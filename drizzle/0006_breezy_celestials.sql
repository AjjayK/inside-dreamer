DROP INDEX `processed_items_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `processed_items_unique` ON `processed_items` (`owner`,`unique_id`,`watch_id`);