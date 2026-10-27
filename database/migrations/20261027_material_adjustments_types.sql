ALTER TABLE pm_material_adjustments DROP CONSTRAINT IF EXISTS pm_material_adjustments_adjustment_type_check;
ALTER TABLE pm_material_adjustments ADD CONSTRAINT pm_material_adjustments_adjustment_type_check CHECK (
  adjustment_type IN ('wastage', 'damage', 'return_to_supplier', 'return_material', 'scrap_material', 'scrap', 'transfer_out')
);
ALTER TABLE pm_material_adjustments ADD COLUMN IF NOT EXISTS amount NUMERIC(14,2);
ALTER TABLE pm_material_adjustments ADD COLUMN IF NOT EXISTS supplier_name TEXT;
