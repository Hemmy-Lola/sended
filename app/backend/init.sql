CREATE DATABASE IF NOT EXISTS bd_node;
USE bd_node;

CREATE TABLE IF NOT EXISTS `users` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `mail` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `total_storage_used` BIGINT DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `fichiers` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `id_user` INT NOT NULL,
  `fichier_name` VARCHAR(100) NOT NULL,
  `fichier_size` BIGINT NOT NULL, 
  `date_add` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_supp` DATETIME DEFAULT NULL,
  `link_fichier` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`id_user`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `shared_links` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `fichier_id` INT NOT NULL,
  `shared_link` VARCHAR(255) NOT NULL,
  `expiration_date` DATETIME NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`fichier_id`) REFERENCES `fichiers` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`firstname`, `lastname`, `mail`, `password`, `total_storage_used`) VALUES
('Sira', 'KALLOGA', 'sira@sended.com', 'password123', 0),
('Meryem', 'EL FELLOUSSI', 'meryem@sended.com', 'securepass', 0),
('Hemmy-Lola', 'MATHYS', 'hemmylola@sended.com', 'mypassword', 0),
('Jean-François', 'DI RIENZO', 'jeanfrancois@user.com', 'anotherpassword', 0);