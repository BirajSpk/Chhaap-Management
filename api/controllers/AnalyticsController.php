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
        $expenseParams = [];

        if ($start && $end) {
            $dateClause = 'AND o.created_at BETWEEN ? AND ?';
            $expenseDateClause = 'AND e.expense_date BETWEEN ? AND ?';
            $params = [$start, $end];
            $expenseParams = [$start, $end];
        }

        // Revenue = completed orders total + advance payments on non-completed orders
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

        // pending_amount = SUM(total - advance) for non-completed orders (what's still owed)
        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(total_amount - advance_payment), 0) AS pending_amount
             FROM orders WHERE status != 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $pendingAmount = (float) $stmt->fetch()['pending_amount'];

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(expense_amount), 0) AS total_expenses FROM expenses e WHERE 1=1 {$expenseDateClause}"
        );
        $stmt->execute($expenseParams);
        $totalExpenses = (float) $stmt->fetch()['total_expenses'];

        $netAmount = $revenue - $totalExpenses;

        $stmt = $db->prepare(
            "SELECT COALESCE(SUM(oi.sold_price * oi.quantity), 0) AS total_revenue,
                    COUNT(DISTINCT o.id) AS order_count,
                    MIN(DATE(o.created_at)) AS first_order_date
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.status = 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $completedData = $stmt->fetch();

        // Total orders (respecting date range)
        $stmt = $db->prepare(
            "SELECT COUNT(*) AS total_orders FROM orders o WHERE 1=1 {$dateClause}"
        );
        $stmt->execute($params);
        $totalOrders = (int) $stmt->fetch()['total_orders'];

        // Active order count (always independent of date range)
        $stmt = $db->query(
            "SELECT COUNT(*) AS active_order_count FROM orders WHERE status != 'Completed'"
        );
        $activeOrderCount = (int) $stmt->fetch()['active_order_count'];

        // Projections based on net_amount
        $projections = ['weekly' => 0, 'monthly' => 0, 'yearly' => 0];
        if ($completedData['total_revenue'] > 0 && $completedData['first_order_date']) {
            $firstDate = new DateTime($completedData['first_order_date']);
            $now = new DateTime();
            $daysElapsed = max(1, (int) $firstDate->diff($now)->days);
            $dailyAvgNet = $netAmount / $daysElapsed;
            $projections = [
                'weekly'  => round($dailyAvgNet * 7, 2),
                'monthly' => round($dailyAvgNet * 30, 2),
                'yearly'  => round($dailyAvgNet * 365, 2),
            ];
        }

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

        // Active orders — always independent of date range
        $stmt = $db->query(
            "SELECT id, customer_name, total_amount, advance_payment, status, payment_status, created_at
             FROM orders
             WHERE status != 'Completed'
             ORDER BY FIELD(status, 'Confirmed','Design Done','In Printing','Printing Done','Delivery in Progress','Delivered'),
                      created_at ASC"
        );
        $activeOrders = $stmt->fetchAll();

        $stmt = $db->query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10');
        $recentActivity = $stmt->fetchAll();

        // Transaction counts
        $stmt = $db->prepare(
            "SELECT COUNT(*) AS incoming_count FROM orders WHERE status = 'Completed' {$dateClause}"
        );
        $stmt->execute($params);
        $incomingTransactions = (int) $stmt->fetch()['incoming_count'];

        $stmt = $db->prepare(
            "SELECT COUNT(*) AS outgoing_count FROM expenses e WHERE 1=1 {$expenseDateClause}"
        );
        $stmt->execute($expenseParams);
        $outgoingTransactions = (int) $stmt->fetch()['outgoing_count'];

        $totalTransactions = $incomingTransactions + $outgoingTransactions;

        return [
            'revenue'              => $revenue,
            'net_amount'           => $netAmount,
            'pending_amount'       => $pendingAmount,
            'total_expenses'       => $totalExpenses,
            'total_orders'         => $totalOrders,
            'active_order_count'   => $activeOrderCount,
            'incoming_transactions' => $incomingTransactions,
            'outgoing_transactions' => $outgoingTransactions,
            'total_transactions'   => $totalTransactions,
            'projections'          => $projections,
            'weekly_trend'         => $weeklyTrend,
            'active_orders'        => $activeOrders,
            'recent_activity'      => $recentActivity,
        ];
    }
}
