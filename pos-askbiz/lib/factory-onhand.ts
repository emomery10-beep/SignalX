// Quick "how much of this product is on the shelf" for ONE product at ONE factory, from its approved
// captures. Used to warn an approver before they sign off a dispatch bigger than anything that was logged
// as made or received. It is a guard rail, not the stock ledger: the ledger (lib/factory-stock) also applies
// physical counts, and small factories often log production late, so the approver can override it.
//
// NOTE: identical copy lives in pos-askbiz/lib/factory-onhand.ts. Change both together.
export interface OnHandCapture { type?: string | null; product_name?: string | null; quantity?: number | string | null }

const BYPRODUCT = /waste|husk|shell|cake|chaff|bran|whey|residue|dregs/i

export function productOnHand(captures: OnHandCapture[], productName: string): { inQty: number; outQty: number; onHand: number } {
  const key = productName.trim().toLowerCase()
  let inQty = 0, outQty = 0
  for (const c of captures) {
    if ((c.product_name || '').trim().toLowerCase() !== key) continue
    const q = Number(c.quantity) || 0
    if (q <= 0) continue
    switch (c.type) {
      case 'intake_arrival': case 'intake': case 'output': case 'packaging': inQty += q; break
      case 'intake_feed': case 'dispatch': outQty += q; break
      // A by-product logged as wastage is something made (cake, husk); any other wastage is shrinkage.
      case 'wastage': if (BYPRODUCT.test(key)) inQty += q; else outQty += q; break
    }
  }
  return { inQty, outQty, onHand: inQty - outQty }
}
