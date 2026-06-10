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
  `user_id` int DEFAULT NULL,
  `action_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (3,1,'UPDATE','PRODUCTS','Product #3 updated','2026-06-07 06:36:18'),(4,1,'UPDATE','PRODUCTS','Product #4 updated','2026-06-07 06:36:32'),(5,1,'UPDATE','PRODUCTS','Product #5 updated','2026-06-07 06:36:52'),(6,1,'UPDATE','PRODUCTS','Product #6 updated','2026-06-07 06:37:21'),(7,1,'UPDATE','PRODUCTS','Product #7 updated','2026-06-07 06:37:29'),(8,1,'UPDATE','PRODUCTS','Product #8 updated','2026-06-07 06:37:34'),(9,1,'UPDATE','PRODUCTS','Product #9 updated','2026-06-07 06:37:43'),(10,1,'UPDATE','PRODUCTS','Product #10 updated','2026-06-07 06:37:56'),(11,1,'UPDATE','PRODUCTS','Product #11 updated','2026-06-07 06:38:12'),(12,1,'UPDATE','PRODUCTS','Product #12 updated','2026-06-07 06:38:25'),(13,1,'UPDATE','PRODUCTS','Product #12 updated','2026-06-07 06:38:33'),(14,1,'UPDATE','PRODUCTS','Product #13 updated','2026-06-07 06:38:55'),(15,1,'UPDATE','PRODUCTS','Product #14 updated','2026-06-07 06:39:04'),(16,1,'UPDATE','PRODUCTS','Product #15 updated','2026-06-07 06:40:28'),(17,1,'UPDATE','PRODUCTS','Product #15 updated','2026-06-07 06:43:33'),(18,1,'UPDATE','PRODUCTS','Product #16 updated','2026-06-07 06:43:53'),(19,1,'UPDATE','PRODUCTS','Product #17 updated','2026-06-07 06:44:09'),(20,1,'UPDATE','PRODUCTS','Product #18 updated','2026-06-07 06:44:42'),(21,1,'UPDATE','PRODUCTS','Product #17 updated','2026-06-07 06:45:03'),(22,1,'UPDATE','PRODUCTS','Product #19 updated','2026-06-07 06:45:23'),(23,1,'UPDATE','PRODUCTS','Product #20 updated','2026-06-07 06:45:50'),(24,1,'UPDATE','PRODUCTS','Product #21 updated','2026-06-07 06:45:55'),(25,1,'UPDATE','PRODUCTS','Product #22 updated','2026-06-07 06:49:02'),(26,1,'UPDATE','PRODUCTS','Product #23 updated','2026-06-07 06:49:10'),(27,1,'UPDATE','PRODUCTS','Product #24 updated','2026-06-07 06:49:55'),(28,1,'UPDATE','PRODUCTS','Product #25 updated','2026-06-07 06:50:21'),(29,1,'UPDATE','PRODUCTS','Product #26 updated','2026-06-07 06:50:37'),(30,1,'UPDATE','PRODUCTS','Product #27 updated','2026-06-07 06:50:52'),(31,1,'UPDATE','PRODUCTS','Product #28 updated','2026-06-07 06:51:22'),(32,1,'UPDATE','PRODUCTS','Product #29 updated','2026-06-07 06:51:39'),(33,1,'UPDATE','PRODUCTS','Product #31 updated','2026-06-07 06:51:49'),(34,1,'UPDATE','PRODUCTS','Product #30 updated','2026-06-07 06:52:16'),(35,1,'UPDATE','PRODUCTS','Product #32 updated','2026-06-07 06:52:32'),(36,1,'UPDATE','PRODUCTS','Product #33 updated','2026-06-07 06:52:37'),(37,1,'CREATE','PRODUCTS','Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0034)','2026-06-07 06:53:17'),(38,1,'CREATE','PRODUCTS','Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0035)','2026-06-07 06:53:49'),(39,1,'CREATE','PRODUCTS','Product \'Visiting Card Normal 1 Side\' created (SKU: CHHP-0036)','2026-06-07 06:55:12'),(40,1,'CREATE','PRODUCTS','Product \'Visiting Card Normal 2 Side\' created (SKU: CHHP-0037)','2026-06-07 06:56:03'),(41,1,'CREATE','PRODUCTS','Product \'Flex Normal\' created (SKU: CHHP-0038)','2026-06-07 06:57:51'),(42,1,'UPDATE','PRODUCTS','Product #38 updated','2026-06-07 06:58:12'),(43,1,'CREATE','PRODUCTS','Product \'Bill Pad 10 book\' created (SKU: CHHP-0039)','2026-06-07 07:00:16'),(44,1,'UPDATE','PRODUCTS','Product #39 updated','2026-06-07 07:00:23'),(45,1,'CREATE','PRODUCTS','Product \'Bill Pad 20 book\' created (SKU: CHHP-0040)','2026-06-07 07:00:50'),(46,1,'CREATE','PRODUCTS','Product \'Vinyl Sticker Transparent/Normal Sq. Ft\' created (SKU: CHHP-0041)','2026-06-07 07:02:05'),(47,1,'CREATE','PRODUCTS','Product \'Framed Flex Sq. Ft\' created (SKU: CHHP-0042)','2026-06-07 07:04:25'),(48,1,'CREATE','PRODUCTS','Product \'Photocopy\' created (SKU: CHHP-0043)','2026-06-07 07:05:53'),(49,1,'CREATE','PRODUCTS','Product \'Color Print Full\' created (SKU: CHHP-0044)','2026-06-07 07:07:45'),(50,1,'CREATE','PRODUCTS','Product \'Color Print Document\' created (SKU: CHHP-0045)','2026-06-07 07:08:01'),(51,1,'CREATE','PRODUCTS','Product \'Normal Inkjet Photo Print 240gsm\' created (SKU: CHHP-0046)','2026-06-07 07:13:57'),(52,1,'CREATE','ORDERS','Order #5 created for Test User','2026-06-07 07:40:14'),(53,1,'UPDATE','ORDERS','Order #5 updated with 1 items, total ???????249','2026-06-07 07:40:55'),(54,1,'UPDATE','ORDERS','Order #5 (Test User Updated) deleted','2026-06-07 07:55:14'),(55,1,'CREATE','ORDERS','Order #6 created for Biraj Sapktoa','2026-06-07 08:03:07'),(56,1,'UPDATE','ORDERS','Order #6 moved to \'Design Done\'','2026-06-07 08:03:14'),(57,1,'UPDATE','ORDERS','Order #6 moved to \'In Printing\'','2026-06-07 08:03:30'),(58,1,'UPDATE','ORDERS','Order #6 moved to \'Printing Done\'','2026-06-07 08:03:34'),(59,1,'UPDATE','ORDERS','Order #6 moved to \'Delivery in Progress\'','2026-06-07 08:03:39'),(60,1,'UPDATE','ORDERS','Order #6 moved to \'Delivered\'','2026-06-07 08:03:43'),(61,1,'UPDATE','ORDERS','Order #6 moved to \'Completed\'','2026-06-07 08:03:53'),(62,1,'CREATE','EXPENSES','Expense of ???????300 logged','2026-06-07 08:04:49'),(63,1,'DELETE','ORDERS','Order #6 (Biraj Sapktoa) deleted','2026-06-07 08:05:25'),(64,1,'CREATE','ORDERS','Order #7 created for asdadas','2026-06-07 09:08:48'),(65,1,'UPDATE','ORDERS','Order #7 moved to \'Design Done\'','2026-06-07 09:08:55'),(66,1,'UPDATE','ORDERS','Order #7 moved to \'In Printing\'','2026-06-07 09:19:23'),(67,1,'UPDATE','ORDERS','Order #7 moved to \'Printing Done\'','2026-06-07 09:19:29'),(68,1,'UPDATE','ORDERS','Order #7 updated with 2 items, total ???????220','2026-06-07 09:19:45'),(69,1,'UPDATE','ORDERS','Order #7 moved to \'Delivery in Progress\'','2026-06-07 09:19:48'),(70,1,'UPDATE','ORDERS','Order #7 advanced to \'Delivered\'','2026-06-07 09:23:16'),(71,1,'UPDATE','ORDERS','Order #7 moved back to \'Confirmed\'','2026-06-07 09:23:27'),(72,1,'CREATE','ORDERS','Order #8 created for Status Test','2026-06-07 09:24:56'),(73,1,'UPDATE','ORDERS','Order #8 advanced to \'In Printing\'','2026-06-07 09:24:56'),(74,1,'UPDATE','ORDERS','Order #8 moved back to \'Design Done\'','2026-06-07 09:24:56'),(75,1,'DELETE','EXPENSES','Expense of ???????300.00 deleted','2026-06-07 09:25:02'),(76,1,'UPDATE','ORDERS','Order #7 advanced to \'Delivered\'','2026-06-07 09:25:06'),(77,1,'UPDATE','ORDERS','Order #8 advanced to \'Completed\'','2026-06-07 09:25:08'),(78,1,'UPDATE','ORDERS','Order #7 moved back to \'Confirmed\'','2026-06-07 09:25:27'),(79,1,'UPDATE','ORDERS','Order #7 advanced to \'Delivered\'','2026-06-07 09:26:03'),(80,1,'CREATE','EXPENSES','Expense of ???????45 logged','2026-06-07 09:32:32'),(81,1,'CREATE','ORDERS','Order #9 created for Click Test','2026-06-07 09:34:10'),(82,1,'UPDATE','ORDERS','Order #9 advanced to \'In Printing\'','2026-06-07 09:34:10'),(83,1,'UPDATE','ORDERS','Order #9 moved back to \'Design Done\'','2026-06-07 09:34:10'),(84,1,'UPDATE','ORDERS','Order #9 advanced to \'Delivered\'','2026-06-07 09:34:10'),(85,1,'UPDATE','ORDERS','Order #9 moved back to \'Delivery in Progress\'','2026-06-07 09:34:17'),(86,1,'UPDATE','ORDERS','Order #9 advanced to \'Delivered\'','2026-06-07 09:34:21'),(87,1,'UPDATE','ORDERS','Order #9 moved back to \'Delivery in Progress\'','2026-06-07 09:34:22'),(88,1,'UPDATE','ORDERS','Order #9 moved back to \'Printing Done\'','2026-06-07 09:34:23'),(89,1,'UPDATE','ORDERS','Order #9 moved back to \'In Printing\'','2026-06-07 09:34:23'),(90,1,'UPDATE','ORDERS','Order #9 moved back to \'Design Done\'','2026-06-07 09:34:24'),(91,1,'UPDATE','ORDERS','Order #9 moved back to \'Confirmed\'','2026-06-07 09:34:26'),(92,1,'UPDATE','ORDERS','Order #9 advanced to \'Design Done\'','2026-06-07 09:34:41'),(93,1,'UPDATE','ORDERS','Order #9 advanced to \'In Printing\'','2026-06-07 09:34:44'),(94,1,'UPDATE','ORDERS','Order #9 advanced to \'Printing Done\'','2026-06-07 09:34:45'),(95,1,'UPDATE','ORDERS','Order #9 advanced to \'Delivery in Progress\'','2026-06-07 09:34:45'),(96,1,'UPDATE','ORDERS','Order #9 advanced to \'Delivered\'','2026-06-07 09:34:46'),(97,1,'UPDATE','ORDERS','Order #9 moved back to \'Printing Done\'','2026-06-07 09:34:49'),(98,1,'UPDATE','ORDERS','Order #9 advanced to \'Completed\'','2026-06-07 09:35:04'),(99,1,'DELETE','ORDERS','Order #8 (Status Test) deleted','2026-06-07 09:35:26'),(100,1,'DELETE','EXPENSES','Expense of ???????45.00 deleted','2026-06-07 10:17:38'),(101,1,'CREATE','EXPENSES','Expense of ???????45 logged','2026-06-07 10:18:05'),(102,1,'DELETE','EXPENSES','Expense of ???????45.00 deleted','2026-06-07 10:18:25'),(103,1,'CREATE','EXPENSES','Expense of ???????45 logged','2026-06-07 10:18:46'),(104,1,'DELETE','EXPENSES','Expense of ???????45.00 deleted','2026-06-07 10:18:58'),(105,1,'CREATE','ORDERS','Order #10 created for sdfdsfsd','2026-06-07 10:26:34'),(106,1,'UPDATE','ORDERS','Order #10 advanced to \'Design Done\'','2026-06-07 10:26:38'),(107,1,'UPDATE','ORDERS','Order #10 advanced to \'In Printing\'','2026-06-07 10:26:41'),(108,1,'UPDATE','ORDERS','Order #10 advanced to \'Printing Done\'','2026-06-07 10:26:43'),(109,1,'UPDATE','ORDERS','Order #10 advanced to \'Delivery in Progress\'','2026-06-07 10:26:44'),(110,1,'UPDATE','ORDERS','Order #10 advanced to \'Delivered\'','2026-06-07 10:26:45'),(111,1,'DELETE','ORDERS','Order #10 (sdfdsfsd) deleted','2026-06-07 10:26:53'),(112,1,'DELETE','ORDERS','Order #9 (Click Test) deleted','2026-06-07 10:27:05'),(113,1,'UPDATE','ORDERS','Order #7 advanced to \'Completed\'','2026-06-07 10:27:24'),(114,1,'CREATE','PRODUCTS','Product \'random\' created (SKU: CHHP-0047)','2026-06-07 10:27:48'),(115,1,'DELETE','PRODUCTS','Product \'random\' deleted','2026-06-07 10:27:55'),(116,1,'CREATE','PRODUCTS','Product \'Random Test\' created (SKU: CHHP-0047)','2026-06-07 10:28:17'),(117,1,'DELETE','PRODUCTS','Product \'Random Test\' deleted','2026-06-07 10:28:23'),(118,1,'CREATE','EXPENSES','Expense of ???????45 logged','2026-06-07 10:34:16'),(119,1,'CREATE','EXPENSES','Expense of ???????50 logged','2026-06-07 10:34:25'),(120,1,'DELETE','EXPENSES','Expense of ???????45.00 deleted','2026-06-07 10:34:43'),(121,1,'DELETE','EXPENSES','Expense of ???????50.00 deleted','2026-06-07 10:34:47'),(122,1,'DELETE','ORDERS','Order #7 (asdadas) deleted','2026-06-07 11:00:05'),(123,1,'CREATE','ORDERS','Order #11 created for Aayush Lama','2026-06-07 12:30:19'),(124,1,'UPDATE','ORDERS','Order #11 advanced to \'In Printing\'','2026-06-07 12:30:23'),(125,1,'CREATE','ORDERS','Order #12 created for test','2026-06-07 12:32:47'),(126,1,'UPDATE','ORDERS','Order #12 advanced to \'Completed\'','2026-06-07 12:32:54'),(127,1,'DELETE','ORDERS','Order #12 (test) deleted','2026-06-07 12:33:14'),(128,1,'CREATE','ORDERS','Order #13 created for Anvik Ghimire','2026-06-07 12:35:59'),(129,1,'UPDATE','ORDERS','Order #13 advanced to \'In Printing\'','2026-06-07 12:36:07'),(130,1,'CREATE','EXPENSES','Expense of ???50 logged','2026-06-07 12:36:46'),(131,1,'CREATE','ORDERS','Order #14 created for Sadbhav Khadka','2026-06-07 12:39:53'),(132,1,'UPDATE','ORDERS','Order #14 advanced to \'In Printing\'','2026-06-07 12:39:55'),(133,1,'CREATE','ORDERS','Order #15 created for test','2026-06-07 12:46:46'),(134,1,'UPDATE','ORDERS','Order #15 advanced to \'Completed\'','2026-06-07 12:47:27'),(135,1,'DELETE','ORDERS','Order #15 (test) deleted','2026-06-07 12:49:08'),(136,1,'UPDATE','ORDERS','Order #14 advanced to \'Printing Done\'','2026-06-07 13:02:05'),(137,1,'UPDATE','ORDERS','Order #14 advanced to \'Printing Done\'','2026-06-07 13:02:05'),(138,1,'UPDATE','ORDERS','Order #14 advanced to \'Delivered\'','2026-06-07 13:02:06'),(139,1,'UPDATE','ORDERS','Order #14 advanced to \'Delivered\'','2026-06-07 13:02:06'),(140,1,'UPDATE','ORDERS','Order #14 moved back to \'In Printing\'','2026-06-07 13:02:09'),(141,1,'CREATE','ORDERS','Order #16 created for test','2026-06-07 13:30:29'),(142,1,'UPDATE','ORDERS','Order #16 advanced to \'Design Done\'','2026-06-07 13:30:33'),(143,1,'UPDATE','ORDERS','Order #16 advanced to \'In Printing\'','2026-06-07 13:30:34'),(144,1,'UPDATE','ORDERS','Order #16 advanced to \'Printing Done\'','2026-06-07 13:30:35'),(145,1,'UPDATE','ORDERS','Order #16 advanced to \'Delivery in Progress\'','2026-06-07 13:30:36'),(146,1,'UPDATE','ORDERS','Order #16 advanced to \'Delivered\'','2026-06-07 13:30:37'),(147,1,'UPDATE','ORDERS','Order #16 advanced to \'Completed\'','2026-06-07 13:30:47'),(148,1,'DELETE','ORDERS','Order #16 (test) deleted','2026-06-07 13:30:58'),(149,1,'UPDATE','ORDERS','Order #14 advanced to \'Printing Done\'','2026-06-07 13:31:39'),(150,1,'UPDATE','ORDERS','Order #13 advanced to \'Printing Done\'','2026-06-07 13:31:50'),(151,1,'UPDATE','ORDERS','Order #11 advanced to \'Printing Done\'','2026-06-07 13:32:08'),(152,1,'CREATE','EXPENSES','Expense of ???110 logged','2026-06-07 13:35:09'),(153,1,'CREATE','ORDERS','Order #17 created for Aayush Besigau','2026-06-07 13:40:35'),(154,1,'UPDATE','ORDERS','Order #17 advanced to \'Printing Done\'','2026-06-07 13:40:37'),(155,1,'CREATE','ORDERS','Order #18 created for Radhika Dawadi','2026-06-07 13:42:18'),(156,1,'UPDATE','ORDERS','Order #18 advanced to \'Delivered\'','2026-06-07 13:42:23'),(157,1,'CREATE','ORDERS','Order #19 created for Prasidha Pandey','2026-06-07 13:44:53'),(158,1,'CREATE','ORDERS','Order #20 created for Prasidha Pandey','2026-06-07 13:44:53'),(159,1,'UPDATE','ORDERS','Order #20 advanced to \'In Printing\'','2026-06-07 13:45:25'),(160,1,'DELETE','ORDERS','Order #19 (Prasidha Pandey) deleted','2026-06-07 13:45:50'),(161,1,'DELETE','ORDERS','Order #20 (Prasidha Pandey) deleted','2026-06-07 13:46:12'),(162,1,'CREATE','ORDERS','Order #21 created for Prasidha Pandey','2026-06-07 13:47:50'),(163,1,'UPDATE','ORDERS','Order #21 advanced to \'In Printing\'','2026-06-07 13:47:57'),(164,1,'CREATE','EXPENSES','Expense of ???500 logged','2026-06-07 14:01:29'),(165,1,'CREATE','ORDERS','Order #22 created for Hamro Jorpati Fast Food','2026-06-07 14:05:56'),(166,1,'UPDATE','ORDERS','Order #22 advanced to \'Delivery in Progress\'','2026-06-07 14:06:13'),(167,1,'UPDATE','ORDERS','Order #22 updated with 1 items, total ???540','2026-06-07 14:06:33'),(168,1,'UPDATE','PRODUCTS','Product #34 updated','2026-06-07 14:15:16'),(169,1,'CREATE','ORDERS','Order #23 created for Hami Garchau','2026-06-07 14:20:07'),(170,1,'UPDATE','ORDERS','Order #23 advanced to \'Delivered\'','2026-06-07 14:20:13'),(171,1,'UPDATE','ORDERS','Order #14 updated with 1 items, total ???480','2026-06-08 12:32:40'),(172,1,'UPDATE','ORDERS','Order #14 advanced to \'Delivery in Progress\'','2026-06-08 12:32:44'),(173,1,'UPDATE','ORDERS','Order #22 advanced to \'Delivered\'','2026-06-08 12:32:56'),(174,1,'UPDATE','ORDERS','Order #21 advanced to \'Completed\'','2026-06-08 12:33:16'),(175,1,'CREATE','EXPENSES','Expense of ???8846 logged','2026-06-08 12:34:30'),(176,1,'CREATE','EXPENSES','Expense of ???310 logged','2026-06-08 12:35:38'),(177,1,'CREATE','ORDERS','Order #26 created for Bibek Dai','2026-06-08 12:38:26'),(178,1,'UPDATE','ORDERS','Order #26 advanced to \'Completed\'','2026-06-08 12:38:33'),(179,1,'CREATE','ORDERS','Order #27 created for Aayush Vanja','2026-06-08 12:39:39'),(180,1,'UPDATE','ORDERS','Order #27 advanced to \'Completed\'','2026-06-08 12:39:46'),(181,1,'UPDATE','ORDERS','Order #18 advanced to \'Completed\'','2026-06-08 12:40:31'),(182,1,'CREATE','EXPENSES','Expense of ???530 logged','2026-06-08 12:47:20'),(183,1,'UPDATE','ORDERS','Order #11 updated with 2 items, total ???969','2026-06-09 04:34:49'),(184,1,'UPDATE','ORDERS','Order #11 moved back to \'In Printing\'','2026-06-09 04:34:51'),(185,1,'UPDATE','ORDERS','Order #13 updated with 2 items, total ???290','2026-06-09 04:39:39'),(186,1,'UPDATE','ORDERS','Order #13 moved back to \'In Printing\'','2026-06-09 04:39:51'),(187,1,'CREATE','ORDERS','Order #28 created for Sunlight Bhattarai','2026-06-09 04:47:04'),(188,1,'UPDATE','ORDERS','Order #28 advanced to \'Completed\'','2026-06-09 04:47:13'),(189,1,'CREATE','ORDERS','Order #29 created for Prithvi Rokka','2026-06-09 04:49:31'),(190,1,'UPDATE','ORDERS','Order #29 advanced to \'Completed\'','2026-06-09 04:49:38'),(191,1,'CREATE','ORDERS','Order #30 created for Rijwal Sharma','2026-06-09 04:54:47'),(192,1,'CREATE','ORDERS','Order #31 created for Sagar Chand','2026-06-09 04:58:58'),(193,1,'UPDATE','ORDERS','Order #31 advanced to \'Delivery in Progress\'','2026-06-09 04:59:00'),(194,1,'CREATE','ORDERS','Order #32 created for Hrishant Maharjan','2026-06-09 05:04:28'),(195,1,'UPDATE','ORDERS','Order #32 advanced to \'Delivered\'','2026-06-09 05:04:30'),(196,1,'CREATE','ORDERS','Order #33 created for Asbin Kumar Chamel','2026-06-09 05:06:26'),(197,1,'UPDATE','ORDERS','Order #33 advanced to \'Delivered\'','2026-06-09 05:06:28'),(198,1,'CREATE','ORDERS','Order #34 created for Snehaa Adhikari','2026-06-09 05:13:29'),(199,1,'UPDATE','ORDERS','Order #34 advanced to \'Printing Done\'','2026-06-09 05:13:33'),(200,1,'UPDATE','ORDERS','Order #34 moved back to \'In Printing\'','2026-06-09 05:13:36'),(201,1,'CREATE','ORDERS','Order #35 created for Pratik Gurung Samdhi','2026-06-09 05:15:15'),(202,1,'UPDATE','ORDERS','Order #35 advanced to \'Completed\'','2026-06-09 05:15:23'),(203,1,'UPDATE','ORDERS','Order #13 moved back to \'Design Done\'','2026-06-09 05:18:37'),(204,1,'UPDATE','ORDERS','Order #14 moved back to \'Design Done\'','2026-06-09 05:18:43'),(205,1,'UPDATE','ORDERS','Order #14 advanced to \'Delivery in Progress\'','2026-06-09 05:18:46'),(206,1,'UPDATE','ORDERS','Order #11 moved back to \'Design Done\'','2026-06-09 05:18:55'),(207,1,'UPDATE','ORDERS','Order #11 moved back to \'Confirmed\'','2026-06-09 05:19:00'),(208,1,'UPDATE','ORDERS','Order #13 moved back to \'Confirmed\'','2026-06-09 05:19:03'),(209,1,'UPDATE','ORDERS','Order #33 updated with 1 items, total ???500','2026-06-09 05:24:02'),(210,1,'UPDATE','ORDERS','Order #22 updated with 2 items, total ???1660','2026-06-09 05:36:56'),(211,1,'UPDATE','ORDERS','Order #22 updated with 6 items, total ???3776','2026-06-09 05:45:28'),(212,1,'UPDATE','ORDERS','Order #22 advanced to \'Completed\'','2026-06-09 05:45:51'),(213,1,'CREATE','ORDERS','Order #36 created for Pratik Aryal','2026-06-09 05:48:13'),(214,1,'UPDATE','ORDERS','Order #36 advanced to \'Delivered\'','2026-06-09 05:48:16'),(215,1,'CREATE','ORDERS','Order #37 created for Sampanna Ghimire','2026-06-09 06:06:39'),(216,1,'UPDATE','ORDERS','Order #37 advanced to \'Completed\'','2026-06-09 06:06:48'),(217,1,'CREATE','ORDERS','Order #38 created for Code Sikshya','2026-06-09 06:08:10'),(218,1,'UPDATE','ORDERS','Order #38 advanced to \'Completed\'','2026-06-09 06:08:17'),(219,1,'UPDATE','ORDERS','Order #14 advanced to \'Completed\'','2026-06-09 06:10:21'),(220,1,'CREATE','EXPENSES','Expense of ???410 logged','2026-06-09 09:14:14'),(221,1,'CREATE','EXPENSES','Expense of ???500 logged','2026-06-09 09:14:32'),(222,1,'CREATE','ORDERS','Order #39 created for Nanimaiya Thapa','2026-06-09 09:39:43'),(223,1,'UPDATE','ORDERS','Order #30 advanced to \'Printing Done\'','2026-06-09 09:40:17'),(224,1,'UPDATE','ORDERS','Order #13 advanced to \'Printing Done\'','2026-06-09 09:40:39'),(225,1,'UPDATE','ORDERS','Order #11 advanced to \'Printing Done\'','2026-06-09 09:40:48'),(226,1,'UPDATE','ORDERS','Order #23 advanced to \'Completed\'','2026-06-09 09:46:02'),(227,1,'UPDATE','ORDERS','Order #39 advanced to \'Design Done\'','2026-06-09 14:12:35'),(228,1,'UPDATE','ORDERS','Order #39 moved back to \'Confirmed\'','2026-06-09 14:12:43'),(229,1,'UPDATE','ORDERS','Order #11 advanced to \'Printing Done\'','2026-06-09 14:14:18'),(230,1,'UPDATE','ORDERS','Order #11 advanced to \'Printing Done\'','2026-06-09 14:14:20'),(231,1,'UPDATE','ORDERS','Order #30 advanced to \'Delivered\'','2026-06-09 15:47:14'),(232,1,'CREATE','ORDERS','Order #40 created for Hami Garchau','2026-06-09 16:24:42'),(233,1,'DELETE','ORDERS','Order #40 (Hami Garchau) deleted','2026-06-09 16:25:06'),(234,1,'CREATE','ORDERS','Order #41 created for Hami Garchau','2026-06-09 16:25:42'),(235,1,'DELETE','ORDERS','Order #41 (Hami Garchau) deleted','2026-06-09 16:26:06'),(236,1,'UPDATE','ORDERS','Order #39 marked as defective','2026-06-10 03:43:12'),(237,1,'UPDATE','ORDERS','Order #39 marked as defective','2026-06-10 03:43:15'),(238,1,'UPDATE','ORDERS','Order #39 defect flag removed','2026-06-10 03:43:15'),(239,1,'UPDATE','ORDERS','Order #39 marked as defective','2026-06-10 03:43:16'),(240,1,'UPDATE','ORDERS','Order #39 marked as defective: test','2026-06-10 03:43:23'),(241,1,'UPDATE','ORDERS','Order #39 defect flag removed: test','2026-06-10 03:43:33'),(242,1,'UPDATE','ORDERS','Order #39 marked as defective: test','2026-06-10 04:19:25'),(243,1,'UPDATE','ORDERS','Order #39 defect flag removed: test','2026-06-10 04:19:26'),(244,1,'UPDATE','ORDERS','Order #39 marked as defective: test','2026-06-10 04:19:27'),(245,1,'UPDATE','ORDERS','Order #39 marked as defective','2026-06-10 04:19:29'),(246,1,'UPDATE','ORDERS','Order #39 defect flag removed','2026-06-10 04:19:29');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `total_orders` int NOT NULL DEFAULT '0',
  `lifetime_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Aayush Lama','9860707074','Gallchi, Dhading',1,969.00,'2026-06-09 13:57:42'),(2,'Anvik Ghimire','9860490507','Samriddhi Chok, Khumaltar, Lalitpur',1,290.00,'2026-06-09 13:57:42'),(3,'Sadbhav Khadka','123456789','Manakamana School',1,480.00,'2026-06-09 13:57:42'),(4,'Aayush Besigau','9803018968','Besigau, Kathmandu',1,200.00,'2026-06-09 13:57:42'),(5,'Radhika Dawadi','9849914954','Manamaiju, Kathmandu',1,1800.00,'2026-06-09 13:57:42'),(6,'Prasidha Pandey','9803004594','Kapan, Kathmandu',1,430.00,'2026-06-09 13:57:42'),(7,'Hamro Jorpati Fast Food','9851201708','Jorpati',1,3776.00,'2026-06-09 13:57:42'),(8,'Hami Garchau','9869225735','Dakshindhoka, Kathmandu',1,1850.00,'2026-06-09 13:57:42'),(9,'Bibek Dai','9843587900','Dakshindhoka, Kathmandu',1,100.00,'2026-06-09 13:57:42'),(10,'Aayush Vanja','9819027588','Kadaghari, Kathmandu',1,500.00,'2026-06-09 13:57:42'),(11,'Sunlight Bhattarai','9807909414','Narephanbt Jadibuti',1,780.00,'2026-06-09 13:57:42'),(12,'Prithvi Rokka','9818958565','Anamnagar, Kathmandu',1,600.00,'2026-06-09 13:57:42'),(13,'Rijwal Sharma','9709811476','Nepal Medical College, Kathmandu',1,280.00,'2026-06-09 13:57:42'),(14,'Sagar Chand','9761177235','Borradadi, Dhading-3',1,80.00,'2026-06-09 13:57:42'),(15,'Hrishant Maharjan','9767934066','Labim Mall, Pulchok, Lalitpur',1,980.00,'2026-06-09 13:57:42'),(16,'Asbin Kumar Chamrel','9801016191','Kandevtastan, Kupandol, Lalitpur',1,500.00,'2026-06-09 13:57:42'),(17,'Snehaa Adhikari','9765974009','Kapan',1,650.00,'2026-06-09 13:57:42'),(18,'Pratik Gurung Samdhi','98111111111111','Kapan, Kathmandu',1,350.00,'2026-06-09 13:57:42'),(19,'Pratik Aryal','9761522770','Putalisadak, Fika Takeway',1,800.00,'2026-06-09 13:57:42'),(20,'Sampanna Ghimire','9847697775','Kapan, Kathmandu',1,400.00,'2026-06-09 13:57:42'),(21,'Code Sikshya','98111111111111','Kathmandu',1,1500.00,'2026-06-09 13:57:42'),(22,'Nanimaiya Thapa','9840352318','Dakshindhoka Chok, Kathmandu',1,5855.00,'2026-06-09 13:57:42');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
  `payment_method` enum('QR','Physical Cash') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`expense_date`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (8,50.00,'Pani Jaar',NULL,'2026-06-07','QR','2026-06-07 12:36:46'),(9,110.00,'Moi',NULL,'2026-06-07','QR','2026-06-07 13:35:09'),(10,500.00,'Khaja','2x sausage\n2x syabhale\n2x legpiece\n1x plat momo','2026-06-07','QR','2026-06-07 14:01:29'),(11,8846.00,'Sujan Sir Express','Printing bills\nUpto: 2083-02-22','2026-06-08','QR','2026-06-08 12:34:30'),(12,310.00,'Khaja + Chamcha','Moi khaja + baraf\n1 pack plastic chamcha\n','2026-06-08','QR','2026-06-08 12:35:38'),(13,530.00,'Frame Besigau','A5 frame and\nLight wala frame payment','2026-06-08','QR','2026-06-08 12:47:20'),(14,410.00,'Khaja','Chowmain','2026-06-09','QR','2026-06-09 09:14:14'),(15,500.00,'Petrol','Bike ma petrol haleko','2026-06-09','QR','2026-06-09 09:14:32');
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
  `length` decimal(10,2) DEFAULT NULL COMMENT 'Length in unit for dimension products',
  `breadth` decimal(10,2) DEFAULT NULL,
  `unit` enum('inches','feet') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `order_items_ibfk_2` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (22,17,8,NULL,4,50.00,15.00,NULL,NULL,NULL),(23,18,32,NULL,20,90.00,50.00,NULL,NULL,NULL),(28,21,24,NULL,1,350.00,210.00,NULL,NULL,NULL),(29,21,7,NULL,1,80.00,30.00,NULL,NULL,NULL),(32,23,8,NULL,40,30.00,15.00,NULL,NULL,NULL),(33,23,NULL,'Stamp',1,450.00,250.00,NULL,NULL,NULL),(34,23,NULL,'Design',1,200.00,0.00,NULL,NULL,NULL),(35,14,11,NULL,4,120.00,50.00,NULL,NULL,NULL),(36,26,43,NULL,25,4.00,2.00,NULL,NULL,NULL),(37,27,43,NULL,100,5.00,2.00,NULL,NULL,NULL),(38,11,35,NULL,1,127.50,90.00,NULL,NULL,NULL),(39,11,16,NULL,11,76.50,45.00,NULL,NULL,NULL),(40,13,7,NULL,3,80.00,30.00,NULL,NULL,NULL),(41,13,8,NULL,1,50.00,15.00,NULL,NULL,NULL),(42,28,25,NULL,4,15.00,1.72,NULL,NULL,NULL),(43,28,26,NULL,16,20.00,4.00,NULL,NULL,NULL),(44,28,31,NULL,1,200.00,60.00,NULL,NULL,NULL),(45,28,30,NULL,2,100.00,30.00,NULL,NULL,NULL),(46,29,26,NULL,30,20.00,4.00,NULL,NULL,NULL),(47,30,8,NULL,4,50.00,15.00,NULL,NULL,NULL),(48,30,7,NULL,1,80.00,30.00,NULL,NULL,NULL),(49,31,8,NULL,1,50.00,15.00,NULL,NULL,NULL),(50,31,9,NULL,1,30.00,7.50,NULL,NULL,NULL),(51,32,27,NULL,20,40.00,10.00,NULL,NULL,NULL),(52,32,29,NULL,3,60.00,20.00,NULL,NULL,NULL),(54,34,36,NULL,500,1.30,0.80,NULL,NULL,NULL),(55,35,26,NULL,25,14.00,4.00,NULL,NULL,NULL),(56,33,8,NULL,10,50.00,15.00,NULL,NULL,NULL),(59,22,16,NULL,9,60.00,45.00,NULL,NULL,NULL),(60,22,41,NULL,10,112.00,60.00,NULL,NULL,NULL),(61,22,41,NULL,4,100.00,60.00,NULL,NULL,NULL),(62,22,41,NULL,4,229.00,60.00,NULL,NULL,NULL),(63,22,38,NULL,10,30.00,22.00,NULL,NULL,NULL),(64,22,NULL,'Fitting',1,500.00,0.00,NULL,NULL,NULL),(65,36,38,NULL,10,35.00,22.00,NULL,NULL,NULL),(66,36,NULL,'Stamp',1,450.00,250.00,NULL,NULL,NULL),(67,37,4,NULL,2,200.00,75.00,NULL,NULL,NULL),(68,38,NULL,'Stamp',1,450.00,250.00,NULL,NULL,NULL),(69,38,NULL,'Logo Design',1,1050.00,0.00,NULL,NULL,NULL),(70,39,42,NULL,29,115.00,70.00,NULL,NULL,NULL),(71,39,42,NULL,8,115.00,70.00,NULL,NULL,NULL),(72,39,38,NULL,15,40.00,22.00,NULL,NULL,NULL),(73,39,NULL,'Fitting',1,1000.00,0.00,NULL,NULL,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_revisions`
--

DROP TABLE IF EXISTS `order_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_revisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `diff_summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_revisions`
--

LOCK TABLES `order_revisions` WRITE;
/*!40000 ALTER TABLE `order_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('Confirmed','Design Done','In Printing','Printing Done','Delivery in Progress','Delivered','Completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Confirmed',
  `payment_status` enum('Pending','Paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `advance_payment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deadline` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `order_source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `platform_handle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('QR','COD','Physical Cash','Hybrid') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `online_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cash_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_defective` tinyint(1) NOT NULL DEFAULT '0',
  `defect_description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_customer` (`customer_name`),
  KEY `idx_customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (11,1,'Aayush Lama','9860707074','Gallchi, Dhading',969.00,'Printing Done','Pending',0.00,NULL,'COD',NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 12:30:19'),(13,2,'Anvik Ghimire','9860490507','Samriddhi Chok, Khumaltar, Lalitpur',290.00,'Printing Done','Pending',0.00,NULL,'Delivary Friday',NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 12:35:59'),(14,3,'Sadbhav Khadka','123456789','Manakamana School',480.00,'Completed','Paid',0.00,NULL,'Shrawan Vai Lai lagna launi',NULL,NULL,'Physical Cash',0.00,0.00,0,NULL,'2026-06-07 12:39:53'),(17,4,'Aayush Besigau','9803018968','Besigau, Kathmandu',200.00,'Printing Done','Pending',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 13:40:35'),(18,5,'Radhika Dawadi','9849914954','Manamaiju, Kathmandu',1800.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 13:42:18'),(21,6,'Prasidha Pandey','9803004594','Kapan, Kathmandu',430.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 13:47:50'),(22,7,'Hamro Jorpati Fast Food','9851201708','Jorpati',3776.00,'Completed','Paid',500.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-07 14:05:56'),(23,8,'Hami Garchau','9869225735','Dakshindhoka, Kathmandu',1850.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'Physical Cash',0.00,0.00,0,NULL,'2026-06-07 14:20:07'),(26,9,'Bibek Dai','9843587900','Dakshindhoka, Kathmandu',100.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-08 12:38:26'),(27,10,'Aayush Vanja','9819027588','Kadaghari, Kathmandu',500.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-08 12:39:39'),(28,11,'Sunlight Bhattarai','9807909414','Narephanbt Jadibuti',780.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 04:47:04'),(29,12,'Prithvi Rokka','9818958565','Anamnagar, Kathmandu',600.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 04:49:31'),(30,13,'Rijwal Sharma','9709811476','Nepal Medical College, Kathmandu',280.00,'Delivered','Pending',0.00,NULL,'Happy Papers Ma Dini',NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 04:54:47'),(31,14,'Sagar Chand','9761177235','Borradadi, Dhading-3',80.00,'Delivery in Progress','Pending',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 04:58:58'),(32,15,'Hrishant Maharjan','9767934066','Labim Mall, Pulchok, Lalitpur',980.00,'Delivered','Pending',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 05:04:28'),(33,16,'Asbin Kumar Chamrel','9801016191','Kandevtastan, Kupandol, Lalitpur',500.00,'Delivered','Pending',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 05:06:26'),(34,17,'Snehaa Adhikari','9765974009','Kapan',650.00,'In Printing','Pending',650.00,NULL,'poko Contact',NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 05:13:29'),(35,18,'Pratik Gurung Samdhi','98111111111111','Kapan, Kathmandu',350.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 05:15:15'),(36,19,'Pratik Aryal','9761522770','Putalisadak, Fika Takeway',800.00,'Delivered','Pending',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 05:48:13'),(37,20,'Sampanna Ghimire','9847697775','Kapan, Kathmandu',400.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 06:06:39'),(38,21,'Code Sikshya','98111111111111','Kathmandu',1500.00,'Completed','Paid',0.00,NULL,NULL,NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 06:08:10'),(39,22,'Nanimaiya Thapa','9840352318','Dakshindhoka Chok, Kathmandu',5855.00,'Confirmed','Pending',0.00,NULL,'72in x 58in Framed\n32in x 36in Frames\n21in x 42in (2x) frame ma tasne\n27in x 61in vinyl',NULL,NULL,'QR',0.00,0.00,0,NULL,'2026-06-09 09:39:43');
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
  `is_dimension_product` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Flag for sqft-based pricing (Flex, Vinyl, Banner etc.)',
  `sqft_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sqft_selling_price` decimal(10,2) NOT NULL DEFAULT '0.00',
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
INSERT INTO `products` VALUES (3,'High Quality Matte Poster - A3','CHHP-0001',150.00,249.00,0,0.00,0.00,'2026-06-07 06:33:12'),(4,'High Quality Matte Poster - A4','CHHP-0002',75.00,149.00,0,0.00,0.00,'2026-06-07 06:33:12'),(5,'High Quality Matte Poster - A5','CHHP-0003',37.50,99.00,0,0.00,0.00,'2026-06-07 06:33:12'),(6,'High Quality Matte Poster - MINI/A6','CHHP-0004',18.75,49.00,0,0.00,0.00,'2026-06-07 06:33:12'),(7,'High Quality Normal Poster - A3','CHHP-0005',30.00,80.00,0,0.00,0.00,'2026-06-07 06:33:12'),(8,'High Quality Normal Poster - A4','CHHP-0006',15.00,50.00,0,0.00,0.00,'2026-06-07 06:33:12'),(9,'High Quality Normal Poster - A5','CHHP-0007',7.50,30.00,0,0.00,0.00,'2026-06-07 06:33:12'),(10,'High Quality Normal Poster - MINI/A6','CHHP-0008',3.75,20.00,0,0.00,0.00,'2026-06-07 06:33:12'),(11,'Sticker Normal Poster - A3','CHHP-0009',50.00,120.00,0,0.00,0.00,'2026-06-07 06:33:12'),(12,'Sticker Normal Poster - A4','CHHP-0010',25.00,70.00,0,0.00,0.00,'2026-06-07 06:33:12'),(13,'Sticker Normal Poster - A5','CHHP-0011',12.50,50.00,0,0.00,0.00,'2026-06-07 06:33:12'),(14,'Sticker Normal Poster - MINI/A6','CHHP-0012',6.25,35.00,0,0.00,0.00,'2026-06-07 06:33:12'),(15,'Sticker Laminated Poster - A3','CHHP-0013',90.00,180.00,0,0.00,0.00,'2026-06-07 06:33:12'),(16,'Sticker Laminated Poster - A4','CHHP-0014',45.00,100.00,0,0.00,0.00,'2026-06-07 06:33:12'),(17,'Sticker Laminated Poster - A5','CHHP-0015',22.50,60.00,0,0.00,0.00,'2026-06-07 06:33:12'),(18,'Sticker Laminated Poster - MINI/A6','CHHP-0016',16.25,45.00,0,0.00,0.00,'2026-06-07 06:33:12'),(19,'Sticker High Quality Poster - A4','CHHP-0017',60.00,250.00,0,0.00,0.00,'2026-06-07 06:33:12'),(20,'Sticker High Quality Poster - A5','CHHP-0018',30.00,130.00,0,0.00,0.00,'2026-06-07 06:33:12'),(21,'Sticker High Quality Poster - MINI/A6','CHHP-0019',15.00,70.00,0,0.00,0.00,'2026-06-07 06:33:12'),(22,'Framed Poster - A3','CHHP-0020',550.00,1250.00,0,0.00,0.00,'2026-06-07 06:33:12'),(23,'Framed Poster - A4','CHHP-0021',275.00,650.00,0,0.00,0.00,'2026-06-07 06:33:12'),(24,'Framed Poster - A5','CHHP-0022',210.00,350.00,0,0.00,0.00,'2026-06-07 06:33:12'),(25,'Laminated High Quality Sticker - 35mm x 35mm','CHHP-0023',1.72,15.00,0,0.00,0.00,'2026-06-07 06:33:12'),(26,'Laminated High Quality Sticker - 50mm x 50mm','CHHP-0024',4.00,20.00,0,0.00,0.00,'2026-06-07 06:33:12'),(27,'Laminated High Quality Sticker - 90mm x 90mm','CHHP-0025',10.00,40.00,0,0.00,0.00,'2026-06-07 06:33:12'),(28,'Laminated High Quality Sticker - 50mm x 90mm','CHHP-0026',6.00,35.00,0,0.00,0.00,'2026-06-07 06:33:12'),(29,'Laminated High Quality Sticker - 90mm x 180mm','CHHP-0027',20.00,60.00,0,0.00,0.00,'2026-06-07 06:33:12'),(30,'Laminated High Quality Sticker - 130mm x 180mm','CHHP-0028',30.00,100.00,0,0.00,0.00,'2026-06-07 06:33:12'),(31,'Laminated High Quality Sticker - A4 Size','CHHP-0029',60.00,200.00,0,0.00,0.00,'2026-06-07 06:33:12'),(32,'Normal Paper Sticker - A3','CHHP-0030',50.00,100.00,0,0.00,0.00,'2026-06-07 06:33:12'),(33,'Normal Paper Sticker - A4','CHHP-0031',25.00,60.00,0,0.00,0.00,'2026-06-07 06:33:12'),(34,'Laminated Paper Sticker - A4','CHHP-0034',50.00,110.00,0,0.00,0.00,'2026-06-07 06:53:17'),(35,'Laminated Paper Sticker - A3','CHHP-0035',90.00,200.00,0,0.00,0.00,'2026-06-07 06:53:49'),(36,'Visiting Card Normal 1 Side','CHHP-0036',0.80,1.30,0,0.00,0.00,'2026-06-07 06:55:12'),(37,'Visiting Card Normal 2 Side','CHHP-0037',1.00,1.60,0,0.00,0.00,'2026-06-07 06:56:03'),(38,'Flex Normal Sq. Ft','CHHP-0038',22.00,40.00,0,0.00,0.00,'2026-06-07 06:57:51'),(39,'Bill Pad 10 books','CHHP-0039',650.00,950.00,0,0.00,0.00,'2026-06-07 07:00:16'),(40,'Bill Pad 20 book','CHHP-0040',950.00,1250.00,0,0.00,0.00,'2026-06-07 07:00:50'),(41,'Vinyl Sticker Transparent/Normal Sq. Ft','CHHP-0041',60.00,120.00,0,0.00,0.00,'2026-06-07 07:02:05'),(42,'Framed Flex Sq. Ft','CHHP-0042',70.00,100.00,0,0.00,0.00,'2026-06-07 07:04:25'),(43,'Photocopy','CHHP-0043',2.00,5.00,0,0.00,0.00,'2026-06-07 07:05:53'),(44,'Color Print Full','CHHP-0044',20.00,40.00,0,0.00,0.00,'2026-06-07 07:07:45'),(45,'Color Print Document','CHHP-0045',5.00,15.00,0,0.00,0.00,'2026-06-07 07:08:01'),(46,'Normal Inkjet Photo Print 240gsm','CHHP-0046',30.00,100.00,0,0.00,0.00,'2026-06-07 07:13:57');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_address` text COLLATE utf8mb4_unicode_ci,
  `items` json NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `description` text COLLATE utf8mb4_unicode_ci,
  `valid_until` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_number` (`quote_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
INSERT INTO `quotations` VALUES (8,'Q-20260610-0001','Biraj Sapkota','9869225735','Chhaap','dir','ktm','[{\"quantity\": 1, \"sold_price\": 120, \"product_name\": \"Vinyl Sticker Transparent/Normal Sq. Ft\"}]',120.00,'hello','2026-06-24','2026-06-10 04:17:37');
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
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
  `role` enum('admin','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Chhaap Admin','contact.chhaapcreatives@gmail.com','$2y$10$5j5sQPQ2MXkllgFiTgaBPei4EN1PNGVuvvP5rohjrNjRIwXTAdq4S','admin','2026-06-07 06:07:16');
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

-- Dump completed on 2026-06-10 10:39:10
