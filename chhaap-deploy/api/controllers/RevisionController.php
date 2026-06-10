<?php

require_once __DIR__ . '/BaseController.php';

class RevisionController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'GET' && $id) {
            return $this->getByOrder($id);
        }
        throw new Exception('Method not allowed');
    }

    private function getByOrder(string $orderId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT id, order_id, diff_summary, created_at
             FROM order_revisions
             WHERE order_id = ?
             ORDER BY created_at DESC'
        );
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    public static function recordRevision(int $orderId, array $oldItems, array $newItems): void {
        $db = Database::getInstance();

        $oldMap = [];
        foreach ($oldItems as $item) {
            $key = $item['product_name'] ?? $item['custom_item_name'] ?? "Item #{$item['id']}";
            $oldMap[$key] = $item;
        }

        $newMap = [];
        foreach ($newItems as $item) {
            $key = $item['product_name'] ?? $item['custom_item_name'] ?? "Item #{$item['id']}";
            $newMap[$key] = $item;
        }

        $changes = [];

        // Find removed or changed items
        foreach ($oldMap as $key => $old) {
            if (!isset($newMap[$key])) {
                $changes[] = "Removed: {$old['quantity']}x {$key} (₹{$old['sold_price']})";
            } else {
                $new = $newMap[$key];
                $diffs = [];
                if ($old['quantity'] != $new['quantity']) {
                    $diffs[] = "qty {$old['quantity']}→{$new['quantity']}";
                }
                if ($old['sold_price'] != $new['sold_price']) {
                    $diffs[] = "price ₹{$old['sold_price']}→₹{$new['sold_price']}";
                }
                if ($diffs) {
                    $changes[] = "Modified: {$key} (" . implode(', ', $diffs) . ")";
                }
            }
        }

        // Find added items
        foreach ($newMap as $key => $new) {
            if (!isset($oldMap[$key])) {
                $changes[] = "Added: {$new['quantity']}x {$key} (₹{$new['sold_price']})";
            }
        }

        if (empty($changes)) return;

        $summary = implode(" | ", $changes);
        $stmt = $db->prepare(
            'INSERT INTO order_revisions (order_id, diff_summary) VALUES (?, ?)'
        );
        $stmt->execute([$orderId, $summary]);
    }
}
