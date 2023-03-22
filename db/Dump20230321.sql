-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: databasenodejs
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `inboxs`
--

DROP TABLE IF EXISTS `inboxs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inboxs` (
  `user_id` varchar(256) DEFAULT NULL,
  `room_id` varchar(256) NOT NULL,
  `last_message` longtext,
  `seen` tinyint DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `room_id_UNIQUE` (`room_id`),
  CONSTRAINT `fk_user_id_to_userID` FOREIGN KEY (`user_id`) REFERENCES `information_of_users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inboxs`
--

LOCK TABLES `inboxs` WRITE;
/*!40000 ALTER TABLE `inboxs` DISABLE KEYS */;
INSERT INTO `inboxs` VALUES ('fcdfd704-d638-417d-a503-4560f04afd37','8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37',NULL,NULL);
/*!40000 ALTER TABLE `inboxs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `information_of_users`
--

DROP TABLE IF EXISTS `information_of_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `information_of_users` (
  `userID` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) DEFAULT NULL,
  `mobilenumber` varchar(45) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `birthday` varchar(256) DEFAULT NULL,
  `link_fb` varchar(256) DEFAULT NULL,
  `link_website` varchar(256) DEFAULT NULL,
  `link_github` varchar(256) DEFAULT NULL,
  `link_insta` varchar(256) DEFAULT NULL,
  `link_twitter` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `userID_UNIQUE` (`userID`),
  UNIQUE KEY `mobilenumber_UNIQUE` (`mobilenumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `information_of_users`
--

LOCK TABLES `information_of_users` WRITE;
/*!40000 ALTER TABLE `information_of_users` DISABLE KEYS */;
INSERT INTO `information_of_users` VALUES ('8658d9a8-6803-491c-a88a-4e796b6de857','le duc phuong','phuongtroc2004@gmail.com','$2b$10$linlW9rL.DyP2SpXY/0aq.ZXkYzLok/gtElpmL/0z3i8T5dVx9yRy','0375420576','  Nam','Khu đô thị Pháp Vân , Hoàng Liệt ,Hoàng Mai ,Hà Nội','19/12/2004','','','','',''),('fcdfd704-d638-417d-a503-4560f04afd37','nguyen minh tri','leducphuong@gmail.com','$2b$10$hNNhlSrP5j4znpvBSpotkO5a305e8jHXRoAChWdLuz99sBugF.IFu','02929392232',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `information_of_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `room_id` varchar(256) NOT NULL,
  `message` longtext,
  PRIMARY KEY (`room_id`),
  CONSTRAINT `fk_room_id_to_room_id` FOREIGN KEY (`room_id`) REFERENCES `inboxs` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES ('8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37','[[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"hello\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"hi\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"bạn ăn cơm chưa\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"rồi\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/cc6mlonuri33hw8tfkih\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/tco3t7ykjhbtwxfvpzqm\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/oancvtxc6gfkofio1b1h\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"hello\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/i3hr5lqvvcjmcmqnhda1\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/nlshtkplzs3bdjiiw4mv\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/k3hcg3hdc1awt0b4pkld\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/ghx8j7pxnhqjstee0tlb\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/bpixwf0k9tkyedz0tfq9\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/lhdjvz229tpp4cvwxm7k\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/w4bujrtkuc0m4lzjwsrd\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/rqge3sjr6ljgihghiyoq\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/hozgutgdikignodw4tec\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/skjswacpwxgcbzkvxd1e\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/figyy1dhp0o5etgnjnhz\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/icrwxbyn1kg2p3br6pzv\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/bxtmlqweqekdr6easuhj\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"hello\"],[\"8658d9a8-6803-491c-a88a-4e796b6de857\",\"fuck you\"],[\"fcdfd704-d638-417d-a503-4560f04afd37\",\"http://res.cloudinary.com/dz1k6vz7m/image/upload/v1/8658d9a8-6803-491c-a88a-4e796b6de857fcdfd704-d638-417d-a503-4560f04afd37/ny0dcndt5scakyubklbv\"]]');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-21 17:20:21
