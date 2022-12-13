CREATE TABLE `mobility_core`.`booking_comments` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `uuid_comment` VARCHAR(245) NULL,
  `comment` VARCHAR(245) NOT NULL,
  `attachment_url` VARCHAR(245) NULL,
  `created_by` BIGINT(20) NULL,
  `commented_by` VARCHAR(45) NULL,
  `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` BIGINT(20) NULL DEFAULT 0,
  `booking_id` BIGINT(20) NULL DEFAULT 0,
  PRIMARY KEY (`id`));
