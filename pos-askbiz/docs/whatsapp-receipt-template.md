# WhatsApp payment receipt — v2 template

Built 2026-08-09. Covers two things: why the receipt customers actually see
looks so bare, and why "advertise here" isn't going on it.

## Why the current receipt looks basic

The receipt is a **Meta-approved WhatsApp Cloud API template** (`askbiz_receipt`,
Utility, approved 2026-07-24) — its text lives in Meta Business Manager, not
in this repo. The code only fills in 4 blanks: amount, business name, date,
payment method. That's the whole message.

There's already a much nicer, genuinely realistic itemised receipt built —
[`app/api/pos/receipt/[id]/image/route.tsx`](../app/api/pos/receipt/[id]/image/route.tsx):
torn-paper zigzag edges, VAT reg. number, cashier name, itemised lines with
qty × unit price, subtotal/discount/tax, a boxed total, a barcode-style
flourish and receipt number. **It just never reaches customers** — it was
wired up as the WhatsApp template's *image header*, and Meta started
returning 200 OK on that send while silently failing to deliver the message
(disabled live 2026-07-27, see the comment block above `sendReceiptImage` in
`lib/whatsapp.ts`).

Fix in this change: stop trying to attach the image as media. Link to it
instead. A plain URL substituted into a template body parameter still
renders as a normal tappable WhatsApp link — far more reliable than a media
header, and it's how most real "view your invoice/receipt" WhatsApp flows
work anyway (delivery trackers, hotel folios, etc.).

I also added the shop's address/phone to the image receipt (`profiles.address`,
`.town`, `.phone` — already collected in Settings for parcel quotes/logistics,
just not shown on the receipt before) so it reads like a real shop header.

## "Advertise on here" — does not comply, not built

Checked against Meta's WhatsApp Business Messaging Policy and template
categorization rules before building anything. Short answer: **selling this
receipt's footer as paid ad space — for AskBiz's own cross-sell, or worse,
for unrelated third-party businesses — would very likely get the template
rejected or forcibly reclassified, and I didn't build it.**

Why:

- `askbiz_receipt` is, and needs to stay, a **Utility** template. Meta's
  rule: utility templates "must be non-promotional, not containing any
  promotional or persuasive intent," and specifically **"should not
  promote, recommend, upsell, or cross-sell products; include offers."**
  An ad slot — anyone's ad — is exactly that.
- Since April 2025, Meta doesn't just reject non-compliant utility
  templates on submission; it **auto-reclassifies them to Marketing**
  after the fact if promotional content slips through. Marketing messages
  cost substantially more per send and legally require the *recipient* to
  have opted into marketing (not just the transaction itself) — most
  people getting a cash-sale receipt haven't done that.
- **Every merchant on this platform sends receipts through one shared
  `META_PHONE_NUMBER_ID`.** A spam/quality problem on this template — and
  a stranger's ad on a stranger's receipt is a textbook spam complaint —
  risks WhatsApp Business Account quality restrictions for *all* shops
  using AskBiz POS, not just the one whose customer complained.
- There's also no Meta product for this: WhatsApp's ad surface is
  Click-to-WhatsApp ads (ads that *open* a chat), not a marketplace for
  inserting third-party ads into outbound business messages. This isn't a
  "your policy is stricter than it needs to be" situation — the feature
  as described doesn't have a compliant version of itself on this specific
  surface.

Sources: [Meta template categorization guidelines](https://developers.facebook.com/docs/whatsapp/updates-to-pricing/new-template-guidelines/),
[WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/).

### If ad/sponsorship revenue is still wanted

Not built (separate feature, separate decision) — but these are the
compliant places for it, cheapest/lowest-risk first:

1. **Sponsored placement inside the AskBiz POS dashboard itself** (e.g. the
   supplier picker in Purchase Orders, an admin-side marketplace tab) — not
   a WhatsApp message at all, so none of the above applies.
2. **A genuinely separate, Marketing-category WhatsApp template**, sent
   only to customers with `pos_customer_preferences.allow_whatsapp_marketing
   = true` (that opt-out check already exists — `isCustomerOptedOut()` in
   `receipt/route.ts`) — as its own message, not appended to the receipt,
   correctly priced and categorised as Marketing from the start.
3. Lowest priority / most legally fiddly: sponsor content on the *linked*
   itemised receipt page — it's a web page AskBiz controls rather than a
   WhatsApp message body, but it's still reached from a business message
   about someone's specific purchase, so I'd want to re-check this
   specifically (and probably get a straight answer from Meta support)
   before treating it as safe.

## v2 template — submit this in WhatsApp Manager

business.facebook.com → WhatsApp Manager → Message Templates → Create Template.

| Field | Value |
|---|---|
| Name | `askbiz_receipt_v2` |
| Category | **Utility** (do not let the picker default to Marketing) |
| Language | English (UK) — `en_GB`, matching `META_TEMPLATE_LANG` |

**Header** (Text):
```
🧾 Payment Receipt
```

**Body:**
```
*{{1}}*
Receipt No. {{2}}
{{3}}

Amount paid: *{{4}}*
Payment method: {{5}}

🧾 Full itemised receipt:
{{6}}

Thank you for your business!
```

Sample values Meta will ask for during submission:

| Var | Meaning | Example |
|---|---|---|
| `{{1}}` | Business name | `Shujaac Oil` |
| `{{2}}` | Receipt number | `8F3A9C21` |
| `{{3}}` | Date/time | `9 Aug 2026, 18:39` |
| `{{4}}` | Amount paid | `KSh100.00` |
| `{{5}}` | Payment method | `Cash` |
| `{{6}}` | Link to itemised receipt | `https://pos.askbiz.co/api/pos/receipt/1234.../image` |

**Footer:**
```
Powered by AskBiz
```

No buttons needed — the link in the body renders as a normal tappable blue
link. (If a Meta reviewer pushes back and wants a structured button instead
of a body-text link, that's a same-day follow-up: add a dynamic URL button
with the transaction id as a query-string suffix, since Meta only allows the
variable at the very end of a button URL — ask if that comes up.)

### What the customer will see

```
🧾 Payment Receipt

Shujaac Oil
Receipt No. 8F3A9C21
9 Aug 2026, 18:39

Amount paid: KSh100.00
Payment method: Cash

🧾 Full itemised receipt:
https://pos.askbiz.co/api/pos/receipt/.../image

Thank you for your business!
Powered by AskBiz
```

...and tapping the link opens the full itemised, torn-edge shop receipt
(business name, address, phone, VAT no., every line item, subtotal,
discount, tax, total, barcode flourish).

## Rollout (safe — won't touch live receipts until you flip it)

`sendReceipt()` in `lib/whatsapp.ts` still sends the **original 4-param
body to `askbiz_receipt`** by default. It only switches to the 6-param v2
body when you explicitly set:

```bash
META_RECEIPT_TEMPLATE=askbiz_receipt_v2
META_RECEIPT_TEMPLATE_VERSION=2
```

Don't set these until Meta has actually approved `askbiz_receipt_v2` —
sending the wrong param count to a template fails the send outright. Once
approved, flip both env vars in Vercel; rolling back is just unsetting
`META_RECEIPT_TEMPLATE_VERSION` (or pointing `META_RECEIPT_TEMPLATE` back at
`askbiz_receipt`).

## Known gap: root app has a separate, older copy

`/Users/lee/Desktop/vercel-deploy/app/api/pos/receipt/route.ts` and
`lib/whatsapp.ts` (root app, not `pos-askbiz`) are a near-duplicate that
still attempts the broken image-header send and were **not** touched by this
change — I don't know if that app's `/sell` page is still live for any
merchant. Worth confirming; if it is, it needs the same v2 wiring or it'll
keep sending the bare 4-line receipt (and keep drifting from this copy the
way the two files already have once before).
