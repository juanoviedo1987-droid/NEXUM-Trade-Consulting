-- ==============================================================================
-- NEXUM TRADE CONSULTING - SCRIPT DE CONFIGURACIÓN CRM (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Proyecto: nexum-trade-consulting (wbcfmanuhotyevquiaht)
-- Este script define las nuevas columnas del CRM y las políticas de seguridad (RLS).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIÓN DE COLUMNAS PARA EL CRM OPERATIVO
-- ------------------------------------------------------------------------------
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS sector text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS responsable text DEFAULT 'Sin Asignar';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS cargo text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS prioridad text DEFAULT 'B';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS proxima_accion text DEFAULT '';
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS fecha_proxima_accion date;
ALTER TABLE leads_nexum ADD COLUMN IF NOT EXISTS notas text DEFAULT '';

-- Restricción de prioridad: A (Alta), B (Media), C (Baja)
DO $$
BEGIN
    ALTER TABLE leads_nexum DROP CONSTRAINT IF EXISTS leads_nexum_prioridad_check;
    ALTER TABLE leads_nexum ADD CONSTRAINT leads_nexum_prioridad_check CHECK (prioridad IN ('A', 'B', 'C'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 2. COMPATIBILIDAD DE ETAPAS (STATUS) CON FORMULARIO Y n8n
-- ------------------------------------------------------------------------------
-- Mantiene intactos los estados actuales:
--   'nuevo'       -> Default que envía el formulario web de la landing
--   'notificado'  -> Asignado automáticamente por n8n tras enviar el email de alerta
-- Y agrega las etapas comerciales:
--   'prospecto'          -> Outbound LinkedIn / Directorios
--   'contactado'         -> En conversación / Esperando respuesta
--   'reunion_agendada'   -> Relevamiento 30 min coordinado
--   'presupuestado'      -> Diagnóstico presupuestado (propuesta 24 h)
--   'cliente'            -> Cerrado ganado (abonado)
--   'descartado'         -> En pausa o perdido
DO $$
BEGIN
    ALTER TABLE leads_nexum DROP CONSTRAINT IF EXISTS leads_nexum_status_check;
    ALTER TABLE leads_nexum ADD CONSTRAINT leads_nexum_status_check 
    CHECK (status IN ('nuevo', 'notificado', 'prospecto', 'contactado', 'reunion_agendada', 'presupuestado', 'cliente', 'descartado'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 3. POLÍTICAS DE ROW LEVEL SECURITY (RLS) ESTRICTAS
-- ------------------------------------------------------------------------------
ALTER TABLE leads_nexum ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas para evitar duplicados o conflictos
DROP POLICY IF EXISTS "Permitir insert publico para formulario web" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados autorizados" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir select para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir insert para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir update para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir delete para anon" ON leads_nexum;
DROP POLICY IF EXISTS "Permitir todo a anon" ON leads_nexum;

-- POLÍTICA A (ROL 'anon' - Visitantes web / Formulario landing):
-- SOLO permite INSERT si el status es exactamente 'nuevo'.
-- Queda estrictamente PROHIBIDO SELECT (no leen datos), UPDATE y DELETE.
CREATE POLICY "Permitir insert publico para formulario web"
ON leads_nexum
FOR INSERT
TO anon
WITH CHECK (status = 'nuevo');

-- POLÍTICA B (ROL 'authenticated' - Juan y Facu autorizados):
-- Permite SELECT, INSERT, UPDATE y DELETE únicamente a los correos autorizados.
-- NOTA: Modificar los correos de la lista si difieren de los emails reales.
CREATE POLICY "Permitir todo a usuarios autenticados autorizados"
ON leads_nexum
FOR ALL
TO authenticated
USING (
    (auth.jwt() ->> 'email') IN (
        'juanoviedo1987@gmail.com',         -- Email de Juan (reemplazar por el real si difiere)
        'facundo.oviedo@nexumtc.com.ar'     -- Email de Facu (reemplazar por el real si difiere)
    )
)
WITH CHECK (
    (auth.jwt() ->> 'email') IN (
        'juanoviedo1987@gmail.com',
        'facundo.oviedo@nexumtc.com.ar'
    )
);

-- ------------------------------------------------------------------------------
-- 4. ÍNDICES DE RENDIMIENTO
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_nexum_status ON leads_nexum(status);
CREATE INDEX IF NOT EXISTS idx_leads_nexum_responsable ON leads_nexum(responsable);
CREATE INDEX IF NOT EXISTS idx_leads_nexum_created_at ON leads_nexum(created_at DESC);
