# AskBiz Source Code Protection Policy

**Effective date:** 2026-07-03
**Owner:** idarus (founder)
**Applies to:** all AskBiz repositories (main app, `pos-askbiz/`, and any future services)

## 1. Purpose

AskBiz's source code is a trade secret and a copyrighted work. This policy sets out how the code is
protected day-to-day, and how it is handled when it must be shared with a third party (e.g. a
regulator, investor, contractor, or auditor).

## 2. Classification

| Level | Examples | Handling |
|---|---|---|
| **Restricted** | Full repositories, `.env` files, Supabase service-role keys, AI prompt templates, pricing/ranking algorithms | Never leaves controlled storage (GitHub org, password manager, Supabase dashboard). Never emailed, never pasted into a form or chat outside this environment. |
| **Confidential** | Representative source excerpts, architecture diagrams, database schema (no data) | May be shared under NDA or to a government body for a specific stated purpose (e.g. copyright deposit). Track what was shared, with whom, and when (see §5). |
| **Public** | Marketing copy, published blog content, public API docs | No restrictions. |

## 3. Access control

- **Repo access** is granted per-person, least-privilege, and revoked immediately on offboarding.
- **Secrets** (Supabase keys, payment provider keys, AI provider keys) live only in environment
  variables / the platform's secret store (Vercel, Supabase). They are never committed to git,
  never hardcoded in source files, and never included in any exported/deposited document.
- **Production database access** is limited to the founder and any explicitly authorized engineer;
  access is via scoped service roles, not shared root credentials.

## 4. Before sharing any code externally

Before any source code, screenshot, or document leaves the org (copyright deposits, investor
due diligence, contractor onboarding, support tickets), it must pass this checklist:

1. **Scope check** — share the minimum necessary. Prefer representative excerpts over full
   repositories or full modules.
2. **Secret scan** — grep the material for API keys, tokens, JWTs, connection strings, and
   `.env` values before export. (`grep -nE "sk-|eyJ|AIza|SECRET|API_KEY"` as a baseline pass.)
3. **Redact competitive-advantage internals** — strip or generalize:
   - exact AI/LLM prompt text (prompt engineering is a real moat; describe the capability,
     don't paste the prompt)
   - proprietary scoring/ranking/pricing formulas
   - infrastructure topology details not needed by the recipient
4. **Confirm the recipient and channel** — is this going to an official, verified destination
   (e.g. the government portal's own upload field), not a third-party link or unverified inbox?
5. **Log the disclosure** — record what was shared, to whom, why, and when (see §5).

## 5. Disclosure log

Every Confidential-level external share gets one line in `docs/DISCLOSURE_LOG.md`:

```
2026-07-03 | KECOBO copyright deposit | source excerpts (camera capture, POS, inventory, auth) | redacted, no secrets | invoice ref 1229729
```

## 6. Copyright registration deposits specifically

Government copyright deposits (e.g. KECOBO/NRR) are **public-adjacent** — treat anything
uploaded there as effectively disclosed, since deposit material can in principle be requested
or leaked. Rules for these deposits:

- Never include `.env` values, API keys, or database credentials.
- Never include verbatim AI prompt strings — replace with a one-line functional description
  in a comment (e.g. `// AI vision prompt describing product image → structured inventory
  fields; template omitted from deposit`).
- Prefer excerpts (first/last N pages of a file, or a small representative module set) over
  the entire codebase.
- Registration establishes a dated public record of authorship — it is not, by itself, a
  vector for someone to "steal" the product; the real risk is prompt/algorithm disclosure,
  which is covered by the redaction step above.

## 7. Incident response

If Restricted-level material is disclosed by mistake (wrong recipient, leaked key, public repo
made public by accident):

1. Rotate any exposed credentials immediately (Supabase keys, API keys, tokens).
2. Determine what was exposed and to whom.
3. Remove/replace the material at the source if possible.
4. Record the incident in `docs/DISCLOSURE_LOG.md` with an `INCIDENT` tag.

## 8. Review

Review this policy whenever a new class of external sharing is introduced (new government
filing, new investor round, new contractor arrangement) or at least every 12 months.
