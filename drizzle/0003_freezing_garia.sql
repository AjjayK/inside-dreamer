ALTER TABLE `alerts` ADD `confidence` text;--> statement-breakpoint
ALTER TABLE `watches` ADD `target_price` text;--> statement-breakpoint
ALTER TABLE `watches` ADD `flight_number` text;--> statement-breakpoint
ALTER TABLE `watches` ADD `slack_channels` text;--> statement-breakpoint
ALTER TABLE `watches` ADD `contact_emails` text;--> statement-breakpoint
ALTER TABLE `watches` ADD `snooze_until` integer;