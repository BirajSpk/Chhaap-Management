-- ============================================================
-- Database Performance Patch — Non-destructive index additions
-- Applied: June 2026
-- ============================================================

-- HIGH PRIORITY: Most-frequently filtered columns on orders table
ALTER TABLE `orders` ADD INDEX `idx_created_at` (`created_at`);
ALTER TABLE `orders` ADD INDEX `idx_payment_method` (`payment_method`);
ALTER TABLE `orders` ADD INDEX `idx_deadline` (`deadline`);
ALTER TABLE `orders` ADD INDEX `idx_customer_phone` (`customer_phone`);

-- MEDIUM PRIORITY: Analytics & leaderboard queries
ALTER TABLE `orders` ADD INDEX `idx_is_defective` (`is_defective`);
ALTER TABLE `expenses` ADD INDEX `idx_expense_payment_method` (`payment_method`);
ALTER TABLE `activity_log` ADD INDEX `idx_log_module_action` (`module`, `action_type`, `created_at`);
ALTER TABLE `activity_log` ADD INDEX `idx_log_user_id` (`user_id`);
ALTER TABLE `customers` ADD INDEX `idx_total_orders` (`total_orders`);
ALTER TABLE `customers` ADD INDEX `idx_lifetime_revenue` (`lifetime_revenue`);
ALTER TABLE `order_items` ADD INDEX `idx_product_id` (`product_id`);
