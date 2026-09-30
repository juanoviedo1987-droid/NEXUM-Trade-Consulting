-- ==============================================================================
-- NEXUM TRADE CONSULTING - SCRIPT DEFINITIVO DE CONFIGURACIÓN CRM (SUPABASE)
-- ==============================================================================
-- Proyecto: nexum-trade-consulting (wbcfmanuhotyevquiaht)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PASO 1: LIMPIEZA INICIAL DE LA TABLA (ANTES DE MODIFICAR COLUMNAS Y CHECKS)
-- ------------------------------------------------------------------------------
-- Elimina los registros generados durante las pruebas técnicas para que las nuevas
-- restricciones (CHECK constraints) se apliquen de forma limpia sin errores.
DELETE FROM leads_nexum;

-- ------------------------------------------------------------------------------
-- PASO 2: EXTENSIÓN DE COLUMNAS PARA EL CRM OPERATIVO
-- ------------------------------------------------------------------------------
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS sector text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS responsable text DEFAULT 'Sin Asignar';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS cargo text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS prioridad text DEFAULT 'B';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS proxima_accion text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS fecha_proxima_accion date;
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS notas text DEFAULT '';

-- Asegurar que el DEFAULT de la columna status sea exactamente 'nuevo'
ALTER TABLE leads_nexum ALTER COLUMN status SET DEFAULT 'nuevo';

-- Restricción de prioridad: A (Alta), B (Media), C (Baja)
DO $$
BEGIN
    ALTER TABLE leads_nexum DROP CONSTRAINT IF EXISTS leads_nexum_prioridad_check;
    ALTER TABLE leads_nexum ADD CONSTRAINT leads_nexum_prioridad_check CHECK (prioridad IN ('A', 'B', 'C'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- PASO 3: COMPATIBILIDAD DE ETAPAS (STATUS) CON FORMULARIO Y n8n
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    ALTER TABLE leads_nexum DROP CONSTRAINT IF EXISTS leads_nexum_status_check;
    ALTER TABLE leads_nexum ADD CONSTRAINT leads_nexum_status_check 
    CHECK (status IN ('nuevo', 'notificado', 'prospecto', 'contactado', 'reunion_agendada', 'presupuestado', 'cliente', 'descartado'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- PASO 4: POLÍTICAS DE ROW LEVEL SECURITY (RLS) ESTRICTAS
-- ------------------------------------------------------------------------------
ALTER TABLE leads_nexum ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas
DROP POLICY IF EXISTS "Permitir insert publico para formulario web" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados autorizados" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir select para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir insert para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir update para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir delete para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a anon" ON leads_nexum;

-- POLÍTICA A (ROL 'anon' - Formulario de la Landing Web):
-- El formulario web NO envía status; PostgreSQL aplica el default 'nuevo'.
-- Esta política permite la inserción únicamente si el status resultante es 'nuevo'.
CREATE POLICY "Permitir insert publico para formulario web"
ON leads_nexum
FOR INSERT
TO anon
WITH CHECK (status = 'nuevo');

-- POLÍTICA B (ROL 'authenticated' - Socios de Nexum Autorizados):
-- Permite SELECT, INSERT, UPDATE y DELETE exclusivamente a los correos autorizados.
-- (Verificar que coincidan exactamente con las cuentas creadas en Supabase Auth)
CREATE POLICY "Permitir todo a usuarios autenticados autorizados"
ON leads_nexum
FOR ALL
TO authenticated
USING (
    (auth.jwt() ->> 'email') IN (
        'juan.oviedo@nexumtc.com.ar',       -- << EMAIL JUAN OVIEDO >>
        'facundo.oviedo@nexumtc.com.ar'     -- << EMAIL FACUNDO OVIEDO >>
        -- Si desean habilitar el acceso a Carlos A. Oviedo, descomentar la siguiente línea:
        -- ,'carlos.oviedo@nexumtc.com.ar'
    )
)
WITH CHECK (
    (auth.jwt() ->> 'email') IN (
        'juan.oviedo@nexumtc.com.ar',       -- << EMAIL JUAN OVIEDO >>
        'facundo.oviedo@nexumtc.com.ar'     -- << EMAIL FACUNDO OVIEDO >>
        -- Si desean habilitar el acceso a Carlos A. Oviedo, descomentar la siguiente línea:
        -- ,'carlos.oviedo@nexumtc.com.ar'
    )
);

-- ------------------------------------------------------------------------------
-- PASO 5: ÍNDICES DE RENDIMIENTO
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_nexum_status ON leads_nexum(status);
CREATE INDEX IF NOT EXISTS idx_leads_nexum_responsable ON leads_nexum(responsable);
CREATE INDEX IF NOT EXISTS idx_leads_nexum_created_at ON leads_nexum(created_at DESC);
