// lib/free-tools-data.ts
// Data for public-facing free tools — Landed Cost Calculator and FX Risk Modeller
// All rates are indicative and updated quarterly. Always verify with official sources.

// ─── CURRENCIES ───────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "AED", name: "UAE Dirham", symbol: "AED", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR", flag: "🇸🇦" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
];

// Mid-market rates vs USD (indicative, April 2026)
export const FX_RATES_VS_USD: Record<string, number> = {
  USD: 1.0,
  GBP: 0.792,
  EUR: 0.921,
  AED: 3.673,
  SAR: 3.750,
  CAD: 1.362,
  AUD: 1.528,
  SGD: 1.341,
  JPY: 149.8,
  INR: 83.4,
  CNY: 7.24,
  HKD: 7.82,
  KES: 129.5,
  NGN: 1580.0,
  ZAR: 18.6,
  BRL: 4.97,
  MXN: 17.1,
  TRY: 32.1,
  CHF: 0.898,
  SEK: 10.42,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = FX_RATES_VS_USD[from] || 1;
  const toRate = FX_RATES_VS_USD[to] || 1;
  return (amount / fromRate) * toRate;
}

// ─── COUNTRIES FOR LANDED COST ─────────────────────────────────────────────

export interface ImportCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  vatRate: number; // standard VAT/GST rate %
  vatName: string; // "VAT", "GST", "Sales Tax", etc.
  customsClearanceFee: number; // flat fee in USD equivalent
  tradeBloc?: string; // "EU", "GCC", "USMCA" etc.
}

export const IMPORT_COUNTRIES: ImportCountry[] = [
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", vatRate: 20, vatName: "VAT", customsClearanceFee: 25, },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", vatRate: 0, vatName: "Sales Tax (varies by state)", customsClearanceFee: 30, },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", vatRate: 19, vatName: "VAT", customsClearanceFee: 28, tradeBloc: "EU", },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", vatRate: 20, vatName: "VAT", customsClearanceFee: 28, tradeBloc: "EU", },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", currency: "EUR", vatRate: 21, vatName: "VAT", customsClearanceFee: 25, tradeBloc: "EU", },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", vatRate: 22, vatName: "VAT", customsClearanceFee: 30, tradeBloc: "EU", },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR", vatRate: 21, vatName: "VAT", customsClearanceFee: 28, tradeBloc: "EU", },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", vatRate: 5, vatName: "VAT", customsClearanceFee: 20, tradeBloc: "GCC", },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", vatRate: 15, vatName: "VAT", customsClearanceFee: 22, tradeBloc: "GCC", },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", vatRate: 5, vatName: "GST", customsClearanceFee: 30, tradeBloc: "USMCA", },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", vatRate: 10, vatName: "GST", customsClearanceFee: 35, },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", vatRate: 9, vatName: "GST", customsClearanceFee: 20, },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", vatRate: 10, vatName: "Consumption Tax", customsClearanceFee: 40, },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", vatRate: 18, vatName: "GST", customsClearanceFee: 25, },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", vatRate: 15, vatName: "VAT", customsClearanceFee: 30, },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", vatRate: 7.5, vatName: "VAT", customsClearanceFee: 35, },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", vatRate: 16, vatName: "VAT", customsClearanceFee: 30, },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", vatRate: 17, vatName: "ICMS (varies)", customsClearanceFee: 40, },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN", vatRate: 16, vatName: "IVA", customsClearanceFee: 30, tradeBloc: "USMCA", },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", currency: "CHF", vatRate: 8.1, vatName: "VAT (MWST)", customsClearanceFee: 45, },
];

// ─── SUPPLIER / ORIGIN COUNTRIES ──────────────────────────────────────────────

export interface OriginCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  commonSector?: string;
}

export const ORIGIN_COUNTRIES: OriginCountry[] = [
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY", commonSector: "Manufacturing, Electronics, Textiles" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", commonSector: "Textiles, Pharmaceuticals, IT" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", currency: "VND", commonSector: "Textiles, Electronics, Footwear" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", commonSector: "Garments, Textiles" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", currency: "TRY", commonSector: "Textiles, Leather, Steel" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR", commonSector: "Textiles, Leather, Sporting Goods" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", currency: "THB", commonSector: "Electronics, Automotive, Food" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", currency: "IDR", commonSector: "Palm Oil, Textiles, Electronics" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR", commonSector: "Electronics, Palm Oil, Rubber" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", commonSector: "Machinery, Automotive, Chemicals" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", commonSector: "Fashion, Machinery, Food" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", commonSector: "Technology, Aerospace, Food" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", commonSector: "Services, Pharmaceuticals, Aerospace" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN", commonSector: "Automotive, Electronics, Textiles" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", currency: "MAD", commonSector: "Textiles, Phosphates, Automotive" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", currency: "ETB", commonSector: "Garments, Coffee, Leather" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", currency: "KRW", commonSector: "Electronics, Automotive, Steel" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", commonSector: "Electronics, Automotive, Machinery" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", currency: "TWD", commonSector: "Electronics, Semiconductors" },
  { code: "PL", name: "Poland", flag: "🇵🇱", currency: "PLN", commonSector: "Machinery, Furniture, Food" },
];

// ─── HS CODES & DUTY RATES ────────────────────────────────────────────────────

export interface HSCode {
  code: string;
  description: string;
  category: string;
  // duty rates by destination country (% of CIF value)
  dutyRates: Record<string, number>;
}

// UK Global Tariff rates (indicative, 2026) — most common traded categories
export const HS_CODES: HSCode[] = [
  // Electronics
  { code: "8471.30", description: "Laptops and portable computers", category: "Electronics", dutyRates: { GB: 0, US: 0, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 10, ZA: 0 } },
  { code: "8517.13", description: "Smartphones and mobile phones", category: "Electronics", dutyRates: { GB: 0, US: 0, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 10, ZA: 0 } },
  { code: "8519.81", description: "Headphones and earphones", category: "Electronics", dutyRates: { GB: 0, US: 0, DE: 3.7, FR: 3.7, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 10, ZA: 10 } },
  { code: "8507.60", description: "Lithium-ion batteries", category: "Electronics", dutyRates: { GB: 0, US: 3.4, DE: 1.8, FR: 1.8, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 15, ZA: 5 } },
  { code: "8528.72", description: "Televisions and monitors", category: "Electronics", dutyRates: { GB: 0, US: 0, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 5, SG: 0, JP: 0, IN: 15, ZA: 5 } },

  // Fashion & Apparel
  { code: "6109.10", description: "T-shirts and vests (cotton)", category: "Apparel", dutyRates: { GB: 12, US: 16.5, DE: 12, FR: 12, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 10.9, IN: 20, ZA: 45 } },
  { code: "6203.42", description: "Men's trousers and jeans (cotton)", category: "Apparel", dutyRates: { GB: 12, US: 16.6, DE: 12, FR: 12, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 10.9, IN: 20, ZA: 45 } },
  { code: "6204.62", description: "Women's trousers (cotton)", category: "Apparel", dutyRates: { GB: 12, US: 16.6, DE: 12, FR: 12, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 10.9, IN: 20, ZA: 45 } },
  { code: "6211.43", description: "Sportswear and activewear", category: "Apparel", dutyRates: { GB: 12, US: 11.3, DE: 12, FR: 12, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 10.9, IN: 20, ZA: 45 } },
  { code: "6401.92", description: "Waterproof footwear", category: "Footwear", dutyRates: { GB: 4.7, US: 25, DE: 4.7, FR: 4.7, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 30, IN: 25, ZA: 30 } },
  { code: "6403.51", description: "Leather footwear", category: "Footwear", dutyRates: { GB: 3.7, US: 8.5, DE: 3.7, FR: 3.7, AE: 5, SA: 5, CA: 18, AU: 10, SG: 0, JP: 30, IN: 25, ZA: 30 } },

  // Beauty & Health
  { code: "3304.91", description: "Lip make-up preparations", category: "Beauty", dutyRates: { GB: 0, US: 4.9, DE: 6.5, FR: 6.5, AE: 5, SA: 5, CA: 6.5, AU: 5, SG: 0, JP: 0, IN: 20, ZA: 15 } },
  { code: "3304.99", description: "Beauty and skincare products", category: "Beauty", dutyRates: { GB: 0, US: 4.9, DE: 6.5, FR: 6.5, AE: 5, SA: 5, CA: 6.5, AU: 5, SG: 0, JP: 0, IN: 20, ZA: 15 } },
  { code: "3305.10", description: "Shampoos and hair care", category: "Beauty", dutyRates: { GB: 0, US: 4.9, DE: 6.5, FR: 6.5, AE: 5, SA: 5, CA: 6.5, AU: 5, SG: 0, JP: 0, IN: 18, ZA: 15 } },
  { code: "3301.29", description: "Essential oils and fragrances", category: "Beauty", dutyRates: { GB: 0, US: 1.7, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 15, ZA: 10 } },

  // Home & Living
  { code: "9403.20", description: "Furniture (metal)", category: "Home & Living", dutyRates: { GB: 0, US: 0, DE: 2.7, FR: 2.7, AE: 5, SA: 5, CA: 9.5, AU: 5, SG: 0, JP: 0, IN: 20, ZA: 20 } },
  { code: "9403.60", description: "Furniture (wood)", category: "Home & Living", dutyRates: { GB: 0, US: 0, DE: 2.7, FR: 2.7, AE: 5, SA: 5, CA: 9.5, AU: 5, SG: 0, JP: 0, IN: 25, ZA: 20 } },
  { code: "6911.10", description: "Tableware (porcelain/china)", category: "Home & Living", dutyRates: { GB: 0, US: 26, DE: 11.9, FR: 11.9, AE: 5, SA: 5, CA: 9.5, AU: 5, SG: 0, JP: 5.2, IN: 20, ZA: 20 } },
  { code: "9405.10", description: "Chandeliers and ceiling lights", category: "Home & Living", dutyRates: { GB: 3.7, US: 3.9, DE: 4.7, FR: 4.7, AE: 5, SA: 5, CA: 7, AU: 5, SG: 0, JP: 3.9, IN: 20, ZA: 15 } },

  // Food & Beverage
  { code: "0901.11", description: "Coffee (not roasted)", category: "Food & Beverage", dutyRates: { GB: 0, US: 0, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 100, ZA: 0 } },
  { code: "1806.32", description: "Chocolate and cocoa products", category: "Food & Beverage", dutyRates: { GB: 8, US: 5, DE: 8, FR: 8, AE: 5, SA: 5, CA: 6, AU: 5, SG: 0, JP: 10, IN: 30, ZA: 15 } },
  { code: "2009.89", description: "Fruit juices", category: "Food & Beverage", dutyRates: { GB: 11.5, US: 3.4, DE: 11.5, FR: 11.5, AE: 5, SA: 5, CA: 8, AU: 5, SG: 0, JP: 9, IN: 30, ZA: 10 } },

  // Sports & Leisure
  { code: "9506.62", description: "Inflatable balls and sports equipment", category: "Sports", dutyRates: { GB: 2.7, US: 4.9, DE: 2.7, FR: 2.7, AE: 5, SA: 5, CA: 0, AU: 5, SG: 0, JP: 3.9, IN: 20, ZA: 15 } },
  { code: "9506.11", description: "Skis and ski equipment", category: "Sports", dutyRates: { GB: 2.7, US: 0, DE: 2.7, FR: 2.7, AE: 5, SA: 5, CA: 0, AU: 5, SG: 0, JP: 0, IN: 20, ZA: 10 } },

  // Toys
  { code: "9503.00", description: "Toys, games and children's products", category: "Toys", dutyRates: { GB: 0, US: 0, DE: 0, FR: 0, AE: 5, SA: 5, CA: 0, AU: 0, SG: 0, JP: 0, IN: 20, ZA: 15 } },

  // Auto & Industrial
  { code: "8708.99", description: "Auto parts and accessories", category: "Automotive", dutyRates: { GB: 3.5, US: 2.5, DE: 3.5, FR: 3.5, AE: 5, SA: 5, CA: 6.1, AU: 5, SG: 0, JP: 0, IN: 15, ZA: 20 } },
  { code: "3926.90", description: "Plastic products and accessories", category: "Plastics", dutyRates: { GB: 0, US: 5.3, DE: 6.5, FR: 6.5, AE: 5, SA: 5, CA: 6.5, AU: 5, SG: 0, JP: 3.9, IN: 15, ZA: 10 } },
];

// ─── FREIGHT OPTIONS ──────────────────────────────────────────────────────────

export interface FreightOption {
  id: string;
  name: string;
  description: string;
  transitDays: { min: number; max: number };
  // cost per kg in USD (approximate)
  costPerKg: number;
  minCost: number; // minimum shipment cost USD
  icon: string;
}

export const FREIGHT_OPTIONS: FreightOption[] = [
  {
    id: "sea-fcl",
    name: "Sea Freight — FCL",
    description: "Full Container Load. Best for large shipments (10+ pallets). Lowest cost per kg.",
    transitDays: { min: 18, max: 45 },
    costPerKg: 0.4,
    minCost: 1200,
    icon: "🚢",
  },
  {
    id: "sea-lcl",
    name: "Sea Freight — LCL",
    description: "Less than Container Load. Share a container. Good for 1–10 pallets.",
    transitDays: { min: 25, max: 55 },
    costPerKg: 0.8,
    minCost: 400,
    icon: "🚢",
  },
  {
    id: "air-standard",
    name: "Air Freight — Standard",
    description: "Standard air cargo. Good balance of speed and cost for mid-weight shipments.",
    transitDays: { min: 5, max: 10 },
    costPerKg: 4.5,
    minCost: 150,
    icon: "✈️",
  },
  {
    id: "air-express",
    name: "Air Freight — Express",
    description: "Express courier (DHL, FedEx, UPS). Fastest option, highest cost.",
    transitDays: { min: 2, max: 5 },
    costPerKg: 9.0,
    minCost: 50,
    icon: "⚡",
  },
  {
    id: "road",
    name: "Road Freight",
    description: "For European/continental shipments only. Door-to-door.",
    transitDays: { min: 3, max: 8 },
    costPerKg: 1.2,
    minCost: 200,
    icon: "🚛",
  },
];

// ─── FX RISK MODELLER DATA ────────────────────────────────────────────────────

export interface FXPair {
  base: string;
  quote: string;
  label: string;
  rate: number; // indicative mid-market April 2026
  typical1YearVolatility: number; // % annualised
}

export const FX_PAIRS: FXPair[] = [
  { base: "GBP", quote: "USD", label: "GBP/USD", rate: 1.263, typical1YearVolatility: 7.2 },
  { base: "GBP", quote: "EUR", label: "GBP/EUR", rate: 1.172, typical1YearVolatility: 5.1 },
  { base: "GBP", quote: "CNY", label: "GBP/CNY", rate: 9.14, typical1YearVolatility: 8.3 },
  { base: "GBP", quote: "INR", label: "GBP/INR", rate: 105.3, typical1YearVolatility: 9.1 },
  { base: "GBP", quote: "AED", label: "GBP/AED", rate: 4.637, typical1YearVolatility: 7.3 },
  { base: "GBP", quote: "SAR", label: "GBP/SAR", rate: 4.737, typical1YearVolatility: 7.4 },
  { base: "GBP", quote: "TRY", label: "GBP/TRY", rate: 40.5, typical1YearVolatility: 28.4 },
  { base: "USD", quote: "EUR", label: "USD/EUR", rate: 0.921, typical1YearVolatility: 6.8 },
  { base: "USD", quote: "CNY", label: "USD/CNY", rate: 7.24, typical1YearVolatility: 4.2 },
  { base: "USD", quote: "JPY", label: "USD/JPY", rate: 149.8, typical1YearVolatility: 9.8 },
  { base: "USD", quote: "INR", label: "USD/INR", rate: 83.4, typical1YearVolatility: 5.1 },
  { base: "USD", quote: "MXN", label: "USD/MXN", rate: 17.1, typical1YearVolatility: 12.3 },
  { base: "USD", quote: "BRL", label: "USD/BRL", rate: 4.97, typical1YearVolatility: 15.8 },
  { base: "EUR", quote: "CNY", label: "EUR/CNY", rate: 7.86, typical1YearVolatility: 7.9 },
  { base: "EUR", quote: "TRY", label: "EUR/TRY", rate: 34.8, typical1YearVolatility: 27.1 },
  { base: "AED", quote: "INR", label: "AED/INR", rate: 22.7, typical1YearVolatility: 5.4 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getHSCodesByCategory(): Record<string, HSCode[]> {
  const result: Record<string, HSCode[]> = {};
  for (const hs of HS_CODES) {
    if (!result[hs.category]) result[hs.category] = [];
    result[hs.category].push(hs);
  }
  return result;
}

export function getDutyRate(hsCode: string, destinationCountryCode: string): number {
  const hs = HS_CODES.find((h) => h.code === hsCode);
  if (!hs) return 5; // default assumption
  return hs.dutyRates[destinationCountryCode] ?? 5;
}

export function getImportCountry(code: string): ImportCountry | undefined {
  return IMPORT_COUNTRIES.find((c) => c.code === code);
}

export function getFXPair(base: string, quote: string): FXPair | undefined {
  return FX_PAIRS.find((p) => p.base === base && p.quote === quote)
    || FX_PAIRS.find((p) => p.base === quote && p.quote === base);
}
