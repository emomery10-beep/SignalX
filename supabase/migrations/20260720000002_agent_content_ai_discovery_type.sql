-- Allow 'ai_discovery_audit' type in agent_content
-- The weekly ai-discovery-audit cron has been running successfully but every insert
-- has silently violated this constraint since the route was added — 'ai_discovery_audit'
-- was never included when 'seo_report'/'reorder_suggestion'/'community_post' were added.
alter table public.agent_content
  drop constraint if exists agent_content_type_check;

alter table public.agent_content
  add constraint agent_content_type_check
  check (type in ('blog','thread','smart_reply','seo_report','reorder_suggestion','community_post','ai_discovery_audit'));
