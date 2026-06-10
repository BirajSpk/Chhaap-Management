-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 09, 2026 at 12:20 PM
-- Server version: 11.8.6-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u164790521_chhaap_mgt`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `description`, `created_at`) VALUES
(3, 'Product #3 updated', '2026-06-07 06:36:18'),
(4, 'Product #4 updated', '2026-06-07 06:36:32'),
(5, 'Product #5 updated', '2026-06-07 06:36:52'),
(6, 'Product #6 updated', '2026-06-07 06:37:21'),
(7, 'Product #7 updated', '2026-06-07 06:37:29'),
(8, 'Product #8 updated', '2026-06-07 06:37:34'),
(9, 'Product #9 updated', '2026-06-07 06:37:43'),
(10, 'Product #10 updated', '2026-06-07 06:37:56'),
(11, 'Product #11 updated', '2026-06-07 06:38:12'),
(12, 'Product #12 updated', '2026-06-07 06:38:25'),
(13, 'Product #12 updated', '2026-06-07 06:38:33'),
(14, 'Product #13 updated', '2026-06-07 06:38:55'),
(15, 'Product #14 updated', '2026-06-07 06:39:04'),
(16, 'Product #15 updated', '2026-06-07 06:40:28'),
(17, 'Product #15 updated', '2026-06-07 06:43:33'),
(18, 'Product #16 updated', '2026-06-07 06:43:53'),
(19, 'Product #17 updated', '2026-06-07 06:44:09'),
(20, 'Product #18 updated', '2026-06-07 06:44:42'),
(21, 'Product #17 updated', '2026-06-07 06:45:03'),
(22, 'Product #19 updated', '2026-06-07 06:45:23'),
(23, 'Product #20 updated', '2026-06-07 06:45:50'),
(24, 'Product #21 updated', '2026-06-07 06:45:55'),
(25, 'Product #22 updated', '2026-06-07 06:49:02'),
(26, 'Product #23 updated', '2026-06-07 06:49:10'),
(27, 'Product #24 updated', '2026-06-07 06:49:55'),
(28, 'Product #25 updated', '2026-06-07 06:50:21'),
(29, 'Product #26 updated', '2026-06-07 06:50:37'),
(30, 'Product #27 updated', '2026-06-07 06:50:52'),
(31, 'Product #28 updated', '2026-06-07 06:51:22'),
(32, 'Product #29 updated', '2026-06-07 06:51:39'),
(33, 'Product #31 updated', '2026-06-07 06:51:49'),
(34, 'Product #30 updated', '2026-06-07 06:52:16'),
(35, 'Product #32 updated', '2026-06-07 06:52:32'),
(36, 'Product #33 updated', '2026-06-07 06:52:37'),
(37, 'Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0034)', '2026-06-07 06:53:17'),
(38, 'Product \'Laminated Paper Sticker - A3\' created (SKU: CHHP-0035)', '2026-06-07 06:53:49'),
(39, 'Product \'Visiting Card Normal 1 Side\' created (SKU: CHHP-0036)', '2026-06-07 06:55:12'),
(40, 'Product \'Visiting Card Normal 2 Side\' created (SKU: CHHP-0037)', '2026-06-07 06:56:03'),
(41, 'Product \'Flex Normal\' created (SKU: CHHP-0038)', '2026-06-07 06:57:51'),
(42, 'Product #38 updated', '2026-06-07 06:58:12'),
(43, 'Product \'Bill Pad 10 book\' created (SKU: CHHP-0039)', '2026-06-07 07:00:16'),
(44, 'Product #39 updated', '2026-06-07 07:00:23'),
(45, 'Product \'Bill Pad 20 book\' created (SKU: CHHP-0040)', '2026-06-07 07:00:50'),
(46, 'Product \'Vinyl Sticker Transparent/Normal Sq. Ft\' created (SKU: CHHP-0041)', '2026-06-07 07:02:05'),
(47, 'Product \'Framed Flex Sq. Ft\' created (SKU: CHHP-0042)', '2026-06-07 07:04:25'),
(48, 'Product \'Photocopy\' created (SKU: CHHP-0043)', '2026-06-07 07:05:53'),
(49, 'Product \'Color Print Full\' created (SKU: CHHP-0044)', '2026-06-07 07:07:45'),
(50, 'Product \'Color Print Document\' created (SKU: CHHP-0045)', '2026-06-07 07:08:01'),
(51, 'Product \'Normal Inkjet Photo Print 240gsm\' created (SKU: CHHP-0046)', '2026-06-07 07:13:57'),
(52, 'Order #5 created for Test User', '2026-06-07 07:40:14'),
(53, 'Order #5 updated with 1 items, total Γé╣249', '2026-06-07 07:40:55'),
(54, 'Order #5 (Test User Updated) deleted', '2026-06-07 07:55:14'),
(55, 'Order #6 created for Biraj Sapktoa', '2026-06-07 08:03:07'),
(56, 'Order #6 moved to \'Design Done\'', '2026-06-07 08:03:14'),
(57, 'Order #6 moved to \'In Printing\'', '2026-06-07 08:03:30'),
(58, 'Order #6 moved to \'Printing Done\'', '2026-06-07 08:03:34'),
(59, 'Order #6 moved to \'Delivery in Progress\'', '2026-06-07 08:03:39'),
(60, 'Order #6 moved to \'Delivered\'', '2026-06-07 08:03:43'),
(61, 'Order #6 moved to \'Completed\'', '2026-06-07 08:03:53'),
(62, 'Expense of Γé╣300 logged', '2026-06-07 08:04:49'),
(63, 'Order #6 (Biraj Sapktoa) deleted', '2026-06-07 08:05:25'),
(64, 'Order #7 created for asdadas', '2026-06-07 09:08:48'),
(65, 'Order #7 moved to \'Design Done\'', '2026-06-07 09:08:55'),
(66, 'Order #7 moved to \'In Printing\'', '2026-06-07 09:19:23'),
(67, 'Order #7 moved to \'Printing Done\'', '2026-06-07 09:19:29'),
(68, 'Order #7 updated with 2 items, total Γé╣220', '2026-06-07 09:19:45'),
(69, 'Order #7 moved to \'Delivery in Progress\'', '2026-06-07 09:19:48'),
(70, 'Order #7 advanced to \'Delivered\'', '2026-06-07 09:23:16'),
(71, 'Order #7 moved back to \'Confirmed\'', '2026-06-07 09:23:27'),
(72, 'Order #8 created for Status Test', '2026-06-07 09:24:56'),
(73, 'Order #8 advanced to \'In Printing\'', '2026-06-07 09:24:56'),
(74, 'Order #8 moved back to \'Design Done\'', '2026-06-07 09:24:56'),
(75, 'Expense of Γé╣300.00 deleted', '2026-06-07 09:25:02'),
(76, 'Order #7 advanced to \'Delivered\'', '2026-06-07 09:25:06'),
(77, 'Order #8 advanced to \'Completed\'', '2026-06-07 09:25:08'),
(78, 'Order #7 moved back to \'Confirmed\'', '2026-06-07 09:25:27'),
(79, 'Order #7 advanced to \'Delivered\'', '2026-06-07 09:26:03'),
(80, 'Expense of Γé╣45 logged', '2026-06-07 09:32:32'),
(81, 'Order #9 created for Click Test', '2026-06-07 09:34:10'),
(82, 'Order #9 advanced to \'In Printing\'', '2026-06-07 09:34:10'),
(83, 'Order #9 moved back to \'Design Done\'', '2026-06-07 09:34:10'),
(84, 'Order #9 advanced to \'Delivered\'', '2026-06-07 09:34:10'),
(85, 'Order #9 moved back to \'Delivery in Progress\'', '2026-06-07 09:34:17'),
(86, 'Order #9 advanced to \'Delivered\'', '2026-06-07 09:34:21'),
(87, 'Order #9 moved back to \'Delivery in Progress\'', '2026-06-07 09:34:22'),
(88, 'Order #9 moved back to \'Printing Done\'', '2026-06-07 09:34:23'),
(89, 'Order #9 moved back to \'In Printing\'', '2026-06-07 09:34:23'),
(90, 'Order #9 moved back to \'Design Done\'', '2026-06-07 09:34:24'),
(91, 'Order #9 moved back to \'Confirmed\'', '2026-06-07 09:34:26'),
(92, 'Order #9 advanced to \'Design Done\'', '2026-06-07 09:34:41'),
(93, 'Order #9 advanced to \'In Printing\'', '2026-06-07 09:34:44'),
(94, 'Order #9 advanced to \'Printing Done\'', '2026-06-07 09:34:45'),
(95, 'Order #9 advanced to \'Delivery in Progress\'', '2026-06-07 09:34:45'),
(96, 'Order #9 advanced to \'Delivered\'', '2026-06-07 09:34:46'),
(97, 'Order #9 moved back to \'Printing Done\'', '2026-06-07 09:34:49'),
(98, 'Order #9 advanced to \'Completed\'', '2026-06-07 09:35:04'),
(99, 'Order #8 (Status Test) deleted', '2026-06-07 09:35:26'),
(100, 'Expense of Γé╣45.00 deleted', '2026-06-07 10:17:38'),
(101, 'Expense of Γé╣45 logged', '2026-06-07 10:18:05'),
(102, 'Expense of Γé╣45.00 deleted', '2026-06-07 10:18:25'),
(103, 'Expense of Γé╣45 logged', '2026-06-07 10:18:46'),
(104, 'Expense of Γé╣45.00 deleted', '2026-06-07 10:18:58'),
(105, 'Order #10 created for sdfdsfsd', '2026-06-07 10:26:34'),
(106, 'Order #10 advanced to \'Design Done\'', '2026-06-07 10:26:38'),
(107, 'Order #10 advanced to \'In Printing\'', '2026-06-07 10:26:41'),
(108, 'Order #10 advanced to \'Printing Done\'', '2026-06-07 10:26:43'),
(109, 'Order #10 advanced to \'Delivery in Progress\'', '2026-06-07 10:26:44'),
(110, 'Order #10 advanced to \'Delivered\'', '2026-06-07 10:26:45'),
(111, 'Order #10 (sdfdsfsd) deleted', '2026-06-07 10:26:53'),
(112, 'Order #9 (Click Test) deleted', '2026-06-07 10:27:05'),
(113, 'Order #7 advanced to \'Completed\'', '2026-06-07 10:27:24'),
(114, 'Product \'random\' created (SKU: CHHP-0047)', '2026-06-07 10:27:48'),
(115, 'Product \'random\' deleted', '2026-06-07 10:27:55'),
(116, 'Product \'Random Test\' created (SKU: CHHP-0047)', '2026-06-07 10:28:17'),
(117, 'Product \'Random Test\' deleted', '2026-06-07 10:28:23'),
(118, 'Expense of Γé╣45 logged', '2026-06-07 10:34:16'),
(119, 'Expense of Γé╣50 logged', '2026-06-07 10:34:25'),
(120, 'Expense of Γé╣45.00 deleted', '2026-06-07 10:34:43'),
(121, 'Expense of Γé╣50.00 deleted', '2026-06-07 10:34:47'),
(122, 'Order #7 (asdadas) deleted', '2026-06-07 11:00:05'),
(123, 'Order #11 created for Aayush Lama', '2026-06-07 12:30:19'),
(124, 'Order #11 advanced to \'In Printing\'', '2026-06-07 12:30:23'),
(125, 'Order #12 created for test', '2026-06-07 12:32:47'),
(126, 'Order #12 advanced to \'Completed\'', '2026-06-07 12:32:54'),
(127, 'Order #12 (test) deleted', '2026-06-07 12:33:14'),
(128, 'Order #13 created for Anvik Ghimire', '2026-06-07 12:35:59'),
(129, 'Order #13 advanced to \'In Printing\'', '2026-06-07 12:36:07'),
(130, 'Expense of ₹50 logged', '2026-06-07 12:36:46'),
(131, 'Order #14 created for Sadbhav Khadka', '2026-06-07 12:39:53'),
(132, 'Order #14 advanced to \'In Printing\'', '2026-06-07 12:39:55'),
(133, 'Order #15 created for test', '2026-06-07 12:46:46'),
(134, 'Order #15 advanced to \'Completed\'', '2026-06-07 12:47:27'),
(135, 'Order #15 (test) deleted', '2026-06-07 12:49:08'),
(136, 'Order #14 advanced to \'Printing Done\'', '2026-06-07 13:02:05'),
(137, 'Order #14 advanced to \'Printing Done\'', '2026-06-07 13:02:05'),
(138, 'Order #14 advanced to \'Delivered\'', '2026-06-07 13:02:06'),
(139, 'Order #14 advanced to \'Delivered\'', '2026-06-07 13:02:06'),
(140, 'Order #14 moved back to \'In Printing\'', '2026-06-07 13:02:09'),
(141, 'Order #16 created for test', '2026-06-07 13:30:29'),
(142, 'Order #16 advanced to \'Design Done\'', '2026-06-07 13:30:33'),
(143, 'Order #16 advanced to \'In Printing\'', '2026-06-07 13:30:34'),
(144, 'Order #16 advanced to \'Printing Done\'', '2026-06-07 13:30:35'),
(145, 'Order #16 advanced to \'Delivery in Progress\'', '2026-06-07 13:30:36'),
(146, 'Order #16 advanced to \'Delivered\'', '2026-06-07 13:30:37'),
(147, 'Order #16 advanced to \'Completed\'', '2026-06-07 13:30:47'),
(148, 'Order #16 (test) deleted', '2026-06-07 13:30:58'),
(149, 'Order #14 advanced to \'Printing Done\'', '2026-06-07 13:31:39'),
(150, 'Order #13 advanced to \'Printing Done\'', '2026-06-07 13:31:50'),
(151, 'Order #11 advanced to \'Printing Done\'', '2026-06-07 13:32:08'),
(152, 'Expense of ₹110 logged', '2026-06-07 13:35:09'),
(153, 'Order #17 created for Aayush Besigau', '2026-06-07 13:40:35'),
(154, 'Order #17 advanced to \'Printing Done\'', '2026-06-07 13:40:37'),
(155, 'Order #18 created for Radhika Dawadi', '2026-06-07 13:42:18'),
(156, 'Order #18 advanced to \'Delivered\'', '2026-06-07 13:42:23'),
(157, 'Order #19 created for Prasidha Pandey', '2026-06-07 13:44:53'),
(158, 'Order #20 created for Prasidha Pandey', '2026-06-07 13:44:53'),
(159, 'Order #20 advanced to \'In Printing\'', '2026-06-07 13:45:25'),
(160, 'Order #19 (Prasidha Pandey) deleted', '2026-06-07 13:45:50'),
(161, 'Order #20 (Prasidha Pandey) deleted', '2026-06-07 13:46:12'),
(162, 'Order #21 created for Prasidha Pandey', '2026-06-07 13:47:50'),
(163, 'Order #21 advanced to \'In Printing\'', '2026-06-07 13:47:57'),
(164, 'Expense of ₹500 logged', '2026-06-07 14:01:29'),
(165, 'Order #22 created for Hamro Jorpati Fast Food', '2026-06-07 14:05:56'),
(166, 'Order #22 advanced to \'Delivery in Progress\'', '2026-06-07 14:06:13'),
(167, 'Order #22 updated with 1 items, total ₹540', '2026-06-07 14:06:33'),
(168, 'Product #34 updated', '2026-06-07 14:15:16'),
(169, 'Order #23 created for Hami Garchau', '2026-06-07 14:20:07'),
(170, 'Order #23 advanced to \'Delivered\'', '2026-06-07 14:20:13'),
(171, 'Order #14 updated with 1 items, total ₹480', '2026-06-08 12:32:40'),
(172, 'Order #14 advanced to \'Delivery in Progress\'', '2026-06-08 12:32:44'),
(173, 'Order #22 advanced to \'Delivered\'', '2026-06-08 12:32:56'),
(174, 'Order #21 advanced to \'Completed\'', '2026-06-08 12:33:16'),
(175, 'Expense of ₹8846 logged', '2026-06-08 12:34:30'),
(176, 'Expense of ₹310 logged', '2026-06-08 12:35:38'),
(177, 'Order #26 created for Bibek Dai', '2026-06-08 12:38:26'),
(178, 'Order #26 advanced to \'Completed\'', '2026-06-08 12:38:33'),
(179, 'Order #27 created for Aayush Vanja', '2026-06-08 12:39:39'),
(180, 'Order #27 advanced to \'Completed\'', '2026-06-08 12:39:46'),
(181, 'Order #18 advanced to \'Completed\'', '2026-06-08 12:40:31'),
(182, 'Expense of ₹530 logged', '2026-06-08 12:47:20'),
(183, 'Order #11 updated with 2 items, total ₹969', '2026-06-09 04:34:49'),
(184, 'Order #11 moved back to \'In Printing\'', '2026-06-09 04:34:51'),
(185, 'Order #13 updated with 2 items, total ₹290', '2026-06-09 04:39:39'),
(186, 'Order #13 moved back to \'In Printing\'', '2026-06-09 04:39:51'),
(187, 'Order #28 created for Sunlight Bhattarai', '2026-06-09 04:47:04'),
(188, 'Order #28 advanced to \'Completed\'', '2026-06-09 04:47:13'),
(189, 'Order #29 created for Prithvi Rokka', '2026-06-09 04:49:31'),
(190, 'Order #29 advanced to \'Completed\'', '2026-06-09 04:49:38'),
(191, 'Order #30 created for Rijwal Sharma', '2026-06-09 04:54:47'),
(192, 'Order #31 created for Sagar Chand', '2026-06-09 04:58:58'),
(193, 'Order #31 advanced to \'Delivery in Progress\'', '2026-06-09 04:59:00'),
(194, 'Order #32 created for Hrishant Maharjan', '2026-06-09 05:04:28'),
(195, 'Order #32 advanced to \'Delivered\'', '2026-06-09 05:04:30'),
(196, 'Order #33 created for Asbin Kumar Chamel', '2026-06-09 05:06:26'),
(197, 'Order #33 advanced to \'Delivered\'', '2026-06-09 05:06:28'),
(198, 'Order #34 created for Snehaa Adhikari', '2026-06-09 05:13:29'),
(199, 'Order #34 advanced to \'Printing Done\'', '2026-06-09 05:13:33'),
(200, 'Order #34 moved back to \'In Printing\'', '2026-06-09 05:13:36'),
(201, 'Order #35 created for Pratik Gurung Samdhi', '2026-06-09 05:15:15'),
(202, 'Order #35 advanced to \'Completed\'', '2026-06-09 05:15:23'),
(203, 'Order #13 moved back to \'Design Done\'', '2026-06-09 05:18:37'),
(204, 'Order #14 moved back to \'Design Done\'', '2026-06-09 05:18:43'),
(205, 'Order #14 advanced to \'Delivery in Progress\'', '2026-06-09 05:18:46'),
(206, 'Order #11 moved back to \'Design Done\'', '2026-06-09 05:18:55'),
(207, 'Order #11 moved back to \'Confirmed\'', '2026-06-09 05:19:00'),
(208, 'Order #13 moved back to \'Confirmed\'', '2026-06-09 05:19:03'),
(209, 'Order #33 updated with 1 items, total ₹500', '2026-06-09 05:24:02'),
(210, 'Order #22 updated with 2 items, total ₹1660', '2026-06-09 05:36:56'),
(211, 'Order #22 updated with 6 items, total ₹3776', '2026-06-09 05:45:28'),
(212, 'Order #22 advanced to \'Completed\'', '2026-06-09 05:45:51'),
(213, 'Order #36 created for Pratik Aryal', '2026-06-09 05:48:13'),
(214, 'Order #36 advanced to \'Delivered\'', '2026-06-09 05:48:16'),
(215, 'Order #37 created for Sampanna Ghimire', '2026-06-09 06:06:39'),
(216, 'Order #37 advanced to \'Completed\'', '2026-06-09 06:06:48'),
(217, 'Order #38 created for Code Sikshya', '2026-06-09 06:08:10'),
(218, 'Order #38 advanced to \'Completed\'', '2026-06-09 06:08:17'),
(219, 'Order #14 advanced to \'Completed\'', '2026-06-09 06:10:21'),
(220, 'Expense of ₹410 logged', '2026-06-09 09:14:14'),
(221, 'Expense of ₹500 logged', '2026-06-09 09:14:32'),
(222, 'Order #39 created for Nanimaiya Thapa', '2026-06-09 09:39:43'),
(223, 'Order #30 advanced to \'Printing Done\'', '2026-06-09 09:40:17'),
(224, 'Order #13 advanced to \'Printing Done\'', '2026-06-09 09:40:39'),
(225, 'Order #11 advanced to \'Printing Done\'', '2026-06-09 09:40:48'),
(226, 'Order #23 advanced to \'Completed\'', '2026-06-09 09:46:02');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `expense_amount` decimal(10,2) DEFAULT NULL,
  `expense_name` text DEFAULT NULL,
  `expense_description` text DEFAULT NULL,
  `expense_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `expense_amount`, `expense_name`, `expense_description`, `expense_date`, `created_at`) VALUES
(8, 50.00, 'Pani Jaar', NULL, '2026-06-07', '2026-06-07 12:36:46'),
(9, 110.00, 'Moi', NULL, '2026-06-07', '2026-06-07 13:35:09'),
(10, 500.00, 'Khaja', '2x sausage\n2x syabhale\n2x legpiece\n1x plat momo', '2026-06-07', '2026-06-07 14:01:29'),
(11, 8846.00, 'Sujan Sir Express', 'Printing bills\nUpto: 2083-02-22', '2026-06-08', '2026-06-08 12:34:30'),
(12, 310.00, 'Khaja + Chamcha', 'Moi khaja + baraf\n1 pack plastic chamcha\n', '2026-06-08', '2026-06-08 12:35:38'),
(13, 530.00, 'Frame Besigau', 'A5 frame and\nLight wala frame payment', '2026-06-08', '2026-06-08 12:47:20'),
(14, 410.00, 'Khaja', 'Chowmain', '2026-06-09', '2026-06-09 09:14:14'),
(15, 500.00, 'Petrol', 'Bike ma petrol haleko', '2026-06-09', '2026-06-09 09:14:32');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_address` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('Confirmed','Design Done','In Printing','Printing Done','Delivery in Progress','Delivered','Completed') NOT NULL DEFAULT 'Confirmed',
  `payment_status` enum('Pending','Paid') NOT NULL DEFAULT 'Pending',
  `advance_payment` decimal(10,2) NOT NULL DEFAULT 0.00,
  `deadline` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_phone`, `customer_address`, `total_amount`, `status`, `payment_status`, `advance_payment`, `deadline`, `notes`, `created_at`) VALUES
(11, 'Aayush Lama', '9860707074', 'Gallchi, Dhading', 969.00, 'Printing Done', 'Pending', 0.00, NULL, 'COD', '2026-06-07 12:30:19'),
(13, 'Anvik Ghimire', '9860490507', 'Samriddhi Chok, Khumaltar, Lalitpur', 290.00, 'Printing Done', 'Pending', 0.00, NULL, 'Delivary Friday', '2026-06-07 12:35:59'),
(14, 'Sadbhav Khadka', '123456789', 'Manakamana School', 480.00, 'Completed', 'Paid', 0.00, NULL, 'Shrawan Vai Lai lagna launi', '2026-06-07 12:39:53'),
(17, 'Aayush Besigau', '9803018968', 'Besigau, Kathmandu', 200.00, 'Printing Done', 'Pending', 0.00, NULL, NULL, '2026-06-07 13:40:35'),
(18, 'Radhika Dawadi', '9849914954', 'Manamaiju, Kathmandu', 1800.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-07 13:42:18'),
(21, 'Prasidha Pandey', '9803004594', 'Kapan, Kathmandu', 430.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-07 13:47:50'),
(22, 'Hamro Jorpati Fast Food', '9851201708', 'Jorpati', 3776.00, 'Completed', 'Paid', 500.00, NULL, NULL, '2026-06-07 14:05:56'),
(23, 'Hami Garchau', '9869225735', 'Dakshindhoka, Kathmandu', 1850.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-07 14:20:07'),
(26, 'Bibek Dai', '9843587900', 'Dakshindhoka, Kathmandu', 100.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-08 12:38:26'),
(27, 'Aayush Vanja', '9819027588', 'Kadaghari, Kathmandu', 500.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-08 12:39:39'),
(28, 'Sunlight Bhattarai', '9807909414', 'Narephanbt Jadibuti', 780.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-09 04:47:04'),
(29, 'Prithvi Rokka', '9818958565', 'Anamnagar, Kathmandu', 600.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-09 04:49:31'),
(30, 'Rijwal Sharma', '9709811476', 'Nepal Medical College, Kathmandu', 280.00, 'Printing Done', 'Pending', 0.00, NULL, 'Happy Papers Ma Dini', '2026-06-09 04:54:47'),
(31, 'Sagar Chand', '9761177235', 'Borradadi, Dhading-3', 80.00, 'Delivery in Progress', 'Pending', 0.00, NULL, NULL, '2026-06-09 04:58:58'),
(32, 'Hrishant Maharjan', '9767934066', 'Labim Mall, Pulchok, Lalitpur', 980.00, 'Delivered', 'Pending', 0.00, NULL, NULL, '2026-06-09 05:04:28'),
(33, 'Asbin Kumar Chamrel', '9801016191', 'Kandevtastan, Kupandol, Lalitpur', 500.00, 'Delivered', 'Pending', 0.00, NULL, NULL, '2026-06-09 05:06:26'),
(34, 'Snehaa Adhikari', '9765974009', 'Kapan', 650.00, 'In Printing', 'Pending', 650.00, NULL, 'poko Contact', '2026-06-09 05:13:29'),
(35, 'Pratik Gurung Samdhi', '98111111111111', 'Kapan, Kathmandu', 350.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-09 05:15:15'),
(36, 'Pratik Aryal', '9761522770', 'Putalisadak, Fika Takeway', 800.00, 'Delivered', 'Pending', 0.00, NULL, NULL, '2026-06-09 05:48:13'),
(37, 'Sampanna Ghimire', '9847697775', 'Kapan, Kathmandu', 400.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-09 06:06:39'),
(38, 'Code Sikshya', '98111111111111', 'Kathmandu', 1500.00, 'Completed', 'Paid', 0.00, NULL, NULL, '2026-06-09 06:08:10'),
(39, 'Nanimaiya Thapa', '9840352318', 'Dakshindhoka Chok, Kathmandu', 5855.00, 'Confirmed', 'Pending', 0.00, NULL, '72in x 58in Framed\n32in x 36in Frames\n21in x 42in (2x) frame ma tasne\n27in x 61in vinyl', '2026-06-09 09:39:43');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `custom_item_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `sold_price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `custom_item_name`, `quantity`, `sold_price`, `cost_price`) VALUES
(22, 17, 8, NULL, 4, 50.00, 15.00),
(23, 18, 32, NULL, 20, 90.00, 50.00),
(28, 21, 24, NULL, 1, 350.00, 210.00),
(29, 21, 7, NULL, 1, 80.00, 30.00),
(32, 23, 8, NULL, 40, 30.00, 15.00),
(33, 23, NULL, 'Stamp', 1, 450.00, 250.00),
(34, 23, NULL, 'Design', 1, 200.00, 0.00),
(35, 14, 11, NULL, 4, 120.00, 50.00),
(36, 26, 43, NULL, 25, 4.00, 2.00),
(37, 27, 43, NULL, 100, 5.00, 2.00),
(38, 11, 35, NULL, 1, 127.50, 90.00),
(39, 11, 16, NULL, 11, 76.50, 45.00),
(40, 13, 7, NULL, 3, 80.00, 30.00),
(41, 13, 8, NULL, 1, 50.00, 15.00),
(42, 28, 25, NULL, 4, 15.00, 1.72),
(43, 28, 26, NULL, 16, 20.00, 4.00),
(44, 28, 31, NULL, 1, 200.00, 60.00),
(45, 28, 30, NULL, 2, 100.00, 30.00),
(46, 29, 26, NULL, 30, 20.00, 4.00),
(47, 30, 8, NULL, 4, 50.00, 15.00),
(48, 30, 7, NULL, 1, 80.00, 30.00),
(49, 31, 8, NULL, 1, 50.00, 15.00),
(50, 31, 9, NULL, 1, 30.00, 7.50),
(51, 32, 27, NULL, 20, 40.00, 10.00),
(52, 32, 29, NULL, 3, 60.00, 20.00),
(54, 34, 36, NULL, 500, 1.30, 0.80),
(55, 35, 26, NULL, 25, 14.00, 4.00),
(56, 33, 8, NULL, 10, 50.00, 15.00),
(59, 22, 16, NULL, 9, 60.00, 45.00),
(60, 22, 41, NULL, 10, 112.00, 60.00),
(61, 22, 41, NULL, 4, 100.00, 60.00),
(62, 22, 41, NULL, 4, 229.00, 60.00),
(63, 22, 38, NULL, 10, 30.00, 22.00),
(64, 22, NULL, 'Fitting', 1, 500.00, 0.00),
(65, 36, 38, NULL, 10, 35.00, 22.00),
(66, 36, NULL, 'Stamp', 1, 450.00, 250.00),
(67, 37, 4, NULL, 2, 200.00, 75.00),
(68, 38, NULL, 'Stamp', 1, 450.00, 250.00),
(69, 38, NULL, 'Logo Design', 1, 1050.00, 0.00),
(70, 39, 42, NULL, 29, 115.00, 70.00),
(71, 39, 42, NULL, 8, 115.00, 70.00),
(72, 39, 38, NULL, 15, 40.00, 22.00),
(73, 39, NULL, 'Fitting', 1, 1000.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `cost_price`, `selling_price`, `created_at`) VALUES
(3, 'High Quality Matte Poster - A3', 'CHHP-0001', 150.00, 249.00, '2026-06-07 06:33:12'),
(4, 'High Quality Matte Poster - A4', 'CHHP-0002', 75.00, 149.00, '2026-06-07 06:33:12'),
(5, 'High Quality Matte Poster - A5', 'CHHP-0003', 37.50, 99.00, '2026-06-07 06:33:12'),
(6, 'High Quality Matte Poster - MINI/A6', 'CHHP-0004', 18.75, 49.00, '2026-06-07 06:33:12'),
(7, 'High Quality Normal Poster - A3', 'CHHP-0005', 30.00, 80.00, '2026-06-07 06:33:12'),
(8, 'High Quality Normal Poster - A4', 'CHHP-0006', 15.00, 50.00, '2026-06-07 06:33:12'),
(9, 'High Quality Normal Poster - A5', 'CHHP-0007', 7.50, 30.00, '2026-06-07 06:33:12'),
(10, 'High Quality Normal Poster - MINI/A6', 'CHHP-0008', 3.75, 20.00, '2026-06-07 06:33:12'),
(11, 'Sticker Normal Poster - A3', 'CHHP-0009', 50.00, 120.00, '2026-06-07 06:33:12'),
(12, 'Sticker Normal Poster - A4', 'CHHP-0010', 25.00, 70.00, '2026-06-07 06:33:12'),
(13, 'Sticker Normal Poster - A5', 'CHHP-0011', 12.50, 50.00, '2026-06-07 06:33:12'),
(14, 'Sticker Normal Poster - MINI/A6', 'CHHP-0012', 6.25, 35.00, '2026-06-07 06:33:12'),
(15, 'Sticker Laminated Poster - A3', 'CHHP-0013', 90.00, 180.00, '2026-06-07 06:33:12'),
(16, 'Sticker Laminated Poster - A4', 'CHHP-0014', 45.00, 100.00, '2026-06-07 06:33:12'),
(17, 'Sticker Laminated Poster - A5', 'CHHP-0015', 22.50, 60.00, '2026-06-07 06:33:12'),
(18, 'Sticker Laminated Poster - MINI/A6', 'CHHP-0016', 16.25, 45.00, '2026-06-07 06:33:12'),
(19, 'Sticker High Quality Poster - A4', 'CHHP-0017', 60.00, 250.00, '2026-06-07 06:33:12'),
(20, 'Sticker High Quality Poster - A5', 'CHHP-0018', 30.00, 130.00, '2026-06-07 06:33:12'),
(21, 'Sticker High Quality Poster - MINI/A6', 'CHHP-0019', 15.00, 70.00, '2026-06-07 06:33:12'),
(22, 'Framed Poster - A3', 'CHHP-0020', 550.00, 1250.00, '2026-06-07 06:33:12'),
(23, 'Framed Poster - A4', 'CHHP-0021', 275.00, 650.00, '2026-06-07 06:33:12'),
(24, 'Framed Poster - A5', 'CHHP-0022', 210.00, 350.00, '2026-06-07 06:33:12'),
(25, 'Laminated High Quality Sticker - 35mm x 35mm', 'CHHP-0023', 1.72, 15.00, '2026-06-07 06:33:12'),
(26, 'Laminated High Quality Sticker - 50mm x 50mm', 'CHHP-0024', 4.00, 20.00, '2026-06-07 06:33:12'),
(27, 'Laminated High Quality Sticker - 90mm x 90mm', 'CHHP-0025', 10.00, 40.00, '2026-06-07 06:33:12'),
(28, 'Laminated High Quality Sticker - 50mm x 90mm', 'CHHP-0026', 6.00, 35.00, '2026-06-07 06:33:12'),
(29, 'Laminated High Quality Sticker - 90mm x 180mm', 'CHHP-0027', 20.00, 60.00, '2026-06-07 06:33:12'),
(30, 'Laminated High Quality Sticker - 130mm x 180mm', 'CHHP-0028', 30.00, 100.00, '2026-06-07 06:33:12'),
(31, 'Laminated High Quality Sticker - A4 Size', 'CHHP-0029', 60.00, 200.00, '2026-06-07 06:33:12'),
(32, 'Normal Paper Sticker - A3', 'CHHP-0030', 50.00, 100.00, '2026-06-07 06:33:12'),
(33, 'Normal Paper Sticker - A4', 'CHHP-0031', 25.00, 60.00, '2026-06-07 06:33:12'),
(34, 'Laminated Paper Sticker - A4', 'CHHP-0034', 50.00, 110.00, '2026-06-07 06:53:17'),
(35, 'Laminated Paper Sticker - A3', 'CHHP-0035', 90.00, 200.00, '2026-06-07 06:53:49'),
(36, 'Visiting Card Normal 1 Side', 'CHHP-0036', 0.80, 1.30, '2026-06-07 06:55:12'),
(37, 'Visiting Card Normal 2 Side', 'CHHP-0037', 1.00, 1.60, '2026-06-07 06:56:03'),
(38, 'Flex Normal Sq. Ft', 'CHHP-0038', 22.00, 40.00, '2026-06-07 06:57:51'),
(39, 'Bill Pad 10 books', 'CHHP-0039', 650.00, 950.00, '2026-06-07 07:00:16'),
(40, 'Bill Pad 20 book', 'CHHP-0040', 950.00, 1250.00, '2026-06-07 07:00:50'),
(41, 'Vinyl Sticker Transparent/Normal Sq. Ft', 'CHHP-0041', 60.00, 120.00, '2026-06-07 07:02:05'),
(42, 'Framed Flex Sq. Ft', 'CHHP-0042', 70.00, 100.00, '2026-06-07 07:04:25'),
(43, 'Photocopy', 'CHHP-0043', 2.00, 5.00, '2026-06-07 07:05:53'),
(44, 'Color Print Full', 'CHHP-0044', 20.00, 40.00, '2026-06-07 07:07:45'),
(45, 'Color Print Document', 'CHHP-0045', 5.00, 15.00, '2026-06-07 07:08:01'),
(46, 'Normal Inkjet Photo Print 240gsm', 'CHHP-0046', 30.00, 100.00, '2026-06-07 07:13:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Chhaap Admin', 'contact.chhaapcreatives@gmail.com', '$2y$10$5j5sQPQ2MXkllgFiTgaBPei4EN1PNGVuvvP5rohjrNjRIwXTAdq4S', '2026-06-07 06:07:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`expense_date`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_customer` (`customer_name`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `order_items_ibfk_2` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
