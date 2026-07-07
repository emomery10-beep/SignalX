-- ============================================================
-- Widen lifecycle_emails.email_type to cover upgrade-welcome
-- emails (plan tier + POS seats), alongside welcome/re_engagement.
-- The (user_id, email_type) unique constraint remains the dedupe
-- mechanism — see 20260702_lifecycle_emails.sql.
-- ============================================================

alter table public.lifecycle_emails drop constraint if exists lifecycle_emails_email_type_check;
alter table public.lifecycle_emails add constraint lifecycle_emails_email_type_check
  check (email_type in (
    'welcome',
    're_engagement',
    'plan_upgrade:growth',
    'plan_upgrade:business',
    'plan_upgrade:enterprise',
    'pos_seats_welcome'
  ));
