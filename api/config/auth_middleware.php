<?php

class AuthMiddleware {
    private static string $secret = '';

    public static function generateToken(int $userId, string $email, bool $rememberMe = false): string {
        $issuedAt = time();
        $expiresAt = $rememberMe ? $issuedAt + 86400 * 30 : $issuedAt + 3600;
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'user_id' => $userId,
            'email' => $email,
        ];
        return self::encode($payload);
    }

    public static function validateToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;
        $expectedSig = self::hmac("{$header}.{$payload}");
        if (!hash_equals($expectedSig, $signature)) return null;

        $data = json_decode(base64_decode($payload), true);
        if (!$data || !isset($data['exp']) || $data['exp'] < time()) return null;

        return $data;
    }

    public static function check(): array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required']);
            exit;
        }
        $payload = self::validateToken($matches[1]);
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }
        return $payload;
    }

    private static function encode(array $payload): string {
        $header = self::base64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payloadEncoded = self::base64url(json_encode($payload));
        $signature = self::hmac("{$header}.{$payloadEncoded}");
        return "{$header}.{$payloadEncoded}.{$signature}";
    }

    private static function getSecret(): string {
        if (self::$secret === '') {
            self::$secret = getenv('JWT_SECRET') ?: 'chhaap_mgmt_secret_key_2026!@#$';
        }
        return self::$secret;
    }

    private static function hmac(string $data): string {
        return self::base64url(hash_hmac('sha256', $data, self::getSecret(), true));
    }

    private static function base64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
