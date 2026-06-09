<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/auth_middleware.php';

class AuthController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'POST' && $id === 'login') {
            return $this->login();
        }
        if ($method === 'GET' && $id === 'verify') {
            return $this->verify();
        }
        throw new Exception('Method not allowed');
    }

    private function login(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception('Email and password required');
        }

        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            http_response_code(401);
            throw new Exception('Invalid credentials');
        }

        $rememberMe = !empty($data['remember_me']);
        $token = AuthMiddleware::generateToken($user['id'], $user['email'], $rememberMe);

        return [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
            ],
        ];
    }

    private function verify(): array {
        $payload = AuthMiddleware::check();
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT id, name, email FROM users WHERE id = ?');
        $stmt->execute([$payload['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            throw new Exception('User not found');
        }
        return ['user' => $user];
    }
}
