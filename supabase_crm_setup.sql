-- ==============================================================================
-- NEXUM TRADE CONSULTING - SCRIPT DE CONFIGURACIÓN CRM (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Proyecto: nexum-trade-consulting (wbcfmanuhotyevquiaht)
-- Ejecutar este script en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Asegurar que la tabla leads_nexum tenga todas las columnas requeridas por el CRM
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS notas text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS responsable text DEFAULT 'Sin Asignar';

-- 2. Eliminar o actualizar posibles restricciones CHECK antiguas de 'status' para aceptar todas las etapas del embudo
DO $$
BEGIN
    -- Intentar eliminar constraint de check antiguo si existiese
    ALTER TABLE leads_nexum DROP CONSTRAINT IF EXISTS leads_nexum_status_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 3. Configurar políticas de Row Level Security (RLS) para permitir lectura, inserción y actualización
-- Opción A (Recomendada para CRM interno en frontend simple): Desactivar RLS
ALTER TABLE leads_nexum DISABLE ROW LEVEL SECURITY;

-- Opción B (Si se desea mantener RLS activo con permisos completos para la Anon Key y Service Role):
-- ALTER TABLE leads_nexum ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Permitir todo a anon en leads_nexum" ON leads_nexum;
-- CREATE POLICY "Permitir todo a anon en leads_nexum" 
-- ON leads_nexum 
-- FOR ALL 
-- TO anon, authenticated, service_role 
-- USING (true) 
-- WITH CHECK (true);

-- 4. Índices para acelerar consultas del CRM
CREATE INDEX IF NOT EXISTS idx_leads_nexum_status ON leads_nexum(status);
CREATE INDEX IF NOT EXISTS idx_leads_nexum_created_at ON leads_nexum(created_at DESC);

-- ==============================================================================
-- ¡Listo! Una vez ejecutado, el formulario web y el CRM funcionarán sin restricciones de RLS.
-- ==============================================================================
