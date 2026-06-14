-- Allow 'reorder_suggestion' and 'seo_report' types in agent_content
alter table public.agent_content
  drop constraint if exists agent_content_type_check;

alter table public.agent_content
  add constraint agent_content_type_check
  check (type in ('blog','thread','smart_reply','seo_report','reorder_suggestion'));
