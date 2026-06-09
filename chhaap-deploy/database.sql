-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chhaap_management
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (3,'Product #3 updated','2026-06-07 06:36:18'),(4,'Product #4 updated','2026-06-07 06:36:32'),(5,'Product #5 updated','2026-06-07 06:36:52'),(6,'Product #6 updated','2026-06-07 06:37:21'),(7,'Product #7 updated','2026-06-07 06:37:29'),(8,'Product #8 updated','2026-06-07 06:37:34'),(9,'Product #9 updated','2026-06-07 06:37:43'),(10,'Product #10 updated','2026-06-07 06:37:56'),(11,'Product #11 updated','2026-06-07 06:38:12'),(12,'Product #12 updated','2026-06-07 06:38:25'),(13,'Product #12 updated','2026-06-07 06:38:33'),(14,'Product #13 updated','2026-06-07 06:38:55'),(15,'Product #14 updated','2026-06-07 06:39:04'),(16,'Product #15 updated','2026-06-07 06:40:28'),(17,'Product #15 updated','2026-06-07 06:43:33'),(18,'Product #16 updated','2026-06-07 06:43:53'),(19,'Product #17 updated','2026-06-07 06:44:09'),(20,'Product #18 updated','2026-06-07 06:44:42'),(21,'Product #17 updated','2026-06-07 06:45:03'),(22,'Product #19 updated','2026-06-07 06:45:23'),(23,'Product #20 updated','2026-06-07 06:45:50'),(24,'Product #21 updated','2026-06-07 06:45:55'),(25,'Product #22 updated','2026-06-07 06:49:02'),(26,'Product #23 updated','2026-06-07 06:49:10'),(27,'Product #24 updated','2026-06-07 06:49:55'),(28,'Product #25 updated','2026-06-07 06:50:21'),(29,'Product #26 updated','2026-06-07 06:50:37'),(30,'Product #27 updated','2026-06-07 06:50:52'),(31,'Product #28 updated','2026-06-07 06:51:22'),(32,'Product #29 updated','2026-06-07 06:51:39'),(33,'Product #31 updated','2026-06-07 06:51:49'),(34,'Product #30 updated','2026-06-07 06:52:16'),(35,'Product #32 updated','2026-06-07 06:52:32'),(36,'Product #33 updated','2026-06-07 06:52:37'),(37,'Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0034)','2026-06-07 06:53:17'),(38,'Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0035)','2026-06-07 06:53:49'),(39,'Product \'Visiting Card Normal 1 Side\' created (SKU: CHHP-0036)','2026-06-07 06:55:12'),(40,'Product \'Visiting Card Normal 2 Side\' created (SKU: CHHP-0037)','2026-06-07 06:56:03'),(41,'Product \'Flex Normal\' created (SKU: CHHP-0038)','2026-06-07 06:57:51'),(42,'Product #38 updated','2026-06-07 06:58:12'),(43,'Product \'Bill Pad 10 book\' created (SKU: CHHP-0039)','2026-06-07 07:00:16'),(44,'Product #39 updated','2026-06-07 07:00:23'),(45,'Product \'Bill Pad 20 book\' created (SKU: CHHP-0040)','2026-06-07 07:00:50'),(46,'Product \'Vinyl Sticker Transparent/Normal Sq. Ft\' created (SKU: CHHP-0041)','2026-06-07 07:02:05'),(47,'Product \'Framed Flex Sq. Ft\' created (SKU: CHHP-0042)','2026-06-07 07:04:25'),(48,'Product \'Photocopy\' created (SKU: CHHP-0043)','2026-06-07 07:05:53'),(49,'Product \'Color Print Full\' created (SKU: CHHP-0044)','2026-06-07 07:07:45'),(50,'Product \'Color Print Document\' created (SKU: CHHP-0045)','2026-06-07 07:08:01'),(51,'Product \'Normal Inkjet Photo Print 240gsm\' created (SKU: CHHP-0046)','2026-06-07 07:13:57'),(52,'Order #5 created for Test User','2026-06-07 07:40:14'),(53,'Order #5 updated with 1 items, total Γé╣249','2026-06-07 07:40:55'),(54,'Order #5 (Test User Updated) deleted','2026-06-07 07:55:14'),(55,'Order #6 created for Biraj Sapktoa','2026-06-07 08:03:07'),(56,'Order #6 moved to \'Design Done\'','2026-06-07 08:03:14'),(57,'Order #6 moved to \'In Printing\'','2026-06-07 08:03:30'),(58,'Order #6 moved to \'Printing Done\'','2026-06-07 08:03:34'),(59,'Order #6 moved to \'Delivery in Progress\'','2026-06-07 08:03:39'),(60,'Order #6 moved to \'Delivered\'','2026-06-07 08:03:43'),(61,'Order #6 moved to \'Completed\'','2026-06-07 08:03:53'),(62,'Expense of Γé╣300 logged','2026-06-07 08:04:49'),(63,'Order #6 (Biraj Sapktoa) deleted','2026-06-07 08:05:25'),(64,'Order #7 created for asdadas','2026-06-07 09:08:48'),(65,'Order #7 moved to \'Design Done\'','2026-06-07 09:08:55'),(66,'Order #7 moved to \'In Printing\'','2026-06-07 09:19:23'),(67,'Order #7 moved to \'Printing Done\'','2026-06-07 09:19:29'),(68,'Order #7 updated with 2 items, total Γé╣220','2026-06-07 09:19:45'),(69,'Order #7 moved to \'Delivery in Progress\'','2026-06-07 09:19:48'),(70,'Order #7 advanced to \'Delivered\'','2026-06-07 09:23:16'),(71,'Order #7 moved back to \'Confirmed\'','2026-06-07 09:23:27'),(72,'Order #8 created for Status Test','2026-06-07 09:24:56'),(73,'Order #8 advanced to \'In Printing\'','2026-06-07 09:24:56'),(74,'Order #8 moved back to \'Design Done\'','2026-06-07 09:24:56'),(75,'Expense of Γé╣300.00 deleted','2026-06-07 09:25:02'),(76,'Order #7 advanced to \'Delivered\'','2026-06-07 09:25:06'),(77,'Order #8 advanced to \'Completed\'','2026-06-07 09:25:08'),(78,'Order #7 moved back to \'Confirmed\'','2026-06-07 09:25:27'),(79,'Order #7 advanced to \'Delivered\'','2026-06-07 09:26:03'),(80,'Expense of Γé╣45 logged','2026-06-07 09:32:32'),(81,'Order #9 created for Click Test','2026-06-07 09:34:10'),(82,'Order #9 advanced to \'In Printing\'','2026-06-07 09:34:10'),(83,'Order #9 moved back to \'Design Done\'','2026-06-07 09:34:10'),(84,'Order #9 advanced to \'Delivered\'','2026-06-07 09:34:10'),(85,'Order #9 moved back to \'Delivery in Progress\'','2026-06-07 09:34:17'),(86,'Order #9 advanced to \'Delivered\'','2026-06-07 09:34:21'),(87,'Order #9 moved back to \'Delivery in Progress\'','2026-06-07 09:34:22'),(88,'Order #9 moved back to \'Printing Done\'','2026-06-07 09:34:23'),(89,'Order #9 moved back to \'In Printing\'','2026-06-07 09:34:23'),(90,'Order #9 moved back to \'Design Done\'','2026-06-07 09:34:24'),(91,'Order #9 moved back to \'Confirmed\'','2026-06-07 09:34:26'),(92,'Order #9 advanced to \'Design Done\'','2026-06-07 09:34:41'),(93,'Order #9 advanced to \'In Printing\'','2026-06-07 09:34:44'),(94,'Order #9 advanced to \'Printing Done\'','2026-06-07 09:34:45'),(95,'Order #9 advanced to \'Delivery in Progress\'','2026-06-07 09:34:45'),(96,'Order #9 advanced to \'Delivered\'','2026-06-07 09:34:46'),(97,'Order #9 moved back to \'Printing Done\'','2026-06-07 09:34:49'),(98,'Order #9 advanced to \'Completed\'','2026-06-07 09:35:04'),(99,'Order #8 (Status Test) deleted','2026-06-07 09:35:26'),(100,'Expense of Γé╣45.00 deleted','2026-06-07 10:17:38'),(101,'Expense of Γé╣45 logged','2026-06-07 10:18:05'),(102,'Expense of Γé╣45.00 deleted','2026-06-07 10:18:25'),(103,'Expense of Γé╣45 logged','2026-06-07 10:18:46'),(104,'Expense of Γé╣45.00 deleted','2026-06-07 10:18:58'),(105,'Order #10 created for sdfdsfsd','2026-06-07 10:26:34'),(106,'Order #10 advanced to \'Design Done\'','2026-06-07 10:26:38'),(107,'Order #10 advanced to \'In Printing\'','2026-06-07 10:26:41'),(108,'Order #10 advanced to \'Printing Done\'','2026-06-07 10:26:43'),(109,'Order #10 advanced to \'Delivery in Progress\'','2026-06-07 10:26:44'),(110,'Order #10 advanced to \'Delivered\'','2026-06-07 10:26:45'),(111,'Order #10 (sdfdsfsd) deleted','2026-06-07 10:26:53'),(112,'Order #9 (Click Test) deleted','2026-06-07 10:27:05'),(113,'Order #7 advanced to \'Completed\'','2026-06-07 10:27:24'),(114,'Product \'random\' created (SKU: CHHP-0047)','2026-06-07 10:27:48'),(115,'Product \'random\' deleted','2026-06-07 10:27:55'),(116,'Product \'Random Test\' created (SKU: CHHP-0047)','2026-06-07 10:28:17'),(117,'Product \'Random Test\' deleted','2026-06-07 10:28:23'),(118,'Expense of Γé╣45 logged','2026-06-07 10:34:16'),(119,'Expense of Γé╣50 logged','2026-06-07 10:34:25'),(120,'Expense of Γé╣45.00 deleted','2026-06-07 10:34:43'),(121,'Expense of Γé╣50.00 deleted','2026-06-07 10:34:47'),(122,'Order #7 (asdadas) deleted','2026-06-07 11:00:05'),(123,'Order #11 created for dsxvsxv','2026-06-07 13:07:12'),(124,'Order #11 advanced to \'Design Done\'','2026-06-07 13:07:14'),(125,'Order #11 advanced to \'In Printing\'','2026-06-07 13:07:15'),(126,'Order #11 advanced to \'Printing Done\'','2026-06-07 13:07:16'),(127,'Order #11 advanced to \'Delivery in Progress\'','2026-06-07 13:07:17'),(128,'Order #11 advanced to \'Delivered\'','2026-06-07 13:07:18'),(129,'Order #11 advanced to \'Completed\'','2026-06-07 13:07:26'),(130,'Order #11 (dsxvsxv) deleted','2026-06-07 13:07:40'),(131,'Order #12 created for vcxvxz','2026-06-07 13:07:58'),(132,'Order #12 (vcxvxz) deleted','2026-06-07 13:08:07'),(133,'Order #13 created for afsada','2026-06-07 13:08:57'),(134,'Order #13 advanced to \'Completed\'','2026-06-07 13:09:11'),(135,'Order #13 (afsada) deleted','2026-06-07 13:09:41'),(136,'Expense of Γé╣50 logged','2026-06-07 13:10:31'),(137,'Expense of Γé╣50.00 deleted','2026-06-07 13:10:53'),(138,'Order #14 created for jhgbjhvghv','2026-06-07 13:22:44'),(139,'Order #14 advanced to \'Design Done\'','2026-06-07 13:22:46'),(140,'Order #14 advanced to \'In Printing\'','2026-06-07 13:22:47'),(141,'Order #14 advanced to \'Printing Done\'','2026-06-07 13:22:47'),(142,'Order #14 advanced to \'Delivery in Progress\'','2026-06-07 13:22:48'),(143,'Order #14 advanced to \'Delivered\'','2026-06-07 13:22:49'),(144,'Order #14 moved back to \'Confirmed\'','2026-06-07 13:22:51'),(145,'Order #14 advanced to \'Design Done\'','2026-06-07 13:22:56'),(146,'Order #14 advanced to \'In Printing\'','2026-06-07 13:22:57'),(147,'Order #14 advanced to \'Printing Done\'','2026-06-07 13:22:58'),(148,'Order #14 advanced to \'Delivery in Progress\'','2026-06-07 13:22:59'),(149,'Order #14 advanced to \'Delivered\'','2026-06-07 13:23:00'),(150,'Order #14 moved back to \'Delivery in Progress\'','2026-06-07 13:23:20'),(151,'Order #14 moved back to \'Printing Done\'','2026-06-07 13:23:21'),(152,'Order #14 moved back to \'In Printing\'','2026-06-07 13:23:21'),(153,'Order #14 moved back to \'Design Done\'','2026-06-07 13:23:22'),(154,'Order #14 moved back to \'Confirmed\'','2026-06-07 13:23:23'),(155,'Order #14 advanced to \'Delivered\'','2026-06-07 13:23:34'),(156,'Order #14 moved back to \'Delivery in Progress\'','2026-06-07 13:23:41');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_amount` decimal(10,2) DEFAULT NULL,
  `expense_name` text COLLATE utf8mb4_unicode_ci,
  `expense_description` text COLLATE utf8mb4_unicode_ci,
  `expense_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`expense_date`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `custom_item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `sold_price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `order_items_ibfk_2` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (17,14,41,NULL,1,120.00,60.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('Confirmed','Design Done','In Printing','Printing Done','Delivery in Progress','Delivered','Completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Confirmed',
  `payment_status` enum('Pending','Paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `advance_payment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deadline` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_customer` (`customer_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (14,'jhgbjhvghv','5165','hjvhvhv ',120.00,'Delivery in Progress','Pending',0.00,NULL,NULL,'2026-06-07 13:22:44');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `selling_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_sku` (`sku`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,'High Quality Matte Poster - A3','CHHP-0001',150.00,249.00,'2026-06-07 06:33:12'),(4,'High Quality Matte Poster - A4','CHHP-0002',75.00,149.00,'2026-06-07 06:33:12'),(5,'High Quality Matte Poster - A5','CHHP-0003',37.50,99.00,'2026-06-07 06:33:12'),(6,'High Quality Matte Poster - MINI/A6','CHHP-0004',18.75,49.00,'2026-06-07 06:33:12'),(7,'High Quality Normal Poster - A3','CHHP-0005',30.00,80.00,'2026-06-07 06:33:12'),(8,'High Quality Normal Poster - A4','CHHP-0006',15.00,50.00,'2026-06-07 06:33:12'),(9,'High Quality Normal Poster - A5','CHHP-0007',7.50,30.00,'2026-06-07 06:33:12'),(10,'High Quality Normal Poster - MINI/A6','CHHP-0008',3.75,20.00,'2026-06-07 06:33:12'),(11,'Sticker Normal Poster - A3','CHHP-0009',50.00,120.00,'2026-06-07 06:33:12'),(12,'Sticker Normal Poster - A4','CHHP-0010',25.00,70.00,'2026-06-07 06:33:12'),(13,'Sticker Normal Poster - A5','CHHP-0011',12.50,50.00,'2026-06-07 06:33:12'),(14,'Sticker Normal Poster - MINI/A6','CHHP-0012',6.25,35.00,'2026-06-07 06:33:12'),(15,'Sticker Laminated Poster - A3','CHHP-0013',90.00,180.00,'2026-06-07 06:33:12'),(16,'Sticker Laminated Poster - A4','CHHP-0014',45.00,100.00,'2026-06-07 06:33:12'),(17,'Sticker Laminated Poster - A5','CHHP-0015',22.50,60.00,'2026-06-07 06:33:12'),(18,'Sticker Laminated Poster - MINI/A6','CHHP-0016',16.25,45.00,'2026-06-07 06:33:12'),(19,'Sticker High Quality Poster - A4','CHHP-0017',60.00,250.00,'2026-06-07 06:33:12'),(20,'Sticker High Quality Poster - A5','CHHP-0018',30.00,130.00,'2026-06-07 06:33:12'),(21,'Sticker High Quality Poster - MINI/A6','CHHP-0019',15.00,70.00,'2026-06-07 06:33:12'),(22,'Framed Poster - A3','CHHP-0020',550.00,1250.00,'2026-06-07 06:33:12'),(23,'Framed Poster - A4','CHHP-0021',275.00,650.00,'2026-06-07 06:33:12'),(24,'Framed Poster - A5','CHHP-0022',210.00,350.00,'2026-06-07 06:33:12'),(25,'Laminated High Quality Sticker - 35mm x 35mm','CHHP-0023',1.72,15.00,'2026-06-07 06:33:12'),(26,'Laminated High Quality Sticker - 50mm x 50mm','CHHP-0024',4.00,20.00,'2026-06-07 06:33:12'),(27,'Laminated High Quality Sticker - 90mm x 90mm','CHHP-0025',10.00,40.00,'2026-06-07 06:33:12'),(28,'Laminated High Quality Sticker - 50mm x 90mm','CHHP-0026',6.00,35.00,'2026-06-07 06:33:12'),(29,'Laminated High Quality Sticker - 90mm x 180mm','CHHP-0027',20.00,60.00,'2026-06-07 06:33:12'),(30,'Laminated High Quality Sticker - 130mm x 180mm','CHHP-0028',30.00,100.00,'2026-06-07 06:33:12'),(31,'Laminated High Quality Sticker - A4 Size','CHHP-0029',60.00,200.00,'2026-06-07 06:33:12'),(32,'Normal Paper Sticker - A3','CHHP-0030',50.00,100.00,'2026-06-07 06:33:12'),(33,'Normal Paper Sticker - A4','CHHP-0031',25.00,60.00,'2026-06-07 06:33:12'),(34,'Laminated Paper Sticker - A3','CHHP-0034',50.00,110.00,'2026-06-07 06:53:17'),(35,'Laminated Paper Sticker - A3','CHHP-0035',90.00,200.00,'2026-06-07 06:53:49'),(36,'Visiting Card Normal 1 Side','CHHP-0036',0.80,1.30,'2026-06-07 06:55:12'),(37,'Visiting Card Normal 2 Side','CHHP-0037',1.00,1.60,'2026-06-07 06:56:03'),(38,'Flex Normal Sq. Ft','CHHP-0038',22.00,40.00,'2026-06-07 06:57:51'),(39,'Bill Pad 10 books','CHHP-0039',650.00,950.00,'2026-06-07 07:00:16'),(40,'Bill Pad 20 book','CHHP-0040',950.00,1250.00,'2026-06-07 07:00:50'),(41,'Vinyl Sticker Transparent/Normal Sq. Ft','CHHP-0041',60.00,120.00,'2026-06-07 07:02:05'),(42,'Framed Flex Sq. Ft','CHHP-0042',70.00,100.00,'2026-06-07 07:04:25'),(43,'Photocopy','CHHP-0043',2.00,5.00,'2026-06-07 07:05:53'),(44,'Color Print Full','CHHP-0044',20.00,40.00,'2026-06-07 07:07:45'),(45,'Color Print Document','CHHP-0045',5.00,15.00,'2026-06-07 07:08:01'),(46,'Normal Inkjet Photo Print 240gsm','CHHP-0046',30.00,100.00,'2026-06-07 07:13:57');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Chhaap Admin','contact.chhaapcreatives@gmail.com','$2y$10$5j5sQPQ2MXkllgFiTgaBPei4EN1PNGVuvvP5rohjrNjRIwXTAdq4S','2026-06-07 06:07:16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 19:11:03
