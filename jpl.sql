-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2025 at 12:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jpl`
--

-- --------------------------------------------------------

--
-- Table structure for table `auction_history`
--

CREATE TABLE `auction_history` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `status` enum('sold','unsold') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auction_queue`
--

CREATE TABLE `auction_queue` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `processed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `bid_amount` decimal(10,2) DEFAULT NULL,
  `bid_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `current_auction`
--

CREATE TABLE `current_auction` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL,
  `auction_duration` int(11) DEFAULT 600
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `current_auction`
--

INSERT INTO `current_auction` (`id`, `player_id`, `start_time`, `expires_at`, `auction_duration`) VALUES
(20, 7, '2025-10-10 17:34:40', '2025-10-10 17:44:40', 600);

-- --------------------------------------------------------

--
-- Table structure for table `player name`
--

CREATE TABLE `player name` (
  `Player Name` varchar(50) NOT NULL,
  `Age` int(10) NOT NULL,
  `Cetegory` varchar(50) NOT NULL,
  `Base Price` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `jersey` varchar(2) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `mobile_No` varchar(10) DEFAULT NULL,
  `email_Id` varchar(30) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `total_runs` int(11) DEFAULT NULL,
  `highest_runs` int(11) DEFAULT NULL,
  `wickets_taken` int(11) DEFAULT NULL,
  `times_out` int(11) DEFAULT NULL,
  `teams_played` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `name`, `nickname`, `age`, `category`, `jersey`, `type`, `mobile_No`, `email_Id`, `base_price`, `total_runs`, `highest_runs`, `wickets_taken`, `times_out`, `teams_played`, `image_path`) VALUES
(1, 'Prathamesh Bhadwalkar', 'PB', 19, 'Batsman', '10', 'Right Handed', NULL, NULL, 5000.00, 1200, 90, 5, 20, 'JPL Warriors', '/assets/images/prathmesh.jpg'),
(2, 'Amit Sharma', 'Ami', 22, 'Bowler', '23', 'Left Arm Spinner', NULL, NULL, 4000.00, 500, 45, 40, 15, 'JPL Titans', 'uploads/players/sharma.png'),
(3, 'Rahul Verma', 'RV', 21, 'All-Rounder', '25', 'Right Handed', NULL, NULL, 7000.00, 1500, 100, 20, 25, 'JPL Challengers', 'uploads/players/Player2.png'),
(4, 'Suresh Iyer', 'SI', 23, 'Batsman', '8', 'Right Handed', NULL, NULL, 6000.00, 1800, 110, 2, 30, 'JPL Strikers', 'uploads/players/Player3.png'),
(5, 'Karan Patel', 'KP', 20, 'Bowler', NULL, 'Right Arm Fast', NULL, NULL, 3500.00, 300, 30, 50, 10, 'JPL Titans', '/assets/images/player5.png'),
(6, 'Neha Kulkarni', 'NK', 18, 'Batsman', NULL, 'Left Handed', NULL, NULL, 3000.00, 800, 60, 0, 18, 'JPL Challengers', '/assets/images/player6.png'),
(7, 'Vikas Yadav', 'Vicky', 25, 'All-Rounder', NULL, 'Right Handed', NULL, NULL, 8000.00, 2200, 130, 30, 28, 'JPL Warriors', '/assets/images/player7.png'),
(8, 'Deepak Joshi', 'DJ', 24, 'Bowler', NULL, 'Left Arm Fast', NULL, NULL, 4500.00, 400, 40, 45, 12, 'JPL Strikers', '/assets/images/player8.png'),
(9, 'Anjali Mehta', 'Anju', 19, 'Batsman', NULL, 'Right Handed', NULL, NULL, 5500.00, 1000, 70, 3, 20, 'JPL Warriors', '/assets/images/player9.png'),
(10, 'Sanjay Rao', 'SR', 26, 'All-Rounder', NULL, 'Left Handed', NULL, NULL, 9000.00, 2500, 150, 35, 32, 'JPL Titans', '/assets/images/player10.png'),
(11, 'Suresh Raina', 'SR', 45, 'Batsman', NULL, 'Right Hand Batsman', NULL, NULL, 5000.00, 1000, 250, 0, 20, 'JPL Titans', '../players/player1.png'),
(13, 'Raj', 'Dogy', 0, 'C', '31', 'Right Hand Spinner', '9326870218', 'rajgujar4@gmail.com', NULL, 50, 25, 10, 20, '', 'uploads/players/bf8b620f4d904edc8dd44b39538755ce.jpg'),
(14, 'Prathamesh Bhadwalkar', 'PB', 19, 'Batsman', NULL, 'Right Handed', NULL, NULL, 5000.00, 1200, 90, 5, 20, 'JPL Warriors', 'uploads/players/player1.png'),
(15, 'Amit Sharma', 'Ami', 22, 'Bowler', NULL, 'Left Arm Spinner', NULL, NULL, 4000.00, 500, 45, 40, 15, 'JPL Titans', 'uploads/players/player2.png'),
(16, 'Rahul Verma', 'RV', 21, 'All-Rounder', NULL, 'Right Handed', NULL, NULL, 7000.00, 1500, 100, 20, 25, 'JPL Challengers', 'uploads/players/player3.png'),
(17, 'Suresh Iyer', 'SI', 23, 'Batsman', NULL, 'Right Handed', NULL, NULL, 6000.00, 1800, 110, 2, 30, 'JPL Strikers', 'uploads/players/player4.png'),
(18, 'Karan Patel', 'KP', 20, 'Bowler', NULL, 'Right Arm Fast', NULL, NULL, 3500.00, 300, 30, 50, 10, 'JPL Titans', 'uploads/players/player5.png'),
(19, 'Neha Kulkarni', 'NK', 18, 'Batsman', NULL, 'Left Handed', NULL, NULL, 3000.00, 800, 60, 0, 18, 'JPL Challengers', 'uploads/players/player6.png'),
(20, 'Vikas Yadav', 'Vicky', 25, 'All-Rounder', NULL, 'Right Handed', NULL, NULL, 8000.00, 2200, 130, 30, 28, 'JPL Warriors', 'uploads/players/player7.png'),
(21, 'Deepak Joshi', 'DJ', 24, 'Bowler', NULL, 'Left Arm Fast', NULL, NULL, 4500.00, 400, 40, 45, 12, 'JPL Strikers', 'uploads/players/player8.png'),
(22, 'Anjali Mehta', 'Anju', 19, 'Batsman', NULL, 'Right Handed', NULL, NULL, 5500.00, 1000, 70, 3, 20, 'JPL Warriors', 'uploads/players/player9.png'),
(23, 'Sanjay Rao', 'SR', 26, 'All-Rounder', NULL, 'Left Handed', NULL, NULL, 9000.00, 2500, 150, 35, 32, 'JPL Titans', 'uploads/players/player10.png');

-- --------------------------------------------------------

--
-- Table structure for table `sold_players`
--

CREATE TABLE `sold_players` (
  `id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `sold_price` decimal(10,2) NOT NULL,
  `sold_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `captain` varchar(20) DEFAULT NULL,
  `mobile_No` varchar(10) DEFAULT NULL,
  `email_Id` varchar(30) DEFAULT NULL,
  `Season_Budget` mediumtext DEFAULT NULL,
  `image_path` varchar(50) DEFAULT NULL,
  `Total_Budget` longtext DEFAULT NULL,
  `Team_Rank` varchar(100) DEFAULT NULL,
  `Players_Bought` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `captain`, `mobile_No`, `email_Id`, `Season_Budget`, `image_path`, `Total_Budget`, `Team_Rank`, `Players_Bought`) VALUES
(1, 'JPL Warriors', NULL, NULL, NULL, '25000.00', 'uploads/teams/Team1.png', NULL, NULL, NULL),
(2, 'JPL Titans', NULL, NULL, NULL, '30000.00', 'uploads/teams/Team2.png', NULL, NULL, NULL),
(3, 'JPL Challengers', NULL, NULL, NULL, '20000.00', 'uploads/teams/Team3.png', NULL, NULL, NULL),
(4, 'JPL Strikers', NULL, NULL, NULL, '15000.00', 'uploads/teams/Team4.png', NULL, NULL, NULL),
(5, 'JPL WARRIORS 2', 'Prathamesh', '7893765643', 'jplwarriors2@gmail.com', '', 'uploads/teams/15ca3586f4684918ae71b9f6e2b17aec.png', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','team') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Prathamesh Admin', 'admin@example.com', '$2b$12$g9.DVl69SZKO5n9pBvBEIOHn7SX74x3ZbAjGkPZxxZeuaLMMwpzRK', 'admin', '2025-08-24 08:21:50'),
(2, NULL, 'admin1@example.com', '$2b$12$0/0WPQ0KbcaI2TnX8PTUh.F2C2/ovIJu.MgK/R1L4GaIAaUciydeu', 'team', '2025-09-02 16:11:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auction_history`
--
ALTER TABLE `auction_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `auction_queue`
--
ALTER TABLE `auction_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `current_auction`
--
ALTER TABLE `current_auction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sold_players`
--
ALTER TABLE `sold_players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `auction_history`
--
ALTER TABLE `auction_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auction_queue`
--
ALTER TABLE `auction_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `current_auction`
--
ALTER TABLE `current_auction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `sold_players`
--
ALTER TABLE `sold_players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auction_history`
--
ALTER TABLE `auction_history`
  ADD CONSTRAINT `auction_history_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `auction_queue`
--
ALTER TABLE `auction_queue`
  ADD CONSTRAINT `auction_queue_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  ADD CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`);

--
-- Constraints for table `current_auction`
--
ALTER TABLE `current_auction`
  ADD CONSTRAINT `current_auction_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`);

--
-- Constraints for table `sold_players`
--
ALTER TABLE `sold_players`
  ADD CONSTRAINT `sold_players_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sold_players_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
