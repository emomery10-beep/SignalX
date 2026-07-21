import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'KRA eTIMS POS — Clean Sales Records for Kenyan Businesses | AskBiz',
  description: 'A phone POS that keeps every sale itemized, timestamped and exportable — so your eTIMS registration and accountant get clean records, not a notebook to untangle. No card machine needed.',
  keywords: ['KRA eTIMS POS', 'eTIMS Kenya', 'eTIMS compliant records', 'KRA record keeping POS', 'digital sales records Kenya', 'eTIMS small business'],
  openGraph: {
    title: 'KRA eTIMS POS — Clean, Exportable Sales Records',
    description: 'Every sale itemized and timestamped automatically, ready for your eTIMS filing or your accountant — no manual reconstruction at tax time.',
    url: 'https://askbiz.co/kra-etims-pos',
  },
  alternates: { canonical: 'https://askbiz.co/kra-etims-pos' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="KRA eTIMS POS"
      h1="Keep KRA-Ready Sales Records Without a Notebook"
      subheading="AskBiz itemizes, timestamps and stores every sale automatically — so when it's time to deal with eTIMS or hand figures to your accountant, the records are already clean. No card machine, no spreadsheet rebuild at filing time."
      intro="Since the KRA eTIMS (electronic Tax Invoice Management System) rules came in, a lot of small Kenyan business owners have been left unsure what's actually required of them, and worried about the penalties — up to KES 1 million — for getting it wrong. Many are still running the business out of a receipt book or a school exercise book, which is fine for remembering what was sold but a genuine nightmare to turn into the kind of clean, itemized record eTIMS registration and tax filing actually need. AskBiz doesn't file eTIMS invoices for you automatically — that submission step isn't built into the app yet — but it solves the harder half of the problem quietly, in the background: every single sale, from the moment you ring it up on your phone, is itemized, timestamped, and stored, ready to export or hand over whenever you need it."
      problem={{
        heading: "Notebooks don't survive contact with a tax deadline",
        body: "A paper record works fine day to day — you know roughly what you sold and what came in. The trouble starts when you actually need that data in a structured form: registering for eTIMS, filing VAT, or answering a KRA query about a specific week's sales. Reconstructing itemized, dated, priced records from handwriting after the fact is slow, error-prone, and stressful, especially if pages are missing or a helper's handwriting is hard to read months later. Business owners we've spoken to aren't confused about wanting to comply — they're confused about how to get from 'notebook' to 'proper digital record' without redoing months of work by hand.",
      }}
      solution={{
        heading: "Every sale is already structured — you just export it",
        body: "There's no separate step where you 'do your records' at the end of the month. Every sale rung up in AskBiz — whether paid by M-Pesa, Airtel Money, MTN Mobile Money, cash or card — is saved immediately with the item, quantity, price, timestamp and payment method attached. Nothing needs re-typing. When you're ready to register for eTIMS, file VAT, or simply hand your accountant a clean set of figures, you export the period you need instead of piecing it together from memory or paper. It turns compliance from an end-of-month scramble into something that was quietly done for you all along.",
      }}
      features={[
        { icon: '🧾', title: 'Every sale itemized automatically', body: 'Item, price, quantity, timestamp and payment method are recorded the moment you ring up a sale — no manual entry after the fact.' },
        { icon: '📤', title: 'Export any date range', body: 'Pull a clean sales record for a day, a month, or a custom period whenever you need it for filing or for your accountant.' },
        { icon: '🗂️', title: 'No paper to lose or misread', body: 'Records live on your phone and sync to the cloud, so nothing depends on a notebook page surviving or being legible months later.' },
        { icon: '💳', title: 'Every payment method captured', body: 'M-Pesa, Airtel Money, MTN Mobile Money, cash and card sales are all recorded the same clean way, with no separate reconciliation.' },
        { icon: '🕒', title: 'Timestamped, not estimated', body: 'Every sale carries the exact time it happened, so there is never a guess about which day or week a transaction falls into.' },
        { icon: '🧮', title: 'Ready for your accountant', body: 'Hand over an export instead of a stack of receipts — your accountant spends less time untangling and more time filing.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Sell as normal on your phone', body: 'Ring up items with the camera or by tapping, take payment by M-Pesa, Airtel, MTN, cash or card — nothing extra to do.' },
        { step: '2', title: 'The sale is itemized instantly', body: 'Item, quantity, price, time and payment method are saved automatically the moment the sale completes.' },
        { step: '3', title: 'Pick a date range when you need it', body: 'At filing time, or before an eTIMS registration step, export exactly the period you need in a few taps.' },
        { step: '4', title: 'Hand it to your accountant or use it yourself', body: 'The export is clean and structured — ready for manual eTIMS entry or straight to whoever handles your filing.' },
      ]}
      faqs={[
        { q: 'Does AskBiz submit eTIMS invoices to KRA automatically?', a: "No — that automated submission step isn't built into AskBiz yet. What AskBiz does today is keep a complete, itemized, timestamped digital record of every sale, which makes manual eTIMS entry or registration far faster because you are never reconstructing figures from memory or paper." },
        { q: 'Is AskBiz connected to my KRA account?', a: "No. AskBiz does not connect to KRA credentials or any government system. It is a POS and record-keeping tool — the records it produces are yours to use for your own eTIMS registration, VAT filing, or bookkeeping, however you choose to do that." },
        { q: 'What exactly do I get when I export my sales?', a: "A clean, itemized breakdown of every sale in the period you choose — item, quantity, price, timestamp and payment method (M-Pesa, Airtel, MTN, cash or card). It is built to be usable directly for eTIMS entry, VAT working, or your accountant, without further tidying." },
        { q: "I've been keeping a paper notebook — can I switch without losing history?", a: "You can start recording every new sale in AskBiz from today, which is the part that matters most going forward — clean digital records from here on, rather than trying to reconstruct compliant figures under deadline pressure later. AskBiz doesn't retroactively digitize old paper records." },
        { q: 'Do I need special hardware to keep KRA-ready records?', a: "No. AskBiz runs on the Android phone or iPhone you already have — no terminal, no separate scanner. The camera scans barcodes, and every sale is recorded the same clean way whether you're at a stall, a shop counter, or on the move." },
        { q: 'What if my business is still small and not eTIMS-registered yet?', a: "That's exactly when it helps most to start clean. Building the habit of itemized digital records from day one means that whenever you do register for eTIMS or cross a VAT threshold, you already have the history in the right shape instead of starting from nothing." },
      ]}
      cta={{
        heading: "Stop reconstructing records at filing time",
        body: "Every sale you ring up from today is already itemized and ready to export. No card required to start.",
      }}
      relatedPages={[
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
        { href: '/inventory-management-kenya', label: 'Inventory management Kenya' },
        { href: '/pricing', label: 'Pricing' },
      ]}
    />
  )
}
