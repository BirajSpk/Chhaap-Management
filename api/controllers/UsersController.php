<?php

require_once __DIR__ . '/BaseController.php';

class UsersController extends BaseController {
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
        $stmt = $db->query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC');
        return $stmt->fetchAll();
    }

    private function getOne(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if (!$user) throw new Exception('User not found');
        return $user;
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            throw new Exception('Name, email, and password are required');
        }

        $db = Database::getInstance();

        $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            throw new Exception('Email already registered');
        }

        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $db->prepare(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $data['email'],
            $passwordHash,
            $data['role'] ?? 'staff',
        ]);

        $id = $db->lastInsertId();
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["User '{$data['name']}' created ({$data['email']})", $_SERVER['USER_ID'] ?? null, 'CREATE', 'users']);
        $stmt = $db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        $existing = $this->getOne($id);

        $db = Database::getInstance();
        $name = $data['name'] ?? $existing['name'];
        $email = $data['email'] ?? $existing['email'];
        $role = $data['role'] ?? $existing['role'];

        $sql = 'UPDATE users SET name=?, email=?, role=?';
        $params = [$name, $email, $role];

        if (!empty($data['password'])) {
            $sql .= ', password_hash=?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $sql .= ' WHERE id=?';
        $params[] = $id;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["User #{$id} updated", $_SERVER['USER_ID'] ?? null, 'UPDATE', 'users']);

        return $this->getOne($id);
    }

    private function delete(string $id): array {
        if ($id === '1') {
            throw new Exception('Cannot delete the primary admin account');
        }

        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT name FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(["User '{$user['name']}' (#{$id}) deleted", $_SERVER['USER_ID'] ?? null, 'DELETE', 'users']);

        return ['message' => 'User deleted'];
    }
}
