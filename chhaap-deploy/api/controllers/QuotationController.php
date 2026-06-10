<?php

require_once __DIR__ . '/BaseController.php';

class QuotationController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
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
        $stmt = $db->query('SELECT * FROM quotations ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }

    private function getOne(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM quotations WHERE id = ?');
        $stmt->execute([$id]);
        $quote = $stmt->fetch();
        if (!$quote) throw new Exception('Quotation not found');
        $quote['items'] = json_decode($quote['items'], true);
        return $quote;
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['customer_name']) || !isset($data['items']) || !is_array($data['items'])) {
            throw new Exception('Customer name and valid items array are required');
        }

        $db = Database::getInstance();

        // Generate quote number: Q-YYYYMMDD-XXXX
        $date = date('Ymd');
        $stmt = $db->query("SELECT COUNT(*) AS cnt FROM quotations WHERE DATE(created_at) = CURDATE()");
        $count = (int) $stmt->fetch()['cnt'] + 1;
        $quoteNumber = "Q-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        // Calculate total
        $totalAmount = 0;
        foreach ($data['items'] as $item) {
            $totalAmount += (float) ($item['sold_price'] ?? 0) * (int) ($item['quantity'] ?? 1);
        }

        // Valid until = 14 days from now
        $validUntil = date('Y-m-d', strtotime('+14 days'));

        $stmt = $db->prepare(
            'INSERT INTO quotations (quote_number, customer_name, customer_phone, customer_company, customer_position, customer_address, items, total_amount, valid_until, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $quoteNumber,
            $data['customer_name'],
            $data['customer_phone'] ?? null,
            $data['customer_company'] ?? null,
            $data['customer_position'] ?? null,
            $data['customer_address'] ?? null,
            json_encode($data['items']),
            $totalAmount,
            $validUntil,
            $data['description'] ?? null,
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Quotation {$quoteNumber} created for {$data['customer_name']}", $_SERVER['USER_ID'] ?? null, 'CREATE', 'quotations']);
        $stmt = $db->prepare('SELECT * FROM quotations WHERE id = ?');
        $stmt->execute([$id]);
        $quote = $stmt->fetch();
        $quote['items'] = json_decode($quote['items'], true);
        return $quote;
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['customer_name']) || !isset($data['items']) || !is_array($data['items'])) {
            throw new Exception('Customer name and valid items array are required');
        }

        $totalAmount = 0;
        foreach ($data['items'] as $item) {
            $totalAmount += (float) ($item['sold_price'] ?? 0) * (int) ($item['quantity'] ?? 1);
        }

        $validUntil = date('Y-m-d', strtotime('+14 days'));

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'UPDATE quotations SET customer_name=?, customer_phone=?, customer_company=?, customer_position=?, customer_address=?, items=?, total_amount=?, valid_until=?, description=? WHERE id=?'
        );
        $stmt->execute([
            $data['customer_name'],
            $data['customer_phone'] ?? null,
            $data['customer_company'] ?? null,
            $data['customer_position'] ?? null,
            $data['customer_address'] ?? null,
            json_encode($data['items']),
            $totalAmount,
            $validUntil,
            $data['description'] ?? null,
            $id,
        ]);

        $stmt = $db->prepare('SELECT * FROM quotations WHERE id = ?');
        $stmt->execute([$id]);
        $quote = $stmt->fetch();
        if (!$quote) throw new Exception('Quotation not found');
        $quote['items'] = json_decode($quote['items'], true);
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Quotation #{$id} updated", $_SERVER['USER_ID'] ?? null, 'UPDATE', 'quotations']);
        return $quote;
    }

    private function delete(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM quotations WHERE id = ?');
        $stmt->execute([$id]);
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Quotation #{$id} deleted", $_SERVER['USER_ID'] ?? null, 'DELETE', 'quotations']);
        return ['message' => 'Quotation deleted'];
    }
}
