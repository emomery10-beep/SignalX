import type { AcademyArticle } from "./academy-types";

// Purchase Orders — create/send/receive supplier orders (retail ops tile).
// Grounded directly in components/pos/PurchaseOrdersTab.tsx, the
// /api/pos/purchase-orders* routes, and lib/pos-permissions.ts — verified
// against the live code on 2026-07-25, not guessed from the feature name.
export const academyPurchaseOrdersGuide: AcademyArticle[] = [
  {
    slug: "purchase-orders-guide-askbiz",
    title: "Purchase Orders: Create, Send & Receive Supplier Orders in AskBiz POS",
    description:
      "How the Purchase Orders tile in POS > Operations actually works — building an order with auto-suggested reorder quantities, sending it to your supplier over WhatsApp, and receiving stock (including part-deliveries) without touching a spreadsheet.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: [
      "purchase orders",
      "supplier orders",
      "restock",
      "reorder",
      "POS",
      "AskBiz",
      "inventory",
      "back order",
      "WhatsApp supplier",
      "receive stock",
    ],
    keyTakeaways: [
      "Purchase Orders lives in POS > Operations > Retail, opened via the 📋 tile — it's a dedicated tab, not a popup bolted onto Inventory.",
      "Starting a new order auto-prefills every product at or below its low-stock threshold, with a suggested quantity that tops it back up to double the threshold and the product's last recorded cost price — you can still edit or remove any line, or add products manually.",
      "Sending a PO messages your supplier's WhatsApp number with an itemised order; if the automated template isn't available it falls back to a pre-filled wa.me link you tap to send yourself. A supplier with no phone number on file can't be sent to at all.",
      "Receiving stock is done per line, so part-deliveries are normal: an order becomes 'Partial' the moment any line is short, and only flips to 'Received' once every line is fully in.",
      "What you can do depends on your POS role — Owner and Manager have full access, Inventory can create and receive but not send, and Supervisor/Branch Manager can only view.",
    ],
    content: [
      {
        heading: "Where to find it",
        body: "Purchase Orders is a tile inside POS > Operations, in the Retail sector — look for the 📋 icon. Tapping it opens a dedicated Purchase Orders tab with its own list, filters (All / Backorders / Received), and a '+ New order' button in the top right. If your restock workflow has, until now, meant messaging a supplier from your own phone and hoping you remembered every item, this is the tool that replaces that habit — it lives inside the same app you already use to sell, so there's nothing separate to log into.",
      },
      {
        heading: "Starting a new order",
        body: "Tap '+ New order' and you'll be asked for a supplier first — pick an existing one from the dropdown, or add a new one on the spot with just a name and a phone number. The phone number matters: it's what the WhatsApp send step uses later, and without one, that order can't be sent, only created and tracked manually.\n\nBelow the supplier, the item list opens already populated: AskBiz looks at every product currently at or below its low-stock threshold and adds it as a line, with a suggested order quantity calculated to bring stock back up to roughly double that threshold, and a unit cost pulled from the product's last recorded cost price. You don't have to accept any of this — edit the quantity or cost on any line, delete lines you don't want, or use the 'Add product' dropdown underneath to pull in anything else from your catalogue that wasn't low on stock. A running total updates as you go, and a notes field at the bottom is a good place for delivery instructions or a reference number your supplier expects.",
      },
      {
        heading: "The five order statuses",
        body: "Every order sits in one of five states, shown as a coloured pill on its card: Draft (created but not sent yet), Ordered (sent to the supplier, nothing received), Partial, Received, or Cancelled. Partial is worth understanding on its own — it isn't a separate action you choose, it's what an order becomes automatically the instant you've received some but not all of what you ordered. If you order 50 units of something and 30 arrive today with the rest coming next week, the order moves to Partial the moment you log those 30, and stays there — showing exactly what's still outstanding — until the remaining 20 come in and it flips to Received on its own. The Backorders filter at the top of the list is just every order currently sitting in Partial, so you can see at a glance what deliveries are still owed to you.",
      },
      {
        heading: "Sending an order to your supplier",
        body: "Open any Draft or Ordered order and tap Send (it reads Resend once an order has already gone out once). AskBiz builds an itemised message — each line as \"item x quantity @ cost\", the total, and your notes if you added any — and tries to deliver it as an automated WhatsApp template message straight to the supplier's number. If that automated path isn't available, it falls back to opening a pre-filled wa.me link in a new tab with the same message already typed in, so you just hit send yourself in WhatsApp. Either way, a Draft order moves to Ordered the first time it's sent, and the send timestamp is refreshed on every subsequent send. If the supplier record has no phone number, the Send button is disabled and a hint tells you to add one — there's no way around needing a number.",
      },
      {
        heading: "Receiving stock",
        body: "When goods arrive, open the order and tap 'Receive stock'. You'll see every line with an input already defaulted to its full outstanding quantity (what's ordered minus what's already been received on that line) — lines that are already fully received are greyed out and can't take more. Adjust any quantity down if only part of that line showed up, then confirm.\n\nConfirming is what actually moves stock: each line atomically increments that product's live stock count in your inventory (the same figure your till and Overview screen read from), and the order's status is recalculated from the fresh numbers — Received if every line is now fully in, Partial if some lines are still short, unchanged otherwise. You can come back and receive against the same order more than once as a delivery arrives in stages; each receipt only asks about what's still outstanding.",
      },
      {
        heading: "Who can do what",
        body: "Purchase order actions are permission-gated by POS role, not a single all-or-nothing toggle. Owner and Manager can view, create, send, receive, and mark orders paid. The Inventory role can create and receive orders (and mark them paid) but cannot send them — sending is deliberately left to management. Supervisor and Branch Manager roles can view orders and their status but can't create, send, or receive against them. If a button looks disabled or a person tells you they can't see the Send option, check their assigned role before assuming something's broken.",
      },
    ],
    relatedSlugs: [
      "pos-inventory-management-askbiz",
      "pos-stock-alerts-askbiz",
      "pos-hack-reorder-alerts-askbiz",
    ],
    faq: [
      {
        q: "Why did AskBiz already add items to my new purchase order before I typed anything?",
        a: "The create form auto-prefills every product currently at or below its low-stock threshold, with a suggested quantity that tops it back up to roughly double that threshold and the last cost price on file. It's a starting point, not a final order — edit, remove, or add lines freely before saving.",
      },
      {
        q: "What does 'Partial' actually mean on an order?",
        a: "It means a back-order: some but not all of the ordered quantity has arrived. It's set automatically the moment you receive any amount less than the full outstanding quantity on at least one line, and the order stays Partial until every line is fully received.",
      },
      {
        q: "Can I send a purchase order without a supplier phone number?",
        a: "No. Sending delivers the order as a WhatsApp message (or a pre-filled WhatsApp link as a fallback), so a supplier needs a phone number on file before you can send to them. You can still create and track the order without one — you just can't send it until a number is added.",
      },
      {
        q: "If I receive part of an order today, can I receive the rest later?",
        a: "Yes. Each receipt only asks about quantities still outstanding, and you can open the same order and receive against it again as later deliveries arrive. Stock is added incrementally each time — nothing is undone or overwritten between receipts.",
      },
      {
        q: "Which staff roles can send a purchase order to a supplier?",
        a: "Only Owner and Manager can send. Inventory-role staff can create and receive orders but not send them, and Supervisor/Branch Manager roles can only view orders, not act on them.",
      },
    ],
  },
];
