import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
};

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"), phone: text("phone"), avatarUrl: text("avatar_url"),
  preferredLanguage: text("preferred_language").notNull().default("vi"),
  accountStatus: text("account_status").notNull().default("active"), ...timestamps,
});

export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(), userId: text("user_id").notNull().references(() => profiles.id),
  role: text("role").notNull(), assignedAt: text("assigned_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  assignedBy: text("assigned_by").references(() => profiles.id),
}, (t) => [uniqueIndex("user_roles_user_role_uq").on(t.userId, t.role), check("user_role_check", sql`${t.role} in ('couple','vendor','admin')`)]);

export const weddingProjects = sqliteTable("wedding_projects", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull().references(() => profiles.id),
  projectName: text("project_name").notNull(), weddingDate: text("wedding_date"), weddingDateIsConfirmed: integer("wedding_date_is_confirmed", { mode: "boolean" }).notNull().default(false),
  location: text("location"), guestCount: integer("guest_count"), totalBudget: integer("total_budget"), currencyCode: text("currency_code").notNull().default("VND"),
  weddingStyle: text("wedding_style"), ceremonyType: text("ceremony_type"), indoorOutdoorPreference: text("indoor_outdoor_preference"),
  planningStatus: text("planning_status").notNull().default("draft"), aiOnboardingCompleted: integer("ai_onboarding_completed", { mode: "boolean" }).notNull().default(false), ...timestamps,
}, (t) => [index("wedding_projects_owner_idx").on(t.ownerId)]);

export const projectMembers = sqliteTable("wedding_project_members", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id),
  userId: text("user_id").notNull().references(() => profiles.id), memberRole: text("member_role").notNull(), permissionLevel: text("permission_level").notNull().default("view"),
  invitedAt: text("invited_at"), acceptedAt: text("accepted_at"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("project_members_project_user_uq").on(t.weddingProjectId, t.userId)]);

export const aiConversations = sqliteTable("ai_conversations", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").references(() => weddingProjects.id),
  userId: text("user_id").notNull().references(() => profiles.id), title: text("title").notNull(), conversationStatus: text("conversation_status").notNull().default("active"), ...timestamps,
});
export const aiMessages = sqliteTable("ai_messages", {
  id: text("id").primaryKey(), conversationId: text("conversation_id").notNull().references(() => aiConversations.id), sequenceNumber: integer("sequence_number").notNull(),
  role: text("role").notNull(), content: text("content").notNull(), structuredContent: text("structured_content"), toolCallId: text("tool_call_id"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("ai_messages_conversation_seq_uq").on(t.conversationId, t.sequenceNumber), check("ai_message_role_check", sql`${t.role} in ('system','user','assistant','tool')`)]);
export const aiWeddingFacts = sqliteTable("ai_wedding_facts", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), fieldName: text("field_name").notNull(),
  fieldValue: text("field_value").notNull(), sourceType: text("source_type").notNull(), confidence: integer("confidence"), isConfirmed: integer("is_confirmed", { mode: "boolean" }).notNull().default(false),
  confirmedBy: text("confirmed_by").references(() => profiles.id), ...timestamps,
}, (t) => [uniqueIndex("ai_facts_project_field_source_uq").on(t.weddingProjectId, t.fieldName, t.sourceType)]);
export const aiActionProposals = sqliteTable("ai_action_proposals", {
  id: text("id").primaryKey(), conversationId: text("conversation_id").notNull().references(() => aiConversations.id), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id),
  actionType: text("action_type").notNull(), proposedPayload: text("proposed_payload").notNull(), status: text("status").notNull().default("pending"), reviewedBy: text("reviewed_by").references(() => profiles.id),
  reviewedAt: text("reviewed_at"), executedAt: text("executed_at"), executionResult: text("execution_result"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [check("ai_action_status_check", sql`${t.status} in ('pending','approved','rejected','executed','failed','expired')`)]);

export const budgetCategories = sqliteTable("budget_categories", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), name: text("name").notNull(),
  allocatedAmount: integer("allocated_amount").notNull().default(0), currencyCode: text("currency_code").notNull().default("VND"), sortOrder: integer("sort_order").notNull().default(0), ...timestamps,
}, (t) => [uniqueIndex("budget_category_project_name_uq").on(t.weddingProjectId, t.name)]);
export const weddingTasks = sqliteTable("wedding_tasks", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), title: text("title").notNull(), description: text("description"),
  category: text("category"), priority: text("priority").notNull().default("medium"), status: text("status").notNull().default("todo"), dueDate: text("due_date"),
  assignedTo: text("assigned_to").references(() => profiles.id), sourceType: text("source_type").notNull().default("manual"), completedAt: text("completed_at"), ...timestamps,
}, (t) => [index("wedding_tasks_project_idx").on(t.weddingProjectId), check("task_status_check", sql`${t.status} in ('todo','in_progress','blocked','completed','cancelled')`)]);
export const timelineItems = sqliteTable("wedding_timeline_items", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), title: text("title").notNull(), description: text("description"),
  startAt: text("start_at"), endAt: text("end_at"), status: text("status").notNull().default("planned"), ...timestamps,
});

export const vendorCategories = sqliteTable("vendor_categories", { id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(), description: text("description") });
export const vendors = sqliteTable("vendors", {
  id: text("id").primaryKey(), ownerId: text("owner_id").references(() => profiles.id), businessName: text("business_name").notNull(), slug: text("slug").notNull().unique(), description: text("description"),
  businessEmail: text("business_email"), businessPhone: text("business_phone"), location: text("location"), serviceAreas: text("service_areas"), verificationStatus: text("verification_status").notNull().default("draft"),
  accountStatus: text("account_status").notNull().default("active"), acceptingInquiries: integer("accepting_inquiries", { mode: "boolean" }).notNull().default(true), ...timestamps,
}, (t) => [check("vendor_verification_check", sql`${t.verificationStatus} in ('draft','pending_review','approved','rejected','suspended')`)]);
export const vendorMembers = sqliteTable("vendor_members", {
  id: text("id").primaryKey(), vendorId: text("vendor_id").notNull().references(() => vendors.id), userId: text("user_id").notNull().references(() => profiles.id), vendorRole: text("vendor_role").notNull(), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("vendor_members_vendor_user_uq").on(t.vendorId, t.userId)]);
export const vendorListings = sqliteTable("vendor_listings", {
  id: text("id").primaryKey(), vendorId: text("vendor_id").notNull().references(() => vendors.id), categoryId: text("category_id").references(() => vendorCategories.id), title: text("title").notNull(), slug: text("slug").notNull(),
  description: text("description"), bookingType: text("booking_type").notNull().default("request_quote"), priceType: text("price_type").notNull().default("custom_quote"), startingPriceAmount: integer("starting_price_amount"),
  currencyCode: text("currency_code").notNull().default("VND"), minimumGuestCount: integer("minimum_guest_count"), maximumGuestCount: integer("maximum_guest_count"), listingStatus: text("listing_status").notNull().default("draft"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), ...timestamps,
}, (t) => [uniqueIndex("vendor_listings_vendor_slug_uq").on(t.vendorId, t.slug), check("listing_booking_type_check", sql`${t.bookingType} in ('instant','request_quote','consultation')`)]);
export const vendorPackages = sqliteTable("vendor_packages", {
  id: text("id").primaryKey(), listingId: text("listing_id").notNull().references(() => vendorListings.id), packageName: text("package_name").notNull(), description: text("description"),
  priceAmount: integer("price_amount"), currencyCode: text("currency_code").notNull().default("VND"), depositType: text("deposit_type"), depositValue: integer("deposit_value"), inclusions: text("inclusions"), exclusions: text("exclusions"), isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
export const vendorShortlists = sqliteTable("vendor_shortlists", {
  id: text("id").primaryKey(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), vendorId: text("vendor_id").notNull().references(() => vendors.id),
  listingId: text("listing_id").notNull().references(() => vendorListings.id), notes: text("notes"), createdBy: text("created_by").notNull().references(() => profiles.id), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("vendor_shortlist_project_listing_uq").on(t.weddingProjectId, t.listingId)]);

export const vendorInquiries = sqliteTable("vendor_inquiries", {
  id: text("id").primaryKey(), inquiryNumber: text("inquiry_number").notNull().unique(), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), vendorId: text("vendor_id").notNull().references(() => vendors.id),
  listingId: text("listing_id").notNull().references(() => vendorListings.id), packageId: text("package_id").references(() => vendorPackages.id), requestedDate: text("requested_date"), eventLocation: text("event_location"), guestCount: integer("guest_count"),
  budgetMin: integer("budget_min"), budgetMax: integer("budget_max"), requirements: text("requirements").notNull(), contactName: text("contact_name").notNull(), contactEmail: text("contact_email").notNull(),
  status: text("status").notNull().default("INQUIRY_SUBMITTED"), idempotencyKey: text("idempotency_key").notNull().unique(), ...timestamps,
}, (t) => [index("vendor_inquiries_project_idx").on(t.weddingProjectId), index("vendor_inquiries_vendor_idx").on(t.vendorId)]);
export const inquiryMessages = sqliteTable("inquiry_messages", {
  id: text("id").primaryKey(), inquiryId: text("inquiry_id").notNull().references(() => vendorInquiries.id), senderId: text("sender_id").notNull().references(() => profiles.id),
  messageType: text("message_type").notNull().default("text"), content: text("content").notNull(), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const quotations = sqliteTable("quotations", {
  id: text("id").primaryKey(), inquiryId: text("inquiry_id").notNull().references(() => vendorInquiries.id), vendorId: text("vendor_id").notNull().references(() => vendors.id),
  quotationNumber: text("quotation_number").notNull().unique(), currentVersion: integer("current_version").notNull().default(1), status: text("status").notNull().default("DRAFT"), ...timestamps,
});
export const quotationVersions = sqliteTable("quotation_versions", {
  id: text("id").primaryKey(), quotationId: text("quotation_id").notNull().references(() => quotations.id), versionNumber: integer("version_number").notNull(), description: text("description"),
  subtotalAmount: integer("subtotal_amount").notNull(), discountAmount: integer("discount_amount").notNull().default(0), additionalFeesAmount: integer("additional_fees_amount").notNull().default(0), totalAmount: integer("total_amount").notNull(),
  depositAmount: integer("deposit_amount").notNull(), currencyCode: text("currency_code").notNull().default("VND"), deliverables: text("deliverables"), exclusions: text("exclusions"), termsSnapshot: text("terms_snapshot"), validUntil: text("valid_until"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("quotation_version_uq").on(t.quotationId, t.versionNumber), check("quotation_deposit_check", sql`${t.depositAmount} >= 0 and ${t.depositAmount} <= ${t.totalAmount}`)]);
export const quotationLineItems = sqliteTable("quotation_line_items", {
  id: text("id").primaryKey(), quotationVersionId: text("quotation_version_id").notNull().references(() => quotationVersions.id), itemName: text("item_name").notNull(), quantity: integer("quantity").notNull(),
  unitPriceAmount: integer("unit_price_amount").notNull(), totalAmount: integer("total_amount").notNull(), sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [check("quotation_item_amount_check", sql`${t.quantity} > 0 and ${t.unitPriceAmount} >= 0 and ${t.totalAmount} >= 0`)]);

export const vendorBookings = sqliteTable("vendor_bookings", {
  id: text("id").primaryKey(), bookingNumber: text("booking_number").notNull().unique(), inquiryId: text("inquiry_id").notNull().references(() => vendorInquiries.id).unique(), quotationVersionId: text("quotation_version_id").notNull().references(() => quotationVersions.id),
  weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), vendorId: text("vendor_id").notNull().references(() => vendors.id), eventDate: text("event_date"),
  contractValue: integer("contract_value").notNull(), currencyCode: text("currency_code").notNull().default("VND"), status: text("status").notNull().default("AWAITING_PAYMENT"), acceptedAt: text("accepted_at").notNull(), confirmedAt: text("confirmed_at"), ...timestamps,
});
export const bookingStatusHistory = sqliteTable("booking_status_history", {
  id: text("id").primaryKey(), bookingId: text("booking_id").notNull().references(() => vendorBookings.id), fromStatus: text("from_status"), toStatus: text("to_status").notNull(),
  changedBy: text("changed_by").references(() => profiles.id), reason: text("reason"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const paymentObligations = sqliteTable("payment_obligations", {
  id: text("id").primaryKey(), bookingId: text("booking_id").references(() => vendorBookings.id), orderId: text("order_id"), serviceContractId: text("service_contract_id"), subscriptionId: text("subscription_id"),
  obligationType: text("obligation_type").notNull(), amountDue: integer("amount_due").notNull(), amountPaid: integer("amount_paid").notNull().default(0), currencyCode: text("currency_code").notNull().default("VND"),
  dueAt: text("due_at"), status: text("status").notNull().default("PENDING"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`), updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [check("payment_obligation_amount_check", sql`${t.amountDue} >= 0 and ${t.amountPaid} >= 0 and ${t.amountPaid} <= ${t.amountDue}`)]);
export const paymentAttempts = sqliteTable("payment_attempts", {
  id: text("id").primaryKey(), obligationId: text("obligation_id").notNull().references(() => paymentObligations.id), provider: text("provider").notNull(), providerReference: text("provider_reference"),
  amount: integer("amount").notNull(), currencyCode: text("currency_code").notNull().default("VND"), status: text("status").notNull().default("PENDING"), idempotencyKey: text("idempotency_key").notNull().unique(), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const paymentTransactions = sqliteTable("payment_transactions", {
  id: text("id").primaryKey(), obligationId: text("obligation_id").notNull().references(() => paymentObligations.id), attemptId: text("attempt_id").references(() => paymentAttempts.id), provider: text("provider").notNull(),
  providerTransactionId: text("provider_transaction_id").notNull().unique(), amount: integer("amount").notNull(), currencyCode: text("currency_code").notNull().default("VND"), transactionType: text("transaction_type").notNull(), verifiedAt: text("verified_at").notNull(), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const paymentWebhookEvents = sqliteTable("payment_webhook_events", {
  id: text("id").primaryKey(), provider: text("provider").notNull(), providerEventId: text("provider_event_id").notNull(), payloadHash: text("payload_hash").notNull(), status: text("status").notNull(), receivedAt: text("received_at").notNull().default(sql`(CURRENT_TIMESTAMP)`), processedAt: text("processed_at"),
}, (t) => [uniqueIndex("payment_webhook_provider_event_uq").on(t.provider, t.providerEventId)]);

export const commissionAgreements = sqliteTable("commission_agreements", {
  id: text("id").primaryKey(), vendorId: text("vendor_id").references(() => vendors.id), commissionType: text("commission_type").notNull(), commissionBasis: text("commission_basis").notNull(), rateBps: integer("rate_bps"), fixedAmount: integer("fixed_amount"),
  effectiveFrom: text("effective_from").notNull(), effectiveUntil: text("effective_until"), isActive: integer("is_active", { mode: "boolean" }).notNull().default(true), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const bookingCommissions = sqliteTable("booking_commissions", {
  id: text("id").primaryKey(), bookingId: text("booking_id").notNull().references(() => vendorBookings.id).unique(), agreementId: text("agreement_id").references(() => commissionAgreements.id),
  commissionBase: integer("commission_base").notNull(), rateBpsSnapshot: integer("rate_bps_snapshot"), grossCommission: integer("gross_commission").notNull(), adjustments: integer("adjustments").notNull().default(0), netCommission: integer("net_commission").notNull(), status: text("status").notNull().default("PENDING"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: text("id").primaryKey(), planCode: text("plan_code").notNull().unique(), planName: text("plan_name").notNull(), targetRole: text("target_role").notNull(), description: text("description"), billingInterval: text("billing_interval").notNull(),
  priceAmount: integer("price_amount").notNull(), currencyCode: text("currency_code").notNull().default("VND"), isActive: integer("is_active", { mode: "boolean" }).notNull().default(true), ...timestamps,
});
export const planFeatures = sqliteTable("plan_features", {
  id: text("id").primaryKey(), planId: text("plan_id").notNull().references(() => subscriptionPlans.id), featureKey: text("feature_key").notNull(), featureLimit: integer("feature_limit"), isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
}, (t) => [uniqueIndex("plan_feature_uq").on(t.planId, t.featureKey)]);
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(), planId: text("plan_id").notNull().references(() => subscriptionPlans.id), userId: text("user_id").references(() => profiles.id), vendorId: text("vendor_id").references(() => vendors.id), provider: text("provider"), providerSubscriptionId: text("provider_subscription_id"),
  subscriptionStatus: text("subscription_status").notNull().default("pending"), currentPeriodStart: text("current_period_start"), currentPeriodEnd: text("current_period_end"), cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).notNull().default(false), cancelledAt: text("cancelled_at"), ...timestamps,
}, (t) => [check("subscription_owner_check", sql`(${t.userId} is not null and ${t.vendorId} is null) or (${t.userId} is null and ${t.vendorId} is not null)`)]);
export const featureUsageCounters = sqliteTable("feature_usage_counters", {
  id: text("id").primaryKey(), subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id), featureKey: text("feature_key").notNull(), periodStart: text("period_start").notNull(), periodEnd: text("period_end").notNull(), usageCount: integer("usage_count").notNull().default(0), reservedCount: integer("reserved_count").notNull().default(0), updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (t) => [uniqueIndex("usage_counter_period_uq").on(t.subscriptionId, t.featureKey, t.periodStart)]);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(), recipientId: text("recipient_id").notNull().references(() => profiles.id), notificationType: text("notification_type").notNull(), title: text("title").notNull(), message: text("message").notNull(), relatedEntityType: text("related_entity_type"), relatedEntityId: text("related_entity_id"), isRead: integer("is_read", { mode: "boolean" }).notNull().default(false), readAt: text("read_at"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const outboxEvents = sqliteTable("outbox_events", {
  id: text("id").primaryKey(), eventType: text("event_type").notNull(), aggregateType: text("aggregate_type").notNull(), aggregateId: text("aggregate_id").notNull(), eventPayload: text("event_payload").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(), processingStatus: text("processing_status").notNull().default("pending"), retryCount: integer("retry_count").notNull().default(0), nextRetryAt: text("next_retry_at"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`), processedAt: text("processed_at"),
});
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(), actorId: text("actor_id").references(() => profiles.id), actorRole: text("actor_role").notNull(), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(),
  previousValues: text("previous_values"), newValues: text("new_values"), requestId: text("request_id").notNull(), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const cancellationRequests = sqliteTable("booking_cancellation_requests", {
  id: text("id").primaryKey(), bookingId: text("booking_id").notNull().references(() => vendorBookings.id), requestedBy: text("requested_by").notNull().references(() => profiles.id), cancellationReason: text("cancellation_reason").notNull(),
  requestedRefundAmount: integer("requested_refund_amount"), approvedRefundAmount: integer("approved_refund_amount"), requestStatus: text("request_status").notNull().default("submitted"), reviewedBy: text("reviewed_by").references(() => profiles.id), reviewedAt: text("reviewed_at"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export const disputes = sqliteTable("disputes", {
  id: text("id").primaryKey(), disputeNumber: text("dispute_number").notNull().unique(), bookingId: text("booking_id").notNull().references(() => vendorBookings.id), openedBy: text("opened_by").notNull().references(() => profiles.id), disputeType: text("dispute_type").notNull(), description: text("description").notNull(), disputeStatus: text("dispute_status").notNull().default("open"), resolutionSummary: text("resolution_summary"), openedAt: text("opened_at").notNull().default(sql`(CURRENT_TIMESTAMP)`), resolvedAt: text("resolved_at"),
});
export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(), userId: text("user_id").references(() => profiles.id), anonymousSessionId: text("anonymous_session_id"), eventName: text("event_name").notNull(), eventProperties: text("event_properties"), sourcePage: text("source_page"), createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const weddingServices = sqliteTable("wedding_services", {
  id: text("id").primaryKey(), title: text("title").notNull(), slug: text("slug").notNull().unique(), shortDescription: text("short_description"), fullDescription: text("full_description"), serviceCategory: text("service_category").notNull(), pricingType: text("pricing_type").notNull(), startingPriceAmount: integer("starting_price_amount"), fixedPriceAmount: integer("fixed_price_amount"), currencyCode: text("currency_code").notNull().default("VND"), serviceStatus: text("service_status").notNull().default("draft"), isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false), ...timestamps,
});
export const serviceInquiries = sqliteTable("service_inquiries", {
  id: text("id").primaryKey(), inquiryNumber: text("inquiry_number").notNull().unique(), serviceId: text("service_id").notNull().references(() => weddingServices.id), weddingProjectId: text("wedding_project_id").notNull().references(() => weddingProjects.id), customerId: text("customer_id").notNull().references(() => profiles.id), contactName: text("contact_name").notNull(), contactEmail: text("contact_email").notNull(), preferredDate: text("preferred_date"), weddingDate: text("wedding_date"), eventLocation: text("event_location"), guestCount: integer("guest_count"), estimatedBudget: integer("estimated_budget"), requirements: text("requirements").notNull(), inquiryStatus: text("inquiry_status").notNull().default("submitted"), ...timestamps,
});
