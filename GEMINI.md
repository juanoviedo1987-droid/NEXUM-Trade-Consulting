# Reglas Operativas - Proyecto NEXUM Trade Consulting

## Rol y Objetivo
Este proyecto gestiona el sitio web corporativo, la captura de leads B2B y las automatizaciones de notificación para **Nexum Trade Consulting** (consultora estratégica en comercio exterior para PyMEs).

---

## Reglas Críticas y Arquitectura

1. **Fuente de Verdad en GitHub (SSOT):**
   - Repositorio central: `https://github.com/juanoviedo1987-droid/NEXUM-Trade-Consulting`.
   - Todo cambio en el frontend, lógica de captura o flujo de n8n (`workflows/`) se versiona y comitea en este repositorio.

2. **Hub Central de Automatizaciones (GCP n8n):**
   - El flujo `workflows/nexum_lead_notification.json` se ejecuta de forma centralizada 24/7 en la instancia Cloud de **n8n en Google Cloud Platform** (`https://34-135-56-126.sslip.io`).
   - El flujo consulta nuevos leads en Supabase cada 5 minutos (`status=eq.nuevo`) y despacha las alertas por email usando **Hostinger SMTP** (`info@nexumtc.com.ar`).

3. **Arquitectura de Datos (Supabase):**
   - Base de datos relacional en Supabase con la tabla maestra `leads_nexum`.
   - El formulario web inserta directamente con la clave pública anónima (`anonKey`).
   - La lectura y actualización de estado de leads para notificaciones se gestiona desde n8n Cloud.

4. **Frontend y Despliegue:**
   - Alojado en **GitHub Pages** con CNAME configurado.
   - HTML5 semántico, Tailwind CSS y Lucide Icons sin dependencias pesadas de build.

5. **Seguridad Absoluta:**
   - NUNCA commitear claves de servicio de Supabase (`service_role`), credenciales de email o contraseñas en texto plano.
   - Toda credencial privada se almacena en el gestor de credenciales de n8n Cloud.

6. **Gestión de Secretos Centralizada:**
   - Las claves de API y accesos de Nexum (Supabase `wbcfmanuhotyevquiaht`, etc.) residen en `C:\Users\juano\.secrets\stack.env`.

