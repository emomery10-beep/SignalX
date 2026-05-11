-- ── WHATSAPP + NOTIFICATION PREFERENCES ──────────────────────────────────────
alter table public.profiles
  add column if not exists whatsapp_number   text,
  add column if not exists notify_whatsapp   boolean default false,
  add column if not exists notify_email_alerts boolean default true,
  add column if not exists notify_digest_hour int default 8; -- UTC hour for daily digest (0-23)
