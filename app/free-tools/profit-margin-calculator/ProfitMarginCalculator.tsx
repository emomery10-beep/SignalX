"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

interface Product {
  id: number;
  name: string;
  costPrice: number;
  sellingPrice: number;
  shippingCost: number;
  platformFees: number;
  otherCosts: number;
  quantity: number;
}

interface ProductResult {
  product: Product;
  totalCost: number;
  unitTotalCost: number;
  profit: number;
  margin: number;
  markup: number;
  naiveMargin: number;
  marginGap: number;
  revenuePerMonth: number;
  profitPerMonth: number;
}

const CURRENCIES = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

const EMPTY_PRODUCT: Product = {
  id: 1,
  name: "",
  costPrice: 0,
  sellingPrice: 0,
  shippingCost: 0,
  platformFees: 0,
  otherCosts: 0,
  quantity: 1,
};

function getMarginColor(margin: number): string {
  if (margin < 0) return "#dc2626";
  if (margin < 10) return "#dc2626";
  if (margin < 20) return "#f59e0b";
  if (margin < 35) return "#d08a59";
  return "#16a34a";
}

function getMarginLabel(margin: number): string {
  if (margin < 0) return "Loss-making";
  if (margin < 10) return "Critical";
  if (margin < 20) return "Thin";
  if (margin < 35) return "Moderate";
  return "Healthy";
}

export default function ProfitMarginCalculator() {
  const { tc } = useLang();
  const [currency, setCurrency] = useState("GBP");
  const [products, setProducts] = useState<Product[]>([{ ...EMPTY_PRODUCT }]);
  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [nextId, setNextId] = useState(2);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || "£";

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000) return `${sym}${n.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
    return `${sym}${n.toFixed(2)}`;
  };

  const updateProduct = (id: number, key: keyof Product, value: string | number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const addProduct = () => {
    setProducts((prev) => [...prev, { ...EMPTY_PRODUCT, id: nextId, name: `Product ${nextId}` }]);
    setNextId((n) => n + 1);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const calculate = () => {
    const r: ProductResult[] = products
      .filter((p) => p.costPrice > 0 && p.sellingPrice > 0)
      .map((p) => {
        const totalCost = p.costPrice + p.shippingCost + p.platformFees + p.otherCosts;
        const profit = p.sellingPrice - totalCost;
        const margin = (profit / p.sellingPrice) * 100;
        const markup = totalCost > 0 ? (profit / totalCost) * 100 : 0;
        const naiveMargin = ((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100;
        const marginGap = naiveMargin - margin;

        return {
          product: p,
          totalCost,
          unitTotalCost: totalCost,
          profit,
          margin,
          markup,
          naiveMargin,
          marginGap,
          revenuePerMonth: p.sellingPrice * p.quantity,
          profitPerMonth: profit * p.quantity,
        };
      });

    r.sort((a, b) => b.margin - a.margin);
    setResults(r);
  };

  const totalRevenue = results?.reduce((s, r) => s + r.revenuePerMonth, 0) || 0;
  const totalProfit = results?.reduce((s, r) => s + r.profitPerMonth, 0) || 0;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const lossMakers = results?.filter((r) => r.margin < 0).length || 0;

  return (
    <div className="pm-root">
      <nav className="pm-nav">
        <div className="pm-nav-inner">
          <Link href="/free-tools" className="pm-nav-back">← Free Tools</Link>
          <Link href="/" className="pm-nav-logo">AskBiz</Link>
          <Link href="/signin?mode=signup" className="pm-nav-cta">Try AskBiz Free →</Link>
        </div>
      </nav>

      <div className="pm-layout">
        {/* ── Left: Form ── */}
        <div className="pm-form-col">
          <div className="pm-header">
            <span className="pm-badge">Free Tool</span>
            <h1 className="pm-title">Profit Margin Calculator</h1>
            <p className="pm-subtitle">
              Calculate your true profit margin and markup after all costs — shipping, fees, and duties included. No sign-up required.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="pm-mode-toggle">
            <button
              className={`pm-mode-btn ${mode === "single" ? "pm-mode-btn--active" : ""}`}
              onClick={() => { setMode("single"); setProducts([products[0]]); setResults(null); }}
              type="button"
            >
              Single Product
            </button>
            <button
              className={`pm-mode-btn ${mode === "batch" ? "pm-mode-btn--active" : ""}`}
              onClick={() => { setMode("batch"); setResults(null); }}
              type="button"
            >
              Compare Products
            </button>
          </div>

          {/* Currency selector */}
          <div className="pm-section pm-section--compact">
            <label className="pm-label">Currency</label>
            <select className="pm-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Product forms */}
          {products.map((p, idx) => (
            <div key={p.id} className="pm-section">
              <div className="pm-section-header">
                <h2 className="pm-section-title">
                  {mode === "batch" ? `📦 Product ${idx + 1}` : "📦 Product Details"}
                </h2>
                {mode === "batch" && products.length > 1 && (
                  <button className="pm-remove-btn" onClick={() => removeProduct(p.id)} type="button">✕</button>
                )}
              </div>

              {mode === "batch" && (
                <div className="pm-field">
                  <label className="pm-label">Product name</label>
                  <input
                    className="pm-input"
                    type="text"
                    placeholder={tc("freetools.pm_ph_product_name")}
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                  />
                </div>
              )}

              <div className="pm-row">
                <div className="pm-field">
                  <label className="pm-label">Cost price (per unit)</label>
                  <div className="pm-input-group">
                    <span className="pm-input-prefix">{sym}</span>
                    <input
                      className="pm-input pm-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.costPrice || ""}
                      onChange={(e) => updateProduct(p.id, "costPrice", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Selling price (per unit)</label>
                  <div className="pm-input-group">
                    <span className="pm-input-prefix">{sym}</span>
                    <input
                      className="pm-input pm-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.sellingPrice || ""}
                      onChange={(e) => updateProduct(p.id, "sellingPrice", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="pm-extra-costs-label">Additional costs per unit (optional)</div>
              <div className="pm-row pm-row--thirds">
                <div className="pm-field">
                  <label className="pm-label">Shipping</label>
                  <div className="pm-input-group">
                    <span className="pm-input-prefix">{sym}</span>
                    <input
                      className="pm-input pm-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.shippingCost || ""}
                      onChange={(e) => updateProduct(p.id, "shippingCost", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Fees / commission</label>
                  <div className="pm-input-group">
                    <span className="pm-input-prefix">{sym}</span>
                    <input
                      className="pm-input pm-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.platformFees || ""}
                      onChange={(e) => updateProduct(p.id, "platformFees", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Duty / other</label>
                  <div className="pm-input-group">
                    <span className="pm-input-prefix">{sym}</span>
                    <input
                      className="pm-input pm-input--suffix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.otherCosts || ""}
                      onChange={(e) => updateProduct(p.id, "otherCosts", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="pm-field">
                <label className="pm-label">Monthly sales volume (units)</label>
                <input
                  className="pm-input"
                  type="number"
                  min="1"
                  value={p.quantity}
                  onChange={(e) => updateProduct(p.id, "quantity", Number(e.target.value))}
                />
              </div>
            </div>
          ))}

          {mode === "batch" && (
            <button className="pm-add-btn" onClick={addProduct} type="button">
              + Add another product
            </button>
          )}

          <button className="pm-calculate-btn" onClick={calculate} type="button">
            Calculate Margins →
          </button>
        </div>

        {/* ── Right: Results ── */}
        <div className="pm-result-col">
          {!results ? (
            <div className="pm-placeholder">
              <div className="pm-placeholder-icon">💰</div>
              <h3 className="pm-placeholder-title">Your results will appear here</h3>
              <p className="pm-placeholder-sub">Enter your cost and selling price, then click Calculate to see your true profit margin.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="pm-placeholder">
              <div className="pm-placeholder-icon">⚠️</div>
              <h3 className="pm-placeholder-title">No valid products</h3>
              <p className="pm-placeholder-sub">Enter a cost price and selling price greater than zero.</p>
            </div>
          ) : (
            <div className="pm-result">
              {/* Summary card */}
              <div className="pm-result-hero">
                <div className="pm-result-hero-label">
                  {results.length === 1 ? "Profit Margin" : "Weighted Average Margin"}
                </div>
                <div className="pm-result-hero-value" style={{ color: getMarginColor(results.length === 1 ? results[0].margin : avgMargin) }}>
                  {(results.length === 1 ? results[0].margin : avgMargin).toFixed(1)}%
                </div>
                <div className="pm-result-hero-badge" style={{ background: `${getMarginColor(results.length === 1 ? results[0].margin : avgMargin)}18`, color: getMarginColor(results.length === 1 ? results[0].margin : avgMargin) }}>
                  {getMarginLabel(results.length === 1 ? results[0].margin : avgMargin)}
                </div>
                {results.length > 1 && (
                  <div className="pm-result-hero-sub">
                    {results.length} products · {lossMakers > 0 ? `${lossMakers} loss-making` : "All profitable"}
                  </div>
                )}
              </div>

              {/* Single product detail */}
              {results.length === 1 && (() => {
                const r = results[0];
                return (
                  <>
                    {/* Key metrics */}
                    <div className="pm-metrics">
                      <div className="pm-metric">
                        <span className="pm-metric-label">Profit per unit</span>
                        <span className="pm-metric-value" style={{ color: r.profit >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(r.profit)}</span>
                      </div>
                      <div className="pm-metric">
                        <span className="pm-metric-label">Markup</span>
                        <span className="pm-metric-value">{r.markup.toFixed(1)}%</span>
                      </div>
                      <div className="pm-metric">
                        <span className="pm-metric-label">True cost per unit</span>
                        <span className="pm-metric-value">{fmt(r.totalCost)}</span>
                      </div>
                      <div className="pm-metric">
                        <span className="pm-metric-label">Monthly profit</span>
                        <span className="pm-metric-value" style={{ color: r.profitPerMonth >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(r.profitPerMonth)}</span>
                      </div>
                    </div>

                    {/* Margin gap alert */}
                    {r.marginGap > 1 && (
                      <div className="pm-alert">
                        <div className="pm-alert-icon">⚠️</div>
                        <div>
                          <div className="pm-alert-title">Hidden cost gap: {r.marginGap.toFixed(1)} percentage points</div>
                          <div className="pm-alert-body">
                            Your simplified margin (cost vs selling price only) is {r.naiveMargin.toFixed(1)}%, but your true margin after shipping, fees, and duties is <strong>{r.margin.toFixed(1)}%</strong>. The difference is {fmt(r.product.shippingCost + r.product.platformFees + r.product.otherCosts)} per unit in hidden costs.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cost breakdown */}
                    <div className="pm-breakdown">
                      <h3 className="pm-breakdown-title">Cost Breakdown</h3>
                      {[
                        { label: "Cost price", value: r.product.costPrice, color: "#d08a59" },
                        { label: "Shipping", value: r.product.shippingCost, color: "#3b82f6" },
                        { label: "Fees / commission", value: r.product.platformFees, color: "#8b5cf6" },
                        { label: "Duty / other", value: r.product.otherCosts, color: "#f59e0b" },
                      ]
                        .filter((row) => row.value > 0)
                        .map((row) => {
                          const pct = r.totalCost > 0 ? (row.value / r.totalCost) * 100 : 0;
                          return (
                            <div key={row.label} className="pm-breakdown-row">
                              <div className="pm-breakdown-row-top">
                                <span className="pm-breakdown-label">{row.label}</span>
                                <span className="pm-breakdown-amount">{fmt(row.value)} <span className="pm-breakdown-pct-text">({pct.toFixed(0)}%)</span></span>
                              </div>
                              <div className="pm-breakdown-bar-wrap">
                                <div className="pm-breakdown-bar" style={{ width: `${pct}%`, background: row.color }} />
                              </div>
                            </div>
                          );
                        })}
                      <div className="pm-breakdown-total">
                        <span>Total cost per unit</span>
                        <span>{fmt(r.totalCost)}</span>
                      </div>
                    </div>

                    {/* Margin vs Markup explainer */}
                    <div className="pm-compare">
                      <h3 className="pm-compare-title">Margin vs Markup</h3>
                      <div className="pm-compare-row">
                        <div className="pm-compare-item">
                          <div className="pm-compare-label">Margin</div>
                          <div className="pm-compare-value">{r.margin.toFixed(1)}%</div>
                          <div className="pm-compare-formula">Profit ÷ Selling Price</div>
                        </div>
                        <div className="pm-compare-divider">vs</div>
                        <div className="pm-compare-item">
                          <div className="pm-compare-label">Markup</div>
                          <div className="pm-compare-value">{r.markup.toFixed(1)}%</div>
                          <div className="pm-compare-formula">Profit ÷ Cost Price</div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Batch product table */}
              {results.length > 1 && (
                <>
                  <div className="pm-metrics">
                    <div className="pm-metric">
                      <span className="pm-metric-label">Monthly revenue</span>
                      <span className="pm-metric-value">{fmt(totalRevenue)}</span>
                    </div>
                    <div className="pm-metric">
                      <span className="pm-metric-label">Monthly profit</span>
                      <span className="pm-metric-value" style={{ color: totalProfit >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(totalProfit)}</span>
                    </div>
                    <div className="pm-metric">
                      <span className="pm-metric-label">Best margin</span>
                      <span className="pm-metric-value" style={{ color: "#16a34a" }}>{results[0].margin.toFixed(1)}%</span>
                    </div>
                    <div className="pm-metric">
                      <span className="pm-metric-label">Worst margin</span>
                      <span className="pm-metric-value" style={{ color: getMarginColor(results[results.length - 1].margin) }}>{results[results.length - 1].margin.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="pm-table-wrap">
                    <table className="pm-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Cost</th>
                          <th>Price</th>
                          <th>Margin</th>
                          <th>Markup</th>
                          <th>Profit/mo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r) => (
                          <tr key={r.product.id}>
                            <td className="pm-table-name">{r.product.name || `Product ${r.product.id}`}</td>
                            <td>{fmt(r.totalCost)}</td>
                            <td>{fmt(r.product.sellingPrice)}</td>
                            <td>
                              <span className="pm-table-margin" style={{ color: getMarginColor(r.margin), background: `${getMarginColor(r.margin)}12` }}>
                                {r.margin.toFixed(1)}%
                              </span>
                            </td>
                            <td>{r.markup.toFixed(0)}%</td>
                            <td style={{ color: r.profitPerMonth >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{fmt(r.profitPerMonth)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Gap alerts */}
                  {results.filter((r) => r.marginGap > 1).length > 0 && (
                    <div className="pm-alert">
                      <div className="pm-alert-icon">⚠️</div>
                      <div>
                        <div className="pm-alert-title">Hidden cost gaps detected</div>
                        <div className="pm-alert-body">
                          {results.filter((r) => r.marginGap > 1).map((r) => (
                            <div key={r.product.id} style={{ marginBottom: 4 }}>
                              <strong>{r.product.name || `Product ${r.product.id}`}</strong>: simplified margin {r.naiveMargin.toFixed(0)}% → true margin <strong>{r.margin.toFixed(1)}%</strong> (−{r.marginGap.toFixed(0)}pp from hidden costs)
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* CTA */}
              <div className="pm-result-cta">
                <p className="pm-result-cta-text">
                  <strong>Want this across your entire catalogue?</strong> AskBiz connects to Shopify, Amazon, and QuickBooks to auto-calculate margins for every product — and alerts you when any drop below your threshold.
                </p>
                <Link href="/signin?mode=signup" className="pm-result-cta-btn">Start free — no card needed →</Link>
              </div>

              <div className="pm-cross-tools">
                <div className="pm-cross-tools-label">Related free tools</div>
                <div className="pm-cross-tools-grid">
                  <Link href="/free-tools/landed-cost-calculator" className="pm-cross-link">🚢 Landed Cost Calculator</Link>
                  <Link href="/free-tools/break-even-calculator" className="pm-cross-link">📐 Break-Even Calculator</Link>
                  <Link href="/free-tools/vat-calculator" className="pm-cross-link">🧾 VAT Calculator</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO content */}
      <section className="pm-seo">
        <div className="pm-seo-inner">
          <h2>How to Calculate Profit Margin</h2>
          <p>Profit margin tells you the percentage of your selling price that is actual profit. The formula is: <strong>Margin % = ((Selling Price − Total Cost) ÷ Selling Price) × 100</strong>.</p>
          <p>For example, if you sell a product for {sym}25 and the total cost (including purchase price, shipping, and fees) is {sym}18, your profit is {sym}7 and your margin is 28%.</p>
          <h3>Margin vs Markup — What's the Difference?</h3>
          <p>Margin is profit as a percentage of the <strong>selling price</strong>. Markup is profit as a percentage of the <strong>cost price</strong>. They measure the same profit differently. A 50% markup is the same as a 33.3% margin. Retailers typically talk in margin; wholesalers and manufacturers often use markup.</p>
          <h3>Why Your Real Margin Is Lower Than You Think</h3>
          <p>Most businesses calculate margin using only the purchase price. But the real cost of selling a product includes shipping to your warehouse, platform or marketplace fees (Amazon takes 15%, eBay 12.8%), payment processing (2–3%), packaging, import duties, and returns. This calculator lets you add all of these to see your true margin.</p>
          <h3>What Is a Good Profit Margin?</h3>
          <p>It depends on your industry. Retail: 5–20%. Ecommerce: 10–30%. SaaS: 60–80%. Professional services: 20–50%. Food and beverage: 3–15%. The most important thing is knowing your margin <em>per product</em>, not just the average — because one loss-making product can drag down an otherwise profitable range.</p>
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
        .pm-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        .pm-nav { background:var(--sf); border-bottom:1px solid var(--b); padding:0 24px; position:sticky; top:0; z-index:100; }
        .pm-nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:56px; }
        .pm-nav-back { font-size:13px; color:var(--tx2); text-decoration:none; transition:color .15s; }
        .pm-nav-back:hover { color:var(--acc); }
        .pm-nav-logo { font-family:var(--font-head); font-size:17px; font-weight:800; color:var(--tx); text-decoration:none; }
        .pm-nav-cta { font-size:13px; font-weight:700; background:var(--acc); color:#fff; padding:7px 14px; border-radius:8px; text-decoration:none; }
        .pm-nav-cta:hover { background:var(--acc-dark); }

        .pm-layout { max-width:1200px; margin:0 auto; padding:40px 24px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }

        .pm-header { margin-bottom:24px; }
        .pm-badge { display:inline-block; background:var(--acc-light); color:var(--acc-dark); font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
        .pm-title { font-family:var(--font-head); font-size:28px; font-weight:800; color:var(--tx); margin:0 0 8px; letter-spacing:-.02em; }
        .pm-subtitle { font-size:15px; color:var(--tx2); margin:0; line-height:1.55; }

        .pm-mode-toggle { display:flex; gap:0; margin-bottom:20px; border-radius:var(--r-sm); overflow:hidden; border:1.5px solid var(--b); }
        .pm-mode-btn { flex:1; padding:10px; border:none; background:var(--sf); font-size:13px; font-weight:600; font-family:var(--font-body); color:var(--tx2); cursor:pointer; transition:all .15s; }
        .pm-mode-btn--active { background:var(--acc); color:#fff; }

        .pm-section { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:24px; margin-bottom:16px; }
        .pm-section--compact { padding:16px 24px; }
        .pm-section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .pm-section-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin:0; }
        .pm-remove-btn { width:28px; height:28px; border-radius:6px; border:1px solid var(--b); background:var(--sf); color:var(--tx3); font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .pm-remove-btn:hover { border-color:#dc2626; color:#dc2626; background:rgba(220,38,38,.05); }

        .pm-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
        .pm-field:last-child { margin-bottom:0; }
        .pm-label { font-size:13px; font-weight:600; color:var(--tx2); }
        .pm-input { width:100%; padding:10px 12px; border:1.5px solid var(--b); border-radius:var(--r-sm); font-size:14px; font-family:var(--font-body); color:var(--tx); background:var(--sf); outline:none; transition:border-color .15s; }
        .pm-input:focus { border-color:var(--acc); }
        .pm-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .pm-row--thirds { grid-template-columns:1fr 1fr 1fr; }
        .pm-input-group { display:flex; }
        .pm-input-prefix { display:flex; align-items:center; padding:0 10px; background:var(--el); border:1.5px solid var(--b); border-right:none; border-radius:var(--r-sm) 0 0 var(--r-sm); font-size:14px; color:var(--tx2); white-space:nowrap; }
        .pm-input--suffix { border-radius:0 var(--r-sm) var(--r-sm) 0; flex:1; }
        .pm-extra-costs-label { font-size:12px; font-weight:600; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:10px; }

        .pm-add-btn { width:100%; padding:12px; border:1.5px dashed var(--b); border-radius:var(--r); background:transparent; font-size:14px; font-weight:600; color:var(--acc); cursor:pointer; margin-bottom:16px; transition:all .15s; font-family:var(--font-body); }
        .pm-add-btn:hover { border-color:var(--acc); background:var(--acc-light); }

        .pm-calculate-btn { width:100%; padding:16px; background:var(--acc); color:#fff; border:none; border-radius:var(--r); font-size:16px; font-weight:700; font-family:var(--font-head); cursor:pointer; transition:background .15s, transform .15s; }
        .pm-calculate-btn:hover { background:var(--acc-dark); transform:translateY(-1px); }

        /* Results */
        .pm-result-col { position:sticky; top:80px; }
        .pm-placeholder { background:var(--sf); border:1.5px dashed var(--b); border-radius:var(--r); padding:60px 40px; text-align:center; }
        .pm-placeholder-icon { font-size:48px; margin-bottom:16px; }
        .pm-placeholder-title { font-family:var(--font-head); font-size:18px; font-weight:700; color:var(--tx); margin:0 0 8px; }
        .pm-placeholder-sub { font-size:14px; color:var(--tx3); margin:0; }

        .pm-result { display:flex; flex-direction:column; gap:16px; }
        .pm-result-hero { background:linear-gradient(135deg,#1a1916 0%,#2d2a26 100%); border-radius:var(--r); padding:32px; text-align:center; }
        .pm-result-hero-label { font-size:12px; font-weight:600; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
        .pm-result-hero-value { font-family:var(--font-head); font-size:52px; font-weight:800; margin-bottom:8px; }
        .pm-result-hero-badge { display:inline-block; font-size:12px; font-weight:700; padding:4px 14px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
        .pm-result-hero-sub { font-size:13px; color:rgba(255,255,255,.45); }

        .pm-metrics { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .pm-metric { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r-sm); padding:16px; display:flex; flex-direction:column; gap:4px; }
        .pm-metric-label { font-size:11px; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; }
        .pm-metric-value { font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--tx); }

        .pm-alert { display:flex; gap:12px; padding:16px; border-radius:var(--r); background:rgba(245,158,11,.06); border:1.5px solid rgba(245,158,11,.2); }
        .pm-alert-icon { font-size:20px; flex-shrink:0; }
        .pm-alert-title { font-family:var(--font-head); font-size:13px; font-weight:700; color:#b45309; margin-bottom:4px; }
        .pm-alert-body { font-size:13px; color:var(--tx2); line-height:1.6; }

        .pm-breakdown { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:24px; }
        .pm-breakdown-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--tx); margin:0 0 16px; }
        .pm-breakdown-row { margin-bottom:12px; }
        .pm-breakdown-row:last-child { margin-bottom:12px; }
        .pm-breakdown-row-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
        .pm-breakdown-label { font-size:13px; color:var(--tx2); font-weight:500; }
        .pm-breakdown-amount { font-size:13px; font-weight:600; color:var(--tx); }
        .pm-breakdown-pct-text { font-weight:400; color:var(--tx3); }
        .pm-breakdown-bar-wrap { height:6px; border-radius:3px; background:var(--el); }
        .pm-breakdown-bar { height:6px; border-radius:3px; min-width:2px; transition:width .4s ease; }
        .pm-breakdown-total { display:flex; justify-content:space-between; padding-top:12px; border-top:1.5px solid var(--b); font-size:14px; font-weight:700; color:var(--tx); }

        .pm-compare { background:var(--el); border-radius:var(--r); padding:20px; }
        .pm-compare-title { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .pm-compare-row { display:flex; align-items:center; gap:16px; }
        .pm-compare-item { flex:1; text-align:center; }
        .pm-compare-label { font-size:11px; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:4px; }
        .pm-compare-value { font-family:var(--font-head); font-size:28px; font-weight:800; color:var(--tx); }
        .pm-compare-formula { font-size:11px; color:var(--tx3); margin-top:4px; }
        .pm-compare-divider { font-size:13px; font-weight:600; color:var(--tx3); flex-shrink:0; }

        .pm-table-wrap { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); overflow:hidden; }
        .pm-table { width:100%; border-collapse:collapse; font-size:13px; }
        .pm-table th { text-align:left; padding:12px 14px; background:var(--el); font-size:11px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.04em; }
        .pm-table td { padding:12px 14px; border-top:1px solid var(--b); color:var(--tx2); }
        .pm-table-name { font-weight:600; color:var(--tx); }
        .pm-table-margin { display:inline-block; padding:2px 8px; border-radius:4px; font-weight:700; font-size:12px; }

        .pm-result-cta { background:var(--acc-light); border:1.5px solid rgba(208,138,89,.25); border-radius:var(--r); padding:20px; }
        .pm-result-cta-text { font-size:13px; color:var(--tx2); margin:0 0 12px; line-height:1.5; }
        .pm-result-cta-btn { display:inline-flex; align-items:center; background:var(--acc); color:#fff; font-size:13px; font-weight:700; padding:10px 18px; border-radius:8px; text-decoration:none; }
        .pm-result-cta-btn:hover { background:var(--acc-dark); }

        .pm-cross-tools { margin-top:4px; }
        .pm-cross-tools-label { font-size:11px; font-weight:600; color:var(--tx3); text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
        .pm-cross-tools-grid { display:flex; flex-wrap:wrap; gap:8px; }
        .pm-cross-link { font-size:13px; color:var(--acc); text-decoration:none; padding:6px 14px; border-radius:100px; border:1px solid rgba(208,138,89,.3); background:rgba(208,138,89,.05); transition:all .15s; }
        .pm-cross-link:hover { background:var(--acc-light); }

        .pm-seo { background:var(--sf); border-top:1px solid var(--b); padding:56px 24px; }
        .pm-seo-inner { max-width:760px; margin:0 auto; }
        .pm-seo-inner h2 { font-family:var(--font-head); font-size:22px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .pm-seo-inner h3 { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:24px 0 10px; }
        .pm-seo-inner p { font-size:15px; color:var(--tx2); line-height:1.75; margin:0 0 14px; }

        @media (max-width:900px) {
          .pm-layout { grid-template-columns:1fr; }
          .pm-result-col { position:static; }
          .pm-row { grid-template-columns:1fr; }
          .pm-row--thirds { grid-template-columns:1fr 1fr 1fr; }
          .pm-metrics { grid-template-columns:1fr 1fr; }
        }
        @media (max-width:480px) {
          .pm-row--thirds { grid-template-columns:1fr; }
          .pm-result-hero-value { font-size:38px; }
          .pm-compare-value { font-size:22px; }
        }
      `}</style>
    </div>
  );
}
