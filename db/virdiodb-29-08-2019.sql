ALTER TABLE `sessions` CHANGE `title` `name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE `sessions` ADD `hostReminder` INT NOT NULL AFTER `channelId`, ADD `participantReminder` INT NOT NULL AFTER `hostReminder`, ADD `cutOffTime` INT NOT NULL AFTER `participantReminder`, ADD `level` INT NOT NULL AFTER `cutOffTime`, ADD `chargeForSession` BOOLEAN NOT NULL DEFAULT FALSE AFTER `level`, ADD `allowParticipantDMOthers` BOOLEAN NOT NULL DEFAULT TRUE AFTER `chargeForSession`, ADD `participantDisableDM` BOOLEAN NOT NULL DEFAULT TRUE AFTER `allowParticipantDMOthers`, ADD `minNotMetNoticeTime` INT NOT NULL AFTER `participantDisableDM`;
ALTER TABLE `interest` ADD `code` INT NOT NULL AFTER `id`;
UPDATE `interest` SET `code` = '100' WHERE `interest`.`id` = 1;
UPDATE `interest` SET `code` = '101' WHERE `interest`.`id` = 2;
UPDATE `interest` SET `code` = '102' WHERE `interest`.`id` = 3;
RENAME TABLE `virdiodb`.`products` TO `virdiodb`.`session_script`;
RENAME TABLE `virdiodb`.`product_attributes` TO `virdiodb`.`script_attributes`;
RENAME TABLE `virdiodb`.`product_session` TO `virdiodb`.`session_script_mapping`;
ALTER TABLE `session_script_mapping` CHANGE `productId` `sessionScriptId` INT(11) NOT NULL;
ALTER TABLE `script_attributes` CHANGE `productId` `sessionScriptId` INT(11) NOT NULL;

INSERT INTO `script_attributes` (`id`, `sessionScriptId`, `attrLabel`, `attrValue`, `status`) VALUES
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


INSERT INTO `session_script` (`id`, `name`, `description`, `note`, `userId`, `interestId`, `status`) VALUES
(1, 'JBC', 'test', 'test', 1, 1, 1),
(2, 'Red Wine', 'test', 'test', 1, 1, 1),
(3, 'Rest', 'test', 'test', 1, 2, 1),
(4, 'Lunges', 'demo', 'demo', 1, 2, 1),
(5, 'Pushups', NULL, NULL, 1, 2, 1);


INSERT INTO `session_script_mapping` (`id`, `sessionId`, `sessionScriptId`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5);