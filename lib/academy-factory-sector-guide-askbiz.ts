import { AcademyArticle } from "./academy-types";

export const academyFactorySectorGuideAskbiz: AcademyArticle[] = [
  {
    slug: "factory-sector-guide-askbiz",
    title: "Running a Factory in AskBiz: Batches, Quality, Downtime, Shifts & Waybills",
    description: "A full tour of AskBiz's Factory sector mode — the nine dedicated pages, the four camera capture stages, the five factory staff roles, and the 12 factory-type templates that pre-fill your process.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "Factory mode",
      "AskBiz",
      "manufacturing",
      "batch tracking",
      "quality control",
      "downtime",
      "shift",
      "waybill",
      "factory type",
      "production",
    ],
    keyTakeaways: [
      "Factory is one of six POS sector modes (alongside Retail, Restaurant, Repair, Salon and Logistics), with nine dedicated pages: Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff, and Approvals.",
      "Camera capture is split into four stages — intake, output, wastage, dispatch — each gated behind its own permission, so a role can be given only the stages it should actually photograph.",
      "Picking business type 'manufacturer' during onboarding (or later in admin settings) surfaces a factory-type picker with 12 templates covering oil pressing, water, milling, dairy, bakery, soap, poultry, coffee, fish smoking and more.",
      "Each template pre-fills stage guidance and a suggested recipe yield range for your process — the stages are shared, but yields vary hugely by product, from around 18% to 76% for the four oil-pressing seed types alone.",
      "Five factory-specific staff roles exist — line operator, quality inspector, shift supervisor, production manager, and inventory manager — each mapped to a distinct permission bucket rather than a generic cashier role.",
    ],
    content: [
      {
        heading: "Factory is a full sector mode, not a Retail add-on",
        body: "AskBiz POS has six sector modes: Retail, Restaurant, Repair, Salon, Factory, and Logistics. Retail is the default for most businesses, but if you're running a production business — pressing oil, milling grain, baking, bottling water, making soap — Factory mode replaces the retail-style Inventory/Sales/Customers menu with a set of pages built around batches, not individual sale transactions. You get to Factory mode from POS > Operations, where it appears as one of the sector pill buttons alongside the other five. Under the hood, Factory ships with nine dedicated pages: Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff, and Approvals. Each one covers a distinct part of running a production floor, and they're designed to be used together rather than in isolation — a batch record references the captures and quality checks that were taken during it, a shift record shows what happened on the floor during that window, and a waybill ties a dispatch capture to the paperwork that leaves with the goods."
      },
      {
        heading: "Capture: four stages, four separate permissions",
        body: "Capture is the camera-first entry point for everything that happens on the floor, and it's split into four distinct capture types: intake (photograph raw material as it arrives), output (photograph what a batch actually produced), wastage (photograph defects, spoilage or loss, with a reason required before it saves), and dispatch (photograph the outgoing batch, with a destination required before it saves). These aren't just four buttons on one screen — each stage is gated behind its own permission (camera.intake, camera.output, camera.wastage, camera.dispatch), so you can hand a junior line operator intake and output only, keep wastage and dispatch restricted to more senior staff, or give a security/logistics-focused role dispatch alone. That granularity is what lets you match camera access to who's actually meant to be photographing what, rather than an all-or-nothing camera permission."
      },
      {
        heading: "Batch, Quality, Downtime, Shift and Waybill",
        body: "Batch tracks a production run end to end — the intake and output captures tied to it, the recipe and expected yield it's measured against, and whether the actual result landed inside, above or below that range. Quality records inspection checks against a batch, so defects get logged against the specific run that produced them rather than as a vague note. Downtime logs stoppages — a machine fault, a power cut, a supply gap — so you can see where production time is actually being lost over a week or a month, not just guess at it. Shift is a dedicated production-shift record (deliberately kept separate from the existing cash-register till-shift table used elsewhere in POS, since a factory floor shift and a cashier's till session are different things measuring different work). Waybill generates the dispatch paperwork for outgoing goods, linked to the dispatch capture and destination notes entered at that stage. Production gives you the floor-level overview across all of the above, and Approvals is where a supervisor or manager signs off on captures, batches or waybills that need review before they're finalised."
      },
      {
        heading: "Five staff roles built for a factory floor, not a shop till",
        body: "Factory mode comes with five dedicated staff roles, each mapped to its own underlying permission bucket rather than reused from retail: factory-line-operator, factory-quality-inspector, factory-shift-supervisor, factory-production-manager, and factory-inventory-manager. A line operator is scoped to the day-to-day capture and batch work on the floor; a quality inspector gets the checks and defect-logging tools; a shift supervisor oversees a shift and approves what happened during it; a production manager and inventory manager get broader visibility across batches, recipes and stock. Assigning the right role matters for more than tidiness — it's what determines which camera stages and which Factory pages a given staff member can actually open when they sign in with their PIN."
      },
      {
        heading: "Twelve factory-type templates — one process shape, very different yields",
        body: "When you set business type to 'manufacturer' during onboarding — or change it later in admin settings — AskBiz surfaces a factory-type picker with 12 templates: Cooking Oil Pressing (sesame, groundnut, sunflower or palm), Packaged Drinking Water, Maize Milling, Cassava Processing, Rice Milling, Dairy, Bakery, Soap, Concrete Blocks, Poultry, Coffee, and Fish Smoking. Picking one pre-fills stage guidance for your specific process — for example, the oil-pressing template walks through intake, cleaning/roasting, pressing, filtering/bottling, and dispatch — plus a suggested recipe with an expected yield percentage and a realistic min/max range, so you're not starting your yield tracking from a blank table. The stages are largely shared across a given template family, but the yields are not: oil-pressing alone spans roughly 18% to 76% depending on which of the four seed types you're running and whether it was roasted first, which is exactly why the template keeps a separate recipe row per seed rather than one blended number. You can accept a template's suggested figures as a starting point and adjust them once your own batches show a different real-world ratio."
      },
      {
        heading: "What changed recently, and why it matters if you set this up a while ago",
        body: "If you configured Factory mode before late July 2026, it's worth knowing that only Capture and Approvals were actually functional in production up to that point — Batch, Quality, Downtime, Shift and Waybill had fully built front-end pages, but the API routes behind them didn't exist yet, so anything entered there wasn't being saved. A fix shipped alongside the 12 factory-type templates, building out all five missing backends and their database tables. The same fix also corrected a permission bug where factory-line-operator had been resolving to zero camera permissions instead of the intake/output access it was meant to have, so any line operator role assigned before the fix should be double-checked in Staff to confirm they can now actually open the camera. If your team has been using Batch, Quality, Downtime, Shift or Waybill and finding nothing saved, that's the explanation — and it's resolved now, so it's worth going back in and re-entering anything you tried to log during that window."
      }
    ],
    relatedSlugs: ["pos-operations-retail-askbiz", "pos-staff-management-askbiz", "purchase-orders-guide-askbiz"],
    faq: [
      {
        q: "How do I switch my business to Factory mode?",
        a: "In POS > Operations, click the Factory pill alongside the other five sector modes. If you're setting up a new account, choosing business type 'manufacturer' during onboarding also surfaces the factory-type picker directly; you can change the factory type later from admin settings."
      },
      {
        q: "What's the difference between the Batch page and the Capture page?",
        a: "Capture is where you take the actual photo for a specific moment — intake, output, wastage or dispatch. Batch is the record that ties those captures together for one production run, alongside the recipe it's measured against and whether the yield came in on target."
      },
      {
        q: "Why can't one of my staff members use the camera in Factory mode?",
        a: "Camera access in Factory mode is split into four separate permissions — intake, output, wastage, dispatch — and each staff role only gets the ones it's supposed to have. Check their assigned role in Factory > Staff; if they're on factory-line-operator and were set up before the July 2026 permission fix, re-check that they now have camera.intake and camera.output as expected."
      },
      {
        q: "Do the 12 factory-type templates lock me into a fixed process?",
        a: "No. A template pre-fills stage guidance and a starting recipe with an expected yield range, but every field is editable. Once you've run a few real batches and know your actual yield, update the recipe to match — the template is a starting point, not a constraint."
      },
      {
        q: "My factory does something that isn't in the 12 templates — can I still use Factory mode?",
        a: "Yes. The 12 templates are convenience presets for common African manufacturing sectors, not a requirement. You can use Factory mode's Capture, Batch, Quality, Downtime, Shift, Waybill, Production, Staff and Approvals pages without picking a template — you'll just be entering your own stage names and recipe figures from scratch instead of starting from pre-filled ones."
      }
    ]
  }
];
