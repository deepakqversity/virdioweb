-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 28, 2019 at 04:15 PM
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
-- Table structure for table `interest`
--

CREATE TABLE `interest` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `interest`
--

INSERT INTO `interest` (`id`, `title`, `description`, `status`) VALUES
(1, 'Wine', '', 1),
(2, 'Fitness', '', 1),
(3, 'Cooking', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `note` text,
  `userId` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `note`, `userId`, `interestId`, `status`) VALUES
(1, 'JBC', 'test', 'test', 1, 1, 1),
(2, 'Red Wine', 'test', 'test', 1, 1, 1),
(3, 'Rest', 'test', 'test', 1, 2, 1),
(4, 'Lunges', 'demo', 'demo', 1, 2, 1),
(5, 'Pushups', NULL, NULL, 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `attrLabel` varchar(255) NOT NULL,
  `attrValue` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `productId`, `attrLabel`, `attrValue`, `status`) VALUES
(1, 1, 'Varietal', '100% Pinot Noir', 1),
(2, 1, 'Year', '2014​', 1),
(3, 1, 'Country', 'United States', 1),
(4, 1, 'Appellation', 'Sonoma', 1),
(5, 2, 'Varietal', '80% Pinot Noir', 1),
(6, 2, 'Year', '2013', 1),
(7, 3, 'TARGET ZONE', '80%', 1),
(8, 3, 'TARGET BPM', '150', 1),
(9, 4, 'TARGET ZONE', '90%', 1),
(10, 4, 'TARGET BPM', '150', 1),
(11, 5, 'TARGET ZONE', '80%', 1),
(12, 5, 'TARGET BPM', '150', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_session`
--

CREATE TABLE `product_session` (
  `id` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_session`
--

INSERT INTO `product_session` (`id`, `sessionId`, `productId`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `interestId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `hostId` int(11) NOT NULL,
  `scheduleDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `duration` int(11) NOT NULL,
  `createdAt` int(11) NOT NULL,
  `description` text,
  `status` tinyint(1) NOT NULL,
  `configId` int(11) DEFAULT NULL,
  `channelId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `interestId`, `title`, `hostId`, `scheduleDate`, `duration`, `createdAt`, `description`, `status`, `configId`, `channelId`) VALUES
(1, 1, 'Winery Testing Session', 1, '2019-08-29 15:17:08', 0, 0, 'this is demo of wine test', 1, 1, 501),
(2, 2, 'Fitness Session', 99, '2019-08-27 11:17:18', 0, 0, '', 1, 1, 502),
(7, 1, 'Winery Testing Session2', 1, '2019-08-27 11:17:25', 0, 0, NULL, 1, 1, 503);

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
  `streamId` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session_users`
--

INSERT INTO `session_users` (`id`, `sessionId`, `userId`, `type`, `sessionType`, `streamId`, `status`) VALUES
(1, 1, 1, 1, 0, 1, 1),
(2, 1, 2, 2, 0, 2, 1),
(3, 1, 3, 2, NULL, NULL, 1),
(4, 1, 4, 2, NULL, NULL, 1),
(5, 1, 5, 2, NULL, NULL, 1),
(6, 1, 6, 2, NULL, NULL, 1),
(7, 1, 7, 2, NULL, 7, 1),
(8, 1, 8, 2, NULL, NULL, 1),
(9, 1, 9, 2, NULL, NULL, 1),
(10, 1, 10, 2, NULL, NULL, 1),
(11, 1, 11, 2, NULL, NULL, 1),
(12, 1, 12, 2, NULL, 12, 1),
(13, 1, 13, 2, NULL, NULL, 1),
(14, 1, 1, 1, NULL, 1, 1),
(15, 2, 2, 2, NULL, 2, 1),
(16, 2, 3, 2, NULL, NULL, 1);

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
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2OTg4NzI5LCJleHAiOjE1OTg1NDU2NTV9.JfJ4WeToiOIg_5zdzJ5zChZRtnqSObRUebEsfJuZw8o'),
(6, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY2OTg5MDE5LCJleHAiOjE1OTg1NDU5NDV9.lopuLw7OjETMTzN5EvT8TexgwnnMJmB_ExIuCQAw720'),
(24, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTU2NjU3MjI4MywiZXhwIjoxNTk4MTI5MjA5fQ.UUbh8nLGYHCvNIeaGgIVPAFeG4IOEmJ5SwY-wtzUUfk'),
(26, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTY2Nzk3MDg0LCJleHAiOjE1OTgzNTQwMTB9._LVj15c5HR-GLMHbDcAh3664T36KH-QeGzkNvjFMeKY');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`) VALUES
(1, 'deepak', 'deepak@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(2, 'amit', 'amit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(3, 'Lalit', 'lalit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(4, 'Atul', 'atul@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(5, 'Rohit', 'rohit@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(6, 'Virendra', 'virendra@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(7, 'Dolly', 'dolly@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(8, 'Abhishek', 'abhishek@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(9, 'Ram', 'ram@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(10, 'Soni', 'soni@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(11, 'Arjun', 'arjun@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(12, 'Deepa', 'deepa@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1),
(13, 'John', 'john@test.com', '$2b$10$br0jNANIe2DcIKgjYunhr.6doQOURwoH8G4IdyENum7vSWrcyOv7K', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agora_config`
--
ALTER TABLE `agora_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interest`
--
ALTER TABLE `interest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_session`
--
ALTER TABLE `product_session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_users`
--
ALTER TABLE `session_users`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agora_config`
--
ALTER TABLE `agora_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `interest`
--
ALTER TABLE `interest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `product_session`
--
ALTER TABLE `product_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `session_users`
--
ALTER TABLE `session_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
