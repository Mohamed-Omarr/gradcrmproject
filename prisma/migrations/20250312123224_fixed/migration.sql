-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `admin_email_key` TO `Admin_email_key`;

-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `admin_id_key` TO `Admin_id_key`;

-- RenameIndex
ALTER TABLE `login` RENAME INDEX `login_email_key` TO `Login_email_key`;

-- RenameIndex
ALTER TABLE `register` RENAME INDEX `register_email_key` TO `Register_email_key`;
