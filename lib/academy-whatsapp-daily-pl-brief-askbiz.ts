import type { AcademyArticle } from "./academy-types";

export const academyWhatsappDailyPlBrief: AcademyArticle[] = [
  {
    slug: "whatsapp-daily-pl-brief-askbiz",
    title: "Your Daily Brief Now Arrives as a WhatsApp P&L Report",
    description:
      "AskBiz's automatic daily message now lands in WhatsApp as a real sales, profit, and loss report for the last 24 hours and last 7 days — here's how to turn it on and what the numbers mean.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: [
      "WhatsApp daily brief",
      "WhatsApp P&L report",
      "AskBiz notifications",
      "profit and loss",
      "daily sales report",
      "POS daily brief",
      "WhatsApp notifications settings",
    ],
    keyTakeaways: [
      "Turn it on in Settings > Notifications, under Channels, by toggling WhatsApp on — a phone number field only appears once the toggle is enabled.",
      "It's sent automatically once a day, and only to POS-enabled accounts that have WhatsApp notifications on with a number saved. Email-only accounts don't receive it.",
      "Each message reports sales, profit (sales minus the real line-item cost of the goods sold), and losses from refunds — for both the last 24 hours and the last 7 days — plus a link back to askbiz.co/home.",
      "Losses count refunds by when the refund was processed, not when the original sale happened — refunding an old sale today adds to today's loss figure.",
      "This replaced the previous email version of the automatic daily message for WhatsApp-opted-in accounts. Your in-app Daily Brief — with its health score, anomalies, and suggested action — is a separate feature and still works exactly as before.",
    ],
    content: [
      {
        heading: "What actually changed",
        body: "AskBiz used to send an automatic morning email built around three AI-generated lines — something that improved, something that needed attention, and a suggested action for the day. That email has been retired for accounts that opt into WhatsApp. In its place, a daily cron job now sends a plain-English P&L report straight to WhatsApp: real sales, real profit, and real losses, pulled directly from your transaction data rather than summarised into a narrative. No AI interpretation, no jargon — just the numbers for the last 24 hours and the last 7 days, formatted in your account's currency. The old version tried to tell you what mattered; this version just gives you the figures and lets you decide.",
      },
      {
        heading: "Turning it on",
        body: "Go to Settings > Notifications in AskBiz and find the Channels section. There are two toggles here: Email Alerts and WhatsApp. Flip the WhatsApp toggle on, and a phone number field appears immediately below it — this field is hidden until you enable the toggle, so if you don't see anywhere to enter a number, check that the toggle itself is on first. Enter your WhatsApp number in international format (for example +254 700 000000) and save. That's the whole setup — there's no separate opt-in step or confirmation message to approve, and no waiting period before the first message can go out. If you later turn the toggle back off, the number field disappears again, but your saved number isn't sent anything further until you switch it back on.",
      },
      {
        heading: "Who actually receives it",
        body: "The daily send is gated more tightly than it might look. It only goes to accounts where POS is enabled — if you use AskBiz purely for connected sources like Shopify or bank feeds without POS switched on, this particular message isn't sent to you, regardless of your notification settings. On top of that, you need both the WhatsApp toggle on and a saved number; having only one of the two means you're skipped, and the cron simply moves on to the next account without generating anything for you. And it's strictly once per business per day — if a brief has already been generated for your account for today's date, the cron won't generate or send a second one, even if you check again later that day. There's no manual 'send now' option either; the message only ever goes out on its own schedule.",
      },
      {
        heading: "How sales, profit, and losses are calculated",
        body: "Sales is the total of your completed POS transactions in the window — pending card or mobile money payments that haven't confirmed yet aren't counted until they do. Profit isn't a rough margin estimate — it's sales minus the actual cost of goods sold, calculated line item by line item from the quantity and cost price recorded on each sold product, then summed across the window. Losses represent the value of refunded line items, not just a count of refund events, and they're pulled from a separate set of transactions — anything marked refunded or partially refunded. This is where the logic is easy to misread: losses are attributed to the day the refund was processed, not the day the original sale took place. If a customer bought something three weeks ago and you process the refund this morning, that refund's full value lands in today's loss figure — it doesn't retroactively adjust the day of the original sale. Over a 7-day window this rarely causes confusion, but it's worth knowing if you ever see a 24-hour loss figure that looks disconnected from that day's actual trading.",
      },
      {
        heading: "What you'll see, and what it links to",
        body: "The message itself is a short WhatsApp text: your business name at the top, then Sales, Profit, and Losses for the last 24 hours, followed by the same three figures for the last 7 days, and a link to askbiz.co/home at the bottom. Because it's a plain WhatsApp message, the numbers themselves are readable the moment it lands — no app to open, no login needed just to see them. The link is a shortcut back into AskBiz if you want to dig further into a number; opening it will still ask you to sign in the same way any other AskBiz link would.",
      },
      {
        heading: "What this doesn't replace",
        body: "It's worth being clear about the boundary here. The WhatsApp report is a separate feature from your in-app Daily Brief — the one with a Business Health Score, anomaly flags, and a suggested action, available whenever you open AskBiz. That endpoint and its data weren't touched by this change and keep working independently of whether you have WhatsApp notifications on. What did change is the automatic push: the old email narrative that used to arrive unprompted each morning is gone for WhatsApp-opted-in accounts, replaced by this more literal P&L message. If you want the health score and action-item style summary, that still lives inside the app — it just isn't what gets pushed to your phone automatically anymore.",
      },
    ],
    relatedSlugs: ["pos-daily-brief-askbiz", "what-is-a-daily-brief", "pos-whatsapp-receipts"],
    faq: [
      {
        q: "I don't use AskBiz POS — will I get this WhatsApp message?",
        a: "No. The daily send only goes to accounts with POS enabled, because the sales, profit, and loss figures are calculated from POS transaction and refund data. If you only use AskBiz for connected sources like Shopify or a bank feed, this specific message isn't sent to you.",
      },
      {
        q: "I already have Email Alerts turned on — do I need to do anything else?",
        a: "Yes. Email Alerts and WhatsApp are separate toggles in Settings > Notifications, and only the WhatsApp toggle (plus a saved number) triggers this daily message. Having Email Alerts on by itself doesn't enable it.",
      },
      {
        q: "Why does a loss on today's message come from a sale I made weeks ago?",
        a: "Losses are counted by the date the refund was processed, not the date of the original sale. If you refund an old transaction today, its value counts toward today's loss figure in both the 24-hour and 7-day totals.",
      },
      {
        q: "Can I get more than one of these messages if I check the app again later in the day?",
        a: "No. The brief is generated once per business per calendar day — if one has already been created for today, the cron skips your account rather than generating or sending a duplicate.",
      },
      {
        q: "Does this replace the Daily Brief I see inside the app, with the health score and suggested action?",
        a: "No, that's a separate feature and it's untouched. The in-app Daily Brief still computes its own health score, anomalies, and action item independently, and you can open it in AskBiz any time regardless of your WhatsApp settings.",
      },
    ],
  },
];
