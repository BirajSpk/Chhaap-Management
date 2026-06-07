<?php

require_once __DIR__ . '/BaseController.php';

class ActivityController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'GET') {
            return $this->getAll();
        }
        throw new Exception('Method not allowed');
    }

    private function getAll(): array {
        $db = Database::getInstance();
        $limit = min((int) ($_GET['limit'] ?? 20), 100);
        $stmt = $db->prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }
}
