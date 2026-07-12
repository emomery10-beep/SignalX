"use client";

import { useState } from "react";
import Link from "next/link";

const CURRENCIES = [
  { code: "GBP", sym: "£", flag: "🇬🇧" },
  { code: "USD", sym: "$", flag: "🇺🇸" },
  { code: "EUR", sym: "€", flag: "🇪🇺" },
  { code: "CAD", sym: "CA$", flag: "🇨🇦" },
  { code: "AUD", sym: "A$", flag: "🇦🇺" },
  { code: "INR", sym: "₹", flag: "🇮🇳" },
  { code: "KES", sym: "KSh", flag: "🇰🇪" },
  { code: "ZAR", sym: "R", flag: "🇿🇦" },
  { code: "NGN", sym: "₦", flag: "🇳🇬" },
  { code: "AED", sym: "AED", flag: "🇦🇪" },
  { code: "SGD", sym: "S$", flag: "🇸🇬" },
  { code: "JPY", sym: "¥", flag: "🇯🇵" },
];

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtMoney = (n: number) => fmt(n, 2);

export default function BreakEvenCalculator() {
  const [currency, setCurrency] = useState("GBP");
  const [fixedCosts, setFixedCosts] = useState("5000");
  const [sellingPrice, setSellingPrice] = useState("25");
  const [variableCost, setVariableCost] = useState("10");
  const [period, setPeriod] = useState<"month" | "year">("month");

  const cur = CURRENCIES.find((c) => c.code === currency)!;
  const fc = parseFloat(fixedCosts) || 0;
  const sp = parseFloat(sellingPrice) || 0;
  const vc = parseFloat(variableCost) || 0;
  const contribution = sp - vc;
  const marginPct = sp > 0 ? (contribution / sp) * 100 : 0;
  const breakEvenUnits = contribution > 0 ? Math.ceil(fc / contribution) : 0;
  const breakEvenRevenue = breakEvenUnits * sp;
  const canCalc = contribution > 0 && fc > 0;

  const scenarios = [0.8, 0.9, 1.0, 1.1, 1.25, 1.5].map((mult) => {
    const units = Math.round(breakEvenUnits * mult);
    const revenue = units * sp;
    const totalCost = fc + units * vc;
    const profit = revenue - totalCost;
    return { mult, units, revenue, totalCost, profit };
  });

  const priceSensitivity = [-20, -10, -5, 0, 5, 10, 20].map((pctChange) => {
    const newPrice = sp * (1 + pctChange / 100);
    const newContribution = newPrice - vc;
    const newBE = newContribution > 0 ? Math.ceil(fc / newContribution) : Infinity;
    return { pctChange, newPrice, newContribution, newBE };
  });

  return (
    <>
      <div className="be-root">
        <nav className="be-nav">
          <div className="be-nav-inner">
            <Link href="/" className="be-nav-logo">AskBiz</Link>
            <div className="be-nav-links">
              <Link href="/free-tools" className="be-nav-link">All Tools</Link>
              <Link href="/free-tools/vat-calculator" className="be-nav-link">VAT Calculator</Link>
              <Link href="/free-tools/landed-cost-calculator" className="be-nav-link">Landed Cost</Link>
              <Link href="/signin?mode=signup" className="be-nav-cta">Try AskBiz Free →</Link>
            </div>
          </div>
        </nav>

        <section className="be-hero">
          <div className="be-hero-inner">
            <div className="be-hero-badge">Free Tool — No Sign-Up Required</div>
            <h1 className="be-hero-title">Break-Even Calculator</h1>
            <p className="be-hero-sub">
              Find out exactly how many units you need to sell to cover your costs.
              See your break-even point, contribution margin, and profit scenarios — instantly.
            </p>
          </div>
        </section>

        <section className="be-calc">
          <div className="be-calc-inner">
            <div className="be-calc-form">
              <div className="be-field">
                <label className="be-label">Currency</label>
                <select className="be-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} ({c.sym})</option>
                  ))}
                </select>
              </div>

              <div className="be-field">
                <label className="be-label">Fixed costs per {period} ({cur.sym})</label>
                <input className="be-input" type="number" min="0" step="100" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} placeholder="5000" />
                <span className="be-hint">Rent, salaries, insurance, subscriptions, etc.</span>
              </div>

              <div className="be-field">
                <label className="be-label">Selling price per unit ({cur.sym})</label>
                <input className="be-input" type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="25.00" />
              </div>

              <div className="be-field">
                <label className="be-label">Variable cost per unit ({cur.sym})</label>
                <input className="be-input" type="number" min="0" step="0.01" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} placeholder="10.00" />
                <span className="be-hint">Materials, packaging, shipping, payment fees, etc.</span>
              </div>

              <div className="be-field">
                <label className="be-label">Period</label>
                <div className="be-toggle-group">
                  <button className={`be-toggle ${period === "month" ? "active" : ""}`} onClick={() => setPeriod("month")}>Monthly</button>
                  <button className={`be-toggle ${period === "year" ? "active" : ""}`} onClick={() => setPeriod("year")}>Yearly</button>
                </div>
              </div>
            </div>

            <div className="be-calc-result">
              {canCalc ? (
                <>
                  <div className="be-result-card be-result-card--primary">
                    <div className="be-result-big-label">Break-Even Point</div>
                    <div className="be-result-big-val">{fmt(breakEvenUnits)} units</div>
                    <div className="be-result-big-sub">per {period} to cover all costs</div>
                    <div className="be-result-divider" />
                    <div className="be-result-rows">
                      <div className="be-result-row">
                        <span>Break-even revenue</span>
                        <span className="be-val">{cur.sym}{fmtMoney(breakEvenRevenue)}</span>
                      </div>
                      <div className="be-result-row">
                        <span>Contribution per unit</span>
                        <span className="be-val">{cur.sym}{fmtMoney(contribution)}</span>
                      </div>
                      <div className="be-result-row">
                        <span>Contribution margin</span>
                        <span className="be-val">{marginPct.toFixed(1)}%</span>
                      </div>
                      <div className="be-result-row">
                        <span>Fixed costs ({period})</span>
                        <span className="be-val">{cur.sym}{fmtMoney(fc)}</span>
                      </div>
                    </div>
                    <div className="be-result-formula">
                      Break-even = {cur.sym}{fmtMoney(fc)} ÷ ({cur.sym}{fmtMoney(sp)} − {cur.sym}{fmtMoney(vc)}) = {fmt(breakEvenUnits)} units
                    </div>
                  </div>

                  <div className="be-result-card">
                    <h3 className="be-card-title">Profit Scenarios</h3>
                    <p className="be-card-sub">What happens at different sales volumes?</p>
                    <div className="be-scenario-table-wrap">
                      <table className="be-scenario-table">
                        <thead>
                          <tr>
                            <th>Units sold</th>
                            <th>Revenue</th>
                            <th>Total cost</th>
                            <th>Profit / Loss</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarios.map((s) => (
                            <tr key={s.mult} className={s.mult === 1.0 ? "be-row-highlight" : ""}>
                              <td>{fmt(s.units)}{s.mult === 1.0 ? " ← BE" : ""}</td>
                              <td>{cur.sym}{fmtMoney(s.revenue)}</td>
                              <td>{cur.sym}{fmtMoney(s.totalCost)}</td>
                              <td className={s.profit >= 0 ? "be-profit" : "be-loss"}>
                                {s.profit >= 0 ? "+" : ""}{cur.sym}{fmtMoney(s.profit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="be-result-card">
                    <h3 className="be-card-title">Price Sensitivity</h3>
                    <p className="be-card-sub">How does changing your price affect break-even?</p>
                    <div className="be-scenario-table-wrap">
                      <table className="be-scenario-table">
                        <thead>
                          <tr>
                            <th>Price change</th>
                            <th>New price</th>
                            <th>Contribution</th>
                            <th>Break-even units</th>
                          </tr>
                        </thead>
                        <tbody>
                          {priceSensitivity.map((s) => (
                            <tr key={s.pctChange} className={s.pctChange === 0 ? "be-row-highlight" : ""}>
                              <td>{s.pctChange > 0 ? "+" : ""}{s.pctChange}%{s.pctChange === 0 ? " (current)" : ""}</td>
                              <td>{cur.sym}{fmtMoney(s.newPrice)}</td>
                              <td>{cur.sym}{fmtMoney(s.newContribution)}</td>
                              <td>{s.newBE === Infinity ? "∞" : fmt(s.newBE)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ background: "#fff8f3", border: "1.5px solid #f0d5b8", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                        Want this calculated automatically on your real data?
                      </div>
                      <div style={{ fontSize: 11, color: "#6b6760" }}>
                        AskBiz connects to Shopify, Amazon & QuickBooks — no spreadsheets needed.
                      </div>
                    </div>
                    <a href="/signin?mode=signup" style={{ display: "inline-flex", alignItems: "center", background: "#d08a59", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                      Try free →
                    </a>
                  </div>
                </>
              ) : (
                <div className="be-result-card be-result-card--empty">
                  <div className="be-empty-icon">📊</div>
                  <div className="be-empty-title">Enter your numbers</div>
                  <p className="be-empty-sub">
                    {sp <= vc && sp > 0
                      ? "Your selling price must be higher than your variable cost per unit."
                      : "Fill in your fixed costs, selling price, and variable cost to see your break-even point."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="be-guide">
          <div className="be-guide-inner">
            <h2 className="be-guide-title">How Break-Even Analysis Works</h2>
            <div className="be-guide-grid">
              {[
                { icon: "📦", title: "Fixed Costs", body: "Costs that stay the same regardless of how many units you sell — rent, salaries, insurance, software subscriptions, loan repayments." },
                { icon: "🏷️", title: "Variable Costs", body: "Costs that increase with every unit sold — raw materials, packaging, shipping, payment processing fees, sales commissions." },
                { icon: "💰", title: "Contribution Margin", body: "Selling price minus variable cost per unit. This is how much each sale contributes toward covering your fixed costs." },
                { icon: "📐", title: "Break-Even Formula", body: "Fixed Costs ÷ Contribution per Unit = Break-Even Units. Sell more than this and you're profitable. Sell fewer and you're making a loss." },
              ].map((item) => (
                <div key={item.title} className="be-guide-card">
                  <div className="be-guide-icon">{item.icon}</div>
                  <h3 className="be-guide-card-title">{item.title}</h3>
                  <p className="be-guide-card-body">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="be-cta-section">
          <div className="be-cta-inner">
            <h2 className="be-cta-title">Want Break-Even Analysis on Your Real Sales Data?</h2>
            <p className="be-cta-sub">
              AskBiz connects to Shopify, Amazon, and QuickBooks to calculate break-even per product,
              per channel, and per market — using your actual numbers. Ask in plain English, get answers in seconds.
            </p>
            <div className="be-cta-actions">
              <Link href="/signin?mode=signup" className="be-cta-btn be-cta-btn--primary">Start free — no card needed →</Link>
              <Link href="/free-tools" className="be-cta-btn be-cta-btn--ghost">All Free Tools</Link>
            </div>
          </div>
        </section>

        <footer className="be-footer">
          <div className="be-footer-inner">
            <span>© 2026 AskBiz</span>
            <div className="be-footer-links">
              {[
                ["/", "Home"],
                ["/free-tools", "Free Tools"],
                ["/free-tools/vat-calculator", "VAT Calculator"],
                ["/free-tools/landed-cost-calculator", "Landed Cost Calculator"],
                ["/free-tools/fx-risk-modeller", "FX Risk Modeller"],
                ["/help", "Help Center"],
                ["/privacy", "Privacy"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="be-footer-link">{label}</Link>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        :root { --acc: #d08a59; --acc-dark: #b8743e; --acc-light: #f5ebe0; --tx: #1a1916; --tx2: #6b6760; --tx3: #a39e97; --sf: #ffffff; --bg: #f9f8f6; --el: #f3f2ef; --b: rgba(0,0,0,.08); --font-head: 'Sora', system-ui, sans-serif; --font-body: 'DM Sans', system-ui, sans-serif; --r: 14px; }
        * { box-sizing: border-box; }
        .be-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        .be-nav { background: var(--sf); border-bottom: 1px solid var(--b); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
        .be-nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .be-nav-logo { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--tx); text-decoration: none; }
        .be-nav-links { display: flex; align-items: center; gap: 20px; }
        .be-nav-link { font-size: 14px; color: var(--tx2); text-decoration: none; transition: color .15s; }
        .be-nav-link:hover { color: var(--tx); }
        .be-nav-cta { font-size: 13px; font-weight: 700; background: var(--acc); color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; }

        .be-hero { background: linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%); padding: 64px 24px 72px; text-align: center; }
        .be-hero-inner { max-width: 640px; margin: 0 auto; }
        .be-hero-badge { display: inline-block; background: rgba(208,138,89,.18); border: 1px solid rgba(208,138,89,.3); color: #e8a87a; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 20px; }
        .be-hero-title { font-family: var(--font-head); font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: #fff; margin: 0 0 14px; letter-spacing: -.02em; }
        .be-hero-sub { color: rgba(255,255,255,.5); font-size: 17px; margin: 0; line-height: 1.6; }

        .be-calc { padding: 48px 24px 64px; }
        .be-calc-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 340px 1fr; gap: 40px; align-items: start; }

        .be-calc-form { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 80px; }
        .be-field { display: flex; flex-direction: column; gap: 6px; }
        .be-label { font-size: 13px; font-weight: 600; color: var(--tx2); text-transform: uppercase; letter-spacing: .04em; }
        .be-hint { font-size: 12px; color: var(--tx3); margin-top: 2px; }
        .be-select, .be-input { font-family: var(--font-body); font-size: 15px; padding: 12px 14px; border: 1.5px solid var(--b); border-radius: 10px; background: var(--sf); color: var(--tx); outline: none; transition: border-color .15s; }
        .be-select:focus, .be-input:focus { border-color: var(--acc); }

        .be-toggle-group { display: flex; gap: 8px; }
        .be-toggle { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 16px; border: 1.5px solid var(--b); border-radius: 8px; background: var(--sf); color: var(--tx2); cursor: pointer; transition: all .15s; }
        .be-toggle:hover { border-color: var(--acc); color: var(--tx); }
        .be-toggle.active { background: var(--acc-light); border-color: var(--acc); color: var(--acc-dark); }

        .be-calc-result { display: flex; flex-direction: column; gap: 24px; }
        .be-result-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 28px; }
        .be-result-card--primary { border-color: var(--acc); box-shadow: 0 4px 20px rgba(208,138,89,.12); }
        .be-result-big-label { font-size: 12px; font-weight: 700; color: var(--acc-dark); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
        .be-result-big-val { font-family: var(--font-head); font-size: clamp(32px, 4vw, 48px); font-weight: 800; color: var(--tx); letter-spacing: -.02em; }
        .be-result-big-sub { font-size: 14px; color: var(--tx3); margin-top: 4px; }
        .be-result-divider { height: 1px; background: var(--b); margin: 20px 0; }
        .be-result-rows { display: flex; flex-direction: column; }
        .be-result-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--b); font-size: 14px; color: var(--tx2); }
        .be-result-row:last-child { border-bottom: none; }
        .be-val { font-family: var(--font-head); font-weight: 700; color: var(--tx); }
        .be-result-formula { margin-top: 16px; padding: 10px 14px; background: var(--el); border-radius: 8px; font-size: 12px; color: var(--tx3); font-family: 'JetBrains Mono', monospace; }

        .be-card-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--tx); margin: 0 0 4px; }
        .be-card-sub { font-size: 13px; color: var(--tx3); margin: 0 0 16px; }

        .be-scenario-table-wrap { overflow-x: auto; }
        .be-scenario-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .be-scenario-table th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .05em; border-bottom: 1.5px solid var(--b); }
        .be-scenario-table td { padding: 10px 12px; border-bottom: 1px solid var(--b); color: var(--tx2); }
        .be-scenario-table tr:last-child td { border-bottom: none; }
        .be-row-highlight { background: var(--acc-light); }
        .be-row-highlight td { font-weight: 700; color: var(--tx); }
        .be-profit { color: #16a34a; font-weight: 700; }
        .be-loss { color: #dc2626; font-weight: 700; }

        .be-result-card--empty { text-align: center; padding: 60px 28px; }
        .be-empty-icon { font-size: 48px; margin-bottom: 16px; }
        .be-empty-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--tx); margin-bottom: 8px; }
        .be-empty-sub { font-size: 14px; color: var(--tx3); margin: 0; max-width: 300px; margin: 0 auto; }

        .be-guide { background: var(--el); padding: 64px 24px; }
        .be-guide-inner { max-width: 1100px; margin: 0 auto; }
        .be-guide-title { font-family: var(--font-head); font-size: 24px; font-weight: 700; color: var(--tx); margin: 0 0 28px; text-align: center; }
        .be-guide-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .be-guide-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 24px; }
        .be-guide-icon { font-size: 28px; margin-bottom: 12px; }
        .be-guide-card-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--tx); margin: 0 0 8px; }
        .be-guide-card-body { font-size: 13px; color: var(--tx2); line-height: 1.65; margin: 0; }

        .be-cta-section { background: linear-gradient(135deg, #1a1916 0%, #2d2a26 100%); padding: 64px 24px; text-align: center; }
        .be-cta-inner { max-width: 600px; margin: 0 auto; }
        .be-cta-title { font-family: var(--font-head); font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 12px; }
        .be-cta-sub { font-size: 15px; color: rgba(255,255,255,.5); line-height: 1.65; margin: 0 0 28px; }
        .be-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .be-cta-btn { display: inline-flex; align-items: center; padding: 13px 24px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all .2s; }
        .be-cta-btn--primary { background: var(--acc); color: #fff; }
        .be-cta-btn--primary:hover { background: var(--acc-dark); }
        .be-cta-btn--ghost { background: rgba(255,255,255,.08); color: rgba(255,255,255,.8); border: 1px solid rgba(255,255,255,.15); }
        .be-cta-btn--ghost:hover { background: rgba(255,255,255,.14); }

        .be-footer { background: var(--sf); border-top: 1px solid var(--b); padding: 28px 24px; }
        .be-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .be-footer-inner > span { font-size: 13px; color: var(--tx3); }
        .be-footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .be-footer-link { font-size: 13px; color: var(--tx3); text-decoration: none; transition: color .15s; }
        .be-footer-link:hover { color: var(--acc); }

        @media (max-width: 900px) {
          .be-calc-inner { grid-template-columns: 1fr; }
          .be-calc-form { position: static; }
          .be-guide-grid { grid-template-columns: 1fr 1fr; }
          .be-nav-links { display: none; }
        }
        @media (max-width: 540px) {
          .be-guide-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
