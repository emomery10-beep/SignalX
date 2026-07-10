-- Allow 'community_post' type in agent_content (Jane Wanjiru — WhatsApp/Facebook community posts)
alter table public.agent_content
  drop constraint if exists agent_content_type_check;

alter table public.agent_content
  add constraint agent_content_type_check
  check (type in ('blog','thread','smart_reply','seo_report','reorder_suggestion','community_post'));
