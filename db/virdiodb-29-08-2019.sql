ALTER TABLE `sessions` CHANGE `title` `name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE `sessions` ADD `hostReminder` INT NOT NULL AFTER `channelId`, ADD `participantReminder` INT NOT NULL AFTER `hostReminder`, ADD `cutOffTime` INT NOT NULL AFTER `participantReminder`, ADD `level` INT NOT NULL AFTER `cutOffTime`, ADD `chargeForSession` BOOLEAN NOT NULL DEFAULT FALSE AFTER `level`, ADD `allowParticipantDMOthers` BOOLEAN NOT NULL DEFAULT TRUE AFTER `chargeForSession`, ADD `participantDisableDM` BOOLEAN NOT NULL DEFAULT TRUE AFTER `allowParticipantDMOthers`, ADD `minNotMetNoticeTime` INT NOT NULL AFTER `participantDisableDM`;
ALTER TABLE `interest` ADD `code` INT NOT NULL AFTER `id`;
UPDATE `interest` SET `code` = '100' WHERE `interest`.`id` = 1;
UPDATE `interest` SET `code` = '101' WHERE `interest`.`id` = 2;
UPDATE `interest` SET `code` = '102' WHERE `interest`.`id` = 3;
RENAME TABLE `virdiodb`.`products` TO `virdiodb`.`session_script`;
RENAME TABLE `virdiodb`.`product_attributes` TO `virdiodb`.`script_attributes`;
RENAME TABLE `virdiodb`.`product_session` TO `virdiodb`.`session_script_mapping`;
