# Nắng platform implementation

## Implemented foundation

- Identity-aware Wedding Workspace using the authenticated Sites user.
- Durable D1 data model with 42 normalized tables covering profiles, roles, wedding projects, AI conversations and proposals, budgets, tasks, timeline, vendor discovery, shortlists, inquiries, quotations, bookings, payment obligations, commissions, subscriptions, notifications, cancellation requests, disputes, analytics, and planning services.
- Generated migration with foreign keys, uniqueness rules, integer VND amounts, status checks, immutable quotation versions, and idempotency keys.
- AI onboarding writes the original message and extracted facts first. Budget, checklist, and timeline records are written only after explicit user confirmation.
- Approved vendor catalog, durable shortlist, editable AI-assisted vendor brief, and inquiry submission. Inquiry submission never creates a booking.
- Vendor registration enters `pending_review`; a vendor cannot self-approve.
- Subscription checkout creates a pending subscription and payment obligation. Paid access is activated only by a verified webhook.
- Signed payment webhook with amount/currency verification, duplicate-event protection, append-only transaction recording, and transactional outbox events.
- Cancellation requests preserve booking and financial history.

## Environment configuration

The hosted application needs these server-side values before real payment processing is enabled:

| Key | Required for | Notes |
| --- | --- | --- |
| `PAYMENT_WEBHOOK_SECRET` | Sandbox/production payment webhook verification | Secret; never expose to the browser. |
| `OPENAI_API_KEY` | Model-backed extraction and planning | Not currently required for the deterministic onboarding fallback. |
| `RESEND_API_KEY` | Transactional email worker | Outbox records are already created; delivery worker is the next integration. |
| `PAYMENT_PROVIDER_API_KEY` | Provider checkout creation | Provider must support the intended Vietnamese payment and marketplace model. |

Runtime values belong in Sites environment settings, not source files.

## External integration boundaries

- No payment is marked successful from a redirect or user-uploaded receipt.
- The current UI creates payment obligations but does not claim a production payment provider is connected.
- Email events are queued in the transactional outbox; provider delivery needs the email worker and credentials.
- The public catalog uses curated seed records without ratings, fabricated availability, or unsupported market-price claims.
- The current platform uses Sites D1 rather than Supabase PostgreSQL because Sites provides managed D1 persistence for this deployment. A Supabase migration would require an external project and credentials.

## Deployment checklist

1. Apply the generated D1 migration to a fresh environment.
2. Configure the payment and email secrets in Sites.
3. Configure real plan prices and usage limits administratively.
4. Connect payment checkout creation and register `/api/payment-webhook` with the provider.
5. Run the outbox/email worker with retry and dead-letter handling.
6. Add private R2 storage before enabling contract, evidence, or verification-document uploads.
7. Assign the first admin through a privileged operational process.
8. Run authorization and concurrency tests against the production-like environment.
9. Review marketplace settlement and electronic-signature requirements with Vietnamese legal/payment specialists.

## Known limitations and next phase

This release is a connected operational foundation, not the entire production marketplace described in the master specification. The customer journey through AI onboarding, workspace, shortlist, and inquiry is functional and persistent. Quotation authoring, admin approval screens, provider checkout UI, notification worker, private uploads, and the remaining role-specific dashboards still require implementation before production launch.
