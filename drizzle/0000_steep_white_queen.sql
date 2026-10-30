CREATE TABLE `ai_action_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`wedding_project_id` text NOT NULL,
	`action_type` text NOT NULL,
	`proposed_payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`executed_at` text,
	`execution_result` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ai_action_status_check" CHECK("ai_action_proposals"."status" in ('pending','approved','rejected','executed','failed','expired'))
);
--> statement-breakpoint
CREATE TABLE `ai_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`conversation_status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ai_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sequence_number` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`structured_content` text,
	`tool_call_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ai_message_role_check" CHECK("ai_messages"."role" in ('system','user','assistant','tool'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_messages_conversation_seq_uq` ON `ai_messages` (`conversation_id`,`sequence_number`);--> statement-breakpoint
CREATE TABLE `ai_wedding_facts` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`field_name` text NOT NULL,
	`field_value` text NOT NULL,
	`source_type` text NOT NULL,
	`confidence` integer,
	`is_confirmed` integer DEFAULT false NOT NULL,
	`confirmed_by` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`confirmed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_facts_project_field_source_uq` ON `ai_wedding_facts` (`wedding_project_id`,`field_name`,`source_type`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`anonymous_session_id` text,
	`event_name` text NOT NULL,
	`event_properties` text,
	`source_page` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`previous_values` text,
	`new_values` text,
	`request_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `booking_commissions` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`agreement_id` text,
	`commission_base` integer NOT NULL,
	`rate_bps_snapshot` integer,
	`gross_commission` integer NOT NULL,
	`adjustments` integer DEFAULT 0 NOT NULL,
	`net_commission` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `vendor_bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`agreement_id`) REFERENCES `commission_agreements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `booking_commissions_booking_id_unique` ON `booking_commissions` (`booking_id`);--> statement-breakpoint
CREATE TABLE `booking_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_by` text,
	`reason` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `vendor_bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`changed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budget_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`name` text NOT NULL,
	`allocated_amount` integer DEFAULT 0 NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_category_project_name_uq` ON `budget_categories` (`wedding_project_id`,`name`);--> statement-breakpoint
CREATE TABLE `booking_cancellation_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`requested_by` text NOT NULL,
	`cancellation_reason` text NOT NULL,
	`requested_refund_amount` integer,
	`approved_refund_amount` integer,
	`request_status` text DEFAULT 'submitted' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `vendor_bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `commission_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text,
	`commission_type` text NOT NULL,
	`commission_basis` text NOT NULL,
	`rate_bps` integer,
	`fixed_amount` integer,
	`effective_from` text NOT NULL,
	`effective_until` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` text PRIMARY KEY NOT NULL,
	`dispute_number` text NOT NULL,
	`booking_id` text NOT NULL,
	`opened_by` text NOT NULL,
	`dispute_type` text NOT NULL,
	`description` text NOT NULL,
	`dispute_status` text DEFAULT 'open' NOT NULL,
	`resolution_summary` text,
	`opened_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`resolved_at` text,
	FOREIGN KEY (`booking_id`) REFERENCES `vendor_bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`opened_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `disputes_dispute_number_unique` ON `disputes` (`dispute_number`);--> statement-breakpoint
CREATE TABLE `feature_usage_counters` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` text NOT NULL,
	`feature_key` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`reserved_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usage_counter_period_uq` ON `feature_usage_counters` (`subscription_id`,`feature_key`,`period_start`);--> statement-breakpoint
CREATE TABLE `inquiry_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`message_type` text DEFAULT 'text' NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `vendor_inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`recipient_id` text NOT NULL,
	`notification_type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`related_entity_type` text,
	`related_entity_id` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`recipient_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `outbox_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`aggregate_type` text NOT NULL,
	`aggregate_id` text NOT NULL,
	`event_payload` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`processing_status` text DEFAULT 'pending' NOT NULL,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`next_retry_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`processed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `outbox_events_idempotency_key_unique` ON `outbox_events` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `payment_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`obligation_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_reference` text,
	`amount` integer NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`idempotency_key` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`obligation_id`) REFERENCES `payment_obligations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_attempts_idempotency_key_unique` ON `payment_attempts` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `payment_obligations` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text,
	`order_id` text,
	`service_contract_id` text,
	`subscription_id` text,
	`obligation_type` text NOT NULL,
	`amount_due` integer NOT NULL,
	`amount_paid` integer DEFAULT 0 NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`due_at` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `vendor_bookings`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "payment_obligation_amount_check" CHECK("payment_obligations"."amount_due" >= 0 and "payment_obligations"."amount_paid" >= 0 and "payment_obligations"."amount_paid" <= "payment_obligations"."amount_due")
);
--> statement-breakpoint
CREATE TABLE `payment_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`obligation_id` text NOT NULL,
	`attempt_id` text,
	`provider` text NOT NULL,
	`provider_transaction_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`transaction_type` text NOT NULL,
	`verified_at` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`obligation_id`) REFERENCES `payment_obligations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attempt_id`) REFERENCES `payment_attempts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_transactions_provider_transaction_id_unique` ON `payment_transactions` (`provider_transaction_id`);--> statement-breakpoint
CREATE TABLE `payment_webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`provider_event_id` text NOT NULL,
	`payload_hash` text NOT NULL,
	`status` text NOT NULL,
	`received_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`processed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_webhook_provider_event_uq` ON `payment_webhook_events` (`provider`,`provider_event_id`);--> statement-breakpoint
CREATE TABLE `plan_features` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`feature_key` text NOT NULL,
	`feature_limit` integer,
	`is_enabled` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plan_feature_uq` ON `plan_features` (`plan_id`,`feature_key`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`full_name` text,
	`phone` text,
	`avatar_url` text,
	`preferred_language` text DEFAULT 'vi' NOT NULL,
	`account_status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_email_unique` ON `profiles` (`email`);--> statement-breakpoint
CREATE TABLE `wedding_project_members` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`member_role` text NOT NULL,
	`permission_level` text DEFAULT 'view' NOT NULL,
	`invited_at` text,
	`accepted_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_members_project_user_uq` ON `wedding_project_members` (`wedding_project_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `quotation_line_items` (
	`id` text PRIMARY KEY NOT NULL,
	`quotation_version_id` text NOT NULL,
	`item_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_amount` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`quotation_version_id`) REFERENCES `quotation_versions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "quotation_item_amount_check" CHECK("quotation_line_items"."quantity" > 0 and "quotation_line_items"."unit_price_amount" >= 0 and "quotation_line_items"."total_amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE `quotation_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`quotation_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`description` text,
	`subtotal_amount` integer NOT NULL,
	`discount_amount` integer DEFAULT 0 NOT NULL,
	`additional_fees_amount` integer DEFAULT 0 NOT NULL,
	`total_amount` integer NOT NULL,
	`deposit_amount` integer NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`deliverables` text,
	`exclusions` text,
	`terms_snapshot` text,
	`valid_until` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "quotation_deposit_check" CHECK("quotation_versions"."deposit_amount" >= 0 and "quotation_versions"."deposit_amount" <= "quotation_versions"."total_amount")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotation_version_uq` ON `quotation_versions` (`quotation_id`,`version_number`);--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`quotation_number` text NOT NULL,
	`current_version` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `vendor_inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_quotation_number_unique` ON `quotations` (`quotation_number`);--> statement-breakpoint
CREATE TABLE `service_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_number` text NOT NULL,
	`service_id` text NOT NULL,
	`wedding_project_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`preferred_date` text,
	`wedding_date` text,
	`event_location` text,
	`guest_count` integer,
	`estimated_budget` integer,
	`requirements` text NOT NULL,
	`inquiry_status` text DEFAULT 'submitted' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `wedding_services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_inquiries_inquiry_number_unique` ON `service_inquiries` (`inquiry_number`);--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_code` text NOT NULL,
	`plan_name` text NOT NULL,
	`target_role` text NOT NULL,
	`description` text,
	`billing_interval` text NOT NULL,
	`price_amount` integer NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_plans_plan_code_unique` ON `subscription_plans` (`plan_code`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`user_id` text,
	`vendor_id` text,
	`provider` text,
	`provider_subscription_id` text,
	`subscription_status` text DEFAULT 'pending' NOT NULL,
	`current_period_start` text,
	`current_period_end` text,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`cancelled_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "subscription_owner_check" CHECK(("subscriptions"."user_id" is not null and "subscriptions"."vendor_id" is null) or ("subscriptions"."user_id" is null and "subscriptions"."vendor_id" is not null))
);
--> statement-breakpoint
CREATE TABLE `wedding_timeline_items` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_at` text,
	`end_at` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`assigned_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`assigned_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_role_check" CHECK("user_roles"."role" in ('couple','vendor','admin'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_roles_user_role_uq` ON `user_roles` (`user_id`,`role`);--> statement-breakpoint
CREATE TABLE `vendor_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_number` text NOT NULL,
	`inquiry_id` text NOT NULL,
	`quotation_version_id` text NOT NULL,
	`wedding_project_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`event_date` text,
	`contract_value` integer NOT NULL,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`status` text DEFAULT 'AWAITING_PAYMENT' NOT NULL,
	`accepted_at` text NOT NULL,
	`confirmed_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `vendor_inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quotation_version_id`) REFERENCES `quotation_versions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_bookings_booking_number_unique` ON `vendor_bookings` (`booking_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_bookings_inquiry_id_unique` ON `vendor_bookings` (`inquiry_id`);--> statement-breakpoint
CREATE TABLE `vendor_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_categories_slug_unique` ON `vendor_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `vendor_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_number` text NOT NULL,
	`wedding_project_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`listing_id` text NOT NULL,
	`package_id` text,
	`requested_date` text,
	`event_location` text,
	`guest_count` integer,
	`budget_min` integer,
	`budget_max` integer,
	`requirements` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`status` text DEFAULT 'INQUIRY_SUBMITTED' NOT NULL,
	`idempotency_key` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`listing_id`) REFERENCES `vendor_listings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`package_id`) REFERENCES `vendor_packages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_inquiries_inquiry_number_unique` ON `vendor_inquiries` (`inquiry_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_inquiries_idempotency_key_unique` ON `vendor_inquiries` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `vendor_inquiries_project_idx` ON `vendor_inquiries` (`wedding_project_id`);--> statement-breakpoint
CREATE INDEX `vendor_inquiries_vendor_idx` ON `vendor_inquiries` (`vendor_id`);--> statement-breakpoint
CREATE TABLE `vendor_listings` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`category_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`booking_type` text DEFAULT 'request_quote' NOT NULL,
	`price_type` text DEFAULT 'custom_quote' NOT NULL,
	`starting_price_amount` integer,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`minimum_guest_count` integer,
	`maximum_guest_count` integer,
	`listing_status` text DEFAULT 'draft' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `vendor_categories`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "listing_booking_type_check" CHECK("vendor_listings"."booking_type" in ('instant','request_quote','consultation'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_listings_vendor_slug_uq` ON `vendor_listings` (`vendor_id`,`slug`);--> statement-breakpoint
CREATE TABLE `vendor_members` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`user_id` text NOT NULL,
	`vendor_role` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_members_vendor_user_uq` ON `vendor_members` (`vendor_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `vendor_packages` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`package_name` text NOT NULL,
	`description` text,
	`price_amount` integer,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`deposit_type` text,
	`deposit_value` integer,
	`inclusions` text,
	`exclusions` text,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `vendor_listings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vendor_shortlists` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`listing_id` text NOT NULL,
	`notes` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`listing_id`) REFERENCES `vendor_listings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendor_shortlist_project_listing_uq` ON `vendor_shortlists` (`wedding_project_id`,`listing_id`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`business_name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`business_email` text,
	`business_phone` text,
	`location` text,
	`service_areas` text,
	`verification_status` text DEFAULT 'draft' NOT NULL,
	`account_status` text DEFAULT 'active' NOT NULL,
	`accepting_inquiries` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "vendor_verification_check" CHECK("vendors"."verification_status" in ('draft','pending_review','approved','rejected','suspended'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vendors_slug_unique` ON `vendors` (`slug`);--> statement-breakpoint
CREATE TABLE `wedding_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`project_name` text NOT NULL,
	`wedding_date` text,
	`wedding_date_is_confirmed` integer DEFAULT false NOT NULL,
	`location` text,
	`guest_count` integer,
	`total_budget` integer,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`wedding_style` text,
	`ceremony_type` text,
	`indoor_outdoor_preference` text,
	`planning_status` text DEFAULT 'draft' NOT NULL,
	`ai_onboarding_completed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wedding_projects_owner_idx` ON `wedding_projects` (`owner_id`);--> statement-breakpoint
CREATE TABLE `wedding_services` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`full_description` text,
	`service_category` text NOT NULL,
	`pricing_type` text NOT NULL,
	`starting_price_amount` integer,
	`fixed_price_amount` integer,
	`currency_code` text DEFAULT 'VND' NOT NULL,
	`service_status` text DEFAULT 'draft' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_services_slug_unique` ON `wedding_services` (`slug`);--> statement-breakpoint
CREATE TABLE `wedding_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`due_date` text,
	`assigned_to` text,
	`source_type` text DEFAULT 'manual' NOT NULL,
	`completed_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`wedding_project_id`) REFERENCES `wedding_projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "task_status_check" CHECK("wedding_tasks"."status" in ('todo','in_progress','blocked','completed','cancelled'))
);
--> statement-breakpoint
CREATE INDEX `wedding_tasks_project_idx` ON `wedding_tasks` (`wedding_project_id`);