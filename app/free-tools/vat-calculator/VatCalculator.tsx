"use client";

import { useState } from "react";
import Link from "next/link";

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", standard: 20, reduced: 5, zero: true, currency: "GBP", sym: "£", flag: "🇬🇧" },
  { code: "DE", name: "Germany", standard: 19, reduced: 7, zero: false, currency: "EUR", sym: "€", flag: "🇩🇪" },
  { code: "FR", name: "France", standard: 20, reduced: 5.5, zero: false, currency: "EUR", sym: "€", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", standard: 21, reduced: 9, zero: false, currency: "EUR", sym: "€", flag: "🇳🇱" },
  { code: "ES", name: "Spain", standard: 21, reduced: 10, zero: false, currency: "EUR", sym: "€", flag: "🇪🇸" },
  { code: "IT", name: "Italy", standard: 22, reduced: 10, zero: false, currency: "EUR", sym: "€", flag: "🇮🇹" },
  { code: "IE", name: "Ireland", standard: 23, reduced: 13.5, zero: true, currency: "EUR", sym: "€", flag: "🇮🇪" },
  { code: "BE", name: "Belgium", standard: 21, reduced: 6, zero: false, currency: "EUR", sym: "€", flag: "🇧🇪" },
  { code: "PT", name: "Portugal", standard: 23, reduced: 6, zero: false, currency: "EUR", sym: "€", flag: "🇵🇹" },
  { code: "AT", name: "Austria", standard: 20, reduced: 10, zero: false, currency: "EUR", sym: "€", flag: "🇦🇹" },
  { code: "PL", name: "Poland", standard: 23, reduced: 8, zero: false, currency: "PLN", sym: "zł", flag: "🇵🇱" },
  { code: "SE", name: "Sweden", standard: 25, reduced: 12, zero: false, currency: "SEK", sym: "kr", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", standard: 25, reduced: 0, zero: false, currency: "DKK", sym: "kr", flag: "🇩🇰" },
  { code: "FI", name: "Finland", standard: 25.5, reduced: 14, zero: false, currency: "EUR", sym: "€", flag: "🇫🇮" },
  { code: "NO", name: "Norway", standard: 25, reduced: 15, zero: false, currency: "NOK", sym: "kr", flag: "🇳🇴" },
  { code: "CH", name: "Switzerland", standard: 8.1, reduced: 2.6, zero: false, currency: "CHF", sym: "CHF", flag: "🇨🇭" },
  { code: "US_CA", name: "US — California", standard: 7.25, reduced: 0, zero: true, currency: "USD", sym: "$", flag: "🇺🇸" },
  { code: "US_NY", name: "US — New York", standard: 8, reduced: 0, zero: true, currency: "USD", sym: "$", flag: "🇺🇸" },
  { code: "US_TX", name: "US — Texas", standard: 6.25, reduced: 0, zero: true, currency: "USD", sym: "$", flag: "🇺🇸" },
  { code: "CA", name: "Canada (Ontario)", standard: 13, reduced: 5, zero: true, currency: "CAD", sym: "CA$", flag: "🇨🇦" },
  { code: "AU", name: "Australia", standard: 10, reduced: 0, zero: true, currency: "AUD", sym: "A$", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", standard: 15, reduced: 0, zero: false, currency: "NZD", sym: "NZ$", flag: "🇳🇿" },
  { code: "SG", name: "Singapore", standard: 9, reduced: 0, zero: false, currency: "SGD", sym: "S$", flag: "🇸🇬" },
  { code: "AE", name: "UAE", standard: 5, reduced: 0, zero: true, currency: "AED", sym: "AED", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", standard: 15, reduced: 0, zero: false, currency: "SAR", sym: "SAR", flag: "🇸🇦" },
  { code: "KE", name: "Kenya", standard: 16, reduced: 0, zero: true, currency: "KES", sym: "KSh", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", standard: 15, reduced: 0, zero: true, currency: "ZAR", sym: "R", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", standard: 7.5, reduced: 0, zero: true, currency: "NGN", sym: "₦", flag: "🇳🇬" },
  { code: "IN", name: "India (GST)", standard: 18, reduced: 5, zero: true, currency: "INR", sym: "₹", flag: "🇮🇳" },
  { code: "JP", name: "Japan", standard: 10, reduced: 8, zero: false, currency: "JPY", sym: "¥", flag: "🇯🇵" },
];

type Direction = "add" | "extract";

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function VatCalculator() {
  const [country, setCountry] = useState("GB");
  const [amount, setAmount] = useState("1000");
  const [direction, setDirection] = useState<Direction>("add");
  const [rateType, setRateType] = useState<"standard" | "reduced" | "zero">("standard");

  const c = COUNTRIES.find((x) => x.code === country)!;
  const rate = rateType === "zero" ? 0 : rateType === "reduced" ? c.reduced : c.standard;
  const parsed = parseFloat(amount) || 0;

  let net: number, vat: number, gross: number;
  if (direction === "add") {
    net = parsed;
    vat = net * (rate / 100);
    gross = net + vat;
  } else {
    gross = parsed;
    net = gross / (1 + rate / 100);
    vat = gross - net;
  }

  return (
    <>
      <div className="vc-root">
        <nav className="vc-nav">
          <div className="vc-nav-inner">
            <Link href="/" className="vc-nav-logo">AskBiz</Link>
            <div className="vc-nav-links">
              <Link href="/free-tools" className="vc-nav-link">All Tools</Link>
              <Link href="/free-tools/landed-cost-calculator" className="vc-nav-link">Landed Cost</Link>
              <Link href="/free-tools/fx-risk-modeller" className="vc-nav-link">FX Risk</Link>
              <Link href="/#pricing" className="vc-nav-cta">Try AskBiz Free →</Link>
            </div>
          </div>
        </nav>

        <section className="vc-hero">
          <div className="vc-hero-inner">
            <div className="vc-hero-badge">Free Tool — No Sign-Up Required</div>
            <h1 className="vc-hero-title">VAT / Sales Tax Calculator</h1>
            <p className="vc-hero-sub">
              Add or remove VAT and sales tax for 30 countries instantly.
              See the net price, tax amount, and gross price in one click.
            </p>
          </div>
        </section>

        <section className="vc-calc">
          <div className="vc-calc-inner">
            <div className="vc-calc-form">
              <div className="vc-field">
                <label className="vc-label">Country / Region</label>
                <select className="vc-select" value={country} onChange={(e) => { setCountry(e.target.value); setRateType("standard"); }}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name} — {c.standard}%</option>
                  ))}
                </select>
              </div>

              <div className="vc-field">
                <label className="vc-label">Amount ({c.sym})</label>
                <input
                  className="vc-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000.00"
                />
              </div>

              <div className="vc-field">
                <label className="vc-label">Direction</label>
                <div className="vc-toggle-group">
                  <button className={`vc-toggle ${direction === "add" ? "active" : ""}`} onClick={() => setDirection("add")}>
                    Add VAT to net price
                  </button>
                  <button className={`vc-toggle ${direction === "extract" ? "active" : ""}`} onClick={() => setDirection("extract")}>
                    Extract VAT from gross price
                  </button>
                </div>
              </div>

              <div className="vc-field">
                <label className="vc-label">Rate</label>
                <div className="vc-toggle-group">
                  <button className={`vc-toggle ${rateType === "standard" ? "active" : ""}`} onClick={() => setRateType("standard")}>
                    Standard ({c.standard}%)
                  </button>
                  {c.reduced > 0 && (
                    <button className={`vc-toggle ${rateType === "reduced" ? "active" : ""}`} onClick={() => setRateType("reduced")}>
                      Reduced ({c.reduced}%)
                    </button>
                  )}
                  {c.zero && (
                    <button className={`vc-toggle ${rateType === "zero" ? "active" : ""}`} onClick={() => setRateType("zero")}>
                      Zero-rated
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="vc-calc-result">
              <div className="vc-result-card">
                <div className="vc-result-header">
                  <span className="vc-result-flag">{c.flag}</span>
                  <span className="vc-result-country">{c.name}</span>
                  <span className="vc-result-rate">{rate}% {c.code.startsWith("US") ? "Sales Tax" : c.code === "AU" || c.code === "NZ" || c.code === "SG" || c.code === "CA" || c.code === "IN" ? "GST" : "VAT"}</span>
                </div>
                <div className="vc-result-rows">
                  <div className="vc-result-row">
                    <span className="vc-result-label">Net price (excl. tax)</span>
                    <span className="vc-result-value">{c.sym}{fmt(net)}</span>
                  </div>
                  <div className="vc-result-row vc-result-row--highlight">
                    <span className="vc-result-label">
                      {c.code.startsWith("US") ? "Sales Tax" : c.code === "AU" || c.code === "NZ" || c.code === "SG" || c.code === "CA" || c.code === "IN" ? "GST" : "VAT"} ({rate}%)
                    </span>
                    <span className="vc-result-value">{c.sym}{fmt(vat)}</span>
                  </div>
                  <div className="vc-result-row vc-result-row--total">
                    <span className="vc-result-label">Gross price (incl. tax)</span>
                    <span className="vc-result-value">{c.sym}{fmt(gross)}</span>
                  </div>
                </div>
                <div className="vc-result-formula">
                  {direction === "add"
                    ? `${c.sym}${fmt(net)} × ${rate}% = ${c.sym}${fmt(vat)} tax → ${c.sym}${fmt(gross)} gross`
                    : `${c.sym}${fmt(gross)} ÷ ${(1 + rate / 100).toFixed(4)} = ${c.sym}${fmt(net)} net + ${c.sym}${fmt(vat)} tax`}
                </div>
              </div>

              <div className="vc-rates-card">
                <h3 className="vc-rates-title">{c.flag} {c.name} — Tax Rates</h3>
                <div className="vc-rates-grid">
                  <div className="vc-rate-item">
                    <span className="vc-rate-label">Standard</span>
                    <span className="vc-rate-val">{c.standard}%</span>
                  </div>
                  {c.reduced > 0 && (
                    <div className="vc-rate-item">
                      <span className="vc-rate-label">Reduced</span>
                      <span className="vc-rate-val">{c.reduced}%</span>
                    </div>
                  )}
                  {c.zero && (
                    <div className="vc-rate-item">
                      <span className="vc-rate-label">Zero-rated</span>
                      <span className="vc-rate-val">0%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vc-ref">
          <div className="vc-ref-inner">
            <h2 className="vc-ref-title">VAT & Sales Tax Rates — All Countries</h2>
            <div className="vc-ref-table-wrap">
              <table className="vc-ref-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Standard Rate</th>
                    <th>Reduced Rate</th>
                    <th>Zero-rated</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.map((c) => (
                    <tr key={c.code}>
                      <td>{c.flag} {c.name}</td>
                      <td><strong>{c.standard}%</strong></td>
                      <td>{c.reduced > 0 ? `${c.reduced}%` : "—"}</td>
                      <td>{c.zero ? "Yes" : "—"}</td>
                      <td>{c.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="vc-cta-section">
          <div className="vc-cta-inner">
            <h2 className="vc-cta-title">Need VAT Calculated Automatically on Every Sale?</h2>
            <p className="vc-cta-sub">
              AskBiz POS calculates VAT in real time at the point of sale — with multi-jurisdiction
              support, tax audit trails, and HMRC-ready reports. Free to start.
            </p>
            <div className="vc-cta-actions">
              <Link href="/" className="vc-cta-btn vc-cta-btn--primary">Try AskBiz Free →</Link>
              <Link href="/free-tools" className="vc-cta-btn vc-cta-btn--ghost">All Free Tools</Link>
            </div>
          </div>
        </section>

        <footer className="vc-footer">
          <div className="vc-footer-inner">
            <span>© 2026 AskBiz</span>
            <div className="vc-footer-links">
              {[
                ["/", "Home"],
                ["/free-tools", "Free Tools"],
                ["/free-tools/landed-cost-calculator", "Landed Cost Calculator"],
                ["/free-tools/fx-risk-modeller", "FX Risk Modeller"],
                ["/free-tools/break-even-calculator", "Break-Even Calculator"],
                ["/help", "Help Center"],
                ["/privacy", "Privacy"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="vc-footer-link">{label}</Link>
              ))}
            </div>
            <p className="vc-footer-disclaimer">
              Rates are for reference only and may change. Always verify with your local tax authority.
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        :root { --acc: #d08a59; --acc-dark: #b8743e; --acc-light: #f5ebe0; --tx: #1a1916; --tx2: #6b6760; --tx3: #a39e97; --sf: #ffffff; --bg: #f9f8f6; --el: #f3f2ef; --b: rgba(0,0,0,.08); --font-head: 'Sora', system-ui, sans-serif; --font-body: 'DM Sans', system-ui, sans-serif; --r: 14px; }
        * { box-sizing: border-box; }
        .vc-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        .vc-nav { background: var(--sf); border-bottom: 1px solid var(--b); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
        .vc-nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .vc-nav-logo { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--tx); text-decoration: none; }
        .vc-nav-links { display: flex; align-items: center; gap: 20px; }
        .vc-nav-link { font-size: 14px; color: var(--tx2); text-decoration: none; transition: color .15s; }
        .vc-nav-link:hover { color: var(--tx); }
        .vc-nav-cta { font-size: 13px; font-weight: 700; background: var(--acc); color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; }

        .vc-hero { background: linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%); padding: 64px 24px 72px; text-align: center; }
        .vc-hero-inner { max-width: 640px; margin: 0 auto; }
        .vc-hero-badge { display: inline-block; background: rgba(208,138,89,.18); border: 1px solid rgba(208,138,89,.3); color: #e8a87a; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 20px; }
        .vc-hero-title { font-family: var(--font-head); font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: #fff; margin: 0 0 14px; letter-spacing: -.02em; }
        .vc-hero-sub { color: rgba(255,255,255,.5); font-size: 17px; margin: 0; line-height: 1.6; }

        .vc-calc { padding: 48px 24px 64px; }
        .vc-calc-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }

        .vc-calc-form { display: flex; flex-direction: column; gap: 20px; }
        .vc-field { display: flex; flex-direction: column; gap: 6px; }
        .vc-label { font-size: 13px; font-weight: 600; color: var(--tx2); text-transform: uppercase; letter-spacing: .04em; }
        .vc-select, .vc-input { font-family: var(--font-body); font-size: 15px; padding: 12px 14px; border: 1.5px solid var(--b); border-radius: 10px; background: var(--sf); color: var(--tx); outline: none; transition: border-color .15s; }
        .vc-select:focus, .vc-input:focus { border-color: var(--acc); }

        .vc-toggle-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .vc-toggle { font-family: var(--font-body); font-size: 13px; font-weight: 600; padding: 9px 16px; border: 1.5px solid var(--b); border-radius: 8px; background: var(--sf); color: var(--tx2); cursor: pointer; transition: all .15s; }
        .vc-toggle:hover { border-color: var(--acc); color: var(--tx); }
        .vc-toggle.active { background: var(--acc-light); border-color: var(--acc); color: var(--acc-dark); }

        .vc-calc-result { display: flex; flex-direction: column; gap: 20px; }
        .vc-result-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 28px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
        .vc-result-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--b); }
        .vc-result-flag { font-size: 22px; }
        .vc-result-country { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--tx); }
        .vc-result-rate { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--acc-dark); background: var(--acc-light); padding: 3px 10px; border-radius: 100px; }
        .vc-result-rows { display: flex; flex-direction: column; gap: 0; }
        .vc-result-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--b); }
        .vc-result-row:last-child { border-bottom: none; }
        .vc-result-label { font-size: 14px; color: var(--tx2); }
        .vc-result-value { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--tx); }
        .vc-result-row--highlight .vc-result-label { color: #b45309; font-weight: 600; }
        .vc-result-row--highlight .vc-result-value { color: #b45309; }
        .vc-result-row--total { padding-top: 14px; margin-top: 4px; border-top: 2px solid var(--tx); border-bottom: none; }
        .vc-result-row--total .vc-result-label { font-weight: 700; color: var(--tx); font-size: 15px; }
        .vc-result-row--total .vc-result-value { font-size: 20px; color: var(--acc-dark); }
        .vc-result-formula { margin-top: 16px; padding: 10px 14px; background: var(--el); border-radius: 8px; font-size: 12px; color: var(--tx3); font-family: 'JetBrains Mono', monospace; }

        .vc-rates-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 20px; }
        .vc-rates-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--tx); margin: 0 0 12px; }
        .vc-rates-grid { display: flex; gap: 16px; }
        .vc-rate-item { display: flex; flex-direction: column; gap: 2px; }
        .vc-rate-label { font-size: 11px; color: var(--tx3); text-transform: uppercase; letter-spacing: .05em; }
        .vc-rate-val { font-family: var(--font-head); font-size: 20px; font-weight: 800; color: var(--tx); }

        .vc-ref { background: var(--el); padding: 64px 24px; }
        .vc-ref-inner { max-width: 1100px; margin: 0 auto; }
        .vc-ref-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--tx); margin: 0 0 24px; }
        .vc-ref-table-wrap { overflow-x: auto; border-radius: var(--r); border: 1.5px solid var(--b); background: var(--sf); }
        .vc-ref-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .vc-ref-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .05em; border-bottom: 1.5px solid var(--b); background: var(--el); }
        .vc-ref-table td { padding: 10px 16px; border-bottom: 1px solid var(--b); color: var(--tx2); }
        .vc-ref-table tr:last-child td { border-bottom: none; }
        .vc-ref-table strong { color: var(--tx); }

        .vc-cta-section { background: linear-gradient(135deg, #1a1916 0%, #2d2a26 100%); padding: 64px 24px; text-align: center; }
        .vc-cta-inner { max-width: 600px; margin: 0 auto; }
        .vc-cta-title { font-family: var(--font-head); font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 12px; }
        .vc-cta-sub { font-size: 15px; color: rgba(255,255,255,.5); line-height: 1.65; margin: 0 0 28px; }
        .vc-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .vc-cta-btn { display: inline-flex; align-items: center; padding: 13px 24px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all .2s; }
        .vc-cta-btn--primary { background: var(--acc); color: #fff; }
        .vc-cta-btn--primary:hover { background: var(--acc-dark); }
        .vc-cta-btn--ghost { background: rgba(255,255,255,.08); color: rgba(255,255,255,.8); border: 1px solid rgba(255,255,255,.15); }
        .vc-cta-btn--ghost:hover { background: rgba(255,255,255,.14); color: #fff; }

        .vc-footer { background: var(--sf); border-top: 1px solid var(--b); padding: 28px 24px; }
        .vc-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .vc-footer-inner > span { font-size: 13px; color: var(--tx3); }
        .vc-footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .vc-footer-link { font-size: 13px; color: var(--tx3); text-decoration: none; transition: color .15s; }
        .vc-footer-link:hover { color: var(--acc); }
        .vc-footer-disclaimer { font-size: 11px; color: var(--tx3); margin: 0; width: 100%; }

        @media (max-width: 900px) {
          .vc-calc-inner { grid-template-columns: 1fr; }
          .vc-nav-links { display: none; }
        }
      `}</style>
    </>
  );
}
