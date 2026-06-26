"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import {
  FX_PAIRS,
  CURRENCIES,
  FX_RATES_VS_USD,
} from "@/lib/free-tools-data";

interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  supplierCostInQuote: number; // cost in the quote currency
  otherCostsInBase: number; // other costs already in home currency
}

interface ScenarioResult {
  rate: number;
  supplierCostInBase: number;
  totalCostInBase: number;
  margin: number;
  marginChange: number;
  breakEven: boolean;
}

interface ProductResult {
  product: Product;
  currentMargin: number;
  breakEvenRate: number;
  scenarios: {
    mild: ScenarioResult;
    moderate: ScenarioResult;
    severe: ScenarioResult;
  };
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", name: "Product A", sellingPrice: 29.99, supplierCostInQuote: 8, otherCostsInBase: 5 },
  { id: "2", name: "Product B", sellingPrice: 49.99, supplierCostInQuote: 15, otherCostsInBase: 7 },
  { id: "3", name: "Product C", sellingPrice: 19.99, supplierCostInQuote: 6, otherCostsInBase: 4 },
];

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function pct(n: number, dp = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(dp)}%`;
}

function fmt(n: number, sym: string): string {
  return `${sym}${Math.abs(n).toFixed(2)}`;
}

export default function FXRiskModeller() {
  const { tc } = useLang();
  const [baseCurrency, setBaseCurrency] = useState("GBP");
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [customRate, setCustomRate] = useState<string>("");
  const [mildPct, setMildPct] = useState(5);
  const [moderatePct, setModeratePct] = useState(10);
  const [severePct, setSeverePct] = useState(20);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [calculated, setCalculated] = useState(false);

  const baseSym = CURRENCIES.find((c) => c.code === baseCurrency)?.symbol || baseCurrency;
  const quoteSym = CURRENCIES.find((c) => c.code === quoteCurrency)?.symbol || quoteCurrency;

  // Find the current rate base/quote
  const currentRate = useMemo(() => {
    if (customRate && !isNaN(Number(customRate))) return Number(customRate);
    // base/quote = how many quote per 1 base
    const baseUSD = 1 / (FX_RATES_VS_USD[baseCurrency] || 1);
    const quoteUSD = 1 / (FX_RATES_VS_USD[quoteCurrency] || 1);
    return baseUSD / quoteUSD;
  }, [baseCurrency, quoteCurrency, customRate]);

  // Find the pair's volatility
  const volatility = useMemo(() => {
    const pair = FX_PAIRS.find(
      (p) =>
        (p.base === baseCurrency && p.quote === quoteCurrency) ||
        (p.base === quoteCurrency && p.quote === baseCurrency)
    );
    return pair?.typical1YearVolatility ?? 8;
  }, [baseCurrency, quoteCurrency]);

  const addProduct = () => {
    setProducts((ps) => [
      ...ps,
      { id: uid(), name: `Product ${ps.length + 1}`, sellingPrice: 29.99, supplierCostInQuote: 8, otherCostsInBase: 4 },
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, key: keyof Product, value: string | number) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const calcMargin = (product: Product, rate: number): number => {
    // rate = base per quote (e.g. GBP per USD)
    // supplier cost in base = supplierCostInQuote / rate
    const supplierInBase = product.supplierCostInQuote / rate;
    const totalCost = supplierInBase + product.otherCostsInBase;
    return ((product.sellingPrice - totalCost) / product.sellingPrice) * 100;
  };

  const calcBreakEven = (product: Product): number => {
    // break even when sellingPrice = supplierCostInQuote/rate + otherCosts
    // rate = supplierCostInQuote / (sellingPrice - otherCosts)
    const denominator = product.sellingPrice - product.otherCostsInBase;
    if (denominator <= 0) return 0;
    return product.supplierCostInQuote / denominator;
  };

  const calculate = () => {
    const results: ProductResult[] = products.map((product) => {
      const rateAfterMild = currentRate * (1 - mildPct / 100);
      const rateAfterModerate = currentRate * (1 - moderatePct / 100);
      const rateAfterSevere = currentRate * (1 - severePct / 100);

      const currentMargin = calcMargin(product, currentRate);
      const breakEvenRate = calcBreakEven(product);

      const makeScenario = (rate: number): ScenarioResult => {
        const supplierCostInBase = product.supplierCostInQuote / rate;
        const totalCostInBase = supplierCostInBase + product.otherCostsInBase;
        const margin = calcMargin(product, rate);
        return {
          rate,
          supplierCostInBase,
          totalCostInBase,
          margin,
          marginChange: margin - currentMargin,
          breakEven: margin <= 0,
        };
      };

      return {
        product,
        currentMargin,
        breakEvenRate,
        scenarios: {
          mild: makeScenario(rateAfterMild),
          moderate: makeScenario(rateAfterModerate),
          severe: makeScenario(rateAfterSevere),
        },
      };
    });

    setResults(results);
    setCalculated(true);
  };

  const scenarioColors = {
    mild: "#10b981",
    moderate: "#f59e0b",
    severe: "#ef4444",
  };

  return (
    <div className="fx-root">
      {/* Nav */}
      <nav className="fx-nav">
        <div className="fx-nav-inner">
          <Link href="/free-tools" className="fx-nav-back">← Free Tools</Link>
          <Link href="/" className="fx-nav-logo">AskBiz</Link>
          <Link href="/signin?mode=signup" className="fx-nav-cta">Try AskBiz Free →</Link>
        </div>
      </nav>

      <div className="fx-layout">
        {/* ── Config Panel ── */}
        <div className="fx-config">
          <div className="fx-header">
            <span className="fx-tool-badge">Free Tool</span>
            <h1 className="fx-title">FX Risk Modeller</h1>
            <p className="fx-subtitle">
              See how exchange rate movements affect your margins. Enter your products and model mild, moderate, and severe depreciation scenarios.
            </p>
          </div>

          {/* Currency pair */}
          <div className="fx-section">
            <h2 className="fx-section-title">💱 Currency Pair</h2>
            <p className="fx-section-desc">
              Your home (selling) currency vs. your supplier's currency.
            </p>
            <div className="fx-pair-row">
              <div className="fx-field">
                <label className="fx-label">Your currency (home)</label>
                <select
                  className="fx-input"
                  value={baseCurrency}
                  onChange={(e) => { setBaseCurrency(e.target.value); setCustomRate(""); }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
              <div className="fx-pair-slash">per</div>
              <div className="fx-field">
                <label className="fx-label">Supplier currency (quote)</label>
                <select
                  className="fx-input"
                  value={quoteCurrency}
                  onChange={(e) => { setQuoteCurrency(e.target.value); setCustomRate(""); }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fx-rate-display">
              <div className="fx-rate-value">
                1 {quoteCurrency} = <strong>{currentRate.toFixed(4)}</strong> {baseCurrency}
              </div>
              <div className="fx-rate-vol">
                Typical 1-year volatility: ±{volatility}%
              </div>
            </div>

            <div className="fx-field" style={{ marginTop: 12 }}>
              <label className="fx-label">Override exchange rate (optional)</label>
              <input
                className="fx-input"
                type="number"
                step="0.0001"
                min="0"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder={tc("freetools.fx_ph_rate_override", { rate: currentRate.toFixed(4) })}
              />
            </div>
          </div>

          {/* Scenarios */}
          <div className="fx-section">
            <h2 className="fx-section-title">📉 Depreciation Scenarios</h2>
            <p className="fx-section-desc">How much does your home currency weaken against the supplier currency?</p>
            <div className="fx-scenarios-grid">
              {[
                { label: "Mild", key: "mild", val: mildPct, set: setMildPct, color: "#10b981" },
                { label: "Moderate", key: "moderate", val: moderatePct, set: setModeratePct, color: "#f59e0b" },
                { label: "Severe", key: "severe", val: severePct, set: setSeverePct, color: "#ef4444" },
              ].map((s) => (
                <div key={s.key} className="fx-scenario-item" style={{ "--sc": s.color } as React.CSSProperties}>
                  <div className="fx-scenario-label" style={{ color: s.color }}>{s.label}</div>
                  <div className="fx-scenario-input-wrap">
                    <input
                      className="fx-input fx-scenario-input"
                      type="number"
                      min="1"
                      max="80"
                      value={s.val}
                      onChange={(e) => s.set(Number(e.target.value))}
                    />
                    <span className="fx-scenario-pct">%</span>
                  </div>
                  <div className="fx-scenario-rate">
                    → 1 {quoteCurrency} = {(currentRate * (1 - s.val / 100)).toFixed(4)} {baseCurrency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="fx-section">
            <h2 className="fx-section-title">📦 Your Products</h2>
            <p className="fx-section-desc">
              Enter your products with selling price in {baseCurrency} and supplier cost in {quoteCurrency}.
            </p>
            <div className="fx-products">
              <div className="fx-products-header">
                <span>Product</span>
                <span>Sell ({baseSym})</span>
                <span>Supplier ({quoteSym})</span>
                <span>Other costs ({baseSym})</span>
                <span></span>
              </div>
              {products.map((product) => (
                <div key={product.id} className="fx-product-row">
                  <input
                    className="fx-input"
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                    placeholder={tc("freetools.fx_ph_product_name")}
                  />
                  <input
                    className="fx-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.sellingPrice}
                    onChange={(e) => updateProduct(product.id, "sellingPrice", Number(e.target.value))}
                  />
                  <input
                    className="fx-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.supplierCostInQuote}
                    onChange={(e) => updateProduct(product.id, "supplierCostInQuote", Number(e.target.value))}
                  />
                  <input
                    className="fx-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.otherCostsInBase}
                    onChange={(e) => updateProduct(product.id, "otherCostsInBase", Number(e.target.value))}
                  />
                  <button
                    className="fx-remove-btn"
                    onClick={() => removeProduct(product.id)}
                    type="button"
                    aria-label="Remove product"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button className="fx-add-btn" onClick={addProduct} type="button">
                + Add product
              </button>
            </div>
          </div>

          <button className="fx-calculate-btn" onClick={calculate} type="button">
            Model FX Risk →
          </button>
        </div>

        {/* ── Results Panel ── */}
        <div className="fx-results-col">
          {!calculated ? (
            <div className="fx-placeholder">
              <div className="fx-placeholder-icon">📊</div>
              <h3 className="fx-placeholder-title">Your scenario results will appear here</h3>
              <p className="fx-placeholder-sub">Configure your currency pair, scenarios, and products, then click Model FX Risk.</p>
            </div>
          ) : results ? (
            <div className="fx-results">
              {/* Summary */}
              <div className="fx-results-summary">
                <h2 className="fx-results-title">FX Risk Analysis</h2>
                <p className="fx-results-desc">
                  {baseCurrency}/{quoteCurrency} at {currentRate.toFixed(4)} today.
                  Showing margin impact across 3 depreciation scenarios.
                </p>

                {/* Scenario legend */}
                <div className="fx-legend">
                  {[
                    { label: `Mild (−${mildPct}%)`, color: scenarioColors.mild },
                    { label: `Moderate (−${moderatePct}%)`, color: scenarioColors.moderate },
                    { label: `Severe (−${severePct}%)`, color: scenarioColors.severe },
                  ].map((l) => (
                    <div key={l.label} className="fx-legend-item">
                      <span className="fx-legend-dot" style={{ background: l.color }} />
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product results */}
              {results.map((r) => (
                <div
                  key={r.product.id}
                  className={`fx-product-result ${
                    r.scenarios.severe.breakEven
                      ? "fx-product-result--danger"
                      : r.scenarios.moderate.breakEven
                      ? "fx-product-result--warning"
                      : ""
                  }`}
                >
                  <div className="fx-product-result-header">
                    <div>
                      <span className="fx-product-result-name">{r.product.name}</span>
                      <span className="fx-product-result-current">
                        Current margin: <strong>{r.currentMargin.toFixed(1)}%</strong>
                      </span>
                    </div>
                    <div className="fx-product-result-be">
                      Break-even: 1 {quoteCurrency} ={" "}
                      <strong>{r.breakEvenRate.toFixed(4)} {baseCurrency}</strong>
                    </div>
                  </div>

                  {/* Scenario bars */}
                  <div className="fx-product-scenarios">
                    {(["mild", "moderate", "severe"] as const).map((scenario) => {
                      const s = r.scenarios[scenario];
                      const color = scenarioColors[scenario];
                      const label =
                        scenario === "mild"
                          ? `Mild −${mildPct}%`
                          : scenario === "moderate"
                          ? `Moderate −${moderatePct}%`
                          : `Severe −${severePct}%`;
                      return (
                        <div key={scenario} className="fx-scenario-row">
                          <div className="fx-scenario-row-header">
                            <span className="fx-scenario-row-label" style={{ color }}>
                              {label}
                            </span>
                            <span className="fx-scenario-row-rate">
                              1 {quoteCurrency} = {s.rate.toFixed(4)} {baseCurrency}
                            </span>
                          </div>
                          <div className="fx-scenario-row-data">
                            <div className="fx-scenario-row-margin">
                              <span
                                className={`fx-scenario-margin-val ${s.breakEven ? "negative" : s.margin < 15 ? "warning" : "good"}`}
                              >
                                {s.margin.toFixed(1)}%
                              </span>
                              <span className="fx-scenario-margin-change" style={{ color: s.marginChange < 0 ? "#ef4444" : "#10b981" }}>
                                ({pct(s.marginChange)})
                              </span>
                            </div>
                            <div className="fx-scenario-bar-outer">
                              <div
                                className="fx-scenario-bar-inner"
                                style={{
                                  width: `${Math.max(0, Math.min(100, s.margin))}%`,
                                  background: s.breakEven ? "#ef4444" : s.margin < 15 ? "#f59e0b" : color,
                                }}
                              />
                            </div>
                          </div>
                          {s.breakEven && (
                            <div className="fx-scenario-alert">
                              ⚠️ Loss-making at this exchange rate. Reprice by {baseSym}{((r.product.supplierCostInQuote / s.rate) + r.product.otherCostsInBase + 1).toFixed(2)}+ to break even.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Aggregate risk */}
              <div className="fx-aggregate">
                <h3 className="fx-aggregate-title">Portfolio Risk Summary</h3>
                <div className="fx-aggregate-grid">
                  {[
                    {
                      label: "Products at risk (severe)",
                      value: results.filter((r) => r.scenarios.severe.breakEven).length,
                      of: results.length,
                      color: "#ef4444",
                    },
                    {
                      label: "Products at risk (moderate)",
                      value: results.filter((r) => r.scenarios.moderate.breakEven).length,
                      of: results.length,
                      color: "#f59e0b",
                    },
                    {
                      label: "Avg margin loss (severe scenario)",
                      value:
                        (
                          results.reduce((sum, r) => sum + r.scenarios.severe.marginChange, 0) /
                          results.length
                        ).toFixed(1) + "%",
                      color: "#ef4444",
                    },
                    {
                      label: "Pair volatility (1-year typical)",
                      value: `±${volatility}%`,
                      color: "#6b6760",
                    },
                  ].map((item) => (
                    <div key={item.label} className="fx-aggregate-item">
                      <span className="fx-aggregate-val" style={{ color: item.color }}>
                        {typeof item.value === "number"
                          ? `${item.value}/${item.of}`
                          : item.value}
                      </span>
                      <span className="fx-aggregate-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fx-disclaimer">
                <strong>Disclaimer:</strong> Rates are indicative mid-market rates (April 2026). Actual rates from your bank or FX provider will differ. This is not financial advice — consult a qualified advisor before hedging decisions.
              </div>

              {/* CTA */}
              <div className="fx-result-cta">
                <p className="fx-result-cta-text">
                  <strong>Want this pre-filled with your real Shopify or Amazon products?</strong> AskBiz connects to your sales data and models FX risk across your entire catalogue automatically.
                </p>
                <Link href="/signin?mode=signup" className="fx-result-cta-btn">Start free — no card needed →</Link>
              </div>

              <div style={{ background: "#fff8f3", border: "1.5px solid #f0d5b8", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                    Want this calculated automatically on your real data?
                  </div>
                  <div style={{ fontSize: 13, color: "#6b6760" }}>
                    AskBiz connects to Shopify, Amazon & QuickBooks — no spreadsheets needed.
                  </div>
                </div>
                <a href="/signin?mode=signup" style={{ display: "inline-flex", alignItems: "center", background: "#d08a59", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Try free →
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* SEO content */}
      <section className="fx-seo-content">
        <div className="fx-seo-inner">
          <h2>What Is FX Risk for Importers?</h2>
          <p>FX (foreign exchange) risk for importers is the risk that your home currency weakens against your supplier's currency, making your imported goods more expensive without any change to the supplier's prices. For example, if you sell in GBP but pay your Chinese supplier in USD, a 10% fall in GBP/USD increases your effective cost by approximately 10%.</p>
          <h3>How to Read This Tool</h3>
          <p>The FX Risk Modeller shows you your current margin, then simulates three scenarios of currency depreciation: mild (5%), moderate (10%), and severe (20%). For each scenario, it calculates your new margin and flags products that become loss-making.</p>
          <h3>What Is a Break-Even Exchange Rate?</h3>
          <p>The break-even exchange rate is the exchange rate at which a product's margin falls to zero — i.e. the rate at which you stop making money. If the current rate is well above your break-even rate, you have significant buffer. If it's close, you're exposed.</p>
          <h3>How Do Businesses Manage FX Risk?</h3>
          <p>Common approaches include: forward contracts (locking in an exchange rate for future payments), pricing in the supplier's currency, building a currency buffer into your margins, diversifying suppliers across multiple currency zones, and hedging via FX options. This tool helps you understand your exposure before choosing a risk management strategy.</p>
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
        }
        * { box-sizing:border-box; }
        .fx-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        .fx-nav { background:var(--sf); border-bottom:1px solid var(--b); padding:0 24px; position:sticky; top:0; z-index:100; }
        .fx-nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:56px; }
        .fx-nav-back { font-size:13px; color:var(--tx2); text-decoration:none; transition:color .15s; }
        .fx-nav-back:hover { color:var(--acc); }
        .fx-nav-logo { font-family:var(--font-head); font-size:17px; font-weight:800; color:var(--tx); text-decoration:none; }
        .fx-nav-cta { font-size:13px; font-weight:700; background:#3b82f6; color:#fff; padding:7px 14px; border-radius:8px; text-decoration:none; }
        .fx-nav-cta:hover { background:#2563eb; }

        .fx-layout { max-width:1200px; margin:0 auto; padding:40px 24px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }

        /* Config */
        .fx-header { margin-bottom:28px; }
        .fx-tool-badge { display:inline-block; background:#eff6ff; color:#1d4ed8; font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
        .fx-title { font-family:var(--font-head); font-size:28px; font-weight:800; color:var(--tx); margin:0 0 8px; letter-spacing:-.02em; }
        .fx-subtitle { font-size:15px; color:var(--tx2); margin:0; line-height:1.55; }

        .fx-section { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:24px; margin-bottom:16px; }
        .fx-section-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin:0 0 6px; }
        .fx-section-desc { font-size:13px; color:var(--tx3); margin:0 0 16px; }
        .fx-field { display:flex; flex-direction:column; gap:5px; }
        .fx-label { font-size:13px; font-weight:600; color:var(--tx2); }
        .fx-input { width:100%; padding:10px 12px; border:1.5px solid var(--b); border-radius:var(--r-sm); font-size:14px; font-family:var(--font-body); color:var(--tx); background:var(--sf); outline:none; transition:border-color .15s; }
        .fx-input:focus { border-color:#3b82f6; }

        .fx-pair-row { display:grid; grid-template-columns:1fr auto 1fr; gap:12px; align-items:end; margin-bottom:12px; }
        .fx-pair-slash { font-size:16px; color:var(--tx3); text-align:center; padding-bottom:10px; }
        .fx-rate-display { background:var(--el); border-radius:var(--r-sm); padding:12px 16px; display:flex; justify-content:space-between; align-items:center; }
        .fx-rate-value { font-size:15px; color:var(--tx); }
        .fx-rate-value strong { font-weight:700; }
        .fx-rate-vol { font-size:12px; color:var(--tx3); }

        .fx-scenarios-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
        .fx-scenario-item { background:var(--el); border-radius:var(--r-sm); padding:12px; border-top:3px solid var(--sc); }
        .fx-scenario-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; display:block; margin-bottom:6px; }
        .fx-scenario-input-wrap { display:flex; align-items:center; gap:4px; margin-bottom:6px; }
        .fx-scenario-input { font-size:16px; font-weight:700; padding:6px 8px; }
        .fx-scenario-pct { font-size:14px; font-weight:600; color:var(--tx2); }
        .fx-scenario-rate { font-size:11px; color:var(--tx3); }

        .fx-products-header { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 28px; gap:8px; padding:0 0 8px; border-bottom:1px solid var(--b); font-size:11px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; }
        .fx-product-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 28px; gap:8px; margin-top:8px; align-items:center; }
        .fx-remove-btn { background:none; border:1.5px solid var(--b); border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:16px; color:var(--tx3); display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .fx-remove-btn:hover { background:#fee2e2; border-color:#fca5a5; color:#ef4444; }
        .fx-add-btn { margin-top:12px; background:none; border:1.5px dashed var(--b); border-radius:var(--r-sm); padding:9px; width:100%; cursor:pointer; font-size:13px; font-weight:600; color:var(--tx3); font-family:var(--font-body); transition:all .15s; }
        .fx-add-btn:hover { border-color:#3b82f6; color:#3b82f6; }

        .fx-calculate-btn { width:100%; padding:16px; background:#3b82f6; color:#fff; border:none; border-radius:var(--r); font-size:16px; font-weight:700; font-family:var(--font-head); cursor:pointer; transition:background .15s,transform .15s; }
        .fx-calculate-btn:hover { background:#2563eb; transform:translateY(-1px); }

        /* Results */
        .fx-results-col { position:sticky; top:80px; }
        .fx-placeholder { background:var(--sf); border:1.5px dashed var(--b); border-radius:var(--r); padding:60px 40px; text-align:center; }
        .fx-placeholder-icon { font-size:48px; margin-bottom:16px; }
        .fx-placeholder-title { font-family:var(--font-head); font-size:18px; font-weight:700; color:var(--tx); margin:0 0 8px; }
        .fx-placeholder-sub { font-size:14px; color:var(--tx3); margin:0; }

        .fx-results { display:flex; flex-direction:column; gap:16px; }
        .fx-results-summary { background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%); border-radius:var(--r); padding:24px; }
        .fx-results-title { font-family:var(--font-head); font-size:20px; font-weight:700; color:#fff; margin:0 0 6px; }
        .fx-results-desc { font-size:14px; color:rgba(255,255,255,.5); margin:0 0 16px; }
        .fx-legend { display:flex; gap:16px; flex-wrap:wrap; }
        .fx-legend-item { display:flex; align-items:center; gap:6px; font-size:13px; color:rgba(255,255,255,.7); }
        .fx-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

        .fx-product-result { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:20px; }
        .fx-product-result--warning { border-color:#fcd34d; }
        .fx-product-result--danger { border-color:#fca5a5; }
        .fx-product-result-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
        .fx-product-result-name { display:block; font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin-bottom:3px; }
        .fx-product-result-current { font-size:13px; color:var(--tx3); }
        .fx-product-result-be { font-size:12px; color:var(--tx3); text-align:right; }

        .fx-product-scenarios { display:flex; flex-direction:column; gap:12px; }
        .fx-scenario-row { }
        .fx-scenario-row-header { display:flex; justify-content:space-between; margin-bottom:4px; }
        .fx-scenario-row-label { font-size:12px; font-weight:700; }
        .fx-scenario-row-rate { font-size:12px; color:var(--tx3); }
        .fx-scenario-row-data { display:flex; align-items:center; gap:12px; }
        .fx-scenario-row-margin { display:flex; align-items:baseline; gap:5px; min-width:90px; }
        .fx-scenario-margin-val { font-size:16px; font-weight:700; }
        .fx-scenario-margin-val.good { color:#10b981; }
        .fx-scenario-margin-val.warning { color:#f59e0b; }
        .fx-scenario-margin-val.negative { color:#ef4444; }
        .fx-scenario-margin-change { font-size:12px; }
        .fx-scenario-bar-outer { flex:1; height:8px; background:var(--el); border-radius:4px; overflow:hidden; }
        .fx-scenario-bar-inner { height:100%; border-radius:4px; transition:width .4s ease; }
        .fx-scenario-alert { font-size:12px; color:#b45309; background:#fef3c7; border-radius:var(--r-sm); padding:7px 10px; margin-top:6px; }

        .fx-aggregate { background:var(--el); border-radius:var(--r); padding:20px; }
        .fx-aggregate-title { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .fx-aggregate-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .fx-aggregate-item { display:flex; flex-direction:column; gap:3px; }
        .fx-aggregate-val { font-family:var(--font-head); font-size:22px; font-weight:700; }
        .fx-aggregate-label { font-size:12px; color:var(--tx3); line-height:1.4; }

        .fx-disclaimer { font-size:11px; color:var(--tx3); line-height:1.5; padding:12px; background:var(--el); border-radius:var(--r-sm); }

        .fx-result-cta { background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:var(--r); padding:20px; }
        .fx-result-cta-text { font-size:13px; color:var(--tx2); margin:0 0 12px; line-height:1.5; }
        .fx-result-cta-btn { display:inline-flex; align-items:center; background:#3b82f6; color:#fff; font-size:13px; font-weight:700; padding:10px 18px; border-radius:8px; text-decoration:none; }
        .fx-result-cta-btn:hover { background:#2563eb; }

        /* SEO */
        .fx-seo-content { background:var(--sf); border-top:1px solid var(--b); padding:56px 24px; }
        .fx-seo-inner { max-width:760px; margin:0 auto; }
        .fx-seo-inner h2 { font-family:var(--font-head); font-size:22px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .fx-seo-inner h3 { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:24px 0 10px; }
        .fx-seo-inner p { font-size:15px; color:var(--tx2); line-height:1.75; margin:0 0 14px; }

        @media (max-width:900px) {
          .fx-layout { grid-template-columns:1fr; }
          .fx-results-col { position:static; }
          .fx-scenarios-grid { grid-template-columns:1fr 1fr 1fr; }
          .fx-products-header,.fx-product-row { grid-template-columns:2fr 1fr 1fr; }
          .fx-products-header span:nth-child(4),.fx-product-row input:nth-child(4) { display:none; }
          .fx-aggregate-grid { grid-template-columns:1fr 1fr; }
        }
        @media (max-width:480px) {
          .fx-scenarios-grid { grid-template-columns:1fr; }
          .fx-products-header { display:none; }
          .fx-product-row { grid-template-columns:1fr 1fr 28px; }
          .fx-product-row input:nth-child(3) { display:none; }
        }
      `}</style>
    </div>
  );
}
