// ============================================================
// AskBiz New Blog Posts — Part 3
// Topics: AskBiz POS · Manufacturing Intelligence · AskBiz Tutorials
// Factory Operations feature launch
// ============================================================

export const FACTORY_BLOG_POSTS = [

{
  slug: 'askbiz-factory-captures-launch',
  title: 'Introducing AskBiz Factory Captures: Real-Time Production Oversight Built Into Your POS',
  metaDescription: 'AskBiz Factory Captures brings photo-based production logging, role-based approval workflows, and a full audit trail directly into your POS. Built for small manufacturers, food producers, and repair shops.',
  cluster: 'AskBiz POS',
  pillar: 'Product Launch',
  publishDate: '2026-05-18',
  readTime: 7,
  tldr: 'Factory Captures is a new AskBiz POS feature that lets production floor staff log intake, output, wastage, and dispatch events with photos. Supervisors and managers approve each capture through a built-in workflow, and every action is recorded in a tamper-proof audit trail — all from pos.askbiz.co.',
  sections: [
    {
      heading: 'What are Factory Captures?',
      level: 2,
      body: 'Factory Captures is a production logging system built directly into AskBiz POS. It gives your floor staff a simple, photo-first way to record what is happening on your production line — without spreadsheets, paper forms, or separate software.\n\nEvery capture is timestamped, tagged to a staff member, attached to a photo, and queued for approval. The result is a real-time picture of your production floor that your supervisors and managers can act on immediately.',
    },
    {
      heading: 'The four capture types',
      level: 2,
      body: 'AskBiz Factory Captures has four core event types, each designed for a distinct moment in your production process:\n\n- **Intake** — raw materials or components arriving at the facility. Staff photograph the incoming batch and log the quantity.\n- **Output** — finished goods coming off the production line. Staff record the completed units with a photo for quality and quantity verification.\n- **Wastage** — materials that are damaged, spoiled, or rejected. Every wastage event is documented so you can track loss rates over time.\n- **Dispatch** — finished goods leaving the facility. Dispatch captures close the loop between production and fulfilment.\n\nEach type has its own permission flag so you can assign exactly which staff can log which events.',
    },
    {
      heading: 'Role-based approval workflow',
      level: 2,
      body: 'Captures do not become part of your production record until they are approved. This two-step workflow — submit then approve — is what gives Factory Captures its accountability layer.\n\n**Floor workers** submit captures from their staff dashboard at pos.askbiz.co. The capture goes into a pending queue immediately.\n\n**Supervisors** hold the `capture.approve` permission. They see all pending captures for their shift and can approve or reject each one with a mandatory reason recorded against any rejection.\n\n**Managers** have full visibility across all captures, approved or pending, and can override or re-open any capture if needed.',
    },
    {
      heading: 'The audit trail',
      level: 2,
      body: 'Every action in the Factory Captures workflow is logged in your AskBiz audit trail. That means every submission, every approval, every rejection, and every override carries a timestamp, a staff ID, and the associated photo.\n\nThe audit trail is accessible from your admin panel at **askbiz.co/pos → Audit tab**. You can filter by event type, date range, staff member, or capture status. This gives you a complete, tamper-proof record of your production history — useful for internal reviews, supplier disputes, and compliance documentation.',
    },
    {
      heading: 'How it works on mobile',
      level: 2,
      body: 'Factory Captures is designed for the production floor, which means it needs to work on a phone. Staff log in to **pos.askbiz.co** using their unique PIN — no app download required, no email login, just a fast PIN entry on any phone or tablet.\n\nOnce logged in, the capture dashboard is front and centre. Staff tap **New Capture**, take or upload a photo, select the capture type (intake, output, wastage, or dispatch), add any notes, and submit. The whole process takes under 30 seconds.',
    },
    {
      heading: 'Who is Factory Captures for?',
      level: 3,
      body: 'Factory Captures is built for any business that has a production element — not just large manufacturers. The most common use cases we see are:\n\n- **Small food producers** — bakeries, sauce makers, meal prep operations that need to document batch output and wastage for traceability\n- **Electronics and component assemblers** — businesses that intake components, assemble products, and dispatch to fulfilment\n- **Repair and refurbishment shops** — already using AskBiz POS for intake, who now want photo evidence at every stage of the repair process\n- **Garment and textile producers** — tracking cut, sew, and dispatch stages with visual verification at each point\n\nIf your business converts raw inputs into finished outputs — and you need evidence of that process — Factory Captures is for you.',
    },
    {
      heading: 'Getting started with Factory Captures',
      level: 2,
      body: 'To enable Factory Captures, go to **Settings → Features → Factory** in your AskBiz admin panel and toggle on the factory sector. You will then be able to assign factory-specific roles to your staff from the **Staff** tab.\n\nAssign the `camera.intake`, `camera.output`, `camera.wastage`, and `camera.dispatch` permissions to your floor workers based on their responsibilities. Assign `capture.approve` to your supervisors.\n\nStaff can then log in immediately at **pos.askbiz.co** using their PIN and start submitting captures. Approvals flow through the supervisor queue in real time. No training materials needed — the interface guides each step.',
    },
  ],
  paa: [
    { q: 'What is AskBiz Factory Captures?', a: 'Factory Captures is a photo-based production logging feature in AskBiz POS. Staff use it to record intake, output, wastage, and dispatch events with photos, and supervisors approve each capture through a built-in workflow.' },
    { q: 'Do I need special hardware for Factory Captures?', a: 'No. Factory Captures runs in any browser at pos.askbiz.co. Staff use the camera on their phone or tablet to take photos. No dedicated hardware or app download is required.' },
    { q: 'What is the approval workflow in Factory Captures?', a: 'Floor workers submit a capture with a photo, type, and notes. The capture goes into a pending queue. Supervisors with the capture.approve permission then approve or reject it, with a reason recorded against any rejection.' },
    { q: 'Can Factory Captures be used in a food production environment?', a: 'Yes. Factory Captures is well-suited for food producers who need photo-based batch documentation, wastage tracking, and a tamper-proof audit trail for traceability purposes.' },
  ],
  cta: { heading: 'Put a production record behind every batch', body: 'Enable Factory Captures in your AskBiz POS settings and start logging production events with photo evidence and supervisor approval — no extra software needed.' },
  relatedSlugs: ['factory-owner-ai-production-intelligence-2026', 'askbiz-pos-launch-built-in-point-of-sale', 'how-to-set-up-factory-captures-askbiz'],
},

{
  slug: 'production-accountability-gap-small-manufacturers',
  title: 'The Production Accountability Gap: Why Small Manufacturers Lose Margin Without a Capture System',
  metaDescription: 'Small manufacturers lose significant margin to untracked wastage, undocumented rework, and informal production records. This post examines the accountability gap and how digital capture systems close it.',
  cluster: 'Manufacturing Intelligence',
  pillar: 'Business Strategy',
  publishDate: '2026-05-18',
  readTime: 9,
  tldr: 'Most SME manufacturers track revenue but not production. The gap between what enters a facility and what leaves it — untracked wastage, informal output records, undocumented rework — is where margin quietly disappears. This post examines the accountability gap and how structured capture systems address it.',
  sections: [
    {
      heading: 'The accountability gap in SME manufacturing',
      level: 2,
      body: 'In large-scale manufacturing, every material movement is logged. Enterprise Resource Planning (ERP) systems like SAP and Oracle ensure that intake, production orders, and dispatch are formally documented at every stage. The cost of not documenting is well understood, and the infrastructure to prevent it is built into the operation.\n\nFor small and medium manufacturers, no such infrastructure exists by default. Production records are kept in notebooks, WhatsApp groups, or verbal handoffs between shifts. The accountability gap — the distance between what actually happened on the production floor and what the business formally knows happened — is often wide. And that gap costs money.',
    },
    {
      heading: 'How informal production tracking causes margin leakage',
      level: 2,
      body: 'Margin leakage in manufacturing is rarely a single large event. It accumulates through hundreds of small undocumented events: a batch that came out 8% under yield, a component that was damaged during assembly and quietly discarded, a dispatch that went out with three units fewer than the invoice stated.\n\nWithout a formal capture system, these events are invisible. They do not appear in any report. They cannot be attributed to a specific shift, batch, or staff member. Over time, the business develops a vague sense that margins are lower than they should be — but lacks the evidence to identify the cause or hold any process accountable.\n\nResearch on SME manufacturing in the UK and sub-Saharan Africa consistently finds that businesses without formal production records underestimate their wastage rates by 15–30%. The margin they believe they are running is not the margin they are actually running.',
    },
    {
      heading: 'Visual evidence and its role in production management',
      level: 2,
      body: 'The value of photographic evidence in production management extends beyond dispute resolution. In quality management literature, the principle of visual verification — documenting the state of materials at each production stage — is foundational to both ISO 9001 and lean manufacturing frameworks.\n\nA photograph of an incoming batch captures condition, quantity estimate, and timestamp in a way that a text log cannot. A photo of a finished output batch creates a contemporaneous record of quality at the point of production, not retrospectively. Wastage photography, specifically, creates accountability for disposal decisions that would otherwise go unrecorded.\n\nFor SME manufacturers without full ERP systems, photo-based capture provides a practical entry point into the same visual verification principles that underpin formal quality management systems.',
    },
    {
      heading: 'Approval workflows and lean principles for small businesses',
      level: 2,
      body: 'The approval workflow — where a capture submitted by a floor worker must be approved by a supervisor before it is formally recorded — mirrors a principle found throughout lean and ISO-aligned quality systems: no production event should be self-certified by the person who created it.\n\nIn lean manufacturing, this is the basis of the **jidoka** concept: the authority to stop and flag a process is separated from the authority to approve its output. In ISO 9001 terms, it reflects the requirement for independent verification of quality-related records.\n\nFor a small manufacturer with two or three staff on a shift, implementing a full quality management system is impractical. But implementing a two-step capture-and-approve workflow carries the same accountability logic at a fraction of the overhead.',
    },
    {
      heading: 'The cost of wastage without measurement',
      level: 3,
      body: 'Wastage is the most financially significant of the untracked events in SME manufacturing. A food producer who discards 12% of each batch but records none of it is running their costing model on fictional yield assumptions. An electronics assembler who quietly bins damaged components is understating their true cost per unit.\n\nThe problem compounds when wastage is seasonal or batch-specific. Without event-level records, there is no way to determine whether a high-wastage period was caused by a specific supplier batch, a particular machine setting, a new staff member, or a process change. Every potential improvement intervention is guesswork.\n\nMeasurement itself tends to reduce wastage. Studies of manufacturing SMEs that introduced formal wastage logging — even paper-based — consistently show a reduction in wastage rates within the first few months, attributed primarily to staff awareness and the social accountability of having their actions recorded.',
    },
    {
      heading: 'How digital capture systems close the loop',
      level: 2,
      body: 'A digital capture system does three things that paper logs and WhatsApp records cannot. First, it creates a timestamped, staff-attributed record that cannot be retrospectively altered. Second, it attaches photographic evidence to the event, providing context that a number alone cannot. Third, it makes the record queryable — enabling analysis by event type, staff member, date range, or batch.\n\nWhen every intake, output, wastage, and dispatch event is captured digitally with a photo and approved by a supervisor, the business gains a production record that reflects what actually happened — not what someone remembers happening. That record becomes the foundation for real costing, real yield analysis, and real improvement decisions.',
    },
    {
      heading: 'Real-world scenarios: food producer, electronics assembler, garment maker',
      level: 2,
      body: 'Consider three representative SME manufacturers and how the accountability gap manifests differently for each:\n\n**Food producer:** A small sauce and condiment manufacturer runs two production batches per day. Without a capture system, output quantities are estimated at the end of the shift. Wastage — burnt batches, broken jars, overfill losses — is not formally recorded. The business believes its yield is 91% but actual analysis would show closer to 84%. The 7% gap represents direct margin loss on every batch.\n\n**Electronics assembler:** A contract assembler handles component intake from multiple suppliers. Damaged components are discarded at the intake stage without formal recording. When a supplier dispute arises about a batch quality issue, there is no contemporaneous photographic evidence. The business absorbs the cost.\n\n**Garment maker:** A small garment producer tracks cutting waste informally. When material costs rise, the business assumes it is entirely due to fabric price increases — but untracked cutting waste has also increased due to a new pattern design. Without per-batch wastage records, the two causes are indistinguishable.',
    },
    {
      heading: 'How AskBiz Factory Captures addresses each scenario',
      level: 2,
      body: 'AskBiz Factory Captures is designed to close the accountability gap described in each of these scenarios without requiring ERP implementation or dedicated quality management staff.\n\nFor the food producer, output and wastage captures on every batch — approved by a supervisor — produce an accurate, event-level yield record within days. For the electronics assembler, intake captures with photos create a contemporaneous record of component condition at arrival that can be used in supplier disputes. For the garment maker, wastage captures tagged by batch and material type reveal whether cutting waste has increased and when.\n\nIn each case, the capture system converts informal, invisible production events into a formal, queryable record. The margin that was leaking silently becomes visible — and therefore manageable.',
    },
  ],
  paa: [
    { q: 'Why do small manufacturers lose margin without tracking production?', a: 'Without formal production records, wastage, yield losses, and undocumented rework go untracked. Businesses underestimate their true cost per unit and cannot identify the cause of margin deterioration.' },
    { q: 'What is the production accountability gap?', a: 'The production accountability gap is the difference between what actually happens on a production floor and what is formally recorded. It represents the untracked events — wastage, yield losses, rework — that cause margin leakage in SME manufacturing.' },
    { q: 'How does photo-based production logging improve accountability?', a: 'Photographs create a timestamped, contemporaneous record of production events that text logs cannot replicate. They provide context for quality decisions, support supplier disputes, and make wastage events harder to ignore.' },
    { q: 'Do I need ISO certification to implement a production capture system?', a: 'No. A structured capture-and-approve workflow carries the accountability logic of ISO and lean principles without requiring formal certification. AskBiz Factory Captures is designed for businesses that want accountability without the overhead of full quality management systems.' },
    { q: 'How much wastage do small manufacturers typically miss without a capture system?', a: 'Research on manufacturing SMEs suggests businesses without formal wastage records underestimate their wastage rates by 15–30%, meaning their actual cost per unit is significantly higher than their costing model assumes.' },
  ],
  cta: { heading: 'Close the production accountability gap', body: 'AskBiz Factory Captures gives every production event a photo, a timestamp, and a supervisor approval — turning your production floor into a formal, queryable record. Enable it in your POS settings today.' },
  relatedSlugs: ['factory-owner-ai-production-intelligence-2026', 'askbiz-factory-captures-launch', 'how-to-set-up-factory-captures-askbiz'],
},

{
  slug: 'how-to-set-up-factory-captures-askbiz',
  title: 'How to Set Up Factory Roles, Captures and Approvals in AskBiz POS',
  metaDescription: 'Step-by-step guide to enabling Factory Captures in AskBiz POS: adding staff with the right roles, logging in with a PIN, submitting photo captures, approving from the supervisor queue, and viewing the audit trail.',
  cluster: 'AskBiz Tutorials',
  pillar: 'How-To Guide',
  publishDate: '2026-05-18',
  readTime: 6,
  tldr: 'This guide walks through the complete Factory Captures setup: enabling the factory sector, assigning roles to staff, submitting a capture as a floor worker, approving it as a supervisor, and reviewing the audit trail in your admin panel.',
  sections: [
    {
      heading: 'Step 1 — Enable the factory sector and add staff',
      level: 2,
      body: 'Go to **Settings → Features → Sectors** in your AskBiz admin panel and toggle on **Factory**. This unlocks the factory-specific role permissions in your Staff tab.\n\nNext, go to **Settings → POS → Staff** and add your production floor staff. When assigning roles, use the permission flags to control what each person can do:\n\n- Floor workers who log **intake** events: assign `camera.intake`\n- Floor workers who log **output** events: assign `camera.output`\n- Staff who log **wastage**: assign `camera.wastage`\n- Staff who log **dispatch**: assign `camera.dispatch`\n- Supervisors who approve captures: assign `capture.approve`\n\nA single staff member can hold multiple camera permissions. Supervisors typically hold `capture.approve` plus any capture permissions relevant to their floor role.',
    },
    {
      heading: 'Step 2 — Staff login and the capture dashboard',
      level: 2,
      body: 'Staff do not use email login to access the production floor interface. They go to **pos.askbiz.co** on any phone, tablet, or shared device and enter their unique **4-digit PIN**.\n\nOnce logged in, the staff dashboard shows only the options their permissions allow. A floor worker with `camera.intake` and `camera.output` will see an **Intake** button and an **Output** button. A supervisor with `capture.approve` will also see the **Approvals** queue showing all pending captures for their facility.\n\nTo generate a PIN for a staff member, go to their profile in **Settings → POS → Staff** and tap **Generate PIN**. The PIN can be reset at any time from the same screen.',
    },
    {
      heading: 'Step 3 — Submitting a capture',
      level: 2,
      body: 'When a floor worker taps a capture button (for example, **Output**), they are walked through four steps:\n\n1. **Photo** — tap to take a photo using the device camera, or upload an existing image from the gallery. The photo is mandatory.\n2. **Type** — confirm the capture type (pre-selected based on the button they tapped, but can be changed).\n3. **Notes** — an optional text field for batch reference, quantity, or any other context.\n4. **Submit** — tap to send the capture to the pending queue.\n\nThe capture is immediately visible to supervisors in the approvals queue. The floor worker sees a confirmation with a pending status indicator. No further action is required from them unless a supervisor rejects the capture and requests a resubmission.',
    },
    {
      heading: 'Step 4 — Supervisor approval and rejection',
      level: 2,
      body: 'Supervisors see the **Approvals** tab when they log in at pos.askbiz.co. Each pending capture shows the photo, capture type, submitting staff member, timestamp, and any notes.\n\nTo **approve**: tap the capture and tap **Approve**. The capture is recorded in the audit trail immediately, tagged with the approving supervisor\'s ID and timestamp.\n\nTo **reject**: tap the capture and tap **Reject**. A reason field appears — this is mandatory. The rejection reason is recorded in the audit trail and the submitting floor worker is notified that a resubmission is needed.\n\nManagers can view all captures regardless of approval status and can override a rejected capture if needed from the admin panel.',
    },
    {
      heading: 'Step 5 — Viewing the audit trail',
      level: 2,
      body: 'Every capture submission, approval, and rejection is logged in your audit trail. To access it, go to your AskBiz admin panel at **askbiz.co/pos** and click the **Audit** tab.\n\nYou can filter the audit trail by:\n- **Event type** (intake, output, wastage, dispatch, or approval events)\n- **Staff member** (by name or PIN)\n- **Date range**\n- **Status** (approved, pending, rejected)\n\nEach audit entry shows the associated photo, the full chain of events (submission → approval or rejection), and the staff members involved. The audit trail cannot be edited or deleted — it is a permanent record of your production history.',
    },
    {
      heading: 'Tips for setting up approval workflows across shifts',
      level: 2,
      body: 'A few practical recommendations for running Factory Captures across multiple shifts:\n\n- **Assign at least one supervisor per shift** who holds `capture.approve`. Captures submitted during a shift should be approved before the shift closes to keep the pending queue manageable.\n- **Use the notes field for shift references**. Asking floor workers to include a shift code or batch number in notes makes the audit trail significantly easier to filter and analyse later.\n- **Review the audit trail at the start of each shift**. Managers reviewing the previous shift\'s captures before the new shift starts catch any rejected captures that need follow-up.\n- **Do not share PINs between staff members**. Each staff member\'s PIN uniquely identifies them in the audit trail. Shared PINs undermine the accountability the system is designed to create.',
    },
  ],
  paa: [
    { q: 'How do I enable Factory Captures in AskBiz POS?', a: 'Go to Settings → Features → Sectors in your AskBiz admin panel and toggle on Factory. Then assign factory role permissions (camera.intake, camera.output, etc.) to your staff from the Staff tab.' },
    { q: 'How do floor workers log in to submit a factory capture?', a: 'Floor workers go to pos.askbiz.co on any device and enter their unique 4-digit PIN. No email or password is required. The capture dashboard appears immediately after login.' },
    { q: 'What happens when a supervisor rejects a capture?', a: 'The supervisor must enter a mandatory rejection reason. The rejection is logged in the audit trail and the floor worker is notified to resubmit. The rejected capture remains in the audit trail for accountability.' },
    { q: 'Where can I view the factory capture audit trail?', a: 'Go to askbiz.co/pos in your admin panel and click the Audit tab. You can filter by event type, staff member, date range, and capture status.' },
  ],
  cta: { heading: 'Set up Factory Captures in minutes', body: 'Enable the factory sector, assign permissions to your staff, and your production floor is ready to start logging captures with photo evidence and supervisor approval. Start now in your AskBiz settings.' },
  relatedSlugs: ['askbiz-factory-captures-launch', 'production-accountability-gap-small-manufacturers', 'askbiz-pos-launch-built-in-point-of-sale'],
},

]
