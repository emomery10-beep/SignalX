import { AcademyArticle } from "./academy-types";

export const ASKBIZ_TRAINING_ARTICLES: AcademyArticle[] = [
  {
    slug: "getting-started-askbiz",
    title: "Getting Started with AskBiz",
    description: "Your first steps with AskBiz — creating an account, logging in, and understanding the main dashboard.",
    category: "Getting Started",
    categorySlug: "getting-started",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["getting started", "login", "account", "dashboard", "AskBiz", "first steps"],
    keyTakeaways: [
      "Create your AskBiz account with your email and set a secure password.",
      "Log in to access your main dashboard and navigate using the top navigation bar.",
      "The dashboard shows your business overview at a glance — revenue, sales, key metrics."
    ],
    content: [
      {
        heading: "Creating Your AskBiz Account",
        body: "Visit askbiz.co and click 'Sign Up'. Enter your business email, create a strong password (mix of uppercase, lowercase, numbers, and symbols), and verify your email address. Once verified, you'll be able to log in and start setting up your business profile."
      },
      {
        heading: "Logging In and First Login Steps",
        body: "Use your email and password to log in. On your first login, AskBiz will guide you through a quick setup wizard: select your business type (Retail, Restaurant, Repair, Salon, Factory, or Logistics), add your business name and location, and invite team members. You can skip any step and complete setup later — just click 'Dashboard' to get started."
      },
      {
        heading: "Understanding Your Main Dashboard",
        body: "Your dashboard is your command center. At the top are navigation tabs: POS (for sales transactions), Operations (for inventory and staffing), Intelligence (for analytics and reporting), and Settings. Each section has sub-tabs for specific features. The main area shows key business metrics — your revenue, sales count, top products, and staff performance. Use the date filters to compare different time periods."
      },
      {
        heading: "Navigating the Top Menu",
        body: "The top navigation bar is consistent across all AskBiz pages. On the left: your business name and logo. In the center: main tabs (POS, Operations, Intelligence, Settings). On the right: notifications bell, help icon, and profile menu. Click the help icon anytime to search for articles or get support. Your profile menu lets you change settings, invite team members, and log out."
      }
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "pos-open-till-askbiz"],
    faq: [
      { q: "What if I forget my password?", a: "Click 'Forgot password' on the login page. Enter your email and you'll receive a reset link. Follow the link to set a new password." },
      { q: "Can I change my business type later?", a: "Yes. Go to Settings > Business Profile and update your business type. AskBiz will adjust its recommendations and features to match." },
      { q: "How do I invite team members?", a: "In Settings, click 'Team'. Click 'Add member', enter their email, select their role (Admin, Manager, Cashier, Viewer), and send the invite. They'll receive an email to accept and set their password." }
    ]
  },
  {
    slug: "camera-first-basics-askbiz",
    title: "How AskBiz Camera-First Works",
    description: "Understanding AskBiz's unique camera-first approach — point your phone, AI recognizes products, and instantly add to cart or complete transactions.",
    category: "Getting Started",
    categorySlug: "getting-started",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["camera-first", "point camera", "AI", "recognition", "product identification", "AskBiz"],
    keyTakeaways: [
      "Camera-first means you start by pointing your phone at a product — no barcodes required.",
      "AskBiz AI instantly recognizes the product and pulls up its name, price, and details.",
      "This works for any product: retail items, dishes in a restaurant, devices for repair, supplies in a factory."
    ],
    content: [
      {
        heading: "What is Camera-First?",
        body: "Traditional systems require you to manually enter product codes, scan barcodes, or search for items. AskBiz does it differently: you simply point your phone camera at a product, and AI instantly recognizes it. No typing. No searching. Just point and add. This is especially powerful in fast-paced environments like retail, restaurants, and repair shops where every second counts."
      },
      {
        heading: "How to Use Camera-First in POS",
        body: "Open the POS screen on your device. You'll see a camera icon. Tap it to open your camera. Point at a product — a shelf item, a dish on the table, or a device to be repaired. Hold steady for a moment. AskBiz AI recognizes the product and displays its name, price, and description. Tap 'Add to cart' and the item is added instantly. Repeat for each item in the transaction. When done, proceed to payment."
      },
      {
        heading: "Works with Your Existing Inventory",
        body: "Camera-first doesn't require you to change anything about your stock. AskBiz matches what it sees to your existing inventory database. So if you already have products set up in AskBiz (which you upload during setup), camera-first immediately recognizes them. No new setup needed. Just point and sell."
      },
      {
        heading: "When Manual Entry Still Works",
        body: "If lighting is poor, the product isn't immediately visible, or you prefer manual entry, you can still search for products by name or barcode. But in most cases — busy retail stores, restaurant counters, repair queues — camera-first is faster and reduces errors. It also prevents missed upsells because AskBiz shows related products and suggestions as you add items."
      }
    ],
    relatedSlugs: ["getting-started-askbiz", "pos-overview-dashboard-askbiz"],
    faq: [
      { q: "Does camera-first work if my lighting is bad?", a: "It works best in clear, natural light. If lighting is poor, you can fall back to barcode scanning or manual search by name. We're always improving recognition accuracy." },
      { q: "What if AskBiz misidentifies a product?", a: "Tap 'Wrong product' and search manually by name. AskBiz learns from corrections, so it improves over time. You can also pre-load your menu or inventory for 100% accuracy." },
      { q: "Is camera-first slower than scanning barcodes?", a: "No — it's usually faster. Most products are recognized instantly. And since you don't need barcodes on every item, you save setup time and barcode printing costs." }
    ]
  },
  {
    slug: "settings-and-team-askbiz",
    title: "Business Settings and Team Management",
    description: "Setting up your business profile, inviting team members, assigning roles, and managing permissions in AskBiz.",
    category: "Getting Started",
    categorySlug: "getting-started",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["settings", "team", "roles", "permissions", "admin", "staff", "AskBiz"],
    keyTakeaways: [
      "Visit Settings to manage your business profile, location details, and payment methods.",
      "Invite team members from the Team tab and assign roles based on their responsibilities.",
      "Roles (Admin, Manager, Cashier, Viewer) control what each person can see and do in AskBiz."
    ],
    content: [
      {
        heading: "Accessing Business Settings",
        body: "Click Settings in the top navigation bar. You'll see tabs for Business Profile, Location, Payment, Security, and Team. Business Profile is where you update your business name, type, description, and logo. Location tab lets you add multiple store locations and manage settings per location. Payment tab connects your payment processor for credit card and digital wallet processing."
      },
      {
        heading: "Inviting Team Members",
        body: "Go to Settings > Team. Click 'Add member'. Enter their email address, select their role (see role guide below), and click 'Send invite'. They'll receive an email with a link to create their password and log in. Once they join, they can start using AskBiz immediately with access appropriate to their role."
      },
      {
        heading: "Understanding Team Roles",
        body: "Admin: Full access to all features, settings, and team management. Ideal for owners and general managers. Manager: Can access POS, Operations, and Intelligence, but not Settings or team management. Good for shift supervisors. Cashier: Access to POS only — can process sales and refunds but can't access inventory, analytics, or settings. Viewer: Read-only access to dashboards and reports for stakeholders or consultants."
      },
      {
        heading: "Managing Permissions and Access",
        body: "Admins can edit or remove team members at any time. Click a team member's name in the Team tab to change their role or permissions. You can deactivate a member temporarily (they can't log in, but data is preserved) or remove them permanently. Each action is logged in the Audit log for security and compliance tracking."
      }
    ],
    relatedSlugs: ["getting-started-askbiz"],
    faq: [
      { q: "Can I change a team member's role later?", a: "Yes. Go to Settings > Team, click the member's name, and update their role. The change takes effect immediately on their next login." },
      { q: "What happens if a team member leaves?", a: "Deactivate them so they can no longer log in. Their sales history and data remain in your reports. Admins can reactivate them later if needed." },
      { q: "How many team members can I add?", a: "You can add unlimited team members. Each gets their own login and activity log, so you can track who did what in your business." }
    ]
  }
];
