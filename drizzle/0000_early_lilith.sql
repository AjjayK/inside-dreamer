CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`watch_id` integer NOT NULL,
	`source_type` text NOT NULL,
	`title` text NOT NULL,
	`snippet` text NOT NULL,
	`explanation` text NOT NULL,
	`source_url` text,
	`source_name` text,
	`dismissed` integer DEFAULT false NOT NULL,
	`dismiss_feedback` text,
	`read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_hashes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`watch_id` integer NOT NULL,
	`url` text NOT NULL,
	`content_hash` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_hashes_unique` ON `content_hashes` (`owner`,`watch_id`,`url`);--> statement-breakpoint
CREATE TABLE `dismissal_patterns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`watch_id` integer NOT NULL,
	`pattern` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `processed_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`unique_id` text NOT NULL,
	`source_type` text NOT NULL,
	`processed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `processed_items_unique` ON `processed_items` (`owner`,`unique_id`);--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`location` text,
	`interests` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`description` text NOT NULL,
	`parsed_topics` text NOT NULL,
	`source_types` text NOT NULL,
	`urgency` text DEFAULT 'digest' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`web_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
