<?php

require_once __DIR__ . '/BaseController.php';

class ProductController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        switch ($method) {
            case 'GET':
                return $id ? $this->getOne($id) : $this->getAll();
            case 'POST':
                return $this->create();
            case 'PUT':
                if (!$id) throw new Exception('Product ID required');
                return $this->update($id);
            case 'DELETE':
                if (!$id) throw new Exception('Product ID required');
                return $this->delete($id);
            default:
                throw new Exception('Method not allowed');
        }
    }

    private function getAll(): array {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM products ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }

    private function getOne(string $id): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) throw new Exception('Product not found');
        return $product;
    }

    private function generateSku(PDO $db): string {
        $stmt = $db->query('SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM products');
        $nextId = $stmt->fetch()['next_id'];
        return 'CHHP-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }

    private function create(): array {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            throw new Exception('Product name is required');
        }

        $db = Database::getInstance();

        // Duplicate name check
        $stmt = $db->prepare('SELECT id, name, sku, cost_price, selling_price, is_dimension_product, sqft_cost_price, sqft_selling_price FROM products WHERE name = ? LIMIT 1');
        $stmt->execute([$data['name']]);
        $existing = $stmt->fetch();
        if ($existing) {
            http_response_code(409);
            return ['error' => 'Product with this name already exists', 'existing' => $existing];
        }

        $sku = $this->generateSku($db);

        $stmt = $db->prepare(
            'INSERT INTO products (name, sku, cost_price, selling_price, is_dimension_product, sqft_cost_price, sqft_selling_price)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $sku,
            $data['cost_price'] ?? 0,
            $data['selling_price'] ?? 0,
            !empty($data['is_dimension_product']) ? 1 : 0,
            $data['sqft_cost_price'] ?? 0,
            $data['sqft_selling_price'] ?? 0,
        ]);

        $id = $db->lastInsertId();
        $this->logActivity("Product '{$data['name']}' created (SKU: {$sku})", 'CREATE');

        return $this->getOne($id);
    }

    private function update(string $id): array {
        $data = json_decode(file_get_contents('php://input'), true);
        $existing = $this->getOne($id);

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'UPDATE products SET name=?, sku=?, cost_price=?, selling_price=?, is_dimension_product=?, sqft_cost_price=?, sqft_selling_price=? WHERE id=?'
        );
        $stmt->execute([
            $data['name'] ?? $existing['name'],
            $data['sku'] ?? $existing['sku'],
            $data['cost_price'] ?? $existing['cost_price'],
            $data['selling_price'] ?? $existing['selling_price'],
            isset($data['is_dimension_product']) ? ($data['is_dimension_product'] ? 1 : 0) : $existing['is_dimension_product'],
            $data['sqft_cost_price'] ?? $existing['sqft_cost_price'],
            $data['sqft_selling_price'] ?? $existing['sqft_selling_price'],
            $id,
        ]);

        $this->logActivity("Product #{$id} updated");
        return $this->getOne($id);
    }

    private function delete(string $id): array {
        $product = $this->getOne($id);
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);

        $this->logActivity("Product '{$product['name']}' deleted", 'DELETE');
        return ['message' => 'Product deleted'];
    }

    private function logActivity(string $description, string $actionType = 'UPDATE'): void {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO activity_log (description, user_id, action_type, module) VALUES (?, ?, ?, ?)');
        $stmt->execute([$description, ($_SERVER['USER_ID'] ?? 1), $actionType, 'PRODUCTS']);
    }
}
