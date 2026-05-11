"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  IMPORT_COUNTRIES,
  ORIGIN_COUNTRIES,
  HS_CODES,
  FREIGHT_OPTIONS,
  CURRENCIES,
  FX_RATES_VS_USD,
  getDutyRate,
  getImportCountry,
  getHSCodesByCategory,
  convertCurrency,
} from "@/lib/free-tools-data";

interface FormState {
  productName: string;
  quantity: number;
  unitPrice: number;
  supplierCurrency: string;
  originCountry: string;
  destinationCountry: string;
  hsCode: string;
  freightMethod: string;
  freightCost: number;
  freightCurrency: string;
  insurancePercent: number;
  homeCurrency: string;
  sellingPricePerUnit: number;
}

interface Result {
  supplierCostUSD: number;
  freightCostUSD: number;
  cifValueUSD: number;
  dutyRate: number;
  dutyAmountUSD: number;
  vatRate: number;
  vatAmountUSD: number;
  customsClearanceUSD: number;
  insuranceAmountUSD: number;
  totalLandedUSD: number;
  totalLandedHome: number;
  unitLandedHome: number;
  homeCurrency: string;
  margin?: number;
  fxRate: number;
  breakdownPct: {
    supplier: number;
    freight: number;
    duty: number;
    vat: number;
    other: number;
  };
}

const DEFAULT_FORM: FormState = {
  productName: "",
  quantity: 500,
  unitPrice: 5,
  supplierCurrency: "USD",
  originCountry: "CN",
  destinationCountry: "GB",
  hsCode: "6109.10",
  freightMethod: "sea-lcl",
  freightCost: 0,
  freightCurrency: "USD",
  insurancePercent: 0.5,
  homeCurrency: "GBP",
  sellingPricePerUnit: 0,
};

function fmt(amount: number, currency: string): string {
  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || currency;
  if (amount >= 1000) return `${sym}${amount.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
  return `${sym}${amount.toFixed(2)}`;
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export default function LandedCostCalculator() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<Result | null>(null);
  const [calculated, setCalculated] = useState(false);

  const hsByCategory = useMemo(() => getHSCodesByCategory(), []);

  const set = (key: keyof FormState, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Auto-calculate freight if left at 0
  const estimatedFreight = useMemo(() => {
    const freight = FREIGHT_OPTIONS.find((f) => f.id === form.freightMethod);
    if (!freight) return 0;
    const weightKg = form.quantity * 0.3; // rough estimate
    const calculated = Math.max(freight.minCost, freight.costPerKg * weightKg);
    return Math.round(calculated);
  }, [form.freightMethod, form.quantity]);

  const calculate = () => {
    const dest = getImportCountry(form.destinationCountry);
    if (!dest) return;

    const dutyRate = getDutyRate(form.hsCode, form.destinationCountry);
    const fxToUSD = (currency: string) => 1 / (FX_RATES_VS_USD[currency] || 1);

    // Convert everything to USD
    const supplierCostUSD =
      form.quantity * form.unitPrice * (1 / (FX_RATES_VS_USD[form.supplierCurrency] || 1));

    const freightActual = form.freightCost > 0 ? form.freightCost : estimatedFreight;
    const freightCostUSD =
      freightActual * (1 / (FX_RATES_VS_USD[form.freightCurrency] || 1));

    const insuranceAmountUSD = (supplierCostUSD * form.insurancePercent) / 100;
    const cifValueUSD = supplierCostUSD + freightCostUSD + insuranceAmountUSD;

    const dutyAmountUSD = (cifValueUSD * dutyRate) / 100;
    const customsClearanceUSD = dest.customsClearanceFee;

    // VAT is applied on CIF + duty in most countries
    const vatBase = cifValueUSD + dutyAmountUSD + customsClearanceUSD;
    const vatAmountUSD = (vatBase * dest.vatRate) / 100;

    const totalLandedUSD =
      supplierCostUSD +
      freightCostUSD +
      insuranceAmountUSD +
      dutyAmountUSD +
      customsClearanceUSD +
      vatAmountUSD;

    const fxRate = FX_RATES_VS_USD[form.homeCurrency] || 1;
    const totalLandedHome = totalLandedUSD * fxRate;
    const unitLandedHome = totalLandedHome / form.quantity;

    let margin: number | undefined;
    if (form.sellingPricePerUnit > 0) {
      const totalRevenue = form.sellingPricePerUnit * form.quantity;
      margin = ((totalRevenue - totalLandedHome) / totalRevenue) * 100;
    }

    const breakdownPct = {
      supplier: (supplierCostUSD / totalLandedUSD) * 100,
      freight: (freightCostUSD / totalLandedUSD) * 100,
      duty: (dutyAmountUSD / totalLandedUSD) * 100,
      vat: (vatAmountUSD / totalLandedUSD) * 100,
      other: ((insuranceAmountUSD + customsClearanceUSD) / totalLandedUSD) * 100,
    };

    setResult({
      supplierCostUSD,
      freightCostUSD,
      cifValueUSD,
      dutyRate,
      dutyAmountUSD,
      vatRate: dest.vatRate,
      vatAmountUSD,
      customsClearanceUSD,
      insuranceAmountUSD,
      totalLandedUSD,
      totalLandedHome,
      unitLandedHome,
      homeCurrency: form.homeCurrency,
      margin,
      fxRate,
      breakdownPct,
    });
    setCalculated(true);
  };

  const destCountry = getImportCountry(form.destinationCountry);

  return (
    <div className="lc-root">
      {/* Nav */}
      <nav className="lc-nav">
        <div className="lc-nav-inner">
          <Link href="/free-tools" className="lc-nav-back">← Free Tools</Link>
          <Link href="/" className="lc-nav-logo">AskBiz</Link>
          <Link href="/" className="lc-nav-cta">Try AskBiz Free →</Link>
        </div>
      </nav>

      <div className="lc-layout">
        {/* ── Left: Form ── */}
        <div className="lc-form-col">
          <div className="lc-header">
            <span className="lc-tool-badge">Free Tool</span>
            <h1 className="lc-title">Landed Cost Calculator</h1>
            <p className="lc-subtitle">
              Calculate the true cost of importing goods — including duty, VAT, freight, and FX. No sign-up required.
            </p>
          </div>

          <div className="lc-form">
            {/* Product */}
            <div className="lc-section">
              <h2 className="lc-section-title">📦 Product Details</h2>
              <div className="lc-field">
                <label className="lc-label">Product name (optional)</label>
                <input
                  className="lc-input"
                  type="text"
                  placeholder="e.g. Cotton T-shirts"
                  value={form.productName}
                  onChange={(e) => set("productName", e.target.value)}
                />
              </div>
              <div className="lc-row">
                <div className="lc-field">
                  <label className="lc-label">Quantity (units)</label>
                  <input
                    className="lc-input"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => set("quantity", Number(e.target.value))}
                  />
                </div>
                <div className="lc-field">
                  <label className="lc-label">Unit price (ex-works)</label>
                  <div className="lc-input-group">
                    <select
                      className="lc-select lc-select--prefix"
                      value={form.supplierCurrency}
                      onChange={(e) => set("supplierCurrency", e.target.value)}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                    <input
                      className="lc-input lc-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(e) => set("unitPrice", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="lc-section">
              <h2 className="lc-section-title">🌍 Origin & Destination</h2>
              <div className="lc-row">
                <div className="lc-field">
                  <label className="lc-label">Supplier country (origin)</label>
                  <select
                    className="lc-input"
                    value={form.originCountry}
                    onChange={(e) => set("originCountry", e.target.value)}
                  >
                    {ORIGIN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="lc-field">
                  <label className="lc-label">Importing into (destination)</label>
                  <select
                    className="lc-input"
                    value={form.destinationCountry}
                    onChange={(e) => set("destinationCountry", e.target.value)}
                  >
                    {IMPORT_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {destCountry && (
                <div className="lc-info-pill">
                  {destCountry.flag} {destCountry.name}: {destCountry.vatRate}% {destCountry.vatName}
                  {destCountry.tradeBloc && ` · ${destCountry.tradeBloc} member`}
                </div>
              )}
            </div>

            {/* HS Code */}
            <div className="lc-section">
              <h2 className="lc-section-title">🏷️ Product Classification (HS Code)</h2>
              <div className="lc-field">
                <label className="lc-label">Select your product category</label>
                <select
                  className="lc-input"
                  value={form.hsCode}
                  onChange={(e) => set("hsCode", e.target.value)}
                >
                  {Object.entries(hsByCategory).map(([category, codes]) => (
                    <optgroup key={category} label={category}>
                      {codes.map((hs) => (
                        <option key={hs.code} value={hs.code}>
                          {hs.code} — {hs.description}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <p className="lc-help-text">
                The duty rate for{" "}
                <strong>{HS_CODES.find((h) => h.code === form.hsCode)?.description}</strong>{" "}
                imported into {destCountry?.name} is{" "}
                <strong>{getDutyRate(form.hsCode, form.destinationCountry)}%</strong>.
              </p>
            </div>

            {/* Freight */}
            <div className="lc-section">
              <h2 className="lc-section-title">🚢 Freight</h2>
              <div className="lc-field">
                <label className="lc-label">Freight method</label>
                <div className="lc-freight-grid">
                  {FREIGHT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      className={`lc-freight-btn ${form.freightMethod === f.id ? "lc-freight-btn--active" : ""}`}
                      onClick={() => set("freightMethod", f.id)}
                      type="button"
                    >
                      <span className="lc-freight-icon">{f.icon}</span>
                      <span className="lc-freight-name">{f.name}</span>
                      <span className="lc-freight-days">{f.transitDays.min}–{f.transitDays.max} days</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="lc-row">
                <div className="lc-field">
                  <label className="lc-label">
                    Freight cost (leave 0 to estimate)
                  </label>
                  <div className="lc-input-group">
                    <select
                      className="lc-select lc-select--prefix"
                      value={form.freightCurrency}
                      onChange={(e) => set("freightCurrency", e.target.value)}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                    <input
                      className="lc-input lc-input--suffix"
                      type="number"
                      min="0"
                      value={form.freightCost}
                      onChange={(e) => set("freightCost", Number(e.target.value))}
                      placeholder={`Estimated: $${estimatedFreight}`}
                    />
                  </div>
                  {form.freightCost === 0 && (
                    <p className="lc-help-text">Using estimated cost: ${estimatedFreight} USD</p>
                  )}
                </div>
                <div className="lc-field">
                  <label className="lc-label">Insurance (% of supplier cost)</label>
                  <input
                    className="lc-input"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.insurancePercent}
                    onChange={(e) => set("insurancePercent", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Output currency */}
            <div className="lc-section">
              <h2 className="lc-section-title">💰 Your Currency & Selling Price</h2>
              <div className="lc-row">
                <div className="lc-field">
                  <label className="lc-label">Your home currency</label>
                  <select
                    className="lc-input"
                    value={form.homeCurrency}
                    onChange={(e) => set("homeCurrency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="lc-field">
                  <label className="lc-label">Selling price per unit (optional)</label>
                  <div className="lc-input-group">
                    <span className="lc-input-prefix">
                      {CURRENCIES.find((c) => c.code === form.homeCurrency)?.symbol}
                    </span>
                    <input
                      className="lc-input lc-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.sellingPricePerUnit || ""}
                      onChange={(e) => set("sellingPricePerUnit", Number(e.target.value))}
                      placeholder="Enter to see margin"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="lc-calculate-btn" onClick={calculate} type="button">
              Calculate Landed Cost →
            </button>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="lc-result-col">
          {!calculated ? (
            <div className="lc-placeholder">
              <div className="lc-placeholder-icon">🧮</div>
              <h3 className="lc-placeholder-title">Your results will appear here</h3>
              <p className="lc-placeholder-sub">Fill in the form and click Calculate to see your full landed cost breakdown.</p>
            </div>
          ) : result ? (
            <div className="lc-result">
              {/* Hero result */}
              <div className="lc-result-hero">
                <div className="lc-result-hero-label">Total Landed Cost</div>
                <div className="lc-result-hero-value">{fmt(result.totalLandedHome, result.homeCurrency)}</div>
                <div className="lc-result-hero-sub">
                  {fmt(result.unitLandedHome, result.homeCurrency)} per unit
                  {form.productName && ` · ${form.productName}`}
                </div>
                {result.margin !== undefined && (
                  <div className={`lc-result-margin ${result.margin < 0 ? "lc-result-margin--negative" : result.margin < 20 ? "lc-result-margin--warning" : "lc-result-margin--good"}`}>
                    {result.margin < 0 ? "⚠️" : result.margin < 20 ? "⚡" : "✅"}
                    {" "}Margin: {result.margin.toFixed(1)}%
                    {result.margin < 0 && " — Loss-making at this selling price"}
                    {result.margin >= 0 && result.margin < 20 && " — Thin margin, consider repricing"}
                    {result.margin >= 20 && " — Healthy margin"}
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="lc-breakdown">
                <h3 className="lc-breakdown-title">Cost Breakdown</h3>
                {[
                  {
                    label: "Supplier cost",
                    usd: result.supplierCostUSD,
                    pct: result.breakdownPct.supplier,
                    color: "#d08a59",
                  },
                  {
                    label: "Freight",
                    usd: result.freightCostUSD,
                    pct: result.breakdownPct.freight,
                    color: "#3b82f6",
                  },
                  {
                    label: `Import duty (${result.dutyRate}%)`,
                    usd: result.dutyAmountUSD,
                    pct: result.breakdownPct.duty,
                    color: "#f59e0b",
                  },
                  {
                    label: `${destCountry?.vatName || "VAT"} (${result.vatRate}%)`,
                    usd: result.vatAmountUSD,
                    pct: result.breakdownPct.vat,
                    color: "#8b5cf6",
                  },
                  {
                    label: "Insurance + clearance",
                    usd: result.insuranceAmountUSD + result.customsClearanceUSD,
                    pct: result.breakdownPct.other,
                    color: "#10b981",
                  },
                ].map((row) => (
                  <div key={row.label} className="lc-breakdown-row">
                    <div className="lc-breakdown-row-top">
                      <span className="lc-breakdown-label">{row.label}</span>
                      <span className="lc-breakdown-amount">
                        ${row.usd.toFixed(0)} USD
                        <span className="lc-breakdown-home">
                          {" "}({fmt(row.usd * result.fxRate, result.homeCurrency)})
                        </span>
                      </span>
                    </div>
                    <div className="lc-breakdown-bar-wrap">
                      <div
                        className="lc-breakdown-bar"
                        style={{ width: `${row.pct}%`, background: row.color }}
                      />
                      <span className="lc-breakdown-pct">{pct(row.pct)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key figures */}
              <div className="lc-key-figures">
                <h3 className="lc-key-title">Key Figures</h3>
                <div className="lc-key-grid">
                  {[
                    ["CIF Value", `$${result.cifValueUSD.toFixed(0)}`],
                    ["Duty Rate", `${result.dutyRate}%`],
                    ["Effective Tax Rate", `${(((result.dutyAmountUSD + result.vatAmountUSD) / result.supplierCostUSD) * 100).toFixed(1)}%`],
                    ["Cost Uplift vs Supplier Price", `+${((result.totalLandedUSD / result.supplierCostUSD - 1) * 100).toFixed(0)}%`],
                    ["FX Rate Used", `1 USD = ${result.fxRate.toFixed(4)} ${result.homeCurrency}`],
                    ["Transit Time", FREIGHT_OPTIONS.find((f) => f.id === form.freightMethod)?.transitDays.min + "–" + FREIGHT_OPTIONS.find((f) => f.id === form.freightMethod)?.transitDays.max + " days"],
                  ].map(([label, value]) => (
                    <div key={label} className="lc-key-item">
                      <span className="lc-key-label">{label}</span>
                      <span className="lc-key-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lc-disclaimer">
                <strong>Disclaimer:</strong> Rates are indicative (April 2026). Verify with official tariff databases and your freight forwarder before making import decisions. VAT may be reclaimable if you are VAT-registered.
              </div>

              {/* CTA */}
              <div className="lc-result-cta">
                <p className="lc-result-cta-text">
                  <strong>Want this pre-filled with your real products?</strong> AskBiz connects to Shopify, Amazon, and QuickBooks to auto-calculate landed costs across your catalogue.
                </p>
                <Link href="/" className="lc-result-cta-btn">Try AskBiz Free →</Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* SEO content below the fold */}
      <section className="lc-seo-content">
        <div className="lc-seo-inner">
          <h2>How to Calculate Landed Cost</h2>
          <p>Landed cost is the total cost of bringing imported goods to your warehouse. The formula is: <strong>Supplier Price + Freight + Insurance + Import Duty + VAT/GST + Customs Clearance</strong>.</p>
          <h3>What is CIF Value?</h3>
          <p>CIF stands for Cost, Insurance, and Freight. Customs authorities use your CIF value (supplier price + insurance + freight) as the basis for calculating import duty — not just the supplier price alone.</p>
          <h3>Import Duty vs VAT — What's the Difference?</h3>
          <p>Import duty is a trade tax applied to goods entering a country, based on the product's HS code and origin. VAT (or GST) is applied on top of the CIF value plus duty. In the UK, VAT-registered businesses can reclaim import VAT through their VAT return — making the effective VAT cost zero for most businesses.</p>
          <h3>Why Use This Calculator?</h3>
          <p>Most importers calculate profit margin using only the supplier price and freight. This underestimates true cost by 15–30%. This calculator adds all the missing costs and shows you the true per-unit landed cost in your home currency.</p>
        </div>
      </section>

      <style jsx global>{`
        :root {
          --acc:#d08a59; --acc-dark:#b8743e; --acc-light:#f5ebe0;
          --tx:#1a1916; --tx2:#6b6760; --tx3:#a39e97;
          --sf:#ffffff; --bg:#f9f8f6; --el:#f3f2ef;
          --b:rgba(0,0,0,.08); --r:12px; --r-sm:8px;
          --font-head:'Sora','DM Sans',system-ui,sans-serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --shadow-md:0 4px 16px rgba(0,0,0,.08);
          --shadow-lg:0 8px 32px rgba(0,0,0,.12);
        }
        * { box-sizing:border-box; }
        .lc-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        .lc-nav { background:var(--sf); border-bottom:1px solid var(--b); padding:0 24px; position:sticky; top:0; z-index:100; }
        .lc-nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:56px; }
        .lc-nav-back { font-size:13px; color:var(--tx2); text-decoration:none; transition:color .15s; }
        .lc-nav-back:hover { color:var(--acc); }
        .lc-nav-logo { font-family:var(--font-head); font-size:17px; font-weight:800; color:var(--tx); text-decoration:none; }
        .lc-nav-cta { font-size:13px; font-weight:700; background:var(--acc); color:#fff; padding:7px 14px; border-radius:8px; text-decoration:none; }
        .lc-nav-cta:hover { background:var(--acc-dark); }

        .lc-layout { max-width:1200px; margin:0 auto; padding:40px 24px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }

        /* Form col */
        .lc-header { margin-bottom:28px; }
        .lc-tool-badge { display:inline-block; background:var(--acc-light); color:var(--acc-dark); font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
        .lc-title { font-family:var(--font-head); font-size:28px; font-weight:800; color:var(--tx); margin:0 0 8px; letter-spacing:-.02em; }
        .lc-subtitle { font-size:15px; color:var(--tx2); margin:0; line-height:1.55; }

        .lc-form { display:flex; flex-direction:column; gap:0; }
        .lc-section { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:24px; margin-bottom:16px; }
        .lc-section-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin:0 0 16px; }
        .lc-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
        .lc-field:last-child { margin-bottom:0; }
        .lc-label { font-size:13px; font-weight:600; color:var(--tx2); }
        .lc-input { width:100%; padding:10px 12px; border:1.5px solid var(--b); border-radius:var(--r-sm); font-size:14px; font-family:var(--font-body); color:var(--tx); background:var(--sf); outline:none; transition:border-color .15s; }
        .lc-input:focus { border-color:var(--acc); }
        .lc-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .lc-input-group { display:flex; }
        .lc-select--prefix { border-radius:var(--r-sm) 0 0 var(--r-sm); border-right:none; padding:10px 8px; min-width:70px; background:var(--el); font-size:13px; }
        .lc-input--suffix { border-radius:0 var(--r-sm) var(--r-sm) 0; flex:1; }
        .lc-input-prefix { display:flex; align-items:center; padding:0 10px; background:var(--el); border:1.5px solid var(--b); border-right:none; border-radius:var(--r-sm) 0 0 var(--r-sm); font-size:14px; color:var(--tx2); }
        .lc-help-text { font-size:12px; color:var(--tx3); margin:4px 0 0; }
        .lc-info-pill { background:var(--el); border:1px solid var(--b); border-radius:100px; padding:5px 14px; font-size:13px; color:var(--tx2); display:inline-block; margin-top:8px; }

        .lc-freight-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .lc-freight-btn { display:flex; flex-direction:column; align-items:flex-start; gap:2px; padding:10px 12px; border:1.5px solid var(--b); border-radius:var(--r-sm); background:var(--sf); cursor:pointer; text-align:left; transition:border-color .15s, background .15s; font-family:var(--font-body); }
        .lc-freight-btn--active { border-color:var(--acc); background:var(--acc-light); }
        .lc-freight-icon { font-size:16px; }
        .lc-freight-name { font-size:12px; font-weight:700; color:var(--tx); }
        .lc-freight-days { font-size:11px; color:var(--tx3); }

        .lc-calculate-btn { width:100%; padding:16px; background:var(--acc); color:#fff; border:none; border-radius:var(--r); font-size:16px; font-weight:700; font-family:var(--font-head); cursor:pointer; transition:background .15s, transform .15s; }
        .lc-calculate-btn:hover { background:var(--acc-dark); transform:translateY(-1px); }

        /* Result col */
        .lc-result-col { position:sticky; top:80px; }
        .lc-placeholder { background:var(--sf); border:1.5px dashed var(--b); border-radius:var(--r); padding:60px 40px; text-align:center; }
        .lc-placeholder-icon { font-size:48px; margin-bottom:16px; }
        .lc-placeholder-title { font-family:var(--font-head); font-size:18px; font-weight:700; color:var(--tx); margin:0 0 8px; }
        .lc-placeholder-sub { font-size:14px; color:var(--tx3); margin:0; }

        .lc-result { display:flex; flex-direction:column; gap:16px; }
        .lc-result-hero { background:linear-gradient(135deg,#1a1916 0%,#2d2a26 100%); border-radius:var(--r); padding:32px; text-align:center; }
        .lc-result-hero-label { font-size:12px; font-weight:600; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
        .lc-result-hero-value { font-family:var(--font-head); font-size:44px; font-weight:800; color:#fff; margin-bottom:6px; }
        .lc-result-hero-sub { font-size:14px; color:rgba(255,255,255,.5); margin-bottom:16px; }
        .lc-result-margin { font-size:14px; font-weight:600; padding:8px 16px; border-radius:100px; display:inline-block; }
        .lc-result-margin--good { background:rgba(16,185,129,.2); color:#10b981; }
        .lc-result-margin--warning { background:rgba(245,158,11,.2); color:#f59e0b; }
        .lc-result-margin--negative { background:rgba(239,68,68,.2); color:#ef4444; }

        .lc-breakdown { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:24px; }
        .lc-breakdown-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin:0 0 16px; }
        .lc-breakdown-row { margin-bottom:12px; }
        .lc-breakdown-row:last-child { margin-bottom:0; }
        .lc-breakdown-row-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
        .lc-breakdown-label { font-size:13px; color:var(--tx2); font-weight:500; }
        .lc-breakdown-amount { font-size:13px; font-weight:600; color:var(--tx); }
        .lc-breakdown-home { font-weight:400; color:var(--tx3); }
        .lc-breakdown-bar-wrap { display:flex; align-items:center; gap:8px; }
        .lc-breakdown-bar { height:6px; border-radius:3px; min-width:2px; transition:width .4s ease; }
        .lc-breakdown-pct { font-size:11px; color:var(--tx3); white-space:nowrap; }

        .lc-key-figures { background:var(--el); border-radius:var(--r); padding:20px; }
        .lc-key-title { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--tx); margin:0 0 12px; }
        .lc-key-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .lc-key-item { display:flex; flex-direction:column; gap:2px; }
        .lc-key-label { font-size:11px; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; }
        .lc-key-value { font-size:14px; font-weight:700; color:var(--tx); }

        .lc-disclaimer { font-size:11px; color:var(--tx3); line-height:1.5; padding:12px; background:var(--el); border-radius:var(--r-sm); }

        .lc-result-cta { background:var(--acc-light); border:1.5px solid rgba(208,138,89,.25); border-radius:var(--r); padding:20px; }
        .lc-result-cta-text { font-size:13px; color:var(--tx2); margin:0 0 12px; line-height:1.5; }
        .lc-result-cta-btn { display:inline-flex; align-items:center; background:var(--acc); color:#fff; font-size:13px; font-weight:700; padding:10px 18px; border-radius:8px; text-decoration:none; }
        .lc-result-cta-btn:hover { background:var(--acc-dark); }

        /* SEO content */
        .lc-seo-content { background:var(--sf); border-top:1px solid var(--b); padding:56px 24px; }
        .lc-seo-inner { max-width:760px; margin:0 auto; }
        .lc-seo-inner h2 { font-family:var(--font-head); font-size:22px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .lc-seo-inner h3 { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:24px 0 10px; }
        .lc-seo-inner p { font-size:15px; color:var(--tx2); line-height:1.75; margin:0 0 14px; }

        /* Responsive */
        @media (max-width:900px) {
          .lc-layout { grid-template-columns:1fr; }
          .lc-result-col { position:static; }
          .lc-row { grid-template-columns:1fr; }
          .lc-freight-grid { grid-template-columns:1fr 1fr; }
          .lc-key-grid { grid-template-columns:1fr 1fr; }
        }
        @media (max-width:480px) {
          .lc-freight-grid { grid-template-columns:1fr; }
          .lc-result-hero-value { font-size:32px; }
        }
      `}</style>
    </div>
  );
}
