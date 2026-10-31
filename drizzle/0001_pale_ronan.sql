CREATE TABLE `vendor_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`applicant_user_id` text NOT NULL,
	`applicant_name` text NOT NULL,
	`applicant_email` text NOT NULL,
	`business_name` text NOT NULL,
	`category` text NOT NULL,
	`location` text NOT NULL,
	`website` text,
	`description` text NOT NULL,
	`review_status` text DEFAULT 'pending_review' NOT NULL,
	`notification_email` text DEFAULT 'thetwoplanner@gmail.com' NOT NULL,
	`email_status` text DEFAULT 'queued' NOT NULL,
	`email_provider_id` text,
	`email_error` text,
	`emailed_at` text,
	`submitted_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`applicant_user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "vendor_application_review_status_check" CHECK("vendor_applications"."review_status" in ('pending_review','approved','rejected','needs_more_info')),
	CONSTRAINT "vendor_application_email_status_check" CHECK("vendor_applications"."email_status" in ('queued','sending','sent','failed'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_applications_vendor_id_unique` ON `vendor_applications` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `vendor_applications_status_idx` ON `vendor_applications` (`review_status`,`submitted_at`);--> statement-breakpoint
CREATE INDEX `vendor_applications_email_status_idx` ON `vendor_applications` (`email_status`);