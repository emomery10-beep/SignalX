# How to Give Staff Exactly the Right Access — No More, No Less

**Most POS systems give you a binary choice: full access or no access. Real businesses need something in between.**

---

## The Over-Permission Problem

Here's a common scenario in a small business with a mixed operation — say, a business with a café and a retail counter:

The café manager has full access to the POS because she needs to process transactions, view reports, manage the menu, and handle refunds. She's trusted and capable. The retail counter staff have access to the same system because it's the same POS.

What can the retail counter staff see? Everything the café manager can see. Revenue reports. Staff performance data. Margin information. Refund histories. Information about other staff members' transaction rates. Potentially, the entire business's financial picture.

This isn't hypothetical. It's how most small-business POS systems work. Access controls are basic — usually just "admin" versus "staff" — without the ability to restrict access by area of operation, by data type, or by reporting level.

For a small business, this is mostly a trust issue. You're relying on staff not to look at things they shouldn't, or not to share what they see with each other or with people outside the business. Most staff don't — but relying on social convention rather than system controls is a fragile form of data governance.

---

## Why Sector-Based Access Is the Right Model

In a business with multiple operational sectors — Restaurant and Retail, or Repair and Salon — the natural access boundary is the sector itself.

A technician at the repair counter needs access to the repair POS: job cards, parts inventory, customer repair records, and the ability to process payment when a job is complete. They do not need access to the retail counter's product catalogue, pricing, or transaction history. They certainly don't need access to the café's revenue reports or staff performance data.

A server in the restaurant needs access to the restaurant POS: table management, menu items, order routing, and payment processing. They don't need to see the repair shop's work order history or the salon's appointment-linked revenue data.

Sector-based access controls make this straightforward. Each staff member is assigned to their sector. Their login, at pos.askbiz.co, shows them exactly the interface they need — and nothing else.

---

## How the Assignment Works

The admin account, at askbiz.co, assigns each staff member to a sector when their account is created. The assignment determines what the staff member sees when they log in at pos.askbiz.co.

A restaurant server logs in and sees the restaurant POS: tables, menu, orders, payment. Nothing about the retail counter or the repair workshop.

A retail assistant logs in and sees the retail POS: product catalogue, stock, transactions, payment. Nothing about the restaurant's covers or the salon's appointments.

The admin account sees everything: all sectors, all staff, all revenue, all reporting — with the ability to filter by sector or branch to focus on any specific part of the business.

The division between the two login URLs is not incidental. pos.askbiz.co is the staff-facing point-of-sale environment. askbiz.co is the owner/admin dashboard. The separation is architectural — staff accounts don't have a path to the admin view, regardless of what they know about the URL structure.

---

## The Two-Edit Limit and Why It Exists

Staff sector assignments can be changed by the admin — but only twice per staff member. After two changes, the assignment is locked and cannot be changed without provisioning a new seat.

This constraint is deliberate, and it serves two purposes.

The first is operational discipline. Constantly reassigning staff between sectors is almost always a sign of either poor planning or organisational churn. The limit encourages admins to think carefully about which sector each person belongs in, rather than treating sector assignment as a fluid administrative action. Two changes is enough to accommodate a genuine role change — a person who moves from the retail counter to the café, for example. It's not enough to support a pattern of constant reassignment.

The second is security. In shared-login environments — where one account is being used by multiple people across shifts — the pattern often shows up as frequent sector changes. If a "staff account" is being reassigned repeatedly across sectors, it's likely being shared, or being used to access areas it shouldn't. The two-change limit creates friction that surfaces this pattern without requiring the admin to investigate manually.

If a genuine permanent reassignment is needed after two changes — a staff member's role has fundamentally changed — the right action is to provision a new seat. This creates a clean record: a new seat, a new assignment, a clean audit trail. The old seat's transaction history remains associated with the original role, which is accurate.

---

## Staff Performance Visibility

The sector permission model doesn't just control what staff see — it also determines how they appear in management reporting.

Staff performance data in AskBiz is segmented by sector. When the admin reviews staff performance, they can filter by sector to see how each team is performing within its own context. A repair technician's average job value is compared to other repair technicians, not to servers in the restaurant.

This matters for performance management. Comparing a repair technician's average transaction value to a server's is meaningless — the transaction types are structurally different in value and frequency. Sector-segmented staff reporting gives you a comparison that's actually informative.

For a business where staff retention is important — and in skilled sectors like repair and salon, it often is — being able to give staff meaningful performance feedback, based on relevant comparisons within their sector, is part of a decent management toolkit.

---

## The Audit Trail at Staff Level

Every action taken in AskBiz is logged to the audit trail: every transaction, every refund, every void, every login, every staff action. The audit trail is searchable by staff member.

When a discrepancy appears — a till that's short at the end of a shift, a refund that doesn't correspond to a recognisable customer, a transaction that was voided and re-entered — the audit trail shows you exactly who did what, and when.

For a multi-sector business, the audit trail is filtered by sector. The café manager investigating a discrepancy in restaurant revenue doesn't see the repair shop's audit entries, and vice versa. The admin sees the full picture across all sectors.

This creates the right accountability structure: sector managers have the visibility they need to manage their team's actions, without access to data from other sectors that's not relevant to their role.

---

## What Good Access Control Actually Looks Like

The principle behind AskBiz's permission model is straightforward: every person in the system should see exactly what they need to do their job well, and nothing they don't need.

This sounds obvious, but it runs counter to how most small business POS systems are designed, which is for simplicity of setup rather than correctness of access. Giving everyone the same access is simpler to configure. It's also a data governance failure, a security vulnerability, and a recipe for staff seeing things that create unnecessary tension or legal exposure.

The cost of getting access control right is low — it's a configuration decision, not a technical project. The cost of getting it wrong accumulates quietly, in the form of data you'd rather staff didn't see, accountability structures that don't hold, and compliance risks you might not even be aware of.

---

*AskBiz is available at [askbiz.co](https://askbiz.co). Staff sector assignment and audit trail are included at £10/seat/month with no hardware required.*