<?php

require_once __DIR__ . '/BaseController.php';

class AnalyticsController extends BaseController {
    public function handle(string $method, ?string $id, ?string $action): mixed {
        if ($method === 'GET') {
            return $this->getAnalytics();
        }
        throw new Exception('Method not allowed');
    }

    private function getDateRange(): array {
        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;
        if ($start && $end) {
            return [$start . ' 00:00:00', $end . ' 23:59:59'];
        }
        return [null, null];
    }

    private function getAnalytics(): array {
        $db = Database::getInstance();
        [$start, $end] = $this->getDateRange();

        $dateClause = '';
        $expenseDateClause = '';
        $params = [];

        if ($start && $end) {
            $dateClause = 'AND o.created_at BETWEEN ? AND ?';
            $expenseDateClause = 'AND e.expense_date BETWEEN ? AND ?';
            $params = [$start, $end];
        }

        // ---- OVERALL REVENUE (existing logic) ----
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(oi.sold_price * oi.quantity), 0) AS completed_revenue
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $completedRevenue = (float) $stmt->fetch()['completed_revenue'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(advance_payment), 0) AS advance_revenue
             FROM orders WHERE status != 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $advanceRevenue = (float) $stmt->fetch()['advance_revenue'];

        $revenue = $completedRevenue + $advanceRevenue;

        // ---- ONLINE REVENUE ----
        // Completed: QR/COD → full amount; Hybrid → online_amount
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(oi.sold_price * oi.quantity), 0) AS qr_cod_rev
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' AND o.payment_method IN ('QR', 'COD') {$dateClause}"
        );
        $stmt->execute($params);
        $qrCodCompleted = (float) $stmt->fetch()['qr_cod_rev'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(o.online_amount), 0) AS hybrid_online_rev
             FROM orders o
             WHERE o.status = 'Completed' AND o.payment_method = 'Hybrid' {$dateClause}"
        );
        $stmt->execute($params);
        $hybridOnlineCompleted = (float) $stmt->fetch()['hybrid_online_rev'];

        // Online advances: QR/COD advance_payment; Hybrid → online_amount
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(advance_payment), 0) AS qr_cod_adv
             FROM orders WHERE status != 'Completed' AND payment_method IN ('QR', 'COD') {$dateClause}"
        );
        $stmt->execute($params);
        $qrCodAdvance = (float) $stmt->fetch()['qr_cod_adv'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(online_amount), 0) AS hybrid_online_adv
             FROM orders WHERE status != 'Completed' AND payment_method = 'Hybrid' {$dateClause}"
        );
        $stmt->execute($params);
        $hybridOnlineAdvance = (float) $stmt->fetch()['hybrid_online_adv'];

        $onlineRevenue = $qrCodCompleted + $hybridOnlineCompleted + $qrCodAdvance + $hybridOnlineAdvance;

        // ---- CASH REVENUE ----
        // Completed: Physical Cash → full amount; Hybrid → cash_amount
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(oi.sold_price * oi.quantity), 0) AS cash_completed
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' AND o.payment_method = 'Physical Cash' {$dateClause}"
        );
        $stmt->execute($params);
        $cashCompleted = (float) $stmt->fetch()['cash_completed'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(o.cash_amount), 0) AS hybrid_cash_rev
             FROM orders o
             WHERE o.status = 'Completed' AND o.payment_method = 'Hybrid' {$dateClause}"
        );
        $stmt->execute($params);
        $hybridCashCompleted = (float) $stmt->fetch()['hybrid_cash_rev'];

        // Cash advances: Physical Cash → advance_payment; Hybrid → cash_amount
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(advance_payment), 0) AS cash_adv
             FROM orders WHERE status != 'Completed' AND payment_method = 'Physical Cash' {$dateClause}"
        );
        $stmt->execute($params);
        $cashAdvance = (float) $stmt->fetch()['cash_adv'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(cash_amount), 0) AS hybrid_cash_adv
             FROM orders WHERE status != 'Completed' AND payment_method = 'Hybrid' {$dateClause}"
        );
        $stmt->execute($params);
        $hybridCashAdvance = (float) $stmt->fetch()['hybrid_cash_adv'];

        $cashRevenue = $cashCompleted + $hybridCashCompleted + $cashAdvance + $hybridCashAdvance;

        // ---- EXPENSES ----
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(expense_amount), 0) AS total_expenses FROM expenses e WHERE 1=1 {$expenseDateClause}"
        );
        $stmt->execute($params);
        $totalExpenses = (float) $stmt->fetch()['total_expenses'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(expense_amount), 0) AS online_expenses FROM expenses e WHERE payment_method = 'QR' {$expenseDateClause}"
        );
        $stmt->execute($params);
        $onlineExpenses = (float) $stmt->fetch()['online_expenses'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(expense_amount), 0) AS cash_expenses FROM expenses e WHERE payment_method = 'Physical Cash' {$expenseDateClause}"
        );
        $stmt->execute($params);
        $cashExpenses = (float) $stmt->fetch()['cash_expenses'];

        // ---- NET AMOUNTS ----
        $netAmount = $revenue - $totalExpenses;
        $onlineNet = $onlineRevenue - $onlineExpenses;
        $cashNet = $cashRevenue - $cashExpenses;

        // ---- PENDING AMOUNT ----
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(total_amount - advance_payment), 0) AS pending_amount
             FROM orders WHERE status != 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $pendingAmount = (float) $stmt->fetch()['pending_amount'];

        // ---- ORDER COUNTS ----
        $stmt = $db->prepare(
            "SELECT COUNT(*) AS total_orders FROM orders o WHERE 1=1 {$dateClause}"
        );
        $stmt->execute($params);
        $totalOrders = (int) $stmt->fetch()['total_orders'];

        $stmt = $db->query(
            "SELECT COUNT(*) AS active_order_count FROM orders WHERE status != 'Completed'"
        );
        $activeOrderCount = (int) $stmt->fetch()['active_order_count'];

        // ---- PROJECTIONS (per mode) ----
        $projectionsOverall = ['weekly' => 0, 'monthly' => 0, 'yearly' => 0];
        $projectionsOnline = ['weekly' => 0, 'monthly' => 0, 'yearly' => 0];
        $projectionsCash = ['weekly' => 0, 'monthly' => 0, 'yearly' => 0];

        $firstDate = null;
        $stmt = $db->prepare(
            "SELECT MIN(DATE(o.created_at)) AS first_order_date
             FROM orders o JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $row = $stmt->fetch();
        $firstDate = $row['first_order_date'] ?? null;

        if ($firstDate) {
            $fDt = new DateTime($firstDate);
            $now = new DateTime();
            $daysElapsed = max(1, (int) $fDt->diff($now)->days);
            $projectionsOverall = [
                'weekly'  => round(($netAmount / $daysElapsed) * 7, 2),
                'monthly' => round(($netAmount / $daysElapsed) * 30, 2),
                'yearly'  => round(($netAmount / $daysElapsed) * 365, 2),
            ];
            $projectionsOnline = [
                'weekly'  => round(($onlineNet / $daysElapsed) * 7, 2),
                'monthly' => round(($onlineNet / $daysElapsed) * 30, 2),
                'yearly'  => round(($onlineNet / $daysElapsed) * 365, 2),
            ];
            $projectionsCash = [
                'weekly'  => round(($cashNet / $daysElapsed) * 7, 2),
                'monthly' => round(($cashNet / $daysElapsed) * 30, 2),
                'yearly'  => round(($cashNet / $daysElapsed) * 365, 2),
            ];
        }

        // ---- WEEKLY TREND ----
        $stmt = $db->prepare(
            "SELECT DATE(o.created_at) AS date,
                    SUM(oi.sold_price * oi.quantity) AS revenue
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' {$dateClause}
             GROUP BY DATE(o.created_at)
             ORDER BY date"
        );
        $stmt->execute($params);
        $weeklyTrend = $stmt->fetchAll();

        // ---- ACTIVE ORDERS ----
        $stmt = $db->query(
            "SELECT id, customer_name, total_amount, advance_payment, status, payment_status, payment_method, created_at
             FROM orders
             WHERE status != 'Completed'
             ORDER BY FIELD(status, 'Confirmed','Design Done','In Printing','Printing Done','Delivery in Progress','Delivered'),
                      created_at ASC"
        );
        $activeOrders = $stmt->fetchAll();

        // ---- RECENT ACTIVITY ----
        $stmt = $db->query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10');
        $recentActivity = $stmt->fetchAll();

        // ---- CUSTOMER LEADERBOARDS ----
        $stmt = $db->query(
            'SELECT id, name, phone, total_orders, lifetime_revenue
             FROM customers WHERE total_orders > 0 ORDER BY total_orders DESC LIMIT 10'
        );
        $mostFrequentCustomers = $stmt->fetchAll();

        $stmt = $db->query(
            'SELECT id, name, phone, total_orders, lifetime_revenue
             FROM customers WHERE lifetime_revenue > 0 ORDER BY lifetime_revenue DESC LIMIT 10'
        );
        $mostValuableCustomers = $stmt->fetchAll();

        // ---- TRANSACTION COUNTS ----
        $stmt = $db->prepare(
            "SELECT COUNT(*) AS incoming_count FROM orders WHERE status = 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $incomingTransactions = (int) $stmt->fetch()['incoming_count'];

        $stmt = $db->prepare(
            "SELECT COUNT(*) AS outgoing_count FROM expenses e WHERE 1=1 {$expenseDateClause}"
        );
        $stmt->execute($params);
        $outgoingTransactions = (int) $stmt->fetch()['outgoing_count'];

        $totalTransactions = $incomingTransactions + $outgoingTransactions;

        return [
            // Overall (backward compat)
            'revenue'              => $revenue,
            'net_amount'           => $netAmount,
            'pending_amount'       => $pendingAmount,
            'total_expenses'       => $totalExpenses,
            'total_orders'         => $totalOrders,
            'active_order_count'   => $activeOrderCount,
            'incoming_transactions' => $incomingTransactions,
            'outgoing_transactions' => $outgoingTransactions,
            'total_transactions'   => $totalTransactions,
            'projections'          => $projectionsOverall,
            'weekly_trend'         => $weeklyTrend,
            'active_orders'        => $activeOrders,
            'recent_activity'      => $recentActivity,
            'most_frequent_customers' => $mostFrequentCustomers,
            'most_valuable_customers' => $mostValuableCustomers,
            // Split fields
            'online_revenue'       => $onlineRevenue,
            'online_net'           => $onlineNet,
            'online_expenses'      => $onlineExpenses,
            'online_projections'   => $projectionsOnline,
            'cash_revenue'         => $cashRevenue,
            'cash_net'             => $cashNet,
            'cash_expenses'        => $cashExpenses,
            'cash_projections'     => $projectionsCash,
        ];
    }
}