export interface TaxConfig {
  vatRate: number
  vatName: string
  vatDueDay: number
  corporateRate: number
  smbRate: number
  smbThreshold: number
  turnoverTax?: { rate: number; minRevenue: number; maxRevenue: number }
  taxAuthority: string
  taxAuthorityShort: string
  complianceSystem?: string
  compliancePenalty?: string
  complianceItems?: string[]
  annualReturnMonth: number
  incomeTaxQuarters: number[]
}

export interface LenderProduct {
  name: string
  range: string
  minGrade: string
}

export interface RegionConfig {
  countryName: string
  currencyCode: string
  currencySymbol: string
  locale: string
  taxConfig: TaxConfig
  lenders: LenderProduct[]
  complianceTip: string
  receivablesInsight: string
  paymentMethods: string
  smbLabel: string
}

const REGIONS: Record<string, RegionConfig> = {
  KE: {
    countryName: 'Kenya',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    locale: 'en-KE',
    taxConfig: {
      vatRate: 0.16,
      vatName: 'VAT',
      vatDueDay: 20,
      corporateRate: 0.30,
      smbRate: 0.15,
      smbThreshold: 1_000_000,
      turnoverTax: { rate: 0.015, minRevenue: 1_000_000, maxRevenue: 25_000_000 },
      taxAuthority: 'Kenya Revenue Authority',
      taxAuthorityShort: 'KRA',
      complianceSystem: 'eTIMS',
      compliancePenalty: '25% penalty + 1% monthly interest on non-compliance',
      complianceItems: [
        'Register on eTIMS (free via KRA portal)',
        'Issue electronic invoices for ALL sales — transmitted to KRA in real-time',
        'Every invoice must include: KRA PIN, QR code, item details, buyer PIN (for VAT claims)',
        'Keep eTIMS receipts for ALL business expenses (otherwise KRA rejects them)',
        'File monthly VAT returns by the 20th of the following month',
      ],
      annualReturnMonth: 6,
      incomeTaxQuarters: [3, 5, 8, 11],
    },
    lenders: [
      { name: 'Fuliza Biashara', range: 'Up to KES 3M', minGrade: 'C' },
      { name: 'KCB Vooma', range: 'KES 50K–5M', minGrade: 'B' },
      { name: 'Equity Biashara', range: 'KES 100K–10M', minGrade: 'B' },
      { name: 'Cooperative Bank SME', range: 'KES 500K–50M', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining clean eTIMS records and consistent digital transactions improves eligibility across all lenders.',
    receivablesInsight: '91% of East African SMEs are owed money outside agreed terms. Tracking receivables helps you forecast cash flow and prioritize collections.',
    paymentMethods: 'M-Pesa payment at point of sale',
    smbLabel: 'Kenyan SMB',
  },

  GB: {
    countryName: 'United Kingdom',
    currencyCode: 'GBP',
    currencySymbol: '£',
    locale: 'en-GB',
    taxConfig: {
      vatRate: 0.20,
      vatName: 'VAT',
      vatDueDay: 7,
      corporateRate: 0.25,
      smbRate: 0.19,
      smbThreshold: 50_000,
      taxAuthority: 'HM Revenue & Customs',
      taxAuthorityShort: 'HMRC',
      complianceSystem: 'Making Tax Digital',
      compliancePenalty: 'Late filing penalties start at £200 and increase with each missed deadline',
      complianceItems: [
        'Register for Making Tax Digital (MTD) if VAT-registered',
        'Use MTD-compatible software to keep digital records',
        'Submit quarterly VAT returns digitally via MTD',
        'Keep records of all business transactions for 6 years',
        'File Corporation Tax return within 12 months of accounting period end',
      ],
      annualReturnMonth: 1,
      incomeTaxQuarters: [0, 3, 6, 9],
    },
    lenders: [
      { name: 'Iwoca', range: 'Up to £500K', minGrade: 'C' },
      { name: 'Funding Circle', range: '£10K–£500K', minGrade: 'B' },
      { name: 'NatWest Business', range: '£1K–£10M', minGrade: 'B' },
      { name: 'Barclays SME', range: '£25K–£25M', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining Making Tax Digital compliance and consistent digital records improves eligibility with all major UK lenders.',
    receivablesInsight: '62% of UK SMEs experience late payments. The average overdue invoice in the UK takes 23 days past terms to collect.',
    paymentMethods: 'card payment or bank transfer at point of sale',
    smbLabel: 'UK SME',
  },

  NG: {
    countryName: 'Nigeria',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    locale: 'en-NG',
    taxConfig: {
      vatRate: 0.075,
      vatName: 'VAT',
      vatDueDay: 21,
      corporateRate: 0.30,
      smbRate: 0.20,
      smbThreshold: 25_000_000,
      taxAuthority: 'Federal Inland Revenue Service',
      taxAuthorityShort: 'FIRS',
      complianceSystem: 'TaxPro Max',
      compliancePenalty: 'Penalty of N50,000 for late filing plus 10% of unpaid tax',
      complianceItems: [
        'Register on TaxPro Max (FIRS online portal)',
        'Obtain a Tax Identification Number (TIN)',
        'File VAT returns monthly by the 21st of the following month',
        'Withholding tax must be remitted within 21 days of deduction',
        'Companies must file annual tax returns within 6 months of year end',
      ],
      annualReturnMonth: 6,
      incomeTaxQuarters: [2, 5, 8, 11],
    },
    lenders: [
      { name: 'Carbon Business', range: 'Up to ₦5M', minGrade: 'C' },
      { name: 'Sterling Bank SME', range: '₦500K–₦50M', minGrade: 'B' },
      { name: 'GTBank Business', range: '₦1M–₦100M', minGrade: 'B' },
      { name: 'Access Bank SME', range: '₦5M–₦500M', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining TaxPro Max compliance and consistent digital records improves eligibility with Nigerian lenders.',
    receivablesInsight: '87% of Nigerian SMEs face delayed payments. Tracking receivables is critical for cash flow forecasting in the Nigerian business environment.',
    paymentMethods: 'bank transfer or mobile payment at point of sale',
    smbLabel: 'Nigerian SME',
  },

  ZA: {
    countryName: 'South Africa',
    currencyCode: 'ZAR',
    currencySymbol: 'R',
    locale: 'en-ZA',
    taxConfig: {
      vatRate: 0.15,
      vatName: 'VAT',
      vatDueDay: 25,
      corporateRate: 0.27,
      smbRate: 0.21,
      smbThreshold: 750_000,
      turnoverTax: { rate: 0.03, minRevenue: 0, maxRevenue: 1_000_000 },
      taxAuthority: 'South African Revenue Service',
      taxAuthorityShort: 'SARS',
      complianceSystem: 'eFiling',
      compliancePenalty: 'Penalties range from R250 to R16,000 per month for non-compliance',
      complianceItems: [
        'Register on SARS eFiling portal',
        'Submit VAT returns bi-monthly (every 2 months)',
        'Issue valid tax invoices for all sales over R50',
        'Keep records of all transactions for 5 years',
        'File annual income tax returns and provisional tax payments',
      ],
      annualReturnMonth: 11,
      incomeTaxQuarters: [1, 7],
    },
    lenders: [
      { name: 'Lulalend', range: 'Up to R5M', minGrade: 'C' },
      { name: 'Nedbank Business', range: 'R50K–R5M', minGrade: 'B' },
      { name: 'FNB Business', range: 'R100K–R10M', minGrade: 'B' },
      { name: 'Standard Bank SME', range: 'R500K–R50M', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining SARS eFiling compliance and consistent digital records improves eligibility with South African lenders.',
    receivablesInsight: '75% of South African SMEs experience cash flow issues due to late payments. Average payment terms are 30-60 days.',
    paymentMethods: 'EFT or card payment at point of sale',
    smbLabel: 'South African SME',
  },

  UG: {
    countryName: 'Uganda',
    currencyCode: 'UGX',
    currencySymbol: 'USh',
    locale: 'en-UG',
    taxConfig: {
      vatRate: 0.18,
      vatName: 'VAT',
      vatDueDay: 15,
      corporateRate: 0.30,
      smbRate: 0.15,
      smbThreshold: 150_000_000,
      taxAuthority: 'Uganda Revenue Authority',
      taxAuthorityShort: 'URA',
      complianceSystem: 'EFRIS',
      compliancePenalty: 'Penalty of 2% of tax due per month for late filing',
      complianceItems: [
        'Register on EFRIS (Electronic Fiscal Receipting and Invoicing Solution)',
        'Issue e-invoices for all taxable supplies via EFRIS',
        'File monthly VAT returns by the 15th of the following month',
        'Withholding tax must be remitted within 15 days',
        'File annual income tax returns by June 30th',
      ],
      annualReturnMonth: 6,
      incomeTaxQuarters: [2, 5, 8, 11],
    },
    lenders: [
      { name: 'Numida', range: 'Up to UGX 10M', minGrade: 'C' },
      { name: 'DFCU Business', range: 'UGX 5M–50M', minGrade: 'B' },
      { name: 'Stanbic Business', range: 'UGX 10M–500M', minGrade: 'B' },
      { name: 'Centenary Bank SME', range: 'UGX 50M–2B', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining EFRIS compliance and consistent digital records improves eligibility with Ugandan lenders.',
    receivablesInsight: '85% of Ugandan SMEs face delayed payments. Tracking receivables helps you manage cash flow and prioritize collections.',
    paymentMethods: 'Mobile Money payment at point of sale',
    smbLabel: 'Ugandan SMB',
  },

  TZ: {
    countryName: 'Tanzania',
    currencyCode: 'TZS',
    currencySymbol: 'TSh',
    locale: 'en-TZ',
    taxConfig: {
      vatRate: 0.18,
      vatName: 'VAT',
      vatDueDay: 20,
      corporateRate: 0.30,
      smbRate: 0.15,
      smbThreshold: 100_000_000,
      taxAuthority: 'Tanzania Revenue Authority',
      taxAuthorityShort: 'TRA',
      complianceSystem: 'EFD',
      compliancePenalty: 'Penalty of TZS 200,000 minimum for failure to use EFD machines',
      complianceItems: [
        'Register for EFD (Electronic Fiscal Device) machine',
        'Issue fiscal receipts for all sales via EFD',
        'File monthly VAT returns by the 20th of the following month',
        'File annual income tax returns by June 30th',
        'Keep all business records for at least 5 years',
      ],
      annualReturnMonth: 6,
      incomeTaxQuarters: [2, 5, 8, 11],
    },
    lenders: [
      { name: 'Tala Business', range: 'Up to TZS 5M', minGrade: 'C' },
      { name: 'NMB Business', range: 'TZS 2M–50M', minGrade: 'B' },
      { name: 'CRDB Business', range: 'TZS 5M–200M', minGrade: 'B' },
      { name: 'NBC SME Banking', range: 'TZS 50M–1B', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining EFD compliance and consistent digital records improves eligibility with Tanzanian lenders.',
    receivablesInsight: '80% of Tanzanian SMEs experience payment delays. Proactive receivables tracking is essential for healthy cash flow.',
    paymentMethods: 'M-Pesa or Tigo Pesa payment at point of sale',
    smbLabel: 'Tanzanian SMB',
  },

  US: {
    countryName: 'United States',
    currencyCode: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    taxConfig: {
      vatRate: 0,
      vatName: 'Sales Tax',
      vatDueDay: 20,
      corporateRate: 0.21,
      smbRate: 0.21,
      smbThreshold: 0,
      taxAuthority: 'Internal Revenue Service',
      taxAuthorityShort: 'IRS',
      complianceSystem: 'IRS e-file',
      compliancePenalty: 'Failure-to-file penalty of 5% per month up to 25% of unpaid tax',
      complianceItems: [
        'Obtain an EIN (Employer Identification Number)',
        'File quarterly estimated tax payments (Form 1040-ES or 1120-W)',
        'Collect and remit state sales tax if applicable',
        'File annual income tax return by March 15 (S-Corp/Partnership) or April 15 (C-Corp)',
        'Keep all business records for at least 3 years (7 years recommended)',
      ],
      annualReturnMonth: 3,
      incomeTaxQuarters: [3, 5, 8, 0],
    },
    lenders: [
      { name: 'Kabbage (Amex)', range: 'Up to $250K', minGrade: 'C' },
      { name: 'OnDeck', range: '$5K–$250K', minGrade: 'B' },
      { name: 'SBA 7(a) Loan', range: '$50K–$5M', minGrade: 'B' },
      { name: 'Wells Fargo Business', range: '$100K–$10M', minGrade: 'A' },
    ],
    complianceTip: 'Maintaining clean IRS records and consistent bookkeeping improves eligibility with US lenders and SBA programs.',
    receivablesInsight: '64% of US small businesses have unpaid invoices older than 30 days. Effective receivables management is key to healthy cash flow.',
    paymentMethods: 'card or ACH payment',
    smbLabel: 'US small business',
  },
}

const DEFAULT_REGION: RegionConfig = {
  countryName: 'your country',
  currencyCode: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  taxConfig: {
    vatRate: 0.15,
    vatName: 'VAT/GST',
    vatDueDay: 20,
    corporateRate: 0.25,
    smbRate: 0.20,
    smbThreshold: 0,
    taxAuthority: 'Tax Authority',
    taxAuthorityShort: 'Tax Auth',
    annualReturnMonth: 6,
    incomeTaxQuarters: [2, 5, 8, 11],
  },
  lenders: [
    { name: 'Digital Lender', range: 'Varies', minGrade: 'C' },
    { name: 'Commercial Bank SME', range: 'Varies', minGrade: 'B' },
    { name: 'Development Bank', range: 'Varies', minGrade: 'A' },
  ],
  complianceTip: 'Maintaining clean tax records and consistent digital transactions improves eligibility with lenders.',
  receivablesInsight: 'Most SMEs experience late payments. Tracking receivables helps you forecast cash flow and prioritize collections.',
  paymentMethods: 'digital payment at point of sale',
  smbLabel: 'SME',
}

export function getRegionConfig(countryCode?: string | null): RegionConfig {
  if (!countryCode) return DEFAULT_REGION
  return REGIONS[countryCode.toUpperCase()] || DEFAULT_REGION
}

export function getRegionName(countryCode?: string | null): string {
  return getRegionConfig(countryCode).countryName
}
