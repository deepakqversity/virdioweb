-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 06, 2019 at 12:53 PM
-- Server version: 5.7.27-0ubuntu0.18.04.1
-- PHP Version: 7.2.19-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virdiodb`
--

-- --------------------------------------------------------

--
-- Table structure for table `agora_config`
--

CREATE TABLE `agora_config` (
  `id` int(11) NOT NULL,
  `appId` varchar(255) DEFAULT NULL,
  `appCertificate` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `agora_config`
--

INSERT INTO `agora_config` (`id`, `appId`, `appCertificate`, `status`) VALUES
(1, 'aec6fd9ab0924971a5b670e522f47c87', 'c0fbd3f61c274aeb9b78c6378780361d', 1);

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` char(1) NOT NULL DEFAULT 'I',
  `description` int(11) NOT NULL,
  `individualOrBusiness` int(11) NOT NULL,
  `ss` varchar(255) NOT NULL,
  `ein` varchar(255) NOT NULL,
  `chargeForSessiones` tinyint(4) NOT NULL DEFAULT '0',
  `image` text NOT NULL,
  `userId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel_equipment`
--

CREATE TABLE `channel_equipment` (
  `id` int(11) NOT NULL,
  `channelId` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel_host`
--

CREATE TABLE `channel_host` (
  `id` int(11) NOT NULL,
  `hostId` int(11) NOT NULL,
  `channelId` int(11) NOT NULL,
  `channelAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `createSession` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel_interest`
--

CREATE TABLE `channel_interest` (
  `id` int(11) NOT NULL,
  `channelId` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `video` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel_shopping_list_items`
--

CREATE TABLE `channel_shopping_list_items` (
  `id` int(11) NOT NULL,
  `channelId` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `interest`
--

CREATE TABLE `interest` (
  `id` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL,
  `image` text,
  `video` text,
  `haveProductList` tinyint(1) NOT NULL DEFAULT '0',
  `haveShoppingList` tinyint(1) DEFAULT '0',
  `haveEquipment` tinyint(1) NOT NULL DEFAULT '0',
  `attendeesAreCalled` varchar(255) NOT NULL,
  `virtualRoomIsCalled` varchar(255) NOT NULL,
  `inProduction` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `interest`
--

INSERT INTO `interest` (`id`, `code`, `title`, `description`, `status`, `image`, `video`, `haveProductList`, `haveShoppingList`, `haveEquipment`, `attendeesAreCalled`, `virtualRoomIsCalled`, `inProduction`) VALUES
(1, 100, 'Wine', '', 1, NULL, NULL, 0, 0, 0, '', '', 0),
(2, 101, 'Fitness', '', 1, NULL, NULL, 0, 0, 0, '', '', 0),
(3, 102, 'Cooking', '', 1, NULL, NULL, 0, 0, 0, '', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Interest_equipment`
--

CREATE TABLE `Interest_equipment` (
  `id` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `interest_group`
--

CREATE TABLE `interest_group` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Interest_shopping_list_items`
--

CREATE TABLE `Interest_shopping_list_items` (
  `id` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `nameitem` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `channel` tinyint(2) NOT NULL COMMENT '0=email, 1=phone',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0=pending. 1=verified, 2=expired, 3=failed',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`id`, `userId`, `code`, `channel`, `status`, `createAt`) VALUES
(1, 24, '8693', 1, 0, '2019-09-02 12:25:36'),
(2, 31, '3522', 1, 1, '2019-09-03 05:30:20'),
(5, 38, 'c2FpFb', 0, 1, '2019-09-03 12:35:04'),
(6, 38, '7392', 1, 1, '2019-09-03 12:35:04'),
(7, 39, '4ddDsM', 0, 0, '2019-09-03 13:53:42'),
(8, 39, '6141', 1, 0, '2019-09-03 13:53:42'),
(9, 40, 'Om0pd4', 0, 0, '2019-09-03 13:59:18'),
(10, 40, '1824', 1, 0, '2019-09-03 13:59:18');

-- --------------------------------------------------------

--
-- Table structure for table `script_attributes`
--

CREATE TABLE `script_attributes` (
  `id` int(11) NOT NULL,
  `sessionScriptId` int(11) NOT NULL,
  `attrLabel` varchar(255) NOT NULL,
  `attrValue` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `script_attributes`
--

INSERT INTO `script_attributes` (`id`, `sessionScriptId`, `attrLabel`, `attrValue`, `type`, `status`) VALUES
(1, 1, 'Varietal', '100% Pinot Noir', 'String', 1),
(2, 1, 'Year', '2014​', '', 1),
(3, 1, 'Country', 'United States', '', 1),
(4, 1, 'Appellation', 'Sonoma', '', 1),
(5, 2, 'Varietal', '80% Pinot Noir', '', 1),
(6, 2, 'Year', '2013', '', 1),
(7, 3, 'TARGET ZONE', '80%', '', 1),
(8, 3, 'TARGET BPM', '150', '', 1),
(9, 4, 'TARGET ZONE', '90%', '', 1),
(10, 4, 'TARGET BPM', '150', '', 1),
(11, 5, 'TARGET ZONE', '80%', '', 1),
(12, 5, 'TARGET BPM', '150', '', 1),
(13, 6, 'TARGET ZONE', '70%', '', 1),
(14, 6, 'TARGET BPM', '160', '', 1),
(15, 7, 'TARGET ZONE', '90%', '', 1),
(16, 7, 'TARGET BPM', '140', '', 1),
(17, 3, 'counter', '45', '', 1),
(18, 4, 'counter', '30', '', 1),
(19, 5, 'counter', '25', '', 1),
(20, 6, 'counter', '40', '', 1),
(21, 7, 'counter', '50', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hostId` int(11) NOT NULL,
  `scheduleDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `createdAt` int(11) NOT NULL,
  `description` text,
  `status` tinyint(1) NOT NULL,
  `configId` int(11) DEFAULT NULL,
  `channelId` int(11) NOT NULL,
  `hostReminder` int(11) NOT NULL,
  `participantReminder` int(11) NOT NULL,
  `cutOffTime` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `chargeForSession` tinyint(1) NOT NULL DEFAULT '0',
  `allowParticipantDMOthers` tinyint(1) NOT NULL DEFAULT '1',
  `participantDisableDM` tinyint(1) NOT NULL DEFAULT '1',
  `minNotMetNoticeTime` int(11) NOT NULL,
  `image` text NOT NULL,
  `video` text NOT NULL,
  `minAttendee` int(11) NOT NULL,
  `maxAttendee` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `interestId`, `name`, `hostId`, `scheduleDate`, `duration`, `createdAt`, `description`, `status`, `configId`, `channelId`, `hostReminder`, `participantReminder`, `cutOffTime`, `level`, `chargeForSession`, `allowParticipantDMOthers`, `participantDisableDM`, `minNotMetNoticeTime`, `image`, `video`, `minAttendee`, `maxAttendee`) VALUES
(1, 1, 'Winery Testing Session', 11, '2019-09-05 15:07:47', 45, 0, 'this is demo of wine test', 1, 1, 1001, 0, 0, 0, 0, 0, 1, 1, 0, '', '', 0, 0),
(2, 2, 'Your Health Matters Coaching', 1, '2019-09-07 05:12:28', 30, 0, '', 1, 1, 1001, 0, 0, 0, 0, 0, 1, 1, 0, '', '', 0, 0),
(7, 1, 'Winery Testing Session2', 1, '2019-09-11 14:22:46', 60, 0, NULL, 1, 1, 503, 0, 0, 0, 0, 0, 1, 1, 0, '', '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `session_script`
--

CREATE TABLE `session_script` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `userId` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session_script`
--

INSERT INTO `session_script` (`id`, `name`, `description`, `userId`, `interestId`, `status`) VALUES
(1, 'JBC', 'test', 11, 1, 1),
(2, 'Red Wine', 'test', 11, 1, 1),
(3, 'Rest', 'test', 1, 2, 1),
(4, 'Lunges', 'demo', 1, 2, 1),
(5, 'Pushups', NULL, 1, 2, 1),
(6, 'Chest', NULL, 1, 2, 1),
(7, 'Chinup', NULL, 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `session_script_mapping`
--

CREATE TABLE `session_script_mapping` (
  `id` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `sessionScriptId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session_script_mapping`
--

INSERT INTO `session_script_mapping` (`id`, `sessionId`, `sessionScriptId`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `session_users`
--

CREATE TABLE `session_users` (
  `id` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `sessionType` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session_users`
--

INSERT INTO `session_users` (`id`, `sessionId`, `userId`, `type`, `sessionType`, `status`) VALUES
(1, 1, 1, 2, 0, 1),
(2, 1, 2, 2, 0, 1),
(3, 1, 3, 2, NULL, 1),
(4, 1, 4, 2, NULL, 1),
(5, 1, 5, 2, NULL, 1),
(6, 1, 6, 2, NULL, 1),
(7, 1, 7, 2, NULL, 1),
(8, 1, 8, 2, NULL, 1),
(9, 1, 9, 2, NULL, 1),
(10, 1, 10, 2, NULL, 1),
(11, 1, 11, 1, NULL, 1),
(12, 1, 12, 2, NULL, 1),
(13, 1, 13, 2, NULL, 1),
(14, 2, 1, 1, NULL, 1),
(15, 2, 2, 2, NULL, 1),
(16, 2, 3, 2, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`id`, `userId`, `token`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY3NzQ5NDQ0LCJleHAiOjE1OTkzMDYzNzB9.778KKIGVQYuttrjdx0Kk78HVZKszqVR0C1Op5FvXY-0'),
(6, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY3NzUyNzY4LCJleHAiOjE1OTkzMDk2OTR9.Der4RW85pElzEMp1VYr14kIlYwGZ9p9fDoQoUW8VIlM'),
(24, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTU2NjU3MjI4MywiZXhwIjoxNTk4MTI5MjA5fQ.UUbh8nLGYHCvNIeaGgIVPAFeG4IOEmJ5SwY-wtzUUfk'),
(26, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTY3NDkxOTA2LCJleHAiOjE1OTkwNDg4MzJ9.fGKoiL9G5bctRBZzCKOlxpP4xrs1zrJVs2blZT8VFq4'),
(30, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTY3NzQ5NjkyLCJleHAiOjE1OTkzMDY2MTh9.jo5PyE9u-6xKaBm6g3jVXS7LTxpr9UcuGOtTkUQFlQA');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `image` text,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `firstName`, `lastName`, `email`, `password`, `status`, `type`, `address1`, `address2`, `city`, `state`, `zip`, `phone`, `image`, `createAt`) VALUES
(1, 'deepak', 'deepak', NULL, 'deepak@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(2, 'amit', 'amit', NULL, 'amit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(3, 'Lalit', 'Lalit', NULL, 'lalit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(4, 'Atul', 'Atul', NULL, 'atul@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(5, 'Rohit', 'Rohit', NULL, 'rohit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(6, 'Virendra', 'Virendra', NULL, 'virendra@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(7, 'Dolly', 'Dolly', NULL, 'dolly@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(8, 'Abhishek', 'Abhishek', NULL, 'abhishek@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(9, 'Ram', 'Ram', NULL, 'ram@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(10, 'Soni', 'Soni', NULL, 'soni@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(11, 'Arjun', 'Arjun', NULL, 'arjun@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(12, 'Deepa', 'Deepa', NULL, 'deepa@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(13, 'John', 'John', NULL, 'john@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-09-02 08:23:17'),
(24, NULL, 'Jagat', 'prakash', 'jagat@test.com', '$2b$10$7ToOC7CdwLApxmODGAhN3.NujMucQQ6wAQzNOu9301QmXVRza99Qi', 0, 0, NULL, NULL, NULL, NULL, NULL, '9696969696', NULL, '2019-09-02 12:25:36'),
(31, NULL, 'Radhe', 'prakash', 'radhe@test.com', '$2b$10$RdkDhla5HPjlJQUySp542eaVRy7ggLuFs3Hcpgd85nxT9/oEdWWeG', 0, 0, NULL, NULL, NULL, NULL, NULL, '9696969600', NULL, '2019-09-03 05:30:20'),
(38, NULL, 'Radhe', 'prakash', 'radhe2@test.com', '$2b$10$dylA91QwNae7/AApd7QdYe2gZmfmhXqA5CqWeePsvSBFy3MSciEmu', 0, 0, NULL, NULL, NULL, NULL, NULL, '9696969111', NULL, '2019-09-03 12:35:04'),
(39, NULL, 'Radhe', 'prakash', 'radhe1@test.com', '$2b$10$5A7eCUDTnGM6zJEWPW2dkexp0ptgKYt2efs0XRimX/vOD6M797Dhq', 0, 0, NULL, NULL, NULL, NULL, NULL, '9696969101', NULL, '2019-09-03 13:53:42'),
(40, NULL, 'Amar', 'prakash', 'amar@test.com', '$2b$10$9wBpQ9Jsk.xD4NSWhsn7UukvWHE8fnKYdYD9IY6vU4mn2bUarOBAK', 0, 0, NULL, NULL, NULL, NULL, NULL, '9696969101', NULL, '2019-09-03 13:59:18');

-- --------------------------------------------------------

--
-- Table structure for table `user_bank_accounts`
--

CREATE TABLE `user_bank_accounts` (
  `id` int(11) NOT NULL,
  `channelId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `routingNo` varchar(50) NOT NULL,
  `accountNo` varchar(50) NOT NULL,
  `accountType` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agora_config`
--
ALTER TABLE `agora_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel_equipment`
--
ALTER TABLE `channel_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel_host`
--
ALTER TABLE `channel_host`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel_interest`
--
ALTER TABLE `channel_interest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel_shopping_list_items`
--
ALTER TABLE `channel_shopping_list_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interest`
--
ALTER TABLE `interest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Interest_equipment`
--
ALTER TABLE `Interest_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interest_group`
--
ALTER TABLE `interest_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Interest_shopping_list_items`
--
ALTER TABLE `Interest_shopping_list_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `script_attributes`
--
ALTER TABLE `script_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_script`
--
ALTER TABLE `session_script`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_script_mapping`
--
ALTER TABLE `session_script_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_users`
--
ALTER TABLE `session_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId_UNIQUE` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Indexes for table `user_bank_accounts`
--
ALTER TABLE `user_bank_accounts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agora_config`
--
ALTER TABLE `agora_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `channel_equipment`
--
ALTER TABLE `channel_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `channel_host`
--
ALTER TABLE `channel_host`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `channel_interest`
--
ALTER TABLE `channel_interest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `channel_shopping_list_items`
--
ALTER TABLE `channel_shopping_list_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `interest`
--
ALTER TABLE `interest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `Interest_equipment`
--
ALTER TABLE `Interest_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `interest_group`
--
ALTER TABLE `interest_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Interest_shopping_list_items`
--
ALTER TABLE `Interest_shopping_list_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `script_attributes`
--
ALTER TABLE `script_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `session_script`
--
ALTER TABLE `session_script`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `session_script_mapping`
--
ALTER TABLE `session_script_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `session_users`
--
ALTER TABLE `session_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `user_bank_accounts`
--
ALTER TABLE `user_bank_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
