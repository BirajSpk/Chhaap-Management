<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/RevisionController.php';

class OrderController extends BaseController {
    private const STATUSES = [
        'Confirmed', 'Design Done', 'In Printing', 'Printing Done',
        'Delivery in Progress', 'Delivered', 'Completed',
    ];

    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'PUT' && $id && $action === 'status') {
            return $this->updateStatus($id);
        }
        if ($method === 'PUT' && $id && $action === 'defect') {
            return $this->updateDefect($id);
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
        $defective = $_GET['is_defective'] ?? null;

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
        if ($defective !== null && $defective !== '') {
            $conditions[] = 'is_defective = ?';
            $params[] = $defective;
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
        unset($order);
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
                'INSERT INTO orders (customer_name, customer_phone, customer_address, customer_id, total_amount, payment_status, advance_payment, deadline, notes, order_source, platform_handle, payment_method, online_amount, cash_amount, is_defective, defect_description)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $data['customer_name'],
                $data['customer_phone'],
                $data['customer_address'],
                $data['customer_id'] ?? null,
                0,
                $data['payment_status'] ?? 'Pending',
                $data['advance_payment'] ?? 0,
                $data['deadline'] ?? null,
                $data['notes'] ?? null,
                $data['order_source'] ?? null,
                $data['platform_handle'] ?? null,
                $data['payment_method'] ?? null,
                $data['online_amount'] ?? 0,
                $data['cash_amount'] ?? 0,
                $data['is_defective'] ?? 0,
                $data['defect_description'] ?? null,
            ]);
            $orderId = $db->lastInsertId();

            $itemStmt = $db->prepare(
                'INSERT INTO order_items (order_id, product_id, custom_item_name, quantity, sold_price, cost_price, length, breadth, unit)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
                $length = $item['length'] ?? null;
                $breadth = $item['breadth'] ?? null;
                $unit = $item['unit'] ?? null;

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
                    $length,
                    $breadth,
                    $unit,
                ]);
                $totalAmount += $soldPrice * $item['quantity'];
            }

            $updateStmt = $db->prepare('UPDATE orders SET total_amount = ? WHERE id = ?');
            $updateStmt->execute([$totalAmount, $orderId]);

            if (!empty($data['customer_id'])) {
                $this->updateCustomerStats($data['customer_id']);
            } else {
                $this->linkOrCreateCustomer($orderId, $data['customer_name'], $data['customer_phone'], $data['customer_address']);
            }

            $db->commit();

            $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
            $stmt->execute(["Order #{$orderId} created for {$data['customer_name']}", ($_SERVER['USER_ID'] ?? 1), 'CREATE', 'ORDERS']);

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

        // Snapshot old items for revision log
        $oldOrder = $this->getOne($id);
        $oldItems = $oldOrder['items'];

        $db->beginTransaction();

        try {
            $stmt = $db->prepare(
                'UPDATE orders SET customer_name=?, customer_phone=?, customer_address=?, customer_id=?, payment_status=?, advance_payment=?, deadline=?, notes=?, order_source=?, platform_handle=?, payment_method=?, online_amount=?, cash_amount=?, is_defective=?, defect_description=? WHERE id=?'
            );
            $stmt->execute([
                $data['customer_name'],
                $data['customer_phone'],
                $data['customer_address'],
                $data['customer_id'] ?? $oldOrder['customer_id'],
                $data['payment_status'] ?? 'Pending',
                $data['advance_payment'] ?? 0,
                $data['deadline'] ?? null,
                $data['notes'] ?? null,
                $data['order_source'] ?? null,
                $data['platform_handle'] ?? null,
                $data['payment_method'] ?? null,
                $data['online_amount'] ?? 0,
                $data['cash_amount'] ?? 0,
                $data['is_defective'] ?? 0,
                $data['defect_description'] ?? null,
                $id,
            ]);

            $stmt = $db->prepare('DELETE FROM order_items WHERE order_id = ?');
            $stmt->execute([$id]);

            $totalAmount = 0;
            $itemStmt = $db->prepare(
                'INSERT INTO order_items (order_id, product_id, custom_item_name, quantity, sold_price, cost_price, length, breadth, unit)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
                $length = $item['length'] ?? null;
                $breadth = $item['breadth'] ?? null;
                $unit = $item['unit'] ?? null;

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
                    $length,
                    $breadth,
                    $unit,
                ]);
                $totalAmount += $soldPrice * $item['quantity'];
            }

            $updateStmt = $db->prepare('UPDATE orders SET total_amount = ? WHERE id = ?');
            $updateStmt->execute([$totalAmount, $id]);

            // Update customer stats if customer_id set
            if (!empty($data['customer_id'])) {
                $this->updateCustomerStats($data['customer_id']);
            } elseif (!empty($oldOrder['customer_id'])) {
                $this->updateCustomerStats($oldOrder['customer_id']);
            } else {
                $this->linkOrCreateCustomer((int)$id, $data['customer_name'], $data['customer_phone'], $data['customer_address']);
            }

            $db->commit();

            // Record revision diff
            $updatedOrder = $this->getOne($id);
            $newItems = $updatedOrder['items'];
            RevisionController::recordRevision((int)$id, $oldItems, $newItems);

            $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
            $stmt->execute(["Order #{$id} updated with " . count($data['items']) . " items, total ₹{$totalAmount}", ($_SERVER['USER_ID'] ?? 1), 'UPDATE', 'ORDERS']);

            return $updatedOrder;
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

        if ($newStatus === 'Completed') {
            $paymentMethod = $data['payment_method'] ?? $order['payment_method'] ?? 'QR';
            $onlineAmount = $data['online_amount'] ?? null;
            $cashAmount = $data['cash_amount'] ?? null;
            if ($paymentMethod === 'Hybrid') {
                $onlineAmount = $onlineAmount ?? 0;
                $cashAmount = $cashAmount ?? ($order['total_amount'] ?? 0);
            }
            $stmt = $db->prepare('UPDATE orders SET status = ?, payment_status = ?, payment_method = ?, online_amount = ?, cash_amount = ? WHERE id = ?');
            $stmt->execute([$newStatus, 'Paid', $paymentMethod, $onlineAmount, $cashAmount, $id]);
        } else {
            $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $stmt->execute([$newStatus, $id]);
        }

        $direction = array_search($newStatus, self::STATUSES) >= array_search($order['status'], self::STATUSES)
            ? 'advanced' : 'moved back';
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Order #{$id} {$direction} to '{$newStatus}'", ($_SERVER['USER_ID'] ?? 1), 'UPDATE', 'ORDERS']);

        return $this->getOne($id);
    }

    private function updateDefect(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE orders SET is_defective = ?, defect_description = ? WHERE id = ?');
        $stmt->execute([
            $data['is_defective'] ?? 0,
            $data['defect_description'] ?? null,
            $id,
        ]);
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $desc = ($data['is_defective'] ?? 0) ? "Order #{$id} marked as defective" : "Order #{$id} defect flag removed";
        if (!empty($data['defect_description'])) $desc .= ": {$data['defect_description']}";
        $stmt->execute([$desc, ($_SERVER['USER_ID'] ?? 1), 'UPDATE', 'ORDERS']);
        return $this->getOne($id);
    }

    private function delete(string $id): array {
        $db = Database::getInstance();
        $order = $this->getOne($id);
        $customerId = $order['customer_id'] ?? null;

        $stmt = $db->prepare('DELETE FROM orders WHERE id = ?');
        $stmt->execute([$id]);

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Order #{$id} ({$order['customer_name']}) deleted", ($_SERVER['USER_ID'] ?? 1), 'DELETE', 'ORDERS']);

        if ($customerId) {
            $this->updateCustomerStats($customerId);
        }

        return ['message' => 'Order deleted'];
    }

    private function updateCustomerStats(int $customerId): void {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'UPDATE customers c
             INNER JOIN (
               SELECT customer_id, COUNT(*) AS cnt, SUM(total_amount) AS rev
               FROM orders WHERE customer_id = ? AND customer_id IS NOT NULL
               GROUP BY customer_id
             ) stats ON c.id = stats.customer_id
             SET c.total_orders = stats.cnt, c.lifetime_revenue = COALESCE(stats.rev, 0)
             WHERE c.id = ?'
        );
        $stmt->execute([$customerId, $customerId]);
    }

    private function linkOrCreateCustomer(int $orderId, string $name, string $phone, string $address): void {
        $db = Database::getInstance();

        // 1. Match by phone first (phone is the unique anchor)
        $stmt = $db->prepare("SELECT * FROM customers WHERE phone = ? LIMIT 1");
        $stmt->execute([$phone]);
        $byPhone = $stmt->fetch();

        if ($byPhone) {
            // Same phone → same person. Update name/address to latest.
            $stmt = $db->prepare("UPDATE customers SET name = ?, address = ? WHERE id = ?");
            $stmt->execute([$name, $address, $byPhone['id']]);
            $customerId = $byPhone['id'];
        } else {
            // New phone → new person (even if name matches someone else)
            $stmt = $db->prepare('INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)');
            $stmt->execute([$name, $phone, $address]);
            $customerId = $db->lastInsertId();
        }

        $stmt = $db->prepare('UPDATE orders SET customer_id = ? WHERE id = ?');
        $stmt->execute([$customerId, $orderId]);

        $this->updateCustomerStats($customerId);
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
