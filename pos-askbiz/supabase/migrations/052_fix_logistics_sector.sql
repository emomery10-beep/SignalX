-- Correct sector for any pos_staff whose role starts with 'logistics-'
-- but was accidentally assigned to the wrong sector.
-- Does NOT increment sector_edit_count because this is a system correction,
-- not an owner-initiated change.
UPDATE pos_staff
SET sector = 'logistics'
WHERE role LIKE 'logistics-%'
  AND (sector IS NULL OR sector != 'logistics');
