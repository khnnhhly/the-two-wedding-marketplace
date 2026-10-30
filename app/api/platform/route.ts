import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { guidebookPackById } from "../../workspace/guidebook-data";

export const dynamic = "force-dynamic";

type Json = Record<string, unknown>;
const ok = (data: unknown, status = 200) => Response.json(data, { status });
const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
const now = () => new Date().toISOString();

async function userId(email: string) {
  const bytes = new TextEncoder().encode(email.toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return `usr_${Array.from(new Uint8Array(hash)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

async function context() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const uid = await userId(user.email);
  await env.DB.prepare(`INSERT INTO profiles (id,email,full_name) VALUES (?,?,?) ON CONFLICT(email) DO UPDATE SET full_name=excluded.full_name, updated_at=CURRENT_TIMESTAMP`)
    .bind(uid, user.email, user.fullName ?? user.displayName).run();
  await env.DB.prepare(`INSERT INTO user_roles (id,user_id,role) VALUES (?,?, 'couple') ON CONFLICT(user_id,role) DO NOTHING`).bind(id("role"), uid).run();
  return { user, uid };
}

async function seedCatalog() {
  const rows = [
    ["ven_theplanners", "The Planners", "the-planners", "Đội ngũ wedding planner với quy trình cá nhân hóa và phạm vi phục vụ Hà Nội, TP.HCM.", "Hà Nội · TP.HCM"],
    ["ven_lumiere", "Lumière Studio", "lumiere-studio", "Photo & Film theo phong cách tự nhiên, giàu cảm xúc.", "Hà Nội"],
    ["ven_moc", "Mộc Concept", "moc-concept", "Thiết kế concept và trang trí tiệc cưới tinh giản, giàu chất liệu.", "TP. Hồ Chí Minh"],
  ];
  const listings = [
    ["lst_theplanners", "ven_theplanners", "Lập kế hoạch cưới trọn gói", "full-wedding-planning", "consultation", "custom_quote", null],
    ["lst_lumiere", "ven_lumiere", "Phóng sự cưới tự nhiên", "wedding-photo-film", "request_quote", "starting_from", 18000000],
    ["lst_moc", "ven_moc", "Concept & Decoration", "concept-decoration", "request_quote", "starting_from", 35000000],
  ];
  const plans = [
    ["plan_couple_free", "couple_free", "Couple Free", "couple", "monthly", 0],
    ["plan_couple_premium", "couple_premium", "Couple Premium", "couple", "monthly", 0],
    ["plan_vendor_free", "vendor_free", "Vendor Free", "vendor", "monthly", 0],
    ["plan_vendor_pro", "vendor_professional", "Vendor Professional", "vendor", "monthly", 0],
  ];
  const statements = [
    ...rows.map((v) => env.DB.prepare(`INSERT INTO vendors (id,business_name,slug,description,location,service_areas,verification_status,account_status,accepting_inquiries) VALUES (?,?,?,?,?,?,'approved','active',1) ON CONFLICT(id) DO NOTHING`).bind(v[0], v[1], v[2], v[3], v[4], v[4])),
    ...listings.map((v) => env.DB.prepare(`INSERT INTO vendor_listings (id,vendor_id,title,slug,booking_type,price_type,starting_price_amount,listing_status) VALUES (?,?,?,?,?,?,?,'published') ON CONFLICT(id) DO NOTHING`).bind(...v)),
    ...plans.map((v) => env.DB.prepare(`INSERT INTO subscription_plans (id,plan_code,plan_name,target_role,billing_interval,price_amount,is_active) VALUES (?,?,?,?,?,?,1) ON CONFLICT(id) DO NOTHING`).bind(...v)),
  ];
  await env.DB.batch(statements);
}

async function ownedProject(uid: string, projectId?: string) {
  const result = projectId
    ? await env.DB.prepare(`SELECT * FROM wedding_projects WHERE id=? AND owner_id=?`).bind(projectId, uid).first()
    : await env.DB.prepare(`SELECT * FROM wedding_projects WHERE owner_id=? ORDER BY created_at DESC LIMIT 1`).bind(uid).first();
  return result as Json | null;
}

export async function GET() {
  const ctx = await context();
  if (!ctx) return ok({ error: "AUTH_REQUIRED", message: "Vui lòng đăng nhập để mở Wedding Workspace." }, 401);
  await seedCatalog();
  const project = await ownedProject(ctx.uid);
  const projectId = project?.id as string | undefined;
  const [vendors, tasks, budgets, timeline, inquiries, bookings, shortlists, subscriptions, notifications] = await Promise.all([
    env.DB.prepare(`SELECT v.id,v.business_name,v.slug,v.description,v.location,v.service_areas,l.id listing_id,l.title,l.booking_type,l.price_type,l.starting_price_amount,l.currency_code FROM vendors v JOIN vendor_listings l ON l.vendor_id=v.id WHERE v.verification_status='approved' AND v.account_status='active' AND l.listing_status='published' ORDER BY l.is_featured DESC,v.business_name`).all(),
    projectId ? env.DB.prepare(`SELECT * FROM wedding_tasks WHERE wedding_project_id=? ORDER BY status, due_date, created_at`).bind(projectId).all() : Promise.resolve({ results: [] }),
    projectId ? env.DB.prepare(`SELECT * FROM budget_categories WHERE wedding_project_id=? ORDER BY sort_order`).bind(projectId).all() : Promise.resolve({ results: [] }),
    projectId ? env.DB.prepare(`SELECT * FROM wedding_timeline_items WHERE wedding_project_id=? ORDER BY start_at`).bind(projectId).all() : Promise.resolve({ results: [] }),
    projectId ? env.DB.prepare(`SELECT i.*,v.business_name,l.title listing_title,q.id quotation_id,q.status quotation_status,q.current_version,qv.total_amount,qv.deposit_amount,qv.valid_until FROM vendor_inquiries i JOIN vendors v ON v.id=i.vendor_id JOIN vendor_listings l ON l.id=i.listing_id LEFT JOIN quotations q ON q.inquiry_id=i.id LEFT JOIN quotation_versions qv ON qv.quotation_id=q.id AND qv.version_number=q.current_version WHERE i.wedding_project_id=? ORDER BY i.created_at DESC`).bind(projectId).all() : Promise.resolve({ results: [] }),
    projectId ? env.DB.prepare(`SELECT b.*,v.business_name,p.amount_due,p.amount_paid,p.status payment_status FROM vendor_bookings b JOIN vendors v ON v.id=b.vendor_id LEFT JOIN payment_obligations p ON p.booking_id=b.id WHERE b.wedding_project_id=? ORDER BY b.created_at DESC`).bind(projectId).all() : Promise.resolve({ results: [] }),
    projectId ? env.DB.prepare(`SELECT s.*,v.business_name,l.title FROM vendor_shortlists s JOIN vendors v ON v.id=s.vendor_id JOIN vendor_listings l ON l.id=s.listing_id WHERE s.wedding_project_id=?`).bind(projectId).all() : Promise.resolve({ results: [] }),
    env.DB.prepare(`SELECT s.*,p.plan_name,p.plan_code FROM subscriptions s JOIN subscription_plans p ON p.id=s.plan_id WHERE s.user_id=? ORDER BY s.created_at DESC`).bind(ctx.uid).all(),
    env.DB.prepare(`SELECT * FROM notifications WHERE recipient_id=? ORDER BY created_at DESC LIMIT 10`).bind(ctx.uid).all(),
  ]);
  return ok({
    user: { name: ctx.user.displayName, email: ctx.user.email }, project,
    tasks: tasks.results, budgets: budgets.results, timeline: timeline.results,
    vendors: vendors.results, inquiries: inquiries.results, bookings: bookings.results,
    shortlists: shortlists.results, subscriptions: subscriptions.results, notifications: notifications.results,
    safeguards: { paymentProof: "webhook_only", instantAvailability: "explicit_only", financialAmounts: "integer_vnd", aiWrites: "confirmation_required" },
  });
}

function parseIdea(idea: string) {
  const place = idea.match(/(?:ở|tại)\s+(Hà Nội|TP\.?\s*Hồ Chí Minh|Sài Gòn|Đà Nẵng|Huế)/i)?.[1] ?? null;
  const guests = Number(idea.match(/(\d{2,4})\s*(?:khách|người)/i)?.[1] ?? 0) || null;
  const budgetMatch = idea.match(/(\d{2,4})\s*(?:triệu|tr)/i)?.[1];
  const date = idea.match(/tháng\s*(\d{1,2})[\s/]*(?:năm\s*)?(20\d{2})/i);
  return { location: place, guestCount: guests, totalBudget: budgetMatch ? Number(budgetMatch) * 1_000_000 : null, weddingDate: date ? `${date[2]}-${date[1].padStart(2, "0")}-01` : null };
}

export async function POST(request: Request) {
  const ctx = await context();
  if (!ctx) return ok({ error: "AUTH_REQUIRED" }, 401);
  const body = await request.json().catch(() => null) as Json | null;
  if (!body || typeof body.action !== "string") return ok({ error: "INVALID_REQUEST" }, 400);
  const requestId = request.headers.get("x-request-id") ?? id("req");

  if (body.action === "start_onboarding") {
    const idea = String(body.idea ?? "").trim();
    if (idea.length < 20 || idea.length > 3000) return ok({ error: "Hãy chia sẻ ít nhất 20 ký tự và không quá 3.000 ký tự." }, 422);
    const parsed = parseIdea(idea); const projectId = id("wed"); const conversationId = id("conv"); const proposalId = id("aip");
    const projectName = parsed.location ? `Đám cưới tại ${parsed.location}` : "Kế hoạch cưới của chúng mình";
    const timelineBlueprint = guidebookPackById["master-timeline"];
    const budgetBlueprint = guidebookPackById["budget-blueprint"];
    const proposal = {
      budget: budgetBlueprint.budget ?? [],
      tasks: timelineBlueprint.tasks.slice(0, 6).map((task) => task.title),
      timeline: (timelineBlueprint.timeline ?? []).map((item) => item.title),
    };
    const statements = [
      env.DB.prepare(`INSERT INTO wedding_projects (id,owner_id,project_name,wedding_date,location,guest_count,total_budget,planning_status) VALUES (?,?,?,?,?,?,?,'onboarding')`).bind(projectId, ctx.uid, projectName, parsed.weddingDate, parsed.location, parsed.guestCount, parsed.totalBudget),
      env.DB.prepare(`INSERT INTO wedding_project_members (id,wedding_project_id,user_id,member_role,permission_level,accepted_at) VALUES (?,?,?,'owner','manage',?)`).bind(id("mem"), projectId, ctx.uid, now()),
      env.DB.prepare(`INSERT INTO ai_conversations (id,wedding_project_id,user_id,title) VALUES (?,?,?,'Kế hoạch cưới đầu tiên')`).bind(conversationId, projectId, ctx.uid),
      env.DB.prepare(`INSERT INTO ai_messages (id,conversation_id,sequence_number,role,content,structured_content) VALUES (?,?,1,'user',?,?)`).bind(id("msg"), conversationId, idea, JSON.stringify(parsed)),
      env.DB.prepare(`INSERT INTO ai_action_proposals (id,conversation_id,wedding_project_id,action_type,proposed_payload,status) VALUES (?,?,?,'initialize_workspace',?,'pending')`).bind(proposalId, conversationId, projectId, JSON.stringify(proposal)),
      ...Object.entries(parsed).filter(([,v]) => v != null).map(([key,value]) => env.DB.prepare(`INSERT INTO ai_wedding_facts (id,wedding_project_id,field_name,field_value,source_type,is_confirmed,confirmed_by) VALUES (?,?,?,?, 'user_provided',1,?)`).bind(id("fact"), projectId, key, JSON.stringify(value), ctx.uid)),
      env.DB.prepare(`INSERT INTO analytics_events (id,user_id,event_name,event_properties,source_page) VALUES (?,?,'ai_planner_started',?,'/workspace')`).bind(id("evt"), ctx.uid, JSON.stringify({ projectId })),
      env.DB.prepare(`INSERT INTO audit_logs (id,actor_id,actor_role,action,entity_type,entity_id,new_values,request_id) VALUES (?,?,'couple','project.created','wedding_project',?,?,?)`).bind(id("aud"), ctx.uid, projectId, JSON.stringify(parsed), requestId),
    ];
    await env.DB.batch(statements);
    return ok({ projectId, proposalId, parsed, proposal }, 201);
  }

  if (body.action === "confirm_ai_plan") {
    const project = await ownedProject(ctx.uid, String(body.projectId ?? ""));
    if (!project) return ok({ error: "FORBIDDEN" }, 403);
    const proposal = await env.DB.prepare(`SELECT * FROM ai_action_proposals WHERE id=? AND wedding_project_id=? AND status='pending'`).bind(String(body.proposalId), project.id).first() as Json | null;
    if (!proposal) return ok({ error: "PROPOSAL_NOT_AVAILABLE" }, 409);
    const data = JSON.parse(String(proposal.proposed_payload)) as { budget: [string,number][], tasks: string[], timeline: string[] };
    const total = Number(project.total_budget ?? 0);
    const statements = [
      ...data.budget.map(([name, pct], i) => env.DB.prepare(`INSERT INTO budget_categories (id,wedding_project_id,name,allocated_amount,sort_order) VALUES (?,?,?,?,?) ON CONFLICT(wedding_project_id,name) DO NOTHING`).bind(id("bud"), project.id, name, Math.round(total * pct / 100), i)),
      ...data.tasks.map((title, i) => env.DB.prepare(`INSERT INTO wedding_tasks (id,wedding_project_id,title,category,priority,source_type) SELECT ?,?,?, 'planning',?, 'ai_confirmed' WHERE NOT EXISTS (SELECT 1 FROM wedding_tasks WHERE wedding_project_id=? AND title=?)`).bind(id("tsk"), project.id, title, i < 2 ? "high" : "medium", project.id, title)),
      ...data.timeline.map((title, i) => env.DB.prepare(`INSERT INTO wedding_timeline_items (id,wedding_project_id,title,start_at,status) VALUES (?,?,?,?, 'planned')`).bind(id("tml"), project.id, title, new Date(Date.now() + i * 60 * 86400000).toISOString())),
      env.DB.prepare(`UPDATE ai_action_proposals SET status='executed',reviewed_by=?,reviewed_at=?,executed_at=?,execution_result=? WHERE id=?`).bind(ctx.uid, now(), now(), JSON.stringify({ created: true }), proposal.id),
      env.DB.prepare(`UPDATE wedding_projects SET ai_onboarding_completed=1,planning_status='active',updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(project.id),
      env.DB.prepare(`INSERT INTO outbox_events (id,event_type,aggregate_type,aggregate_id,event_payload,idempotency_key) VALUES (?,'AI_PLAN_CONFIRMED','wedding_project',?,?,?)`).bind(id("out"), project.id, JSON.stringify({ projectId: project.id, userId: ctx.uid }), `ai-plan:${proposal.id}`),
    ];
    await env.DB.batch(statements);
    return ok({ confirmed: true });
  }

  if (body.action === "apply_guidebook_pack") {
    const project = await ownedProject(ctx.uid, String(body.projectId ?? ""));
    if (!project) return ok({ error: "FORBIDDEN" }, 403);
    const pack = guidebookPackById[String(body.packId ?? "")];
    if (!pack) return ok({ error: "TEMPLATE_NOT_AVAILABLE" }, 404);
    const weddingDate = project.wedding_date ? new Date(String(project.wedding_date)) : null;
    const dueDate = (daysBeforeWedding?: number) => weddingDate && daysBeforeWedding != null
      ? new Date(weddingDate.getTime() - daysBeforeWedding * 86400000).toISOString()
      : null;
    const totalBudget = Number(project.total_budget ?? 0);
    const statements = [
      ...pack.tasks.map((task) => env.DB.prepare(`INSERT INTO wedding_tasks (id,wedding_project_id,title,description,category,priority,due_date,source_type)
        SELECT ?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM wedding_tasks WHERE wedding_project_id=? AND title=?)`)
        .bind(id("tsk"), project.id, task.title, task.description ?? null, task.category, task.priority ?? "medium", dueDate(task.daysBeforeWedding), `guidebook:${pack.id}`, project.id, task.title)),
      ...(pack.timeline ?? []).map((item) => env.DB.prepare(`INSERT INTO wedding_timeline_items (id,wedding_project_id,title,description,start_at,status)
        SELECT ?,?,?,?,?, 'planned' WHERE NOT EXISTS (SELECT 1 FROM wedding_timeline_items WHERE wedding_project_id=? AND title=?)`)
        .bind(id("tml"), project.id, item.title, item.description, dueDate(item.daysBeforeWedding), project.id, item.title)),
      ...(pack.budget ?? []).map(([name, percentage], index) => env.DB.prepare(`INSERT INTO budget_categories (id,wedding_project_id,name,allocated_amount,sort_order)
        VALUES (?,?,?,?,?) ON CONFLICT(wedding_project_id,name) DO NOTHING`)
        .bind(id("bud"), project.id, name, Math.round(totalBudget * percentage / 100), index + 20)),
      env.DB.prepare(`INSERT INTO audit_logs (id,actor_id,actor_role,action,entity_type,entity_id,new_values,request_id)
        VALUES (?,?,'couple','guidebook.applied','wedding_project',?,?,?)`)
        .bind(id("aud"), ctx.uid, project.id, JSON.stringify({ packId: pack.id, source: pack.sourceLabel }), requestId),
    ];
    await env.DB.batch(statements);
    return ok({
      applied: true,
      packId: pack.id,
      taskCount: pack.tasks.length,
      timelineCount: pack.timeline?.length ?? 0,
      budgetCategoryCount: pack.budget?.length ?? 0,
    });
  }

  if (body.action === "toggle_task") {
    const task = await env.DB.prepare(`SELECT t.* FROM wedding_tasks t JOIN wedding_projects p ON p.id=t.wedding_project_id WHERE t.id=? AND p.owner_id=?`).bind(String(body.taskId), ctx.uid).first() as Json | null;
    if (!task) return ok({ error: "FORBIDDEN" }, 403);
    const next = task.status === "completed" ? "todo" : "completed";
    await env.DB.prepare(`UPDATE wedding_tasks SET status=?,completed_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(next, next === "completed" ? now() : null, task.id).run();
    return ok({ status: next });
  }

  if (body.action === "shortlist") {
    const project = await ownedProject(ctx.uid, String(body.projectId ?? "")); if (!project) return ok({ error: "FORBIDDEN" }, 403);
    const listing = await env.DB.prepare(`SELECT l.*,v.verification_status FROM vendor_listings l JOIN vendors v ON v.id=l.vendor_id WHERE l.id=? AND l.listing_status='published' AND v.verification_status='approved'`).bind(String(body.listingId)).first() as Json | null;
    if (!listing) return ok({ error: "LISTING_NOT_AVAILABLE" }, 404);
    const existing = await env.DB.prepare(`SELECT id FROM vendor_shortlists WHERE wedding_project_id=? AND listing_id=?`).bind(project.id, listing.id).first();
    if (existing) await env.DB.prepare(`DELETE FROM vendor_shortlists WHERE id=?`).bind(existing.id).run();
    else await env.DB.prepare(`INSERT INTO vendor_shortlists (id,wedding_project_id,vendor_id,listing_id,created_by) VALUES (?,?,?,?,?)`).bind(id("sht"), project.id, listing.vendor_id, listing.id, ctx.uid).run();
    return ok({ saved: !existing });
  }

  if (body.action === "submit_inquiry") {
    const project = await ownedProject(ctx.uid, String(body.projectId ?? "")); if (!project) return ok({ error: "FORBIDDEN" }, 403);
    const listing = await env.DB.prepare(`SELECT l.*,v.business_name,v.verification_status,v.accepting_inquiries FROM vendor_listings l JOIN vendors v ON v.id=l.vendor_id WHERE l.id=?`).bind(String(body.listingId)).first() as Json | null;
    if (!listing || listing.verification_status !== "approved" || listing.listing_status !== "published" || !listing.accepting_inquiries) return ok({ error: "VENDOR_NOT_ACCEPTING_INQUIRIES" }, 409);
    const requirements = String(body.requirements ?? "").trim(); if (requirements.length < 30) return ok({ error: "Yêu cầu cần ít nhất 30 ký tự." }, 422);
    const key = String(body.idempotencyKey ?? id("idem")); const inquiryId = id("inq"); const number = `NQ-${Date.now().toString(36).toUpperCase()}`;
    const statements = [
      env.DB.prepare(`INSERT INTO vendor_inquiries (id,inquiry_number,wedding_project_id,vendor_id,listing_id,requested_date,event_location,guest_count,budget_min,budget_max,requirements,contact_name,contact_email,idempotency_key) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(inquiryId, number, project.id, listing.vendor_id, listing.id, project.wedding_date, project.location, project.guest_count, body.budgetMin ?? null, body.budgetMax ?? null, requirements, ctx.user.displayName, ctx.user.email, key),
      env.DB.prepare(`INSERT INTO inquiry_messages (id,inquiry_id,sender_id,message_type,content) VALUES (?,?,?,'brief',?)`).bind(id("imsg"), inquiryId, ctx.uid, requirements),
      env.DB.prepare(`INSERT INTO outbox_events (id,event_type,aggregate_type,aggregate_id,event_payload,idempotency_key) VALUES (?,'VENDOR_INQUIRY_SUBMITTED','vendor_inquiry',?,?,?)`).bind(id("out"), inquiryId, JSON.stringify({ inquiryId, vendorId: listing.vendor_id }), `inquiry:${inquiryId}`),
      env.DB.prepare(`INSERT INTO analytics_events (id,user_id,event_name,event_properties,source_page) VALUES (?,?,'vendor_inquiry_submitted',?,'/workspace')`).bind(id("evt"), ctx.uid, JSON.stringify({ inquiryId, vendorId: listing.vendor_id })),
    ];
    try { await env.DB.batch(statements); } catch (error) { if (String(error).includes("UNIQUE")) return ok({ error: "DUPLICATE_REQUEST" }, 409); throw error; }
    return ok({ inquiryId, inquiryNumber: number, status: "INQUIRY_SUBMITTED" }, 201);
  }

  if (body.action === "register_vendor") {
    const name = String(body.businessName ?? "").trim(); if (name.length < 3) return ok({ error: "Tên doanh nghiệp chưa hợp lệ." }, 422);
    const vendorId = id("ven"); const slug = `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${vendorId.slice(-5)}`;
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO vendors (id,owner_id,business_name,slug,description,business_email,location,service_areas,verification_status) VALUES (?,?,?,?,?,?,?,?,'pending_review')`).bind(vendorId, ctx.uid, name, slug, String(body.description ?? ""), ctx.user.email, String(body.location ?? ""), String(body.location ?? "")),
      env.DB.prepare(`INSERT INTO vendor_members (id,vendor_id,user_id,vendor_role) VALUES (?,?,?,'owner')`).bind(id("vmem"), vendorId, ctx.uid),
      env.DB.prepare(`INSERT INTO user_roles (id,user_id,role) VALUES (?,?, 'vendor') ON CONFLICT(user_id,role) DO NOTHING`).bind(id("role"), ctx.uid),
      env.DB.prepare(`INSERT INTO outbox_events (id,event_type,aggregate_type,aggregate_id,event_payload,idempotency_key) VALUES (?,'VENDOR_APPLICATION_SUBMITTED','vendor',?,?,?)`).bind(id("out"), vendorId, JSON.stringify({ vendorId }), `vendor-application:${vendorId}`),
    ]);
    return ok({ vendorId, status: "pending_review" }, 201);
  }

  if (body.action === "select_plan") {
    const plan = await env.DB.prepare(`SELECT * FROM subscription_plans WHERE id=? AND target_role='couple' AND is_active=1`).bind(String(body.planId)).first() as Json | null;
    if (!plan) return ok({ error: "PLAN_NOT_AVAILABLE" }, 404);
    if (Number(plan.price_amount) === 0) {
      const subId = id("sub"); await env.DB.prepare(`INSERT INTO subscriptions (id,plan_id,user_id,subscription_status,current_period_start,current_period_end) VALUES (?,?,?,'active',?,?)`).bind(subId, plan.id, ctx.uid, now(), new Date(Date.now()+365*86400000).toISOString()).run();
      return ok({ subscriptionId: subId, status: "active" }, 201);
    }
    const subId = id("sub"), obligationId = id("obl"), attemptId = id("pay");
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO subscriptions (id,plan_id,user_id,subscription_status) VALUES (?,?,?,'pending')`).bind(subId, plan.id, ctx.uid),
      env.DB.prepare(`INSERT INTO payment_obligations (id,subscription_id,obligation_type,amount_due,status) VALUES (?,?,'subscription',?,'PENDING')`).bind(obligationId, subId, plan.price_amount),
      env.DB.prepare(`INSERT INTO payment_attempts (id,obligation_id,provider,amount,status,idempotency_key) VALUES (?,?, 'sandbox',?,'PENDING',?)`).bind(attemptId, obligationId, plan.price_amount, `subscription:${subId}:initial`),
    ]);
    return ok({ subscriptionId: subId, paymentAttemptId: attemptId, status: "pending_payment", message: "Quyền Premium chỉ được kích hoạt sau webhook thanh toán đã xác minh." }, 201);
  }

  if (body.action === "cancel_booking") {
    const booking = await env.DB.prepare(`SELECT b.* FROM vendor_bookings b JOIN wedding_projects p ON p.id=b.wedding_project_id WHERE b.id=? AND p.owner_id=?`).bind(String(body.bookingId), ctx.uid).first() as Json | null;
    if (!booking) return ok({ error: "FORBIDDEN" }, 403);
    const reason = String(body.reason ?? "").trim(); if (reason.length < 10) return ok({ error: "Vui lòng nêu lý do rõ hơn." }, 422);
    const cid = id("can"); await env.DB.batch([
      env.DB.prepare(`INSERT INTO booking_cancellation_requests (id,booking_id,requested_by,cancellation_reason,request_status) VALUES (?,?,?,?,'submitted')`).bind(cid, booking.id, ctx.uid, reason),
      env.DB.prepare(`INSERT INTO outbox_events (id,event_type,aggregate_type,aggregate_id,event_payload,idempotency_key) VALUES (?,'BOOKING_CANCELLATION_REQUESTED','booking',?,?,?)`).bind(id("out"), booking.id, JSON.stringify({ cancellationRequestId: cid }), `cancel:${cid}`),
    ]); return ok({ cancellationRequestId: cid, status: "submitted" }, 201);
  }

  return ok({ error: "UNKNOWN_ACTION" }, 400);
}
