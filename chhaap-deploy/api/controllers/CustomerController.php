<?php

require_once __DIR__ . '/BaseController.php';

class CustomerController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'GET' && $id === 'search') {
            return $this->search();
        }
        if ($method === 'GET' && $action === 'stats') {
            return $this->getStats();
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
        if ($method === 'PUT' && $id) {
            return $this->update($id);
        }
        if ($method === 'DELETE' && $id) {
            return $this->delete($id);
        }
        throw new Exception('Method not allowed');
    }

    private function getAll(): array {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM customers ORDER BY lifetime_revenue DESC');
        return $stmt->fetchAll();
    }

    private function getOne(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->execute([$id]);
        $customer = $stmt->fetch();
        if (!$customer) throw new Exception('Customer not found');

        $stmt = $db->prepare('SELECT id, total_amount, status, payment_status, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC');
        $stmt->execute([$id]);
        $customer['orders'] = $stmt->fetchAll();

        return $customer;
    }

    private function search(): array {
        $db = Database::getInstance();
        $q = $_GET['q'] ?? '';
        $field = $_GET['field'] ?? null;
        if (strlen($q) < 1) return [];

        if ($field === 'name') {
            $stmt = $db->prepare(
                'SELECT id, name, phone, address FROM customers
                 WHERE name LIKE ?
                 LIMIT 10'
            );
            $stmt->execute(["%{$q}%"]);
        } elseif ($field === 'phone') {
            $stmt = $db->prepare(
                'SELECT id, name, phone, address FROM customers
                 WHERE phone LIKE ?
                 LIMIT 10'
            );
            $stmt->execute(["%{$q}%"]);
        } else {
            $stmt = $db->prepare(
                'SELECT id, name, phone, address FROM customers
                 WHERE name LIKE ? OR phone LIKE ?
                 LIMIT 10'
            );
            $likeTerm = "%{$q}%";
            $stmt->execute([$likeTerm, $likeTerm]);
        }

        return $stmt->fetchAll();
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name']) || empty($data['phone'])) {
            throw new Exception('Name and phone are required');
        }

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $data['phone'],
            $data['address'] ?? '',
        ]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Customer '{$data['name']}' created", ($_SERVER['USER_ID'] ?? 1), 'CREATE', 'CUSTOMERS']);

        $stmt = $db->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        $existing = $this->getOneSimple($id);

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'UPDATE customers SET name=?, phone=?, address=? WHERE id=?'
        );
        $stmt->execute([
            $data['name'] ?? $existing['name'],
            $data['phone'] ?? $existing['phone'],
            $data['address'] ?? $existing['address'],
            $id,
        ]);

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Customer #{$id} updated", ($_SERVER['USER_ID'] ?? 1), 'UPDATE', 'CUSTOMERS']);

        $stmt = $db->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function delete(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE orders SET customer_id = NULL WHERE customer_id = ?');
        $stmt->execute([$id]);

        $existing = $this->getOneSimple($id);

        $stmt = $db->prepare('DELETE FROM customers WHERE id = ?');
        $stmt->execute([$id]);

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Customer '{$existing['name']}' deleted", ($_SERVER['USER_ID'] ?? 1), 'DELETE', 'CUSTOMERS']);

        return ['message' => 'Customer deleted'];
    }

    private function getOneSimple(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->execute([$id]);
        $customer = $stmt->fetch();
        if (!$customer) throw new Exception('Customer not found');
        return $customer;
    }

    private function getStats(): array {
        $db = Database::getInstance();

        $stmt = $db->query(
            'SELECT id, name, phone, total_orders, lifetime_revenue
             FROM customers
             ORDER BY total_orders DESC
             LIMIT 10'
        );
        $mostFrequent = $stmt->fetchAll();

        $stmt = $db->query(
            'SELECT id, name, phone, total_orders, lifetime_revenue
             FROM customers
             ORDER BY lifetime_revenue DESC
             LIMIT 10'
        );
        $mostValuable = $stmt->fetchAll();

        return [
            'most_frequent' => $mostFrequent,
            'most_valuable' => $mostValuable,
        ];
    }
}
