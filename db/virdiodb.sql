-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 26, 2019 at 11:19 AM
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
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `channel` varchar(45) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `name` varchar(255) DEFAULT NULL,
  `configId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `userId`, `channel`, `status`, `name`, `configId`) VALUES
(1, 1, '1022', 1, 'Wine Session', 1),
(2, 1, '1021', 1, 'Fitness Session', 1);

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
(14, 2, 1, 1, NULL, NULL, 1),
(15, 2, 2, 2, NULL, NULL, 1),
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
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2Nzk1MzU1LCJleHAiOjE1OTgzNTIyODF9.scFwxXpXdhJ9BS6JZEGTQQvd5J7HnwUZvEiuEACVuH4'),
(6, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY2NTQ2MTUyLCJleHAiOjE1OTgxMDMwNzh9.plbTqpFvEw3W0601Md2IyhgigICXGVxjSKz2QTFwPMY'),
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
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`,`configId`);

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
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `session_users`
--
ALTER TABLE `session_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
