<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/load_env.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth_middleware.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'auth'       => 'AuthController',
    'products'   => 'ProductController',
    'orders'     => 'OrderController',
    'expenses'   => 'ExpenseController',
    'analytics'  => 'AnalyticsController',
    'activity'   => 'ActivityController',
    'customers'  => 'CustomerController',
    'revisions'  => 'RevisionController',
    'quotations' => 'QuotationController',
    'users'      => 'UsersController',
];

$parts = array_values(array_filter(explode('/', $uri), fn($p) => $p !== '' && $p !== 'api'));

if (empty($parts)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$resource = $parts[0] ?? null;
$id       = $parts[1] ?? null;
$action   = $parts[2] ?? null;

if (!$resource || !isset($routes[$resource])) {
    http_response_code(404);
    echo json_encode(['error' => 'Resource not found']);
    exit;
}

// Public routes (no auth required)
$publicRoutes = ['auth'];
$authPayload = null;
if (!in_array($resource, $publicRoutes)) {
    $authPayload = AuthMiddleware::check();
    $_SERVER['USER_ID'] = $authPayload['user_id'] ?? 1;
    $_SERVER['USER_EMAIL'] = $authPayload['email'] ?? '';
}

$controllerClass = $routes[$resource];
require_once __DIR__ . "/controllers/{$controllerClass}.php";

$controller = new $controllerClass();

try {
    $result = $controller->handle($method, $id, $action);
    if ($result !== null) {
        echo json_encode($result);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
