CREATE TABLE `stale_processed_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`unique_id` text NOT NULL,
	`source_type` text NOT NULL,
	`watch_id` integer,
	`processed_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `processed_items` ADD `watch_id` integer;