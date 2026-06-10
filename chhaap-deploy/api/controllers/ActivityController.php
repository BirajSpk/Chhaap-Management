<?php

require_once __DIR__ . '/BaseController.php';

class ActivityController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        // TODO: Security pass - this should be DELETE not GET to prevent accidental triggers
        if ($method === 'GET' && $action === 'clear') {
            return $this->clearLogs();
        }
        if ($method === 'GET') {
            return $this->getAll();
        }
        throw new Exception('Method not allowed');
    }

    private function getAll(): array {
        $db = Database::getInstance();

        $sql = 'SELECT * FROM activity_log WHERE 1=1';
        $params = [];

        // Date range filter
        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;
        if ($start && $end) {
            $sql .= ' AND created_at BETWEEN ? AND ?';
            $params[] = $start . ' 00:00:00';
            $params[] = $end . ' 23:59:59';
        }

        // Module filter
        $module = $_GET['module'] ?? null;
        if ($module) {
            $sql .= ' AND module = ?';
            $params[] = strtoupper($module);
        }

        // Action type filter
        $actionType = $_GET['action_type'] ?? null;
        if ($actionType) {
            $sql .= ' AND action_type = ?';
            $params[] = strtoupper($actionType);
        }

        // Search filter
        $search = $_GET['search'] ?? null;
        if ($search) {
            $sql .= ' AND description LIKE ?';
            $params[] = "%{$search}%";
        }

        // Pagination
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 50)));
        $offset = ($page - 1) * $perPage;

        // Count total for pagination metadata
        $countStmt = $db->prepare("SELECT COUNT(*) AS total FROM activity_log WHERE 1=1" .
            ($start && $end ? ' AND created_at BETWEEN ? AND ?' : '') .
            ($module ? ' AND module = ?' : '') .
            ($actionType ? ' AND action_type = ?' : '') .
            ($search ? ' AND description LIKE ?' : '')
        );
        $countParams = $params;
        $countStmt->execute($countParams);
        $total = (int) $countStmt->fetch()['total'];

        $sql .= ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        $params[] = $perPage;
        $params[] = $offset;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        return [
            'data' => $logs,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ];
    }

    private function clearLogs(): array {
        $confirm = $_GET['confirm'] ?? '';
        if ($confirm !== 'DELETE') {
            throw new Exception('Type "DELETE" to confirm clearing all logs');
        }

        $db = Database::getInstance();
        $db->exec('TRUNCATE TABLE activity_log');

        // Re-log the clear action
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute(['All activity logs cleared', ($_SERVER['USER_ID'] ?? 1), 'DELETE', 'SYSTEM']);

        return ['message' => 'Activity logs cleared'];
    }
}