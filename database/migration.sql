-- =============================================================================
-- Chhaap Management – Structural Migration Script
-- Applies ALL new feature schema changes safely (no destructive operations)
-- Test locally first, then run against Hostinger via phpMyAdmin SQL tab
-- =============================================================================

-- ==========================================================
-- SECTION A: NEW TABLES
-- ==========================================================

-- FEATURE 1: CRM - Standalone customers table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text,
  `total_orders` int NOT NULL DEFAULT 0,
  `lifetime_revenue` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FEATURE 4: Order Revision Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS `order_revisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `diff_summary` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FEATURE 9: Quotations (Price Estimator / PDF)
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_number` varchar(20) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `items` json NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `valid_until` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_number` (`quote_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SECTION B: SMART CRM DATA EXTRACTION
-- Extracts distinct customer profiles from existing orders
-- Dedup strategy: same (name + phone) = same customer
-- ==========================================================

INSERT INTO `customers` (`name`, `phone`, `address`)
SELECT
  TRIM(`customer_name`) AS `name`,
  TRIM(`customer_phone`) AS `phone`,
  MAX(TRIM(`customer_address`)) AS `address`
FROM `orders`
GROUP BY TRIM(`customer_name`), TRIM(`customer_phone`);

-- Link existing orders to customers table
ALTER TABLE `orders`
  ADD COLUMN `customer_id` int DEFAULT NULL AFTER `id`,
  ADD KEY `idx_customer_id` (`customer_id`);

UPDATE `orders` o
INNER JOIN `customers` c
  ON TRIM(o.`customer_name`) = c.`name`
  AND TRIM(o.`customer_phone`) = c.`phone`
SET o.`customer_id` = c.`id`;

-- Populate customer aggregate stats
UPDATE `customers` c
INNER JOIN (
  SELECT
    `customer_id`,
    COUNT(*) AS `orders_count`,
    SUM(`total_amount`) AS `total_revenue`
  FROM `orders`
  WHERE `customer_id` IS NOT NULL
  GROUP BY `customer_id`
) AS stats ON c.`id` = stats.`customer_id`
SET
  c.`total_orders` = stats.`orders_count`,
  c.`lifetime_revenue` = stats.`total_revenue`;

-- ==========================================================
-- SECTION C: SAFE ALTER TABLE — NEW COLUMNS
-- All columns are DEFAULT NULL so existing rows are untouched
-- ==========================================================

-- FEATURE 2: Order Source / Communication Channel
ALTER TABLE `orders`
  ADD COLUMN `order_source` varchar(50) DEFAULT NULL AFTER `notes`,
  ADD COLUMN `platform_handle` varchar(255) DEFAULT NULL AFTER `order_source`;

-- FEATURE 6: RBAC – Add role column to users
ALTER TABLE `users`
  ADD COLUMN `role` enum('admin','staff') NOT NULL DEFAULT 'staff' AFTER `password_hash`;

-- Promote master admin to admin role
UPDATE `users` SET `role` = 'admin'
WHERE `email` = 'contact.chhaapcreatives@gmail.com';

-- ==========================================================
-- SECTION D: DIMENSIONAL PRICING (FEATURE 7)
-- ==========================================================

ALTER TABLE `products`
  ADD COLUMN `is_dimension_product` tinyint(1) NOT NULL DEFAULT 0
    COMMENT 'Flag for sqft-based pricing (Flex, Vinyl, Banner etc.)'
    AFTER `selling_price`,
  ADD COLUMN `sqft_cost_price` decimal(10,2) NOT NULL DEFAULT 0.00
    AFTER `is_dimension_product`,
  ADD COLUMN `sqft_selling_price` decimal(10,2) NOT NULL DEFAULT 0.00
    AFTER `sqft_cost_price`;

ALTER TABLE `order_items`
  ADD COLUMN `length` decimal(10,2) DEFAULT NULL
    COMMENT 'Length in unit for dimension products'
    AFTER `cost_price`,
  ADD COLUMN `breadth` decimal(10,2) DEFAULT NULL
    AFTER `length`,
  ADD COLUMN `unit` enum('inches','feet') DEFAULT NULL
    AFTER `breadth`;

-- ==========================================================
-- SECTION E: PAYMENT METHODS & HYBRID SPLIT (FEATURES 2, 5)
-- ==========================================================

ALTER TABLE `orders`
  ADD COLUMN `payment_method` enum('QR','COD','Physical Cash','Hybrid') DEFAULT NULL
    COMMENT 'QR/COD=Online, Physical Cash=Cash, Hybrid=split' AFTER `platform_handle`,
  ADD COLUMN `online_amount` decimal(10,2) NOT NULL DEFAULT 0.00
    COMMENT 'Portion paid via online for Hybrid orders' AFTER `payment_method`,
  ADD COLUMN `cash_amount` decimal(10,2) NOT NULL DEFAULT 0.00
    COMMENT 'Portion paid via cash for Hybrid orders' AFTER `online_amount`;

ALTER TABLE `expenses`
  ADD COLUMN `payment_method` enum('QR','Physical Cash') DEFAULT NULL
    COMMENT 'QR=Online, Physical Cash=Cash' AFTER `expense_date`;

-- Backfill historical orders: "Hami Garchau" and "Sadbhav Khadka" → Physical Cash, rest → QR
UPDATE `orders`
SET `payment_method` = CASE
  WHEN TRIM(`customer_name`) IN ('Hami Garchau', 'Sadbhav Khadka') THEN 'Physical Cash'
  ELSE 'QR'
END
WHERE `payment_method` IS NULL;

-- Backfill all historical expenses → QR
UPDATE `expenses` SET `payment_method` = 'QR' WHERE `payment_method` IS NULL;

-- ==========================================================
-- SECTION F: STRUCTURED ACTIVITY LOG (FEATURE 5C)
-- ==========================================================

ALTER TABLE `activity_log`
  ADD COLUMN `user_id` int DEFAULT NULL AFTER `id`,
  ADD COLUMN `action_type` varchar(20) DEFAULT NULL AFTER `user_id`,
  ADD COLUMN `module` varchar(30) DEFAULT NULL AFTER `action_type`;

-- Backfill existing activity log rows with default values
UPDATE `activity_log`
SET
  `user_id` = 1,
  `action_type` = CASE
    WHEN `description` LIKE 'Order #%created%' THEN 'CREATE'
    WHEN `description` LIKE 'Order #%updated%' THEN 'UPDATE'
    WHEN `description` LIKE 'Order #%advanced%' THEN 'UPDATE'
    WHEN `description` LIKE 'Order #%moved back%' THEN 'UPDATE'
    WHEN `description` LIKE 'Order #%deleted%' THEN 'DELETE'
    WHEN `description` LIKE 'Expense%logged%' THEN 'CREATE'
    WHEN `description` LIKE 'Expense%deleted%' THEN 'DELETE'
    WHEN `description` LIKE 'Product%created%' THEN 'CREATE'
    WHEN `description` LIKE 'Product%updated%' THEN 'UPDATE'
    WHEN `description` LIKE 'Product%deleted%' THEN 'DELETE'
    ELSE 'UPDATE'
  END,
  `module` = CASE
    WHEN `description` LIKE 'Order #%' THEN 'ORDERS'
    WHEN `description` LIKE 'Expense%' THEN 'EXPENSES'
    WHEN `description` LIKE 'Product%' THEN 'PRODUCTS'
    WHEN `description` LIKE 'Customer%' THEN 'CUSTOMERS'
    ELSE 'SYSTEM'
  END
WHERE `module` IS NULL;

-- ==========================================================
-- SECTION G: VERIFICATION
-- ==========================================================
SELECT 'orders' AS `table`, COUNT(*) AS `count` FROM `orders`
UNION ALL
SELECT 'order_items', COUNT(*) FROM `order_items`
UNION ALL
SELECT 'products', COUNT(*) FROM `products`
UNION ALL
SELECT 'expenses', COUNT(*) FROM `expenses`
UNION ALL
SELECT 'activity_log', COUNT(*) FROM `activity_log`
UNION ALL
SELECT 'customers', COUNT(*) FROM `customers`
UNION ALL
SELECT 'users', COUNT(*) FROM `users`;

-- ==========================================================
-- SECTION H: QUOTATION ADDITIONAL FIELDS
-- Adds Position, Address, Description columns for quotations
-- ==========================================================

SET @has_position := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME='quotations' AND COLUMN_NAME='customer_position' AND TABLE_SCHEMA=DATABASE());
SET @has_address := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME='quotations' AND COLUMN_NAME='customer_address' AND TABLE_SCHEMA=DATABASE());
SET @has_description := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME='quotations' AND COLUMN_NAME='description' AND TABLE_SCHEMA=DATABASE());
SET @has_po := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME='quotations' AND COLUMN_NAME='po_number' AND TABLE_SCHEMA=DATABASE());

SET @sql := IF(@has_position = 0, 'ALTER TABLE quotations ADD COLUMN customer_position varchar(255) DEFAULT NULL AFTER customer_company', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_address = 0, 'ALTER TABLE quotations ADD COLUMN customer_address text DEFAULT NULL AFTER customer_position', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_description = 0, 'ALTER TABLE quotations ADD COLUMN description text DEFAULT NULL AFTER total_amount', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_po > 0, 'ALTER TABLE quotations DROP COLUMN po_number', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ==========================================================
-- SECTION I: CUSTOMER STATS RECALCULATION
-- Rebuild total_orders and lifetime_revenue from actual orders
-- Run after any order deletions to fix stale leaderboard data
-- ==========================================================

UPDATE customers c
INNER JOIN (
  SELECT customer_id, COUNT(*) AS cnt, SUM(total_amount) AS rev
  FROM orders WHERE customer_id IS NOT NULL
  GROUP BY customer_id
) stats ON c.id = stats.customer_id
SET c.total_orders = stats.cnt, c.lifetime_revenue = COALESCE(stats.rev, 0);

-- ==========================================================
-- SECTION J: DEFECTIVE ORDER TRACKING
-- Adds is_defective flag + defect_description to orders
-- ==========================================================

SET @has_defective := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_NAME='orders' AND COLUMN_NAME='is_defective' AND TABLE_SCHEMA=DATABASE());

SET @sql := IF(@has_defective = 0,
  'ALTER TABLE orders
   ADD COLUMN is_defective TINYINT(1) NOT NULL DEFAULT 0 AFTER cash_amount,
   ADD COLUMN defect_description text DEFAULT NULL AFTER is_defective',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
