-- Add bill_url and bill_filename columns to pm_material_received and pm_material_adjustments
ALTER TABLE pm_material_received 
  ADD COLUMN IF NOT EXISTS bill_url text,
  ADD COLUMN IF NOT EXISTS bill_filename text;

ALTER TABLE pm_material_adjustments 
  ADD COLUMN IF NOT EXISTS bill_url text,
  ADD COLUMN IF NOT EXISTS bill_filename text;
