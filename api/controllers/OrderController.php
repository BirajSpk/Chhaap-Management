<?php

require_once __DIR__ . '/BaseController.php';

class OrderController extends BaseController {
    private const STATUSES = [
        'Confirmed', 'Design Done', 'In Printing', 'Printing Done',
        'Delivery in Progress', 'Delivered', 'Completed',
    ];

    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'PUT' && $id && $action === 'status') {
            return $this->updateStatus($id);
        }
        if ($method === 'PUT' && $id && !$action) {
            return $this->update($id);
        }
        if ($method === 'GET' && $id === 'count' && !$action) {
            return $this->getCount();
        }
        if ($method === 'GET' && $id) {
            return $this->getOne($id);
        }
        if ($method === 'GET') {
            return $this->getAll();
        }
        if ($method === 'POST') {
            return $this->create();
        }
        if ($method === 'DELETE' && $id) {
            return $this->delete($id);
        }
        throw new Exception('Method not allowed');
    }

    private function getCount(): array {
        $db = Database::getInstance();
        $stmt = $db->query("SELECT COUNT(*) AS count FROM orders WHERE status != 'Completed'");
        return $stmt->fetch();
    }

    private function getAll(): array {
        $db = Database::getInstance();
        $statusFilter = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;
        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;
        $deadlineSort = $_GET['deadline_sort'] ?? null;

        $sql = 'SELECT * FROM orders';
        $conditions = [];
        $params = [];

        if ($statusFilter) {
            $conditions[] = 'status = ?';
            $params[] = $statusFilter;
        }
        if ($search) {
            $conditions[] = '(id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            $likeTerm = "%{$search}%";
            $params[] = $likeTerm;
            $params[] = $likeTerm;
            $params[] = $likeTerm;
        }
        if ($start && $end) {
            $conditions[] = 'created_at BETWEEN ? AND ?';
            $params[] = $start . ' 00:00:00';
            $params[] = $end . ' 23:59:59';
        }
        if ($conditions) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }

        if ($deadlineSort === 'asc') {
            $sql .= ' ORDER BY deadline IS NULL, deadline ASC, created_at DESC';
        } else {
            $sql .= ' ORDER BY created_at DESC';
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $order['items'] = $this->getItems($order['id']);
        }
        return $orders;
    }

    private function getOne(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        if (!$order) throw new Exception('Order not found');

        $order['items'] = $this->getItems($id);
        return $order;
    }

    private function getItems(int $orderId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT oi.*,
                    COALESCE(p.name, oi.custom_item_name) AS product_name,
                    p.sku AS product_sku
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?
             ORDER BY oi.id'
        );
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['customer_name']) || empty($data['customer_phone']) || empty($data['customer_address']) || empty($data['items'])) {
            throw new Exception('Customer name, phone, address, and items are required');
        }

        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $totalAmount = 0;

            $stmt = $db->prepare(
                'INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, payment_status, advance_payment, deadline, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $data['customer_name'],
                $data['customer_phone'],
                $data['customer_address'],
                0,
                $data['payment_status'] ?? 'Pending',
                $data['advance_payment'] ?? 0,
                $data['deadline'] ?? null,
                $data['notes'] ?? null,
            ]);
            $orderId = $db->lastInsertId();

            $itemStmt = $db->prepare(
                'INSERT INTO order_items (order_id, product_id, custom_item_name, quantity, sold_price, cost_price)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );

            foreach ($data['items'] as $item) {
                if (empty($item['quantity'])) {
                    throw new Exception('Each item needs quantity');
                }

                $isCustom = !empty($item['is_custom']);
                $productId = $isCustom ? null : ($item['product_id'] ?? null);
                $customName = $isCustom ? ($item['custom_item_name'] ?? '') : null;
                $soldPrice = $item['sold_price'] ?? ($isCustom ? 0 : $this->getProductSellingPrice($item['product_id']));
                $costPrice = $item['cost_price'] ?? ($isCustom ? 0 : $this->getProductCostPrice($item['product_id']));

                if (!$isCustom && empty($productId)) {
                    throw new Exception('Product ID is required for catalog items');
                }

                $itemStmt->execute([
                    $orderId,
                    $productId,
                    $customName,
                    $item['quantity'],
                    $soldPrice,
                    $costPrice,
                ]);
                $totalAmount += $soldPrice * $item['quantity'];
            }

            $updateStmt = $db->prepare('UPDATE orders SET total_amount = ? WHERE id = ?');
            $updateStmt->execute([$totalAmount, $orderId]);

            $db->commit();

            $stmt = $db->prepare('INSERT INTO activity_log (description) VALUES (?)');
            $stmt->execute(["Order #{$orderId} created for {$data['customer_name']}"]);

            return $this->getOne($orderId);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['customer_name']) || empty($data['customer_phone']) || empty($data['customer_address'])) {
            throw new Exception('Customer name, phone, and address are required');
        }
        if (!isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
            throw new Exception('At least one item is required');
        }

        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare(
                'UPDATE orders SET customer_name=?, customer_phone=?, customer_address=?, payment_status=?, advance_payment=?, deadline=?, notes=? WHERE id=?'
            );
            $stmt->execute([
                $data['customer_name'],
                $data['customer_phone'],
                $data['customer_address'],
                $data['payment_status'] ?? 'Pending',
                $data['advance_payment'] ?? 0,
                $data['deadline'] ?? null,
                $data['notes'] ?? null,
                $id,
            ]);

            $stmt = $db->prepare('DELETE FROM order_items WHERE order_id = ?');
            $stmt->execute([$id]);

            $totalAmount = 0;
            $itemStmt = $db->prepare(
                'INSERT INTO order_items (order_id, product_id, custom_item_name, quantity, sold_price, cost_price)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );

            foreach ($data['items'] as $item) {
                if (empty($item['quantity'])) {
                    throw new Exception('Each item needs quantity');
                }

                $isCustom = !empty($item['is_custom']);
                $productId = $isCustom ? null : ($item['product_id'] ?? null);
                $customName = $isCustom ? ($item['custom_item_name'] ?? '') : null;
                $soldPrice = $item['sold_price'] ?? ($isCustom ? 0 : $this->getProductSellingPrice($item['product_id']));
                $costPrice = $item['cost_price'] ?? ($isCustom ? 0 : $this->getProductCostPrice($item['product_id']));

                if (!$isCustom && empty($productId)) {
                    throw new Exception('Product ID is required for catalog items');
                }

                $itemStmt->execute([
                    $id,
                    $productId,
                    $customName,
                    $item['quantity'],
                    $soldPrice,
                    $costPrice,
                ]);
                $totalAmount += $soldPrice * $item['quantity'];
            }

            $updateStmt = $db->prepare('UPDATE orders SET total_amount = ? WHERE id = ?');
            $updateStmt->execute([$totalAmount, $id]);

            $db->commit();

            $stmt = $db->prepare('INSERT INTO activity_log (description) VALUES (?)');
            $stmt->execute(["Order #{$id} updated with " . count($data['items']) . " items, total ₹{$totalAmount}"]);

            return $this->getOne($id);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    private function updateStatus(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['status'])) {
            throw new Exception('Status is required');
        }

        $newStatus = $data['status'];
        if (!in_array($newStatus, self::STATUSES)) {
            throw new Exception('Invalid status value');
        }

        $db = Database::getInstance();
        $order = $this->getOne($id);

        if ($order['status'] === 'Completed') {
            throw new Exception('Completed orders cannot be changed');
        }

        if ($newStatus === 'Completed') {
            $confirmText = $data['confirm_text'] ?? '';
            if ($confirmText !== 'COMPLETE') {
                throw new Exception('Type "COMPLETE" to confirm finalizing this order');
            }
        }

        $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$newStatus, $id]);

        $direction = array_search($newStatus, self::STATUSES) >= array_search($order['status'], self::STATUSES)
            ? 'advanced' : 'moved back';
        $stmt = $db->prepare('INSERT INTO activity_log (description) VALUES (?)');
        $stmt->execute(["Order #{$id} {$direction} to '{$newStatus}'"]);

        return $this->getOne($id);
    }

    private function delete(string $id): array {
        $db = Database::getInstance();
        $order = $this->getOne($id);

        $stmt = $db->prepare('DELETE FROM orders WHERE id = ?');
        $stmt->execute([$id]);

        $stmt = $db->prepare('INSERT INTO activity_log (description) VALUES (?)');
        $stmt->execute(["Order #{$id} ({$order['customer_name']}) deleted"]);

        return ['message' => 'Order deleted'];
    }

    private function getProductSellingPrice(int $productId): float {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT selling_price FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        return $product ? (float) $product['selling_price'] : 0;
    }

    private function getProductCostPrice(int $productId): float {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT cost_price FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        return $product ? (float) $product['cost_price'] : 0;
    }
}
