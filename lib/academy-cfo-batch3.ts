import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_BATCH_3: AcademyArticle[] = [
  // ─── Article 51 ───────────────────────────────────────────────────────────
  {
    slug: "intro-to-expenses-tab-askbiz",
    title: "Introduction to the Expenses Tab",
    description:
      "Get a complete overview of the Expenses tab in the AskBiz CFO dashboard — what it tracks, why it matters, and how it connects to your burn rate and runway.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "expenses tab",
      "AskBiz CFO",
      "expense tracking",
      "burn rate",
      "cash flow",
      "small business expenses",
    ],
    keyTakeaways: [
      "The Expenses tab is the central place to log every outgoing payment your business makes.",
      "Expense data feeds directly into your burn rate calculation and cash runway forecast.",
      "You can add expenses manually or use the AI receipt scanner for speed and accuracy.",
    ],
    content: [
      {
        heading: "What Is the Expenses Tab?",
        body: "The Expenses tab lives inside the AskBiz CFO dashboard, which you reach by tapping the Intelligence icon in the bottom navigation bar and then selecting the Cash Flow tab. Within Cash Flow, you will find two main sub-tabs: Overview and Expenses. Tap Expenses to open it. This area is your business spending ledger. Every time you pay a supplier, cover payroll, settle a software subscription, or buy office supplies, you record it here. The tab stores each entry as a row in a secure database, giving you a single searchable, filterable history of all your outgoings.",
      },
      {
        heading: "Why Track Expenses Inside AskBiz?",
        body: "Many founders rely on bank statements to understand their spending, but bank feeds are often delayed by one to three business days and group related transactions in unhelpful ways. By logging expenses in AskBiz as they happen, you maintain a real-time picture of outgoing cash. This matters for three reasons. First, your Daily Net Gain/Burn card on the CFO dashboard reads directly from this table, so the card stays accurate the moment you save a new expense. Second, the Rolling Cash Forecast uses your expense history to project future outflows, making the weekly forecast more precise over time. Third, you can instantly see how much you are spending in each category — payroll, rent, software — without waiting for an accountant to categorise a statement.",
      },
      {
        heading: "How the Expenses Tab Is Laid Out",
        body: "When you open the Expenses tab you will notice several distinct areas. At the very top is the Category Breakdown bar, a coloured stacked bar that shows what proportion of your total spend falls into each of the 14 expense categories. Below that is a toolbar containing a search input, category filter chips, and a date range selector. Under the toolbar is the expenses list, a scrollable table of every recorded expense. Each row shows the date, vendor name, amount, category, and any notes you added. At the bottom right of the screen is the floating indigo camera button, which opens the AI receipt scanner. In the top right of the tab you will also find the Add Expense button that opens the manual entry form.",
      },
      {
        heading: "The Connection to Burn Rate and Runway",
        body: "Your burn rate is the net amount of cash leaving your business each day. AskBiz calculates this by taking total expenses recorded in the current period and subtracting revenue. The more complete your expense data is, the more accurate this figure becomes. If you forget to log a large rent payment, your apparent burn rate will look lower than it really is, and your runway estimate will be overstated. A cash runway that says you have six months of runway when you actually have four is a dangerous mismatch. Keeping the Expenses tab up to date is therefore not just good bookkeeping — it is what keeps every other CFO metric trustworthy.",
      },
      {
        heading: "Two Ways to Add Expenses",
        body: "AskBiz gives you a choice of two entry methods. The manual form is best when you are at a desk and want to type in the details directly — you fill in vendor, date, amount, category, and optional notes, then tap Save. The AI receipt scanner is best on the go: you photograph a paper receipt or upload an image from your photo library, and Claude AI reads the receipt and pre-fills all the fields for you. You then review the extracted data, correct anything that looks wrong, and confirm to save. Both methods save the expense to the same Supabase database table, so the data is identical regardless of which route you use.",
      },
    ],
    relatedSlugs: [
      "how-to-add-expense-manually-askbiz",
      "how-to-scan-receipt-camera-askbiz",
      "how-expense-data-connects-burn-rate",
    ],
    faq: [
      {
        q: "Does the Expenses tab sync with my bank account automatically?",
        a: "Not at this time. You add expenses manually or via the AI receipt scanner. Automatic bank sync is on the AskBiz product roadmap.",
      },
      {
        q: "Can I edit an expense after I save it?",
        a: "Yes. Tap the expense row in the list to open the edit form, adjust any field, and save again.",
      },
    ],
    videoUrl: "QToJkcdFBi8",
  },

  // ─── Article 52 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-add-expense-manually-askbiz",
    title: "How to Add an Expense Manually in AskBiz",
    description:
      "A step-by-step walkthrough of the manual expense entry form in AskBiz — covering every field, how to choose the right category, and how to save successfully.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "add expense",
      "manual expense entry",
      "AskBiz CFO",
      "expense form",
      "vendor",
      "expense category",
    ],
    keyTakeaways: [
      "Tap the Add Expense button in the top right of the Expenses tab to open the entry form.",
      "The five fields are Vendor, Date, Amount, Category, and Notes — Vendor, Date, Amount, and Category are required.",
      "Tapping Save instantly updates the expense list and all dependent CFO metrics.",
    ],
    content: [
      {
        heading: "Opening the Manual Entry Form",
        body: "To add an expense manually, begin by navigating to the Expenses tab. From anywhere in AskBiz, tap the Intelligence icon in the bottom navigation bar. On the Intelligence screen, select the Cash Flow tab at the top of the page. Then tap the Expenses sub-tab. In the top right corner of the Expenses tab you will see a button labelled Add Expense with a plus icon. Tap this button. A form slides up from the bottom of the screen containing five input fields.",
      },
      {
        heading: "Filling In the Vendor Field",
        body: "The first field is Vendor. Type the name of the company or person you paid. Be consistent with how you spell vendor names — if you sometimes write 'AWS' and sometimes 'Amazon Web Services', the search feature will treat them as different vendors. A good practice is to decide on one canonical name for each supplier and stick to it. The Vendor field accepts up to 120 characters. Examples of well-formatted vendor names: Shopify, Google Ads, WeWork London, John Smith Consulting.",
      },
      {
        heading: "Setting the Date and Amount",
        body: "The Date field defaults to today's date. Tap it to open a calendar picker if the expense occurred on a different day. Always use the actual payment date rather than the invoice date, because AskBiz uses the expense date to calculate daily burn figures. The Amount field accepts numeric input only. Enter the total amount you paid in your account currency. Do not include currency symbols — just the number, for example 1250.00. The dashboard will display the correct currency symbol based on your account settings.",
      },
      {
        heading: "Choosing a Category and Adding Notes",
        body: "Tap the Category field to open a scrollable list of the 14 available expense categories: Rent/Lease, Payroll, Utilities, Software/SaaS, Marketing and Ads, Supplies, Travel, Meals and Entertainment, Shipping, Professional Services, Equipment, Insurance, Taxes and Fees, and Other. Select the one that best matches the nature of the expense. If you are unsure, use Other rather than leaving the category blank. The Notes field is optional but useful for context. Examples of helpful notes: 'July invoice', 'team lunch with client Acme Ltd', 'domain renewal for 2 years'. Notes are searchable, so brief descriptive text helps you find the expense later.",
      },
      {
        heading: "Saving and Verifying the Entry",
        body: "Once all required fields are filled, tap the Save button at the bottom of the form. The form closes and you will see the new expense appear at the top of the expenses list, sorted by date descending. The Category Breakdown bar at the top of the tab updates immediately to reflect the new spending proportion. If you made a mistake, tap the expense row in the list to reopen the edit form, make corrections, and tap Save again. To discard an unwanted expense entirely, open the row and tap the Delete button, then confirm the deletion in the prompt that appears.",
      },
    ],
    relatedSlugs: [
      "intro-to-expenses-tab-askbiz",
      "how-to-scan-receipt-camera-askbiz",
      "how-to-categorise-expenses-askbiz",
    ],
    faq: [
      {
        q: "What if I need to enter an expense in a foreign currency?",
        a: "Enter the amount converted to your account's base currency. AskBiz does not currently support multi-currency expense entries.",
      },
      {
        q: "Is there a limit to how many expenses I can add?",
        a: "There is no practical limit. The Expenses tab can handle thousands of entries and the list remains fast to scroll and search.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 53 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-scan-receipt-camera-askbiz",
    title: "How to Scan a Receipt Using Your Phone Camera",
    description:
      "Learn how to use the AskBiz camera button to photograph a paper receipt, allow camera access, and complete the AI-assisted review screen in under a minute.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "scan receipt",
      "camera button",
      "AI receipt scanner",
      "AskBiz",
      "photograph receipt",
      "expense from receipt",
    ],
    keyTakeaways: [
      "Tap the floating indigo camera button at the bottom right of any screen to launch the scanner.",
      "You can choose to take a new photo or upload from your library — both routes reach the same review screen.",
      "Camera permission is required once; after granting it, the camera opens instantly on every subsequent use.",
    ],
    content: [
      {
        heading: "Finding the Camera Button",
        body: "AskBiz makes the receipt scanner available from anywhere in the app through the floating camera button. This is a circular indigo button fixed to the bottom right corner of the screen, sitting above the navigation bar. It is always visible when you are inside the CFO dashboard, so you do not need to navigate to the Expenses tab first. If you prefer, you can also access the scanner from within the Expenses tab by tapping the camera icon that appears alongside the Add Expense button in the top right.",
      },
      {
        heading: "Granting Camera Permission",
        body: "The first time you tap the camera button, your phone will display a permission dialog asking whether AskBiz can access your camera. Tap Allow or Allow While Using App to grant permission. This dialog only appears once. If you accidentally tap Don't Allow, you will need to go to your phone's Settings app, find AskBiz in the list of apps, and toggle Camera access on manually. Without camera permission, the scanner will offer the photo library upload option only.",
      },
      {
        heading: "Taking the Photo",
        body: "After tapping the camera button and selecting the Take Photo option, your camera viewfinder opens. Position the receipt so it fills most of the frame. Hold your phone roughly 20 to 30 centimetres above the receipt, keeping the phone parallel to the surface rather than at an angle. Good lighting is the most important factor — stand near a window or use overhead light. When the receipt is clearly in frame and the text looks sharp in the viewfinder, tap the white shutter button. AskBiz captures the image and immediately sends it to the AI extraction engine.",
      },
      {
        heading: "What Happens While the AI Processes the Image",
        body: "After the shutter fires, a brief loading indicator appears on screen, usually for two to five seconds depending on your internet connection. During this time, the image is sent securely to the Claude AI vision service, which reads the text on the receipt and identifies the key fields: vendor name, transaction date, total amount, suggested expense category, and any notes that can be inferred from the receipt content. When processing is complete, the app transitions automatically to the review screen showing the extracted data.",
      },
      {
        heading: "Completing the Flow on the Review Screen",
        body: "The review screen displays each extracted field alongside a confidence score, shown as a percentage. Fields the AI is very confident about appear in full colour, while lower-confidence fields are highlighted in amber to prompt you to check them. Review every field before confirming. Tap any field to edit it if the value looks wrong. Once you are happy with all the data, tap Confirm to save the expense. The receipt data is written to the expenses database and the new entry appears immediately in your expenses list.",
      },
    ],
    relatedSlugs: [
      "how-to-upload-receipt-photo-library",
      "reviewing-confirming-scanned-receipt",
      "tips-for-better-receipt-scan-accuracy",
    ],
    faq: [
      {
        q: "Can I scan a receipt that has already been folded or crumpled?",
        a: "Yes, but accuracy improves significantly if you flatten the receipt on a flat surface before photographing it. Creases can distort characters and reduce the AI confidence scores.",
      },
      {
        q: "Does the photo get stored anywhere?",
        a: "The image is used only for extraction and is not permanently stored on AskBiz servers. Only the extracted data fields are saved to your account.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 54 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-upload-receipt-photo-library",
    title: "How to Upload a Receipt From Your Photo Library",
    description:
      "Step-by-step instructions for using the upload option in the AskBiz receipt scanner to select a receipt image from your phone's photo library or files app.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "upload receipt",
      "photo library",
      "receipt from gallery",
      "AskBiz receipt scanner",
      "file upload",
      "expense upload",
    ],
    keyTakeaways: [
      "Tap the floating camera button and choose Upload from Library instead of Take Photo.",
      "You can select any image file from your phone's photo library or files app.",
      "The same AI extraction and review flow applies whether you take a photo or upload one.",
    ],
    content: [
      {
        heading: "When to Use the Upload Option",
        body: "The upload option is useful in several scenarios. You may have already photographed a receipt earlier in the day and want to process it now. You might have received a digital receipt as an image attachment in your email and saved it to your phone. Or you could be working at a desk and prefer to drag a receipt image file from your laptop. The upload path handles all of these. It accepts JPEG, PNG, and PDF files up to 10 MB.",
      },
      {
        heading: "Opening the Upload Panel",
        body: "Tap the floating indigo camera button at the bottom right of the screen. A small action sheet appears with two options: Take Photo and Upload from Library. Tap Upload from Library. On iOS this opens the standard photo picker showing your recent photos. On Android it opens your device gallery. If you want to select a file from a cloud storage app such as Google Drive or Dropbox rather than your local gallery, tap the Files option that appears in the top right of the picker (iOS) or use the Files app shortcut (Android).",
      },
      {
        heading: "Selecting Your Receipt Image",
        body: "Browse to the image you want to use and tap it to select it. The picker closes automatically and AskBiz displays a brief loading spinner while it sends the image to Claude AI for extraction. If you selected a PDF, the first page is extracted automatically. After processing, the review screen appears with all detected fields pre-filled, exactly as if you had taken the photo directly through the app.",
      },
      {
        heading: "Reviewing and Confirming the Extracted Data",
        body: "On the review screen, check each field: vendor, date, amount, category, and notes. The AI confidence score beside each field tells you how certain the model was about that value. If a field shows an amber or red confidence indicator, tap it and type the correct value manually. Once every field is correct, tap Confirm at the bottom of the screen. The expense is saved to your account and appears in the expenses list immediately.",
      },
    ],
    relatedSlugs: [
      "how-to-scan-receipt-camera-askbiz",
      "reviewing-confirming-scanned-receipt",
      "how-ai-receipt-scanner-works-askbiz",
    ],
    faq: [
      {
        q: "Can I upload a screenshot of a digital receipt?",
        a: "Yes. Screenshots of email receipts, online order confirmations, or invoices work well as long as the key fields — vendor, date, and amount — are clearly visible in the image.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 55 ───────────────────────────────────────────────────────────
  {
    slug: "how-ai-receipt-scanner-works-askbiz",
    title: "How the AI Receipt Scanner Extracts Data",
    description:
      "Understand the technology behind the AskBiz receipt scanner — how Claude AI reads receipt images, what data it extracts, and why accuracy varies across receipts.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "AI receipt scanner",
      "Claude AI vision",
      "receipt extraction",
      "OCR",
      "machine learning expenses",
      "AskBiz AI",
    ],
    keyTakeaways: [
      "AskBiz uses the Claude vision API to read receipt images, not traditional OCR, so it understands context as well as text.",
      "The AI extracts six fields: vendor, date, amount, category, notes, and a confidence score for each.",
      "Image quality — especially lighting and focus — is the biggest factor controlling extraction accuracy.",
    ],
    content: [
      {
        heading: "The Technology Behind the Scanner",
        body: "When you photograph or upload a receipt, AskBiz sends the image to Anthropic's Claude AI via a secure API call. Claude is a multimodal large language model, meaning it can understand both text and images simultaneously. Unlike older optical character recognition (OCR) tools that simply convert printed letters to plain text, Claude reads the receipt in context. It understands that the large bold figure at the bottom of a restaurant receipt is the total, that a string like '23/05/25' is a date in day/month/year format, and that 'Costa Coffee' is a vendor in the Meals and Entertainment category. This contextual understanding is why the scanner handles varied receipt layouts — thermal rolls, PDF invoices, handwritten notes — far better than traditional OCR.",
      },
      {
        heading: "What Data Gets Extracted",
        body: "For every receipt, the AI attempts to identify six pieces of information. The vendor name is the trading name of the business you paid, for example 'Tesco' or 'Slack Technologies'. The date is the transaction date, converted to the standard format used by your account. The amount is the total charged, inclusive of tax. The category is Claude's best guess at which of the 14 AskBiz expense categories applies, based on the vendor name and items listed on the receipt. The notes field may be populated with a brief description if the receipt contains useful context, such as a list of purchased items or a reference number. Finally, a confidence score between 0 and 100 is generated for each field independently, reflecting how certain the model is about that particular value.",
      },
      {
        heading: "Why Accuracy Varies",
        body: "Several factors affect how accurately the AI reads a receipt. Image sharpness is the most critical — a blurry photo caused by camera shake will produce low confidence scores across all fields. Lighting matters too: a receipt photographed under warm dim light may show low contrast between the thermal ink and the paper, making characters harder to distinguish. Receipt format also plays a role: a clean PDF invoice with machine-readable text will always score higher than a faded thermal roll receipt that has been folded and refolded. The AI also performs better on receipts in Latin-script languages (English, French, Spanish, etc.) than on receipts in non-Latin scripts.",
      },
      {
        heading: "Category Inference Logic",
        body: "When assigning a category, Claude looks at the vendor name, any line items listed, and any category codes that appear on the receipt. For well-known vendors, the mapping is typically very accurate: Slack maps to Software/SaaS, a petrol station maps to Travel, a pharmacy maps to Supplies. For less familiar vendors or ambiguous purchases, the AI falls back on context clues from the line items. If you find the AI consistently miscategorising a particular vendor, you can correct it on the review screen. The corrected category will override the AI suggestion for that submission but does not automatically re-train the model for future receipts.",
      },
      {
        heading: "Data Security and Privacy",
        body: "The receipt image is transmitted over an encrypted HTTPS connection to Anthropic's API. Anthropic does not use API-submitted images to train future models unless you have opted in under a separate data use agreement. The image itself is not stored permanently by AskBiz — only the extracted field values are written to your Supabase database. If you are handling receipts that contain sensitive personal information (for example, medical expenses), you can redact that information from the image before uploading without affecting the fields the scanner needs.",
      },
    ],
    relatedSlugs: [
      "reviewing-confirming-scanned-receipt",
      "understanding-ai-confidence-scores-receipts",
      "tips-for-better-receipt-scan-accuracy",
    ],
    faq: [
      {
        q: "Does the scanner work offline?",
        a: "No. The image must be sent to the Claude AI API, which requires an active internet connection. If you are offline, use the manual entry form instead.",
      },
      {
        q: "Can the scanner read receipts in languages other than English?",
        a: "Yes, Claude supports many languages. Accuracy is highest for English and other Latin-script languages, but French, Spanish, German, and Portuguese receipts generally work well.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 56 ───────────────────────────────────────────────────────────
  {
    slug: "reviewing-confirming-scanned-receipt",
    title: "Reviewing and Confirming a Scanned Receipt",
    description:
      "A detailed guide to the receipt review screen in AskBiz — understanding each pre-filled field, how to edit values before saving, and what happens when you confirm.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "review receipt",
      "confirm expense",
      "receipt review screen",
      "AskBiz",
      "edit scanned receipt",
      "save expense",
    ],
    keyTakeaways: [
      "Always review every field on the review screen before tapping Confirm — the AI is accurate but not infallible.",
      "Tap any field to edit it directly on the review screen without losing the other extracted values.",
      "Tapping Confirm writes the expense to your database and the entry appears in the list immediately.",
    ],
    content: [
      {
        heading: "What the Review Screen Shows",
        body: "After the AI has processed your receipt image, the review screen appears. This screen is laid out similarly to the manual entry form. At the top you see a small thumbnail of the receipt image you submitted, which you can tap to expand if you want to cross-reference the original. Below the thumbnail are five editable fields: Vendor, Date, Amount, Category, and Notes. Each field displays the value the AI extracted, along with a coloured confidence indicator: green for high confidence (above 80), amber for medium confidence (50 to 80), and red for low confidence (below 50).",
      },
      {
        heading: "Reading the Confidence Indicators",
        body: "The confidence indicators are visual signals designed to tell you where to focus your attention. If all five indicators are green, a quick glance at each value is usually sufficient before confirming. If you see an amber or red indicator, that field warrants careful checking against the original receipt. Common causes of low confidence include a partially obscured total amount, a date in an unusual format, or a vendor name that appears only in a small font. The indicator for the Notes field is less critical because notes are optional — a red indicator there simply means the AI could not confidently suggest anything.",
      },
      {
        heading: "Editing a Field Before Confirming",
        body: "To edit any field on the review screen, tap directly on it. The field becomes editable and a keyboard or picker appears. For text fields such as Vendor and Notes, a text keyboard opens and you can type a replacement value. For the Date field, a calendar picker opens. For Amount, a numeric keyboard appears. For Category, a scrollable list of the 14 categories appears. Make your correction and then tap Done or tap elsewhere to dismiss the keyboard. The edited value replaces the AI suggestion, and the confidence indicator for that field disappears since you have manually verified the value.",
      },
      {
        heading: "Confirming and What Happens Next",
        body: "Once you are satisfied with all the fields, tap the blue Confirm button at the bottom of the screen. AskBiz writes the expense record to the Supabase database under your account. The review screen closes and you are returned to the Expenses tab. The new entry appears at the top of the expenses list sorted by date. The Category Breakdown bar updates to include this expense. The CFO metric cards — particularly the Daily Net Gain/Burn card and the Cash Runway card — recalculate automatically based on the updated expense data.",
      },
      {
        heading: "If You Want to Discard the Scan",
        body: "If you decide you do not want to save the scanned receipt, tap the Cancel or Back button at the top left of the review screen. No data is saved. You are returned to wherever you were in the app before opening the scanner. The image is discarded and does not appear in any history. You can then either try scanning again or add the expense manually using the Add Expense form.",
      },
    ],
    relatedSlugs: [
      "how-to-scan-receipt-camera-askbiz",
      "understanding-ai-confidence-scores-receipts",
      "how-to-fix-incorrectly-scanned-receipt",
    ],
    faq: [
      {
        q: "Can I go back and edit the expense after confirming?",
        a: "Yes. Find the expense in the list, tap the row to open it in edit mode, change any field, and tap Save.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 57 ───────────────────────────────────────────────────────────
  {
    slug: "understanding-ai-confidence-scores-receipts",
    title: "Understanding AI Confidence Scores on Receipts",
    description:
      "Learn what the 0–100 confidence score means on the AskBiz receipt review screen, how each colour band is defined, and which situations call for manual verification.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "confidence score",
      "AI accuracy",
      "receipt scanner",
      "AskBiz",
      "trust AI extraction",
      "verify receipt data",
    ],
    keyTakeaways: [
      "Confidence scores range from 0 to 100 and reflect how certain the AI is about each individual field.",
      "Green means high confidence (above 80), amber means check carefully (50 to 80), red means verify manually (below 50).",
      "Low confidence on the Amount field is the most important to correct — an incorrect amount affects burn rate calculations.",
    ],
    content: [
      {
        heading: "What the Score Represents",
        body: "After Claude AI processes your receipt image, it assigns a confidence score to each of the five extracted fields: Vendor, Date, Amount, Category, and Notes. The score is a number from 0 to 100. A score of 95 means the AI is highly certain — it found a clear, unambiguous value. A score of 40 means the AI found something plausible but is uncertain, perhaps because the text was faint, the format was unusual, or multiple candidate values were present on the image. The score is field-specific: the same receipt could have a confidence of 92 on Vendor but only 48 on Date if the date was printed in a small or unusual font.",
      },
      {
        heading: "Green, Amber, and Red Colour Bands",
        body: "AskBiz translates the numerical confidence score into three visual colour bands. Green covers scores from 81 to 100 and indicates the AI is very confident in the extracted value. A quick glance to confirm it looks right is all that is needed. Amber covers scores from 50 to 80. These fields are plausible but uncertain enough that you should read the value carefully and compare it to the receipt image. Red covers scores from 0 to 49. A red indicator means the AI struggled significantly with this field and you should always manually verify or re-enter the value. Do not confirm an expense with a red Amount score without checking the total on the original receipt.",
      },
      {
        heading: "Which Fields Matter Most",
        body: "Not all fields carry equal financial weight. The Amount field is the most critical because an incorrect amount directly affects your burn rate and forecast calculations. If the AI read 1250 when the receipt says 12.50, the error is a factor of one hundred. Always verify the Amount field regardless of confidence colour. The Date field is the second most important, because expenses logged on the wrong date will distort your daily and monthly spending trends. The Vendor and Category fields matter for reporting accuracy but a miscategorised expense does not affect the total spend figures. The Notes field is entirely optional and errors there have no financial impact.",
      },
      {
        heading: "Why Scores Drop",
        body: "Several receipt and image conditions cause confidence scores to drop. A blurry or out-of-focus photo is the most common cause of across-the-board low scores. Poor lighting creates low contrast between ink and paper, making characters ambiguous. Receipts with staining, fading, or thermal degradation present characters that look similar — for example an 8 may be confused with a 3. Folded or crumpled receipts can cause physical distortion that changes the apparent shape of letters. Receipts with non-standard layouts — such as handwritten notes, unusual fonts, or multi-column formats — also produce lower scores because the AI encounters less familiar patterns.",
      },
      {
        heading: "What to Do With Low Confidence Fields",
        body: "When you see an amber or red confidence indicator, follow these steps. First, tap the thumbnail image at the top of the review screen to expand the receipt and locate the relevant field. Second, read the original value directly from the receipt. Third, tap the low-confidence field on the review screen and type in the correct value. Fourth, after correcting all flagged fields, tap Confirm. If the image is too poor quality to read even when expanded, it is better to discard the scan and add the expense manually using the Add Expense form rather than guessing.",
      },
    ],
    relatedSlugs: [
      "reviewing-confirming-scanned-receipt",
      "how-to-fix-incorrectly-scanned-receipt",
      "tips-for-better-receipt-scan-accuracy",
    ],
    faq: [
      {
        q: "Is a 75 confidence score on the Amount field good enough to trust?",
        a: "It is amber-rated, which means you should verify it against the receipt. For the Amount field specifically, always double-check regardless of the score.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 58 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-fix-incorrectly-scanned-receipt",
    title: "How to Fix a Receipt That Scanned Incorrectly",
    description:
      "Step-by-step instructions for correcting vendor, date, amount, or category errors on the AskBiz receipt review screen before saving — and how to edit a saved expense afterwards.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "fix scanned receipt",
      "correct receipt data",
      "edit expense",
      "AskBiz receipt error",
      "wrong amount",
      "wrong vendor",
    ],
    keyTakeaways: [
      "Fix errors before confirming by tapping the incorrect field on the review screen and typing the right value.",
      "If you already confirmed a wrong entry, find it in the expenses list, tap to edit, correct the field, and save again.",
      "You never need to delete and re-create an expense — every field is editable after saving.",
    ],
    content: [
      {
        heading: "Catching Errors on the Review Screen",
        body: "The best time to fix a scanning error is on the review screen, before you tap Confirm. This screen appears immediately after the AI finishes processing your image. Scan each of the five fields — Vendor, Date, Amount, Category, and Notes — and compare them to the original receipt. Pay particular attention to any fields with an amber or red confidence indicator, as these are the fields the AI was least certain about. If you spot any discrepancy between the extracted value and the receipt, correct it immediately on this screen.",
      },
      {
        heading: "Editing Vendor, Notes, or Category",
        body: "To correct the Vendor field, tap it once. A text input appears with the current extracted value selected. Use the backspace key to clear the wrong text and type the correct vendor name. Tap Done on the keyboard when finished. To correct Notes, follow the same process. To correct Category, tap the Category field. The 14-category picker opens. Scroll through the list and tap the correct category. The picker closes automatically and the new category appears in the field. None of these edits affect the confidence indicators on the other fields.",
      },
      {
        heading: "Editing Date and Amount",
        body: "To correct the Date field, tap it to open the calendar picker. Navigate to the correct month using the arrow buttons at the top of the calendar, then tap the correct day. The picker closes and the corrected date appears in the field. To correct the Amount field, tap it to open the numeric keyboard. The current value is shown in the input. Clear it with the backspace key and type the correct amount. Use a decimal point for cents or pence — for example, type 47.50 for forty-seven pounds fifty. Tap Done to confirm the new amount.",
      },
      {
        heading: "Fixing an Expense You Already Confirmed",
        body: "If you tapped Confirm before noticing an error, do not worry. Find the incorrect expense in the expenses list on the Expenses tab. You can use the search bar to find it by vendor name if it has scrolled off screen. Tap the expense row to open it in edit mode. The edit form is identical to the manual entry form and shows all the current field values. Correct whichever field is wrong and tap Save. The expense record in the database is updated immediately, and all CFO metrics that depend on this expense recalculate automatically.",
      },
      {
        heading: "When to Delete and Re-scan",
        body: "Deleting an expense and re-scanning is rarely necessary — editing the saved expense is faster. However, if the scan produced completely garbled results across all fields, or if you accidentally saved an expense for the wrong account, it may be cleaner to delete the entry and start fresh. To delete an expense, open it from the list, scroll to the bottom of the edit form, and tap the red Delete button. Confirm the deletion in the dialog that appears. The expense is removed from the database and the metrics update accordingly.",
      },
    ],
    relatedSlugs: [
      "reviewing-confirming-scanned-receipt",
      "understanding-ai-confidence-scores-receipts",
      "how-to-add-expense-manually-askbiz",
    ],
    faq: [
      {
        q: "What if I deleted an expense by mistake?",
        a: "Deleted expenses cannot be restored. You will need to add the expense again using the manual entry form or by re-scanning the receipt.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 59 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-use-floating-camera-button",
    title: "How to Use the Floating Camera Button",
    description:
      "Everything you need to know about the fixed indigo camera button in AskBiz — where it lives, how to access it from any screen, and why it exists as a floating control.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "floating camera button",
      "quick receipt scan",
      "AskBiz camera",
      "bottom right button",
      "indigo button",
      "scan receipt anywhere",
    ],
    keyTakeaways: [
      "The floating camera button is always visible in the bottom right corner of the CFO dashboard screens.",
      "It provides one-tap access to the receipt scanner without navigating to the Expenses tab first.",
      "The button sits above the navigation bar at z-index 50, so it appears over all other content.",
    ],
    content: [
      {
        heading: "Where the Button Lives",
        body: "The floating camera button is a circular button with an indigo background and a white camera icon. It is fixed to the bottom right corner of the screen, positioned just above the main navigation bar. Because it uses a high z-index in the layout, it floats visually on top of all other content — meaning it is visible whether you are looking at the Cash Flow overview, the Expenses list, the Burn Rate drill-down panel, or the Runway detail screen. You never have to scroll or navigate to find it.",
      },
      {
        heading: "Why It Is a Floating Button",
        body: "Expense recording is a time-sensitive action. When you are at a coffee shop paying for a client meeting, or at a trade show making a purchase, you want to capture the receipt before you leave or before the paper gets lost. A floating button means you can tap it the moment you receive a receipt, regardless of which part of the app you happen to be viewing at that moment. Without the floating button, you would need to tap back to the home screen, navigate to Intelligence, select Cash Flow, tap Expenses, and then find the scanner option — a journey of five or six taps compared to one.",
      },
      {
        heading: "Using the Button Step by Step",
        body: "Step 1: While inside any screen of the AskBiz CFO dashboard, locate the indigo circular button at the bottom right of the screen. Step 2: Tap it once. An action sheet slides up from the bottom showing two options: Take Photo and Upload from Library. Step 3: Choose Take Photo to use your device camera in real time, or choose Upload from Library to select an existing image. Step 4: Complete the photo or selection. Step 5: Wait two to five seconds while the AI processes the image. Step 6: Review the extracted fields on the review screen. Step 7: Correct any errors and tap Confirm. The expense is saved and you are returned to the screen you were on before.",
      },
      {
        heading: "Behaviour After Confirming",
        body: "After you tap Confirm on the review screen, AskBiz returns you to whichever screen was active when you tapped the floating camera button. If you were on the Overview tab, you go back to the Overview tab. If you were on the Runway drill-down panel, you go back there. The new expense has already been saved and the relevant metrics updated, so you can immediately see the impact on your burn rate or runway without any further action.",
      },
    ],
    relatedSlugs: [
      "how-to-scan-receipt-camera-askbiz",
      "how-to-upload-receipt-photo-library",
      "intro-to-expenses-tab-askbiz",
    ],
    faq: [
      {
        q: "Can I hide the floating camera button if it gets in the way?",
        a: "Currently the button cannot be hidden. It is designed to be always accessible. If it overlaps content you need to see, you can scroll or swipe that content to bring it into view.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 60 ───────────────────────────────────────────────────────────
  {
    slug: "tips-for-better-receipt-scan-accuracy",
    title: "Tips for Getting Better Receipt Scan Accuracy",
    description:
      "Practical advice on lighting, positioning, receipt preparation, and image cropping to maximise the accuracy of the AskBiz AI receipt scanner.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "receipt scan accuracy",
      "AI scanner tips",
      "better receipt photo",
      "AskBiz receipt",
      "OCR accuracy",
      "photograph receipt",
    ],
    keyTakeaways: [
      "Good lighting is the single biggest factor — natural daylight or a bright overhead light produces the clearest images.",
      "Flatten and straighten the receipt before photographing to avoid distortion that lowers confidence scores.",
      "Keep the camera parallel to the receipt surface and fill 80 percent of the frame with the receipt.",
    ],
    content: [
      {
        heading: "Get the Lighting Right",
        body: "Thermal receipt paper has very low contrast — the ink is a dark grey rather than true black, and the paper background is off-white. In poor light the contrast difference almost disappears, making it hard for the AI to distinguish individual characters. To maximise contrast, use bright, even lighting. Natural daylight from a window is ideal. A bright ceiling light works well too. Avoid taking photos under warm yellow tungsten bulbs, in shadows, or under flickering fluorescent tubes. If you are outdoors and using sunlight, make sure the sun is not casting a harsh shadow across the receipt from your phone or hand.",
      },
      {
        heading: "Flatten and Arrange the Receipt",
        body: "Curled, folded, or crumpled receipts create physical distortions that change the apparent shape of printed characters. Before photographing, take a few seconds to flatten the receipt. Place it face-up on a flat, dark-coloured surface — dark surfaces provide contrast behind the receipt edges, which helps the AI locate the boundaries of the document. If the receipt is very long, try to have the most important section (vendor name and total at the top and bottom) visible within the frame. You can fold the middle of a long receipt to fit both the header and footer into one photo.",
      },
      {
        heading: "Frame the Receipt Correctly",
        body: "Hold your phone directly above the receipt with the camera lens pointing straight down, parallel to the receipt surface. Angled shots cause keystoning — a perspective distortion that stretches text on one side. Aim to fill roughly 80 percent of the frame with the receipt, leaving a small border of the dark surface visible around all four edges. This gives the AI clear boundaries to work with. Avoid including your hands, table clutter, or other objects inside the frame. The phone viewfinder will show you exactly what the camera sees — check the preview before tapping the shutter.",
      },
      {
        heading: "Wait for Focus Before Shooting",
        body: "Most phone cameras take a fraction of a second to autofocus after you reposition them. If you tap the shutter immediately after moving the phone, the image may be slightly out of focus, which causes blurry characters and low confidence scores. Watch the viewfinder and wait until the focus indicator (usually a small square or circle) stabilises before tapping the shutter. Some phones play a subtle sound or show a brief flash when focus locks. Alternatively, tap on the receipt in the viewfinder to force the camera to focus on that area, then tap the shutter.",
      },
      {
        heading: "Handling Faded or Old Receipts",
        body: "Thermal receipts fade significantly over time, especially if exposed to heat, sunlight, or friction. If you are scanning an old receipt, try scanning it near a bright light source to make any remaining ink as visible as possible. If the receipt is extremely faded, consider uploading a photo taken with your phone's high-contrast or document scanning mode (available in some camera apps as a 'scan' or 'document' filter). After uploading, even a well-processed faded receipt may return low confidence scores, in which case manual entry is the more reliable option.",
      },
    ],
    relatedSlugs: [
      "how-to-scan-receipt-camera-askbiz",
      "understanding-ai-confidence-scores-receipts",
      "how-ai-receipt-scanner-works-askbiz",
    ],
    faq: [
      {
        q: "Does using my phone's built-in document scanner before uploading help?",
        a: "Yes. iOS and Android document scanning modes apply perspective correction and contrast enhancement before you save the image, which typically improves extraction accuracy.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 61 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-categorise-expenses-askbiz",
    title: "How to Categorise Expenses Correctly in AskBiz",
    description:
      "A practical guide to choosing the right category for each expense in AskBiz, why correct categorisation matters for reporting, and how to handle ambiguous cases.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "expense categories",
      "categorise expenses",
      "AskBiz CFO",
      "expense classification",
      "accounting categories",
      "spending categories",
    ],
    keyTakeaways: [
      "Choose the category that most accurately reflects the nature of the purchase, not the vendor name.",
      "Consistent categorisation over time makes the Category Breakdown bar genuinely useful for spotting spending trends.",
      "When unsure, use Other rather than picking an approximate category that will skew your reports.",
    ],
    content: [
      {
        heading: "Why Correct Categorisation Matters",
        body: "Every expense you log in AskBiz is assigned to one of 14 categories. These categories are not just labels — they feed the Category Breakdown bar at the top of the Expenses tab, and they allow you to filter your expense list to see spending in a single category over any time period. If you routinely miscategorise expenses, the breakdown bar becomes misleading. For example, if you put your accountant's monthly invoice under Supplies instead of Professional Services, your Professional Services total will be understated, and you may not realise that external advisors represent a significant portion of your outgoings. Correct categorisation from the start saves effort later when you are reviewing spending or preparing financial summaries.",
      },
      {
        heading: "The Decision Rule: Nature Over Vendor",
        body: "The most common mistake is categorising an expense based on who you paid rather than what you paid for. Amazon, for example, sells software subscriptions (Software/SaaS), physical goods (Supplies or Equipment), and logistics services (Shipping). A single vendor can span multiple categories depending on what was purchased. When choosing a category, ask yourself: what did I get in return for this payment? If you paid Amazon for AWS cloud hosting, the category is Software/SaaS. If you paid Amazon for a printer cartridge, the category is Supplies. If you paid Amazon for next-day courier delivery to a customer, the category is Shipping.",
      },
      {
        heading: "Setting the Category on the Manual Entry Form",
        body: "When filling in the manual expense form, tap the Category field after entering the amount. A scrollable list of all 14 categories appears. Read through the options and select the one that best matches the nature of the purchase. The list is ordered roughly from highest-frequency categories (Rent/Lease, Payroll) at the top to lower-frequency ones (Taxes and Fees, Other) at the bottom. If none of the 14 categories fit precisely, choose Other. You can always filter on Other later to review and recategorise those entries when you have more context.",
      },
      {
        heading: "Correcting Miscategorised Expenses",
        body: "To fix a category on an existing expense, find it in the expenses list — use the search bar or category chip filters to narrow down the list. Tap the expense row to open it in edit mode. Tap the Category field, choose the correct category, and tap Save. The Category Breakdown bar at the top of the Expenses tab updates immediately. If you have many miscategorised expenses from the past — for example, after importing historical data — work through them in batches by filtering on the wrong category using the category chips, then editing each entry.",
      },
      {
        heading: "Using the AI Receipt Scanner to Pre-fill Categories",
        body: "When you scan a receipt, the AI suggests a category based on the vendor name and items listed. For well-known vendors and clear receipts, this suggestion is usually accurate. You should still review the category field on the review screen before confirming, especially for vendors that sell across multiple categories. If the AI consistently suggests the wrong category for a particular vendor, override it on the review screen each time. Developing the habit of checking the category field on every scan takes a few seconds and keeps your reporting clean.",
      },
    ],
    relatedSlugs: [
      "14-expense-categories-explained-askbiz",
      "how-to-add-expense-manually-askbiz",
      "reading-expenses-category-breakdown-bar",
    ],
    faq: [
      {
        q: "Can I create custom expense categories beyond the 14 built-in ones?",
        a: "Not currently. The 14 categories are the standard set. If you have an expense type not well represented, use Other and add context in the Notes field.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 62 ───────────────────────────────────────────────────────────
  {
    slug: "14-expense-categories-explained-askbiz",
    title: "All 14 Expense Categories Explained",
    description:
      "Clear definitions and real-world examples for every one of the 14 expense categories in AskBiz, so you always know which category to choose.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: [
      "expense categories",
      "14 categories",
      "AskBiz categories",
      "rent lease",
      "payroll",
      "software SaaS",
      "professional services",
    ],
    keyTakeaways: [
      "AskBiz has exactly 14 expense categories covering the full range of typical small-business outgoings.",
      "Each category has a specific meaning — using the right one keeps your Category Breakdown bar accurate.",
      "When a purchase spans multiple categories, use the primary purpose of the spend to decide.",
    ],
    content: [
      {
        heading: "Premises and Infrastructure Costs",
        body: "Rent/Lease covers any payment for the physical or virtual space your business uses. Examples: monthly office rent, co-working membership fees, warehouse lease payments, vehicle lease instalments, storage unit rental. Utilities covers ongoing infrastructure services tied to a premises or operations. Examples: electricity, gas, water, business broadband, telephone landline, waste disposal, CCTV monitoring service.",
      },
      {
        heading: "People and Technology Costs",
        body: "Payroll covers all costs related to employees and contractors. Examples: monthly salary payments, PAYE employer contributions, employer National Insurance contributions, contractor invoices, freelancer payments. Software/SaaS covers subscription fees for digital tools and cloud services. Examples: Slack, Notion, Shopify, Google Workspace, Xero, Salesforce, Adobe Creative Cloud, AWS, GitHub, Zoom. Note that one-off purchases of physical software are Equipment, not Software/SaaS.",
      },
      {
        heading: "Revenue Generation Costs",
        body: "Marketing and Ads covers all spending on customer acquisition and brand promotion. Examples: Google Ads, Facebook and Instagram ad spend, sponsored LinkedIn posts, influencer fees, PR agency invoices, print advertising, exhibition stand costs. Shipping covers the cost of sending goods to customers or between locations. Examples: Royal Mail postage, DHL or FedEx courier fees, Parcel Monkey shipments, pallet delivery charges, import duty payments on inbound goods.",
      },
      {
        heading: "Operational and Physical Costs",
        body: "Supplies covers consumable items used in day-to-day operations. Examples: stationery, printer paper and toner, packaging materials, cleaning products, coffee and kitchen supplies for the office, small tools that are consumed or regularly replaced. Travel covers movement of people for business purposes. Examples: train and bus tickets, flights, taxi and rideshare fares, hotel accommodation, mileage claims for personal vehicle use, parking charges. Meals and Entertainment covers food and drink purchased in a business context. Examples: client lunch, team celebration dinner, coffee meeting with a supplier, conference catering.",
      },
      {
        heading: "Professional, Capital, and Compliance Costs",
        body: "Professional Services covers external expertise hired on a project or retainer basis. Examples: accountant fees, solicitor invoices, management consultant fees, IT support contractor, business coach, architect or surveyor charges. Equipment covers the purchase of physical assets expected to last more than one year. Examples: laptop, printer, desk and chairs, point-of-sale terminal, manufacturing machinery, company vehicle purchase. Insurance covers all insurance premiums. Examples: employers liability, public liability, professional indemnity, building and contents, cyber liability, business interruption insurance. Taxes and Fees covers statutory payments and regulatory fees. Examples: Corporation Tax, VAT payments to HMRC, council business rates, Companies House filing fees, trade licence fees, bank charges. Other covers any legitimate business expense that does not fit clearly into the above 13 categories. Always add a note when using Other so you can recategorise later if needed.",
      },
    ],
    relatedSlugs: [
      "how-to-categorise-expenses-askbiz",
      "reading-expenses-category-breakdown-bar",
      "how-to-filter-expenses-by-category",
    ],
    faq: [
      {
        q: "Where do I put a gym membership I pay for as a staff benefit?",
        a: "Use Payroll, since it is a cost of employing people. If you want to track benefits separately, add a note such as 'staff gym benefit' in the Notes field.",
      },
      {
        q: "What category is a business bank account monthly fee?",
        a: "Use Taxes and Fees, as bank charges are a financial administration cost similar to regulatory fees.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 63 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-search-expenses-askbiz",
    title: "How to Search Your Expenses in AskBiz",
    description:
      "Learn how to use the search bar in the AskBiz Expenses tab to quickly find specific expenses by vendor name or notes text.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "search expenses",
      "find expense",
      "AskBiz search bar",
      "vendor search",
      "expense lookup",
      "filter by vendor",
    ],
    keyTakeaways: [
      "The search bar matches against vendor name and notes text — type a partial name to find all matching entries.",
      "Search results update in real time as you type each character.",
      "Clear the search bar by tapping the X icon to return to the full unfiltered expense list.",
    ],
    content: [
      {
        heading: "Finding the Search Bar",
        body: "Open the Expenses tab from the CFO dashboard. The search bar is located in the filter toolbar, which sits directly below the Category Breakdown bar at the top of the tab. It is a white or light-grey input field with a magnifying glass icon on the left and the placeholder text Search expenses. The search bar is always visible — you do not need to scroll to find it.",
      },
      {
        heading: "How to Perform a Search",
        body: "Tap the search bar once to bring up your device keyboard. Type any part of a vendor name or any word from the notes field. For example, type 'Google' to find all expenses where the vendor contains the word Google. Type 'client' to find any expense where the notes field includes the word client. The search is case-insensitive, so typing 'google' and 'Google' return the same results. The expenses list updates after each character you type — there is no need to press Enter or tap a search button.",
      },
      {
        heading: "What the Search Matches Against",
        body: "The search function checks two fields: Vendor Name and Notes. It does not search by amount, date, or category. If you are looking for expenses in a particular category, use the category chip filters instead of the search bar. If you want to find expenses within a date range, use the date range inputs. You can combine the search bar with category chips and date range filters simultaneously — for example, search for 'Smith' while the Professional Services chip is active and the date range is set to Q1, which would show all professional services expenses from vendors or notes containing Smith in Q1.",
      },
      {
        heading: "Clearing the Search",
        body: "To clear the search and return to the full list, tap the small X icon that appears at the right end of the search bar whenever text is present. Alternatively, tap the search bar to put the cursor in it, then select all the text and delete it. The expenses list immediately reverts to showing all entries that match any other active filters (category chips or date range) without the text search constraint.",
      },
    ],
    relatedSlugs: [
      "how-to-filter-expenses-by-category",
      "how-to-filter-expenses-by-date-range",
      "how-to-sort-expenses-askbiz",
    ],
    faq: [
      {
        q: "Can I search by amount — for example, find all expenses of exactly 500?",
        a: "Not with the search bar, which only searches vendor and notes fields. To find expenses by amount, sort the list by amount and scroll to the relevant range.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 64 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-filter-expenses-by-category",
    title: "How to Filter Expenses by Category",
    description:
      "Step-by-step instructions for using the category filter chips in the AskBiz Expenses tab to isolate spending in any single expense category.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "filter expenses by category",
      "category chips",
      "AskBiz expense filter",
      "payroll filter",
      "software filter",
      "category spending",
    ],
    keyTakeaways: [
      "Tap a category chip to show only expenses in that category — the list updates instantly.",
      "Tap the same chip again to deselect it and return to the full list.",
      "Category chips work alongside the search bar and date range filter for multi-dimensional filtering.",
    ],
    content: [
      {
        heading: "Where the Category Chips Are",
        body: "The category filter chips are a horizontally scrollable row of pill-shaped buttons located in the filter toolbar of the Expenses tab, just below the Category Breakdown bar and above the expenses list. Each chip displays the name of one expense category. Because there are 14 categories, the row extends beyond the screen width — swipe left on the chip row to reveal categories that are off screen to the right. All 14 categories have a chip.",
      },
      {
        heading: "Activating a Category Filter",
        body: "To filter by a category, tap its chip once. The chip changes colour from its resting state (typically light grey with dark text) to its active state (typically a filled indigo or brand-colour background with white text). The expenses list below updates immediately to show only expenses assigned to that category. The list header also updates to show a count of matching expenses. If you have also set a date range or typed a search term, the filtered results respect all active constraints simultaneously.",
      },
      {
        heading: "Deactivating the Filter",
        body: "To remove the category filter and return to the full list, tap the active chip a second time. It reverts to its resting style and the full expense list reappears, subject to any other active filters. Alternatively, if you want to quickly clear all active filters at once — chips, date range, and search text — look for a Clear Filters or Reset button that may appear in the toolbar when any filter is active. Tapping it removes all filter constraints in one action.",
      },
      {
        heading: "Using Chips With the Category Breakdown Bar",
        body: "The stacked Category Breakdown bar at the top of the Expenses tab is also interactive. Tapping a colour segment in the breakdown bar activates the corresponding category chip filter automatically, just as if you had tapped the chip manually. This means you can glance at the bar, notice that Marketing and Ads looks larger than expected, and tap that segment to immediately drill into the individual transactions making up that total. The chip row will scroll to show the now-active Marketing and Ads chip highlighted.",
      },
    ],
    relatedSlugs: [
      "reading-expenses-category-breakdown-bar",
      "how-to-filter-expenses-by-date-range",
      "how-to-search-expenses-askbiz",
    ],
    faq: [
      {
        q: "Can I filter by more than one category at the same time?",
        a: "Currently only one category chip can be active at a time. To see two categories together, use the search bar to search for a shared keyword, or export your data and filter in a spreadsheet.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 65 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-filter-expenses-by-date-range",
    title: "How to Filter Expenses by Date Range",
    description:
      "How to use the date range inputs in the AskBiz Expenses tab to view spending within any custom date window, and how to clear the filter when done.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "filter by date",
      "date range filter",
      "AskBiz expenses",
      "monthly expenses",
      "date filter",
      "expense period",
    ],
    keyTakeaways: [
      "Use the From and To date inputs in the filter toolbar to restrict the expense list to a specific period.",
      "The filter is inclusive — expenses on the From date and the To date are both included.",
      "Clear the date range by tapping the X on either date input to return to the full history.",
    ],
    content: [
      {
        heading: "Locating the Date Range Inputs",
        body: "In the filter toolbar of the Expenses tab, alongside the search bar and category chips, you will find two date inputs labelled From and To. They display placeholder dates in the format DD/MM/YYYY (or MM/DD/YYYY depending on your locale settings). These inputs allow you to restrict the expense list to any calendar period you choose — a single day, a week, a month, a quarter, or a custom range.",
      },
      {
        heading: "Setting the From Date",
        body: "Tap the From input to open a calendar date picker. The picker opens on the current month. Use the left and right arrows at the top of the picker to navigate to an earlier month. Tap the day that marks the start of your desired date range. The picker closes and the From input displays the selected date. The expense list immediately filters to show only expenses on or after that date. If you have not yet set a To date, the list shows all expenses from the From date to the most recent entry.",
      },
      {
        heading: "Setting the To Date",
        body: "Tap the To input to open a second calendar date picker. Navigate to the desired end month and tap the day that marks the end of your range. The picker closes and the To input displays that date. The expense list now shows only expenses with a date between the From date and the To date, inclusive. Both date inputs work independently — you can set only a From date, only a To date, or both together. Setting only a To date without a From date shows all expenses up to and including the To date.",
      },
      {
        heading: "Clearing the Date Range Filter",
        body: "To remove the date range filter, tap the X icon that appears inside each date input when a date is selected. Tapping the X on the From input clears the start date. Tapping the X on the To input clears the end date. If both inputs are cleared, the expenses list returns to showing your complete history, subject to any category chip or search bar filters that may still be active. You can also use the Clear Filters button if visible to reset all active filters simultaneously.",
      },
    ],
    relatedSlugs: [
      "how-to-filter-expenses-by-category",
      "how-to-search-expenses-askbiz",
      "understanding-monthly-expense-totals",
    ],
    faq: [
      {
        q: "Can I filter by a single day — for example, today's expenses only?",
        a: "Yes. Set both the From and To dates to the same day. The list will show only expenses recorded on that date.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 66 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-sort-expenses-askbiz",
    title: "How to Sort Expenses by Date, Vendor, or Amount",
    description:
      "Learn how to use the column header sort controls in the AskBiz Expenses tab to reorder your expense list by date, vendor name, or amount in ascending or descending order.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "sort expenses",
      "sort by date",
      "sort by amount",
      "sort by vendor",
      "expense list order",
      "AskBiz sorting",
    ],
    keyTakeaways: [
      "Tap a column header in the expense list to sort by that column — tap again to reverse the order.",
      "The default sort is by date descending, showing the most recent expense first.",
      "Sorting by amount descending is a quick way to identify your largest single expenses.",
    ],
    content: [
      {
        heading: "The Default Sort Order",
        body: "When you open the Expenses tab, the expense list is sorted by date descending — the most recently recorded expense appears at the top of the list and older entries appear further down. This default order is the most useful for day-to-day use because you can instantly see your latest transactions without scrolling. A small downward arrow icon next to the Date column header indicates the current active sort direction.",
      },
      {
        heading: "Sorting by Date",
        body: "The Date column header is the first column in the expense list. To sort from oldest to newest (ascending date order), tap the Date column header once. The arrow icon next to the header changes to point upward, and the list reorders so the oldest expense is at the top. This is useful when you want to review expenses chronologically from the beginning of a period. To return to newest-first (descending), tap the Date header again. The arrow flips downward and the list reverts to the default order.",
      },
      {
        heading: "Sorting by Vendor",
        body: "Tap the Vendor column header to sort the list alphabetically by vendor name in ascending order (A to Z). The active column header highlights to indicate it is the current sort key. Tap the Vendor header again to reverse the order to Z to A. Alphabetical sorting is useful when you want to group all expenses from a single vendor together — for example, to add up all Slack invoices across a quarter without using the search bar.",
      },
      {
        heading: "Sorting by Amount",
        body: "Tap the Amount column header to sort the list from smallest to largest amount (ascending). Tap again to sort from largest to smallest (descending). Sorting by amount descending is one of the fastest ways to identify where large one-off costs occurred. If your cash balance dropped unexpectedly in a given month, sort by amount to see the biggest outlays at a glance. This sort order also makes it easy to spot duplicate entries — two expenses for the same amount from the same vendor on similar dates stand out immediately when the list is amount-sorted.",
      },
    ],
    relatedSlugs: [
      "how-to-search-expenses-askbiz",
      "how-to-filter-expenses-by-category",
      "understanding-monthly-expense-totals",
    ],
    faq: [
      {
        q: "Does my sort preference save between sessions?",
        a: "The sort resets to the default date-descending order each time you reopen the Expenses tab. Set the sort order manually each session as needed.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 67 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-delete-an-expense-askbiz",
    title: "How to Delete an Expense in AskBiz",
    description:
      "Step-by-step guide to deleting an incorrectly entered or duplicate expense from the AskBiz Expenses tab, including the confirmation prompt and what happens to your metrics.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "delete expense",
      "remove expense",
      "AskBiz delete",
      "duplicate expense",
      "expense error",
      "undo expense",
    ],
    keyTakeaways: [
      "Tap an expense row to open it, then tap the Delete button at the bottom of the edit form.",
      "A confirmation dialog appears before the expense is permanently removed — tap Confirm Delete to proceed.",
      "Deleted expenses cannot be recovered, so verify the entry before deleting.",
    ],
    content: [
      {
        heading: "When to Delete an Expense",
        body: "Delete an expense when it was entered by mistake, when it is a clear duplicate of an entry already in the list, or when it was saved with incorrect information that cannot be corrected by editing (for example, a test entry from when you were setting up the app). For most errors — wrong amount, wrong vendor, wrong date — it is faster to edit the expense rather than delete it and re-enter it. Only delete when the entire entry needs to go.",
      },
      {
        heading: "Opening the Expense to Delete",
        body: "Navigate to the Expenses tab. Find the expense you want to delete by scrolling, searching, or filtering. Once the expense row is visible in the list, tap anywhere on the row. The expense edit form opens, displaying all the current field values for that entry — vendor, date, amount, category, and notes.",
      },
      {
        heading: "Using the Delete Button",
        body: "Scroll to the bottom of the edit form. You will see a red Delete button labelled Delete Expense or similar. Tap this button. A confirmation dialog appears asking you to confirm that you want to permanently delete this expense. The dialog typically displays the vendor name and amount of the expense so you can verify you are deleting the right entry. Read the confirmation message carefully.",
      },
      {
        heading: "Confirming the Deletion",
        body: "In the confirmation dialog, tap the Confirm or Delete button to proceed with deletion. The dialog closes, the expense is removed from the database, and the expense list reloads without that entry. The Category Breakdown bar updates immediately, and all CFO metric cards recalculate. If you tapped Delete accidentally, tap Cancel or Dismiss in the confirmation dialog — the expense will not be deleted. If you have already confirmed the deletion, the expense cannot be recovered.",
      },
    ],
    relatedSlugs: [
      "how-to-add-expense-manually-askbiz",
      "how-to-fix-incorrectly-scanned-receipt",
      "intro-to-expenses-tab-askbiz",
    ],
    faq: [
      {
        q: "Can I bulk-delete multiple expenses at once?",
        a: "Not currently. Each expense must be deleted individually. To clean up a large number of test entries, contact AskBiz support for assistance.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 68 ───────────────────────────────────────────────────────────
  {
    slug: "reading-expenses-category-breakdown-bar",
    title: "Reading the Expenses Category Breakdown Bar",
    description:
      "Understand the stacked bar chart at the top of the AskBiz Expenses tab — how to read proportions, what the colours mean, and how to click a segment to filter.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "category breakdown bar",
      "stacked bar chart",
      "expenses visualisation",
      "AskBiz CFO",
      "spending by category",
      "expense proportions",
    ],
    keyTakeaways: [
      "The stacked bar represents 100 percent of total expenses in the current filter period, split by category.",
      "Each colour segment corresponds to one expense category, and the segment width shows its share of total spending.",
      "Tapping a segment activates the matching category chip filter and shows only that category in the list below.",
    ],
    content: [
      {
        heading: "What the Bar Shows",
        body: "The Category Breakdown bar is a full-width horizontal bar at the top of the Expenses tab. It is a stacked proportional chart — the entire bar always represents 100 percent of total expenses for the current view. The bar is divided into coloured segments, each representing one expense category that has at least one recorded expense. The width of each segment is proportional to that category's share of total spending. A category that accounts for 40 percent of total expenses will occupy 40 percent of the bar's width. Categories with very small shares may appear as thin slivers.",
      },
      {
        heading: "Reading the Colour Legend",
        body: "Each expense category has a consistent colour throughout the AskBiz dashboard. The category colours follow a fixed palette: Payroll is typically the darkest shade (often dark indigo or charcoal) because it tends to be the largest expense for most businesses. Rent/Lease uses a medium shade. Lighter and more saturated colours are assigned to smaller categories like Meals and Entertainment or Supplies. A colour legend or tooltip is available by tapping and holding a segment, which displays the category name and the exact percentage and total amount for that segment.",
      },
      {
        heading: "How the Bar Responds to Filters",
        body: "The breakdown bar responds dynamically to any active filters you apply in the filter toolbar. If you set a date range filter to show only the current month, the bar recalculates to represent only expenses within that month. If you activate a category chip filter, the bar does not change because the bar's purpose is to show relative proportions — filtering to a single category would make the bar 100 percent that category and lose its usefulness. The bar therefore reflects the date range and search filters but remains independent of the category chip.",
      },
      {
        heading: "Tapping a Segment to Filter",
        body: "You can tap any colour segment in the breakdown bar to instantly filter the expense list to that category. When you tap a segment, the corresponding category chip in the filter toolbar activates (highlighted in its active colour), and the expense list updates to show only expenses in that category. This interaction is a shortcut — instead of scrolling through the chip row to find and tap the Marketing and Ads chip, you can tap the Marketing and Ads segment in the bar directly. To deactivate the filter, tap the highlighted chip in the chip row, or tap another segment in the bar to switch to a different category.",
      },
      {
        heading: "Using the Bar to Spot Overspending",
        body: "The most practical use of the breakdown bar is as a quick visual health check. Glance at the bar at the start of each week. If Payroll, Rent/Lease, and Software/SaaS make up the expected proportions, your cost structure looks normal. If you see a segment that looks larger than usual — for example, Travel has grown noticeably compared to last month — tap that segment to drill into the individual transactions and understand what drove the increase. This kind of visual pattern recognition is much faster than scrolling through a list of individual entries.",
      },
    ],
    relatedSlugs: [
      "14-expense-categories-explained-askbiz",
      "how-to-filter-expenses-by-category",
      "understanding-monthly-expense-totals",
    ],
    faq: [
      {
        q: "What happens to the bar if I have no expenses recorded?",
        a: "The bar is empty or hidden when there are no expenses in the current period. It appears as soon as at least one expense is recorded.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 69 ───────────────────────────────────────────────────────────
  {
    slug: "understanding-monthly-expense-totals",
    title: "Understanding Your Monthly Expense Totals",
    description:
      "How to use the AskBiz Expenses tab to find your total spending for any month, understand the list footer total, and track month-over-month trends.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "monthly expenses",
      "total expenses",
      "monthly spending",
      "expense total",
      "AskBiz CFO",
      "monthly burn",
    ],
    keyTakeaways: [
      "Set the date range filter to a calendar month to see the total for that month in the footer.",
      "The footer total updates dynamically whenever you change any filter, showing the sum of all visible rows.",
      "Comparing monthly totals over several months reveals spending trends and cost creep early.",
    ],
    content: [
      {
        heading: "Finding the Total for a Month",
        body: "To see your total expenses for a specific month, use the date range filter. Tap the From input and select the first day of the month — for example, 1 June 2025. Then tap the To input and select the last day of that month — 30 June 2025. The expense list updates to show only June expenses. At the bottom of the expenses list, a footer row displays the total amount for all visible entries. This total is the sum of every expense in June across all categories.",
      },
      {
        heading: "How the Footer Total Works",
        body: "The footer total is a live aggregate that reflects the current state of the expense list, including all active filters. If you also have a category chip active — for example, Software/SaaS — the footer shows the total for Software/SaaS expenses in June only, not the full June total. If you type a vendor name in the search bar, the footer total shows only the sum for that vendor in June. The footer is labelled Total or Total Expenses and typically displays in a larger or bolder font than the individual row amounts to make it easy to spot.",
      },
      {
        heading: "Comparing Month to Month",
        body: "To compare spending across months, note the footer total for one month, then change the date range to the previous month and note that total. For a more systematic comparison, work through the last three to six months and write down each total. A consistent month-on-month increase in total expenses without a corresponding increase in revenue is a warning sign of cost creep — spending that grows gradually without being driven by deliberate business decisions. AskBiz does not currently display a side-by-side month comparison view, so this manual comparison is the available method.",
      },
      {
        heading: "Monthly Category Totals",
        body: "To understand monthly spending within a specific category, combine the date range and category chip filters. Set the date range to the desired month, then tap the category chip for the category you want to analyse. The footer total now shows spending for that category in that month. For example, to see how much you spent on Professional Services in May, set the date range to May and tap the Professional Services chip. The footer shows the sum. Repeat with the date range set to April to get the April figure and compare the two.",
      },
      {
        heading: "Expenses and the Monthly Fixed Costs Card",
        body: "The Monthly Fixed Costs card visible on the main CFO dashboard shows a configured estimate of your fixed costs, as set in the Cost Configuration drawer. This figure does not automatically match the Expenses tab total for the month because the card uses configured values rather than recorded transactions. The goal is to close this gap over time: as you log all your expenses consistently, the Expenses tab total becomes your actual spend, and you can use that actual figure to update the configured values in Cost Configuration for more accurate forecasting.",
      },
    ],
    relatedSlugs: [
      "how-to-filter-expenses-by-date-range",
      "how-expense-data-connects-burn-rate",
      "how-to-read-monthly-fixed-costs-card",
    ],
    faq: [
      {
        q: "Does the footer total include VAT?",
        a: "The footer totals whatever amounts you entered in the Amount field. If you entered amounts inclusive of VAT, the total includes VAT. If you entered net amounts, the total is net. Be consistent in how you record amounts.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 70 ───────────────────────────────────────────────────────────
  {
    slug: "how-expense-data-connects-burn-rate",
    title: "How Expense Data Connects to Your Burn Rate",
    description:
      "Understand the data flow from the AskBiz Expenses tab through to the burn rate calculation, and why keeping expenses up to date makes every CFO metric more reliable.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "burn rate",
      "expense data",
      "cash burn",
      "AskBiz CFO",
      "runway impact",
      "expense accuracy",
    ],
    keyTakeaways: [
      "The Daily Net Gain/Burn card reads directly from the expenses recorded in the Supabase database.",
      "Missing or incorrect expenses cause the burn rate to appear lower than reality, overstating runway.",
      "Logging expenses in real time — rather than in batches at month end — keeps burn rate metrics current.",
    ],
    content: [
      {
        heading: "The Data Flow From Expense to Metric",
        body: "Every time you save an expense in AskBiz, the record is written to the cfo_expenses table in your Supabase database. The CFO dashboard reads from this table whenever it calculates the metric card values. The Daily Net Gain/Burn card queries the expenses table for all expenses with today's date (or the current period) and sums them. It then compares this outflow total against the revenue data from your point-of-sale system or manual revenue entries to compute the net figure. The result appears on the card within seconds of you saving a new expense.",
      },
      {
        heading: "How Burn Rate Is Calculated",
        body: "The burn rate calculation in AskBiz uses a rolling average of your recent expense data rather than a single day's figure. This smooths out one-off large payments — a quarterly rent payment, for example — so the daily burn rate reflects your typical ongoing cost base rather than spiking on payment days. The rolling window is typically 30 days. Total expenses over the last 30 days are divided by 30 to produce a daily average burn figure. If the sum of your daily average revenue exceeds this daily average burn, the card shows a positive net gain. If burn exceeds revenue, it shows a net burn figure.",
      },
      {
        heading: "The Impact of Missing Expenses",
        body: "If you forget to log expenses, the burn rate will appear lower than it actually is. For example, if your actual monthly expenses are 8,000 but you have only logged 5,000, the dashboard will calculate burn based on the 5,000 figure. This produces an overstated runway estimate. If your current cash balance is 40,000 and actual burn is 8,000 per month, real runway is 5 months. But if the dashboard sees only 5,000 in expenses, it calculates a 6,000 burn rate (mixing logged and configured costs) and shows 6.5 months of runway — a 30 percent overstatement. Financial decisions made on the basis of the 6.5-month figure could leave your business short of cash.",
      },
      {
        heading: "Expenses and the Cash Runway Card",
        body: "The Cash Runway card takes the current cash balance and divides it by the average monthly burn rate to project how many months of operating cash remain. Since burn rate depends on expense data, a well-maintained Expenses tab translates directly into a reliable Runway card. Every time you scan a receipt or manually add an expense, you are improving the quality of your runway estimate. The more complete and timely your expense recording, the more trustworthy the runway number.",
      },
      {
        heading: "Building a Daily Expense Logging Habit",
        body: "The most effective approach is to log expenses as they happen rather than batching them at the end of the week or month. For physical receipts, scan them immediately after receiving them using the floating camera button. For digital invoices and subscription charges, set a daily two-minute habit of checking your email for new receipts and logging them. Month-end batch logging means your burn rate data is stale for most of the month, which reduces the utility of the real-time CFO dashboard. Frequent small logging sessions take less total time than one large catch-up session and keep your metrics accurate all month.",
      },
    ],
    relatedSlugs: [
      "how-to-read-daily-net-gain-burn-card",
      "how-to-read-cash-runway-card",
      "burn-rate-vs-runway-relationship",
    ],
    faq: [
      {
        q: "Do expenses from the Expenses tab override the configured costs in Cost Configuration?",
        a: "No. The configured costs and the recorded expenses serve different purposes. Configured costs are used for forecasting assumptions; recorded expenses are the actual transaction history. Both inform different parts of the dashboard.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 71 ───────────────────────────────────────────────────────────
  {
    slug: "what-is-rolling-cash-forecast-askbiz",
    title: "What Is the Rolling Cash Forecast?",
    description:
      "An overview of the Rolling Cash Forecast feature in the AskBiz CFO dashboard — what it shows, why it is called rolling, and how far ahead it projects your cash position.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "rolling cash forecast",
      "cash flow forecast",
      "AskBiz CFO",
      "weekly forecast",
      "cash projection",
      "cash runway",
    ],
    keyTakeaways: [
      "The Rolling Cash Forecast projects your week-by-week cash position for the next 12 weeks based on historical patterns.",
      "It is called rolling because the forecast window advances by one week each week, always showing the next 12 weeks from today.",
      "The forecast combines historical revenue and expense patterns with any outstanding receivables you have entered.",
    ],
    content: [
      {
        heading: "What the Rolling Cash Forecast Is",
        body: "The Rolling Cash Forecast is a financial planning tool inside the AskBiz CFO dashboard. It displays a weekly table projecting your business's expected inflows, outflows, net cash movement, and running balance for the next 12 weeks. It answers the practical question: if my revenue and expenses follow their recent patterns, how much cash will I have each week over the coming quarter? This gives you an early warning of potential cash shortfalls weeks before they happen, giving you time to take corrective action — such as chasing outstanding invoices, cutting discretionary spending, or arranging a credit facility.",
      },
      {
        heading: "Why It Is Called Rolling",
        body: "A static forecast is fixed to a calendar period — for example, January to December. A rolling forecast always projects the same number of periods forward from today, regardless of the calendar. The AskBiz forecast looks 12 weeks ahead at all times. On Monday of week one, it shows weeks one through twelve. By the following Monday, week one has passed and the forecast has advanced: it now shows weeks two through thirteen. The forecast window rolls forward continuously, so you always have a full 12-week outlook in front of you. This is more useful than a static forecast that gets shorter as the year progresses.",
      },
      {
        heading: "What Data Drives the Forecast",
        body: "The forecast engine uses three data sources. First, it analyses your historical revenue data from the last 90 days to identify weekly revenue patterns, including day-of-week seasonality and any growth or decline trend. Second, it looks at your historical expense data from the Expenses tab over the same 90-day period, separating fixed recurring costs from variable costs. Third, it incorporates any outstanding receivables — unpaid invoices you are expecting to collect — that you have entered into the system. These three inputs are combined to project the inflow and outflow figures for each future week.",
      },
      {
        heading: "Where to Find the Forecast",
        body: "The Rolling Cash Forecast is accessible from the Cash Flow tab in the AskBiz CFO dashboard. Navigate to Intelligence in the bottom navigation bar, then tap Cash Flow. Within the Cash Flow tab, scroll down past the metric cards and the daily cash chart until you reach the Rolling Forecast section. The forecast appears as a table with one row per week. On narrower screens, the table scrolls horizontally to show all columns.",
      },
      {
        heading: "How Accurate Is the Forecast?",
        body: "The accuracy of the forecast depends on the quality and completeness of your historical data. If you have been logging expenses consistently for at least 60 days and your revenue data is connected, the forecast will be a reasonable approximation of your near-term cash position. The forecast is less reliable for businesses that are growing very quickly, have highly seasonal revenue, or have large irregular expenses such as annual licence renewals. The forecast assumes that patterns from the recent past will broadly continue. It is a planning tool and a direction indicator — not a precise guarantee of future cash balances.",
      },
    ],
    relatedSlugs: [
      "how-to-read-weekly-forecast-table",
      "how-inflows-are-projected-forecast",
      "how-outflows-are-calculated-forecast",
    ],
    faq: [
      {
        q: "Can I change the forecast horizon from 12 weeks to something else?",
        a: "Not currently. The forecast window is fixed at 12 weeks. Custom horizon settings are on the product roadmap.",
      },
      {
        q: "Does the forecast update automatically?",
        a: "Yes. The forecast recalculates each time you open the Cash Flow tab and incorporates the most recent expense and revenue data.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 72 ───────────────────────────────────────────────────────────
  {
    slug: "how-to-read-weekly-forecast-table",
    title: "How to Read the Weekly Forecast Table",
    description:
      "A complete guide to every column in the AskBiz Rolling Cash Forecast table — Week, Projected Inflow, Projected Outflow, Net Cash Flow, and Running Balance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "forecast table",
      "weekly forecast",
      "cash flow columns",
      "AskBiz forecast",
      "inflow outflow",
      "running balance",
    ],
    keyTakeaways: [
      "The table has five columns: Week, Projected Inflow, Projected Outflow, Net Cash Flow, and Running Balance.",
      "Net Cash Flow is Inflow minus Outflow for that week — green means cash positive, red means cash negative.",
      "Running Balance shows the cumulative cash balance at the end of each week, assuming the projected figures materialise.",
    ],
    content: [
      {
        heading: "Overview of the Table Structure",
        body: "The Rolling Cash Forecast table has one row for each of the next 12 weeks. Each row contains five columns. Reading left to right: the Week column identifies the calendar week, the Projected Inflow column shows expected money coming into the business that week, the Projected Outflow column shows expected money going out, the Net Cash Flow column shows the difference, and the Running Balance column shows the cumulative cash balance at the end of that week. The table starts with the current week at the top and extends 12 weeks into the future.",
      },
      {
        heading: "The Week Column",
        body: "Each row in the Week column is labelled with a short date range indicating the Monday to Sunday of that week — for example, 2 Jun - 8 Jun. The current week may also be labelled as This Week for clarity. Weeks in the near future (weeks one and two) are considered higher-confidence projections. Weeks further out (weeks ten to twelve) are lower-confidence because they are based on extrapolated trends with more potential for variance.",
      },
      {
        heading: "Projected Inflow and Projected Outflow",
        body: "The Projected Inflow column shows the total expected revenue and incoming cash for that week. This includes forecasted sales revenue, expected receipt of outstanding invoices, and any other anticipated inflows. The Projected Outflow column shows the total expected spending that week, including fixed costs such as rent and subscriptions that fall due in that week, variable costs projected from revenue, and any identified one-off costs such as a quarterly payment known to fall in a particular week. Both columns display amounts in your account currency.",
      },
      {
        heading: "Net Cash Flow Column",
        body: "The Net Cash Flow column for each row is simply Projected Inflow minus Projected Outflow. A positive net figure means more money is expected to come in than go out that week. AskBiz displays positive net figures in green text with an upward arrow indicator. A negative net figure means you are projected to spend more than you earn that week. Negative figures appear in red text with a downward arrow. A negative net week is not necessarily a crisis — many businesses have regular high-expense weeks followed by high-revenue weeks — but a string of consecutive negative net weeks is a warning to investigate.",
      },
      {
        heading: "Running Balance Column",
        body: "The Running Balance column shows the projected cash balance at the end of each week, calculated cumulatively. The first row's Running Balance is your current cash balance plus or minus that week's Net Cash Flow. The second row's Running Balance takes the first row's ending balance and adds the second week's Net Cash Flow. And so on, week by week. The Running Balance is the most decision-critical column in the table. If the Running Balance is projected to fall below your minimum operating reserve at any point in the 12-week window, that is a flag to take action now — not when the shortfall actually arrives.",
      },
    ],
    relatedSlugs: [
      "what-is-rolling-cash-forecast-askbiz",
      "what-is-net-cash-flow-forecast",
      "how-inflows-are-projected-forecast",
    ],
    faq: [
      {
        q: "What does it mean if the Running Balance goes negative in the forecast?",
        a: "It means AskBiz projects you will run out of cash in that week if current patterns continue. You should take action before then — cut costs, accelerate receivables collection, or arrange financing.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 73 ───────────────────────────────────────────────────────────
  {
    slug: "how-inflows-are-projected-forecast",
    title: "How Inflows Are Projected in the Forecast",
    description:
      "An explanation of the methodology AskBiz uses to project weekly cash inflows in the Rolling Cash Forecast, including historical patterns, seasonal adjustments, and receivables.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "inflow projection",
      "revenue forecast",
      "cash inflow",
      "AskBiz forecast methodology",
      "historical patterns",
      "receivables forecast",
    ],
    keyTakeaways: [
      "Projected inflows start from a rolling average of your recent weekly revenue, then adjust for identified trends and seasonality.",
      "Outstanding receivables you have entered are added as point-in-time inflow spikes in the week they are expected to be paid.",
      "The projection is not a commitment — it is a statistically informed estimate that improves as you log more revenue history.",
    ],
    content: [
      {
        heading: "Step One: Establishing the Baseline Revenue Pattern",
        body: "The first stage of inflow projection is establishing a weekly baseline from historical data. AskBiz looks at your revenue data for the previous 90 days and calculates the average weekly revenue over that period. This becomes the starting baseline projection for each future week. If your business has been generating an average of 6,000 in revenue per week over the last 90 days, each forecast week begins with 6,000 as its base inflow figure. The 90-day window is long enough to smooth out short-term noise but short enough to remain responsive to recent business performance.",
      },
      {
        heading: "Step Two: Applying a Trend Adjustment",
        body: "If your revenue has been growing or declining over the 90-day window, the forecast engine applies a trend adjustment to each future week. A linear trend is calculated by comparing the average revenue in the first 30 days of the window against the average in the most recent 30 days. If your average weekly revenue grew from 5,000 in the first month to 7,000 in the most recent month, the engine infers a growth trend and projects that each successive future week will be slightly higher than the baseline. A declining trend works in reverse. The trend adjustment is modest and bounded — the engine does not extrapolate extreme growth rates into the future without dampening them.",
      },
      {
        heading: "Step Three: Seasonal Pattern Recognition",
        body: "For businesses that have been using AskBiz for more than one annual cycle, the forecast can identify seasonal patterns — predictable recurring variations in revenue tied to time of year. A retail business that sees a 40 percent lift in revenue in December will have that December uplift incorporated into the forecast for future December weeks. Similarly, a business with quiet summer months will see those weeks projected with lower inflows. Seasonal adjustment requires at least 52 weeks of revenue history. If you have less than 52 weeks of data, the forecast uses only the recent trend without seasonal overlay.",
      },
      {
        heading: "Step Four: Adding Outstanding Receivables",
        body: "In addition to the pattern-based projection, you can add outstanding receivables — invoices you have issued to customers that have not yet been paid. When you enter a receivable with an expected payment date, AskBiz adds that amount to the Projected Inflow for the week in which the payment is expected to arrive. This creates a spike in the forecast on the appropriate week. If the payment does not arrive on time, you can update the expected payment date in your receivables record, and the forecast adjusts accordingly.",
      },
      {
        heading: "Confidence and Limitations",
        body: "Weeks one and two of the forecast carry the highest confidence because they are close in time to the current data and the pattern-to-reality gap is small. Week twelve carries the lowest confidence because many things can change over three months. Inflow projections can be significantly off if your business has: an irregular payment structure such as large annual contracts; a recent pivotal change in pricing or product mix; an external event such as a major customer churning; or inadequate revenue history in AskBiz. Treat the forecast as a decision-support tool that helps you identify risk, not as a precise prediction of the future.",
      },
    ],
    relatedSlugs: [
      "what-is-rolling-cash-forecast-askbiz",
      "how-outflows-are-calculated-forecast",
      "how-to-read-weekly-forecast-table",
    ],
    faq: [
      {
        q: "How do I add an outstanding receivable to the forecast?",
        a: "Navigate to the Receivables section (if available in your plan) and enter the customer, amount, and expected payment date. The amount automatically appears in the relevant forecast week's inflow.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 74 ───────────────────────────────────────────────────────────
  {
    slug: "how-outflows-are-calculated-forecast",
    title: "How Outflows Are Calculated in the Forecast",
    description:
      "Understand how AskBiz calculates projected weekly outflows in the Rolling Cash Forecast, combining your fixed cost schedule with variable cost percentages derived from revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "outflow calculation",
      "forecast expenses",
      "fixed costs forecast",
      "variable costs forecast",
      "cash outflow",
      "AskBiz forecast",
    ],
    keyTakeaways: [
      "Fixed costs from your Cost Configuration drawer are scheduled across future weeks based on their payment cycle.",
      "Variable costs are projected as a percentage of projected revenue, derived from your historical expense-to-revenue ratio.",
      "Reviewing and updating your Cost Configuration regularly keeps the outflow projection aligned with reality.",
    ],
    content: [
      {
        heading: "Two Types of Outflow: Fixed and Variable",
        body: "AskBiz separates projected outflows into two components: fixed costs and variable costs. Fixed costs are expenses that recur on a regular schedule regardless of revenue — rent, payroll, software subscriptions, insurance premiums. Variable costs scale with business activity — merchant processing fees, packaging, delivery charges, and commission payments tend to rise when revenue rises. By separating these two components, the forecast can project outflows more accurately than treating all costs as a single block.",
      },
      {
        heading: "How Fixed Costs Are Scheduled",
        body: "Fixed costs are drawn from the values you entered in the Cost Configuration drawer, which is accessible from the CFO dashboard settings. When you configure a fixed cost — for example, 3,500 rent paid on the first of each month — AskBiz places that amount into the Projected Outflow column for the week in which the first of the month falls. If your payroll runs on the 15th and 28th of each month, the payroll amount appears in the two relevant forecast weeks for each month in the 12-week window. This scheduling means the outflow column shows spikes on payroll and rent weeks rather than a flat weekly average, which is a more realistic picture of your cash flow timing.",
      },
      {
        heading: "How Variable Costs Are Projected",
        body: "Variable costs are projected using a ratio derived from your historical data. AskBiz looks at the last 90 days of expenses in variable-cost categories — primarily Supplies, Shipping, Meals and Entertainment, and Travel — and compares their total to the revenue generated over the same period. This produces a variable cost ratio, expressed as a percentage of revenue. For example, if you spent 1,200 on variable costs in a month when revenue was 12,000, your variable cost ratio is 10 percent. For each future week, AskBiz applies this 10 percent ratio to the projected inflow for that week to estimate the variable outflow.",
      },
      {
        heading: "One-Off Known Costs",
        body: "In addition to scheduled fixed costs and variable cost ratios, you can flag upcoming one-off costs that are not part of a regular cycle. For example, if you know you will be paying a 4,000 annual software licence renewal in three weeks, you can record this as a planned expenditure with the relevant date. AskBiz adds this amount to the Projected Outflow for that week. Without flagging it, the forecast would not know to include it and the outflow for that week would be understated.",
      },
      {
        heading: "Keeping the Forecast Accurate",
        body: "The accuracy of the outflow projection depends on two things: the completeness of your Cost Configuration (for fixed cost scheduling) and the accuracy of your recorded expenses (for the variable cost ratio). Review your Cost Configuration at least once a month to ensure fixed cost amounts are current — if your rent increased at the start of a new lease period, update the figure. If your variable costs have changed materially — for example, you switched to a cheaper shipping provider — the ratio will update naturally over time as the new lower expenses enter the 90-day calculation window, but you can accelerate the update by ensuring all recent shipping expenses are correctly logged.",
      },
    ],
    relatedSlugs: [
      "how-inflows-are-projected-forecast",
      "what-is-rolling-cash-forecast-askbiz",
      "how-to-configure-fixed-costs-askbiz",
    ],
    faq: [
      {
        q: "Why does the forecast show a big outflow spike in one particular week?",
        a: "This usually indicates a scheduled fixed cost — such as rent or payroll — falls due in that week. Check your Cost Configuration to see which cost is scheduled for that date.",
      },
    ],
    videoUrl: "",
  },

  // ─── Article 75 ───────────────────────────────────────────────────────────
  {
    slug: "what-is-net-cash-flow-forecast",
    title: "What Net Cash Flow Means in the Forecast",
    description:
      "A clear explanation of the Net Cash Flow column in the AskBiz Rolling Cash Forecast — how it is calculated, what green and red colours mean, and how the cumulative running balance is built from it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "net cash flow",
      "forecast net",
      "inflow minus outflow",
      "cumulative balance",
      "AskBiz forecast",
      "cash positive week",
    ],
    keyTakeaways: [
      "Net Cash Flow for each week equals Projected Inflow minus Projected Outflow — a simple subtraction.",
      "Green net figures mean that week is expected to add cash to your balance; red means it will reduce it.",
      "The Running Balance column accumulates each week's net figure onto your current cash balance.",
    ],
    content: [
      {
        heading: "The Simple Formula",
        body: "Net Cash Flow for any given week in the Rolling Cash Forecast is calculated by a straightforward formula: Projected Inflow minus Projected Outflow equals Net Cash Flow. For example, if week three shows a Projected Inflow of 8,400 and a Projected Outflow of 6,900, the Net Cash Flow for that week is plus 1,500. If week four shows Projected Inflow of 6,000 and Projected Outflow of 9,200 (a payroll week), the Net Cash Flow is minus 3,200. These are the two possible outcomes: a positive net week adds cash, a negative net week drains cash.",
      },
      {
        heading: "Green and Red Colour Coding",
        body: "AskBiz uses a consistent colour scheme to make Net Cash Flow easy to read at a glance. Positive figures (inflow greater than outflow) are displayed in green text, often with a small upward arrow icon. Negative figures (outflow greater than inflow) are displayed in red text, often with a small downward arrow icon. A week with exactly zero net cash flow — inflow exactly equal to outflow — displays in a neutral grey. Because forecasting involves estimates, a very small positive or negative figure should be treated as approximately neutral rather than as a firm prediction of cash gain or loss.",
      },
      {
        heading: "How the Running Balance Is Built",
        body: "The Running Balance column is built by adding each week's Net Cash Flow to the previous week's Running Balance. It starts with your current cash balance as the opening position. Week one's Running Balance equals current balance plus week one's Net Cash Flow. Week two's Running Balance equals week one's Running Balance plus week two's Net Cash Flow. This process continues through all 12 weeks. The result is a projected cash balance at the end of each week that shows whether your cash cushion is growing, holding steady, or being depleted over the forecast horizon.",
      },
      {
        heading: "Reading the Forecast for Cash Health",
        body: "Scan the Net Cash Flow column from top to bottom. A healthy pattern shows a mix of positive and negative weeks, with positive weeks outnumbering negative ones overall. A concerning pattern shows several consecutive red weeks, especially if those red weeks coincide with large outflow spikes such as payroll fortnights. The most actionable signal is when the Running Balance column begins showing declining values week over week and is projected to reach a low point within eight weeks. This gives you a specific timeline — eight weeks — in which to take action to reverse the trend.",
      },
      {
        heading: "Using Net Cash Flow to Plan Timing of Payments",
        body: "Net cash flow awareness helps you time discretionary payments strategically. If the forecast shows week six will be a strongly positive week — perhaps because a large receivable is expected to be paid — and you are planning to purchase new equipment, timing that purchase for week six means the outflow lands when your cash position is strongest. Conversely, if week five is already projected as a heavy outflow week due to payroll and rent, avoid scheduling additional discretionary purchases that week. The forecast provides the visibility to make these timing judgements confidently.",
      },
    ],
    relatedSlugs: [
      "how-to-read-weekly-forecast-table",
      "how-inflows-are-projected-forecast",
      "how-outflows-are-calculated-forecast",
    ],
    faq: [
      {
        q: "Is the Net Cash Flow figure the same as profit?",
        a: "No. Net cash flow measures actual cash movement during a period. Profit is a different concept that uses accrual accounting rules and includes non-cash items such as depreciation. A business can be profitable yet have negative net cash flow in a given week if customers have not yet paid their invoices.",
      },
      {
        q: "What should I do if I see several consecutive red weeks in the forecast?",
        a: "Review your expense schedule and look for discretionary costs you can defer. Check whether any outstanding invoices can be chased to arrive sooner. Consider whether a short-term credit facility would bridge the gap. The goal is to act on the forecast before the cash shortfall occurs, not after.",
      },
    ],
    videoUrl: "",
  },
];
