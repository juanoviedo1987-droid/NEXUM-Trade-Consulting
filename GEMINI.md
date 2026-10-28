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

7. **Estándar de Diseño Mobile-First Obligatorio:**
   - Todo desarrollo, pantalla o componente web se diseña y prueba **Mobile-First** (resoluciones de 360px a 430px) y luego se expande armónicamente a pantallas de escritorio (`sm:`, `md:`, `lg:`, `xl:`).
   - Ergonomía táctil obligatoria (zonas de toque >= 44px, navegación al alcance del pulgar, formularios adaptativos, sin scrolls laterales accidentales).
   - En PC se garantiza la vista ejecutiva de pantalla completa sin comprometer la base móvil.

8. **Perfil de Cliente Ideal (ICP) y Filtro Maestro de Prospección:**
   - **Filtro Maestro Obligatorio:** Empresas o fábricas argentinas que **NO cuenten con departamento propio ni analista interno de Comercio Exterior**. Si tienen un producto terminado con marca propia y no tienen área de Comex interna, **califican automáticamente para ser contactadas**.
   - **Dotación de Personal Flexible:** No limitar por cantidad de operarios. Una fábrica puede tener 10, 40 o más de 60 empleados (donde la gran mayoría está en planta/producción) y ser un cliente ideal con excelente espalda financiera, siempre que carezca de estructura de Comex.
   - **Exclusión Estricta:** NUNCA prospectar empresas que ya tengan gerencia/jefatura interna de Comercio Exterior o burocracias corporativas impenetrables.
   - **Perfil del Producto:** Producto terminado con marca propia (no materias primas a granel), validado en el mercado interno y con capacidad productiva para atender pedidos regionales.
   - **Decisor Directo:** El dueño, fundador, socio gerente o director comercial debe ser accesible de forma directa (a una llamada, WhatsApp comercial o LinkedIn de distancia).
   - **Cadencia de Contacto:** Siempre validar la lista de prospectos con Juan ANTES de cargar a base de datos. Estrategia multicanal: Email formal inicial (plantar bandera) seguido a los 3-5 días de contacto directo por WhatsApp o llamada telefónica.

9. **Tono de Voz y Copywriting de Juan (Estilo de Comunicación B2B):**
   - **ADN de Comunicación:** Rioplatense natural, simple, cercano, seguro y al grano. Cero rodeos, cero chamuyo corporativo o jerga inflada de consultora tradicional (PROHIBIDO usar frases como "sinergia estratégica", "en pos de", "quedo a su entera disposición", "estimados directivos").
   - **Estructura Estándar para WhatsApp / Mensajes Directos:**
     - Saludo natural y al pie: *"¡Hola [Nombre]! ¿Cómo estás? Te habla Juan, socio de Nexum."*
     - Foco en 1 sola frase concreta sobre el interés o producto.
     - Cierre abierto y sin presiones: *"Cuando quieras coordinamos una videollamada o hablamos por acá, lo que te sea más cómodo."*
   - **Extensión:** Máximo 3 o 4 líneas. Menos es más: dejar que la contraparte hable, responda o proponga.
   - **Regla de Ejecución Estricta:** NUNCA disparar envíos masivos de emails, mensajes ni mutaciones operativas externas sin la confirmación y el visto bueno explícito de Juan.

10. **Aislamiento de Alertas n8n (Inbound Web vs. Outbound CRM):**
    - El estado `status: 'nuevo'` está reservado **EXCLUSIVAMENTE para leads orgánicos del formulario web** (`nexumtc.com.ar`). La automatización n8n en GCP despacha alertas por correo a Juan cada vez que detecta un lead con `status: 'nuevo'`.
    - Toda prospección saliente / outbound cargada en Supabase debe crearse con `status: 'prospecto'` (o pasar a `status: 'contactado'` tras el envío). **PROHIBIDO cargar prospectos fríos con `status: 'nuevo'`** para no saturar el Gmail personal de Juan con falsas alertas de consulta web.

11. **Permiso Previo Obligatorio (Cero Autonomía No Solicitada):**
    - **Regla de Oro:** SOLO hacer, editar, crear, sincronizar archivos o ejecutar acciones operativas si Juan lo pide explícitamente en el chat.
    - Ante cualquier pregunta informativa, responder únicamente lo consultado y **PREGUNTAR antes de realizar cualquier cambio**.
    - Esperar siempre el "Sí", "Dale" o confirmación consciente de Juan antes de ejecutar.





