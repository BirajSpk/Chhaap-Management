<?php

require_once __DIR__ . '/BaseController.php';

class ExpenseController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
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

        $sql = 'SELECT id, expense_name, expense_amount, expense_description, expense_date, payment_method, created_at FROM expenses WHERE 1=1';
        $params = [];

        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;
        if ($start && $end) {
            $sql .= ' AND expense_date BETWEEN ? AND ?';
            $params[] = $start;
            $params[] = $end;
        }

        $sql .= ' ORDER BY expense_date DESC, created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['expense_amount']) || empty($data['expense_name'])) {
            throw new Exception('Amount and name are required');
        }

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO expenses (expense_amount, expense_name, expense_description, expense_date, payment_method) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['expense_amount'],
            $data['expense_name'],
            $data['expense_description'] ?? null,
            $data['expense_date'] ?? date('Y-m-d'),
            $data['payment_method'] ?? null,
        ]);

        $id = $db->lastInsertId();

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Expense of ₹{$data['expense_amount']} logged", ($_SERVER['USER_ID'] ?? 1), 'CREATE', 'EXPENSES']);

        $stmt = $db->prepare('SELECT * FROM expenses WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);

        $db = Database::getInstance();

        $stmt = $db->prepare('SELECT * FROM expenses WHERE id = ?');
        $stmt->execute([$id]);
        $old = $stmt->fetch();
        if (!$old) throw new Exception('Expense not found');

        $stmt = $db->prepare(
            'UPDATE expenses SET expense_name=?, expense_amount=?, expense_description=?, expense_date=?, payment_method=? WHERE id=?'
        );
        $stmt->execute([
            $data['expense_name'] ?? $old['expense_name'],
            $data['expense_amount'] ?? $old['expense_amount'],
            $data['expense_description'] ?? $old['expense_description'],
            $data['expense_date'] ?? $old['expense_date'],
            $data['payment_method'] ?? $old['payment_method'],
            $id,
        ]);

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Expense of ₹{$old['expense_amount']} updated", ($_SERVER['USER_ID'] ?? 1), 'UPDATE', 'EXPENSES']);

        $stmt = $db->prepare('SELECT * FROM expenses WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function delete(string $id): array {
        $db = Database::getInstance();

        $stmt = $db->prepare('SELECT * FROM expenses WHERE id = ?');
        $stmt->execute([$id]);
        $expense = $stmt->fetch();
        if (!$expense) throw new Exception('Expense not found');

        $stmt = $db->prepare('DELETE FROM expenses WHERE id = ?');
        $stmt->execute([$id]);

        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["Expense of ₹{$expense['expense_amount']} deleted", ($_SERVER['USER_ID'] ?? 1), 'DELETE', 'EXPENSES']);

        return ['message' => 'Expense deleted'];
    }
}