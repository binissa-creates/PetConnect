-- LGU demo data for PetConnect (TiDB)
-- This script creates the tables and inserts demo rows used by the LGU dashboard when the API returns empty data.
START TRANSACTION;

CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `vaccine_type` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `campaign_date` DATE NOT NULL,
  `target_barangay` VARCHAR(100) DEFAULT 'All',
  `location` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `campaigns` (`title`,`vaccine_type`,`description`,`campaign_date`,`target_barangay`,`location`)
VALUES ('Free Rabies Vaccination','Rabies','Community drive for stray dogs.','2026-05-15','All','Barangay Hall Gym');

CREATE TABLE IF NOT EXISTS `adoptions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `pet_name` VARCHAR(100) NOT NULL,
  `species` ENUM('Dog','Cat','Bird','Other') NOT NULL DEFAULT 'Dog',
  `breed` VARCHAR(100) DEFAULT NULL,
  `estimated_age` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `status` ENUM('available','adopted') NOT NULL DEFAULT 'available',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `adoptions` (`pet_name`,`species`,`breed`,`estimated_age`,`description`,`photo_url`,`status`)
VALUES ('Max','Dog','Labrador','3 years','Gentle, good with kids.','', 'available');

CREATE TABLE IF NOT EXISTS `strays` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `species` ENUM('Dog','Cat','Bird','Other') NOT NULL DEFAULT 'Dog',
  `status` ENUM('open','investigating','rescued') NOT NULL DEFAULT 'open',
  `location_description` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `reporter_name` VARCHAR(100) DEFAULT 'Anonymous',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `strays` (`species`,`status`,`location_description`,`description`,`reporter_name`)
VALUES ('Dog','open','Banilad, Cebu City','Lost brown dog, friendly.','Anonymous');

INSERT INTO `alerts` (`pet_id`,`type`,`title`,`message`,`is_read`,`created_at`)
VALUES (2,'scan','Luna Scanned!','Someone scanned Luna''s tag near Mandaue City.',0,'2026-05-04 09:15:00');

COMMIT;
