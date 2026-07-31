-- ============================================================
-- pos_notification_settings (032_pos_intelligence_notifications.sql)
-- shipped with SELECT and UPDATE policies but no INSERT policy, so a
-- first-time save can't go through the user's own RLS-scoped session
-- (app/api/pos/notification-settings/route.ts works around this today
-- by always writing through the service-role client, per its own
-- comment). Adding the missing policy so any future caller using the
-- normal session client isn't silently blocked or forced to reach for
-- the service client without knowing why.
-- ============================================================

DROP POLICY IF EXISTS "Users can only insert their own notification settings" ON public.pos_notification_settings;
CREATE POLICY "Users can only insert their own notification settings"
ON public.pos_notification_settings FOR INSERT
WITH CHECK (owner_id = auth.uid());
