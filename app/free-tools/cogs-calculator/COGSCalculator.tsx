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

const fmt = (n: number, d = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

interface Product {
  id: string;
  name: string;
  materials: string;
  labour: string;
  shipping: string;
  packaging: string;
  overhead: string;
  salePrice: string;
}

function makeProduct(id: string): Product {
  return { id, name: `Product ${id}`, materials: "", labour: "", shipping: "", packaging: "", overhead: "", salePrice: "" };
}

export default function COGSCalculator() {
  const [currency, setCurrency] = useState("GBP");
  const [products, setProducts] = useState<Product[]>([makeProduct("1")]);

  const cur = CURRENCIES.find((c) => c.code === currency)!;

  const addProduct = () => {
    setProducts((prev) => [...prev, makeProduct(String(prev.length + 1))]);
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  type CalcProduct = Product & {
    cogs: number;
    grossProfit: number;
    cogsRatio: number;
    margin: number;
    canCalc: boolean;
  };

  const calced: CalcProduct[] = products.map((p) => {
    const mat = parseFloat(p.materials) || 0;
    const lab = parseFloat(p.labour) || 0;
    const shp = parseFloat(p.shipping) || 0;
    const pkg = parseFloat(p.packaging) || 0;
    const ovh = parseFloat(p.overhead) || 0;
    const sp  = parseFloat(p.salePrice) || 0;
    const cogs = mat + lab + shp + pkg + ovh;
    const grossProfit = sp - cogs;
    const cogsRatio = sp > 0 ? (cogs / sp) * 100 : 0;
    const margin = sp > 0 ? (grossProfit / sp) * 100 : 0;
    return { ...p, cogs, grossProfit, cogsRatio, margin, canCalc: cogs > 0 };
  });

  const totalCOGS = calced.reduce((s, p) => s + p.cogs, 0);
  const totalRev  = calced.reduce((s, p) => s + (parseFloat(p.salePrice) || 0), 0);
  const totalGP   = totalRev - totalCOGS;
  const avgMargin = totalRev > 0 ? (totalGP / totalRev) * 100 : 0;

  const hasResult = calced.some((p) => p.canCalc);

  return (
    <>
      <style>{`
        .cogs-root { font-family: DM Sans, sans-serif; background: #faf9f7; min-height: 100vh; color: #1a1916; }
        .cogs-nav { background: #fff; border-bottom: 1px solid #eee; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
        .cogs-nav-links { display: flex; gap: 20px; align-items: center; }
        .cogs-nav-link { color: #666; text-decoration: none; font-size: 13px; }
        .cogs-nav-link:hover { color: #1a1a2e; }
        .cogs-cta-btn { background: #d08a59; color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
        .cogs-inner { max-width: 860px; margin: 0 auto; padding: 40px 20px 60px; }
        .cogs-card { background: #fff; border: 1px solid #eee; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .cogs-label { display: block; font-size: 12px; color: #888; margin-bottom: 5px; font-weight: 500; }
        .cogs-input { width: 100%; padding: 9px 12px; font-size: 13px; background: #fff; border: 1px solid #ddd; border-radius: 8px; color: #1a1916; outline: none; font-family: inherit; box-sizing: border-box; }
        .cogs-input:focus { border-color: #d08a59; }
        .cogs-result-card { background: #fff8f3; border: 1.5px solid #f0d5b8; border-radius: 14px; padding: 20px 24px; }
        @media (max-width: 600px) { .cogs-cols { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      <div className="cogs-root">
        {/* Nav */}
        <nav className="cogs-nav">
          <Link href="/" style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e", textDecoration: "none" }}>
            AskBiz
          </Link>
          <div className="cogs-nav-links">
            <Link href="/free-tools" className="cogs-nav-link">All tools</Link>
            <Link href="/signin?mode=signup" className="cogs-cta-btn">Start free — no card needed →</Link>
          </div>
        </nav>

        <div className="cogs-inner">
          {/* Title */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>
              COGS Calculator
            </h1>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7 }}>
              Calculate your true cost of goods sold — including materials, labour, shipping, packaging, and overhead. Free, no sign-up required.
            </p>
          </div>

          {/* Currency */}
          <div className="cogs-card" style={{ marginBottom: 20 }}>
            <label className="cogs-label">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              style={{ padding: "9px 12px", fontSize: 13, border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", background: "#fff", color: "#1a1916", cursor: "pointer" }}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} ({c.sym})</option>
              ))}
            </select>
          </div>

          {/* Products */}
          {products.map((p, idx) => {
            const cp = calced[idx];
            return (
              <div key={p.id} className="cogs-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <input
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                    style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1a2e", background: "none", border: "none", outline: "none", flex: 1 }}
                    placeholder="Product name"
                  />
                  {products.length > 1 && (
                    <button onClick={() => removeProduct(p.id)}
                      style={{ background: "none", border: "1px solid #eee", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#999", cursor: "pointer", flexShrink: 0 }}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="cogs-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
                  {(
                    [
                      { field: "materials", label: `Materials (${cur.sym})` },
                      { field: "labour",    label: `Direct labour (${cur.sym})` },
                      { field: "shipping",  label: `Inbound shipping (${cur.sym})` },
                      { field: "packaging", label: `Packaging (${cur.sym})` },
                      { field: "overhead",  label: `Overhead per unit (${cur.sym})` },
                      { field: "salePrice", label: `Sale price (${cur.sym})` },
                    ] as { field: keyof Product; label: string }[]
                  ).map(({ field, label }) => (
                    <div key={field}>
                      <label className="cogs-label">{label}</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="cogs-input"
                        value={p[field]}
                        onChange={(e) => updateProduct(p.id, field, e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>

                {/* Per-product result */}
                {cp.canCalc && (
                  <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "14px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12 }}>
                    {[
                      { label: "COGS per unit", value: `${cur.sym}${fmt(cp.cogs)}`, color: "#e74c3c" },
                      { label: "Gross profit",  value: `${cur.sym}${fmt(cp.grossProfit)}`, color: cp.grossProfit >= 0 ? "#27ae60" : "#e74c3c" },
                      { label: "COGS ratio",    value: `${fmt(cp.cogsRatio, 1)}%`, color: "#e67e22" },
                      { label: "Gross margin",  value: `${fmt(cp.margin, 1)}%`, color: cp.margin >= 30 ? "#27ae60" : cp.margin >= 15 ? "#e67e22" : "#e74c3c" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add product */}
          <button onClick={addProduct}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9999, border: "1.5px dashed #ccc", background: "transparent", color: "#888", fontFamily: "inherit", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>
            + Add another product
          </button>

          {/* Summary */}
          {hasResult && (
            <div className="cogs-result-card" style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 12, fontWeight: 700, color: "#d08a59", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                Total Summary
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Total COGS",      value: `${cur.sym}${fmt(totalCOGS)}`, color: "#e74c3c" },
                  { label: "Total revenue",   value: `${cur.sym}${fmt(totalRev)}`,  color: "#1a1a2e" },
                  { label: "Gross profit",    value: `${cur.sym}${fmt(totalGP)}`,   color: totalGP >= 0 ? "#27ae60" : "#e74c3c" },
                  { label: "Avg gross margin",value: `${fmt(avgMargin, 1)}%`,       color: avgMargin >= 30 ? "#27ae60" : avgMargin >= 15 ? "#e67e22" : "#e74c3c" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      {["Product", "COGS", "Sale price", "Gross profit", "Margin", "COGS ratio"].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#888", fontWeight: 500, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calced.filter((p) => p.canCalc).map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "9px 10px", fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: "9px 10px", color: "#e74c3c" }}>{cur.sym}{fmt(p.cogs)}</td>
                        <td style={{ padding: "9px 10px" }}>{parseFloat(p.salePrice) > 0 ? `${cur.sym}${fmt(parseFloat(p.salePrice))}` : "—"}</td>
                        <td style={{ padding: "9px 10px", color: p.grossProfit >= 0 ? "#27ae60" : "#e74c3c" }}>{parseFloat(p.salePrice) > 0 ? `${cur.sym}${fmt(p.grossProfit)}` : "—"}</td>
                        <td style={{ padding: "9px 10px", color: p.margin >= 30 ? "#27ae60" : p.margin >= 15 ? "#e67e22" : "#e74c3c" }}>{parseFloat(p.salePrice) > 0 ? `${fmt(p.margin, 1)}%` : "—"}</td>
                        <td style={{ padding: "9px 10px", color: "#e67e22" }}>{parseFloat(p.salePrice) > 0 ? `${fmt(p.cogsRatio, 1)}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Post-result nudge */}
          {hasResult && (
            <div style={{ background: "#fff8f3", border: "1.5px solid #f0d5b8", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
                  Want COGS calculated automatically on your real data?
                </div>
                <div style={{ fontSize: 13, color: "#6b6760" }}>
                  AskBiz connects to Shopify, Amazon & QuickBooks — no spreadsheets needed.
                </div>
              </div>
              <a href="/signin?mode=signup" style={{ display: "inline-flex", alignItems: "center", background: "#d08a59", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                Try free →
              </a>
            </div>
          )}

          {/* Educational section (shown when no results yet) */}
          {!hasResult && (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 }}>
                How to calculate COGS
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { title: "COGS Formula", body: "COGS = Materials + Direct Labour + Inbound Shipping + Packaging + Overhead per unit. Every cost directly tied to making or buying a sellable unit counts." },
                  { title: "COGS Ratio", body: "COGS Ratio = COGS ÷ Sale Price × 100. A 60% COGS ratio means £0.60 of every £1 of revenue is consumed by direct costs. Lower is better." },
                  { title: "Gross Margin", body: "Gross Margin = (Sale Price − COGS) ÷ Sale Price × 100. This is what covers overheads and profit. Retail aims for 25–40%; ecommerce 40–60%; SaaS 60–80%." },
                ].map((s) => (
                  <div key={s.title} style={{ padding: "16px 20px", borderRadius: 12, background: "#fff", border: "1px solid #eee" }}>
                    <div style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{s.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
