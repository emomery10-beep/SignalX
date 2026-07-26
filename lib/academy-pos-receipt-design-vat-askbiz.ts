import type { AcademyArticle } from "./academy-types";

// The redesigned till receipt — image-based store-receipt look + dynamic VAT.
// Grounded directly in lib/whatsapp.ts (sendReceipt / sendReceiptImage) and
// app/api/pos/receipt/[id]/image/route.tsx, verified against the live code
// on 2026-07-25. Shipped across 782f5ec4 (image rendering), 3cb92510
// (image-first send with text fallback) and 997fd992 (visual redesign +
// dynamic VAT), all 2026-07-24/25.
export const academyPosReceiptDesignVat: AcademyArticle[] = [
  {
    slug: "pos-receipt-design-vat-askbiz",
    title: "AskBiz's Redesigned Till Receipt: Itemised Layout & Dynamic VAT",
    description:
      "The WhatsApp receipt AskBiz sends after a sale is now a real store-receipt-style image — torn edges, boxed total, decorative barcode — and its VAT line only appears for businesses that actually have a VAT number on file.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: [
      "receipt design",
      "till receipt",
      "WhatsApp receipt",
      "VAT receipt",
      "dynamic VAT",
      "AskBiz POS",
      "digital receipt",
      "receipt image",
    ],
    keyTakeaways: [
      "The receipt AskBiz sends over WhatsApp after a sale is now a rendered image styled like a real till receipt — Courier Prime monospace type, torn/perforated top and bottom edges, a boxed TOTAL, and a decorative barcode — not the plain text summary it used to be.",
      "A 'VAT Reg. No.' line and a 'VAT (rate%)' tax label only appear if your business has a VAT number saved in Settings. No VAT number on file means customers see a generic 'Tax' line instead — there's no separate on/off toggle, the number itself is the flag.",
      "AskBiz always tries to send the image first; if that fails for any reason it automatically falls back to a shorter text-summary message, with nothing for you to configure or retry.",
      "The image is generated fresh from the actual transaction every time it's fetched, so it's never a stale screenshot — and the fetch itself needs no login, because it's the unguessable transaction ID doing the gating.",
    ],
    content: [
      {
        heading: "What's changed",
        body: "When a customer's receipt goes out over WhatsApp after a sale, it used to arrive as a plain text message — a short line or two summarising the total, your business name, and the payment method. That still exists as a fallback, but it's no longer what most customers see. The primary receipt AskBiz sends now is an actual image, laid out and styled to look like a printed till receipt, with every line item, the subtotal, any discount, tax, and the final total shown exactly as a paper receipt would show them. Nothing on your side changes to get this — it's automatic on every sale where a receipt is sent.",
      },
      {
        heading: "What a redesigned receipt looks like",
        body: "The image is set in Courier Prime, a monospace typewriter-style font, which is most of what makes it read as a receipt rather than a generic message card. The top and bottom edges are drawn as a torn/perforated zigzag, the way a receipt looks when it's been torn off a roll. The TOTAL line sits inside its own bordered box near the bottom so it's the one figure that's impossible to miss. Underneath that is a decorative barcode — a row of vertical bars of varying height, generated deterministically from the transaction ID as a seed, so the same receipt always renders with the same bars if it's ever re-fetched. It isn't a real, scannable barcode; it's there for the visual effect of a genuine till receipt, with the receipt number printed underneath it in place of what a barcode would normally encode.",
      },
      {
        heading: "Everything printed on the receipt",
        body: "Reading top to bottom: your business name (in capitals), followed by the VAT registration line if you have one on file, then a receipt number — the first 8 characters of the transaction ID, dashes stripped and uppercased — alongside the date and time. Below that, 'Served by [cashier name]' appears on the left if the sale was rung up under a named cashier login, with the payment method shown in capitals on the right. Then the itemised lines: each product's name and full line total on one row, with the quantity and unit price ('2 x £4.50') printed underneath it. After the items comes the subtotal, a discount line only if a discount was actually applied to the sale, and a tax line only if the sale actually carried any tax — a zero-tax sale simply has no tax row at all. The boxed TOTAL closes it out, followed by the barcode, the receipt number again, and a thank-you line.",
      },
      {
        heading: "VAT is dynamic — it depends on your Settings",
        body: "The tax line isn't fixed to always say 'VAT' or always say 'Tax' — it changes per business, based on one thing: whether you have a VAT number saved under Settings. If you've entered one, the receipt shows a 'VAT Reg. No.' line right under your business name, and the tax line itself is labelled 'VAT', with the rate appended when every item on that sale shares a single tax rate (for example 'VAT (20%)'). If your items are taxed at mixed rates, it falls back to a plain 'VAT' label rather than guessing at one rate. If you don't have a VAT number on file, none of that appears — the receipt shows a generic 'Tax' line instead, with no registration line above the business name at all. There's no separate switch for this anywhere in AskBiz; the VAT number field itself is the only registration flag the system has, so adding or removing it in Settings is what turns the VAT-specific wording on the receipt on or off.",
      },
      {
        heading: "How AskBiz decides whether to send the image or fall back to text",
        body: "Every receipt send attempt starts by trying the image template. WhatsApp requires business message templates to be pre-approved by Meta before they can be used, and the image template's header isn't a fixed uploaded picture — it's a link back to AskBiz that Meta's own delivery servers fetch at the moment the message is actually sent, which is exactly why the receipt always reflects the real transaction rather than a cached image from earlier. If that image send fails for any reason — most commonly because the template is still sitting in Meta's review queue — AskBiz automatically retries with a separate, shorter approved text template instead, carrying just the total, business name, date, and payment method. You don't see this decision happen and there's nothing to configure: whichever one succeeds is what the customer gets, and once the image template is fully approved, sends succeed on the image attempt as a matter of course.",
      },
      {
        heading: "Why the receipt link needs no login",
        body: "Because it's Meta's servers — not your browser or your till — that fetch the receipt image at delivery time, that request can't carry an AskBiz login session with it; there's no user to authenticate. So the endpoint that generates the image is intentionally left open, and its only protection is that the transaction ID in the link is an unguessable UUID rather than a small sequential number — the same trust model AskBiz uses for every other link that's scoped to a single transaction. In practice this means the image link isn't something you'd want to forward around casually outside WhatsApp, since anyone who has the exact link can view that one receipt, but it's not something you need to do anything about — it's how the automatic send is designed to work.",
      },
    ],
    relatedSlugs: ["pos-receipts-askbiz", "pos-vat-calculations", "what-is-vat-registration"],
    faq: [
      {
        q: "Do I need to turn on the new receipt design somewhere in Settings?",
        a: "No — the image-style receipt is what AskBiz sends automatically on every WhatsApp receipt now. There's no toggle to find; if the image template send fails for any reason it falls back to a text summary on its own.",
      },
      {
        q: "Why does my receipt say 'Tax' instead of 'VAT'?",
        a: "The VAT wording only appears when your business has a VAT number saved under Settings — that field is the only VAT-registration flag AskBiz has. Add your VAT number there and both the 'VAT Reg. No.' line and the 'VAT' tax label will start appearing on receipts.",
      },
      {
        q: "Why does the VAT line sometimes just say 'VAT' with no percentage?",
        a: "AskBiz only prints a rate (like 'VAT (20%)') when every item on that particular sale shares one tax rate. If the sale mixes items taxed at different rates, it shows the plain 'VAT' label rather than picking one rate that wouldn't be accurate for the whole receipt.",
      },
      {
        q: "Is the barcode on the receipt something a customer could actually scan?",
        a: "No — it's decorative. The bars are generated from the transaction ID so the same receipt always looks the same if it's viewed again, but they don't encode anything a scanner could read. The real reference for a transaction is the receipt number printed above and below it.",
      },
      {
        q: "Can anyone with the receipt image link view someone else's receipt?",
        a: "The link isn't protected by a login — it can't be, since WhatsApp's own delivery servers fetch it, not a logged-in browser — but it is protected by the transaction ID being an unguessable UUID. Treat the link the way you'd treat any single-use reference number: fine as sent to the customer over WhatsApp, not something to publish or forward on elsewhere.",
      },
    ],
  },
];
