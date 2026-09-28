# Nexum Trade Consulting - Landing Page MVP

Sitio web corporativo y de captura de leads para **Nexum Trade Consulting**, consultora estratégica en comercio exterior para PyMEs argentinas liderada por Carlos A. Oviedo (+20 años de trayectoria).

---

## 🚀 Arquitectura del Stack

* **Frontend:** HTML5 semántico, Tailwind CSS (CDN), Lucide Icons, Vanilla JavaScript.
* **Hosting:** GitHub Pages ($0) con SSL y CDN vía Cloudflare.
* **Backend & Automatización:** Webhook en n8n -> Registro en Supabase (`leads_nexum`) -> Notificaciones instantáneas (Telegram / Email).
* **Conversión B2B:** Formulario interactivo + Botón directo a WhatsApp.

---

## 📁 Estructura del Proyecto

```text
├── index.html        # Página principal (Hero, Problemas, Quiénes Somos, Servicios, Formulario)
├── css/
│   └── custom.css    # Estilos complementarios y transiciones suaves
├── js/
│   └── app.js        # Lógica de captura de leads, webhook n8n y WhatsApp
└── README.md         # Documentación de despliegue y configuración
```

---

## ⚙️ Configuración del Webhook (n8n)

En el archivo `js/app.js`, reemplazá la variable `N8N_WEBHOOK_URL` con tu URL real cuando esté lista:

```javascript
const N8N_WEBHOOK_URL = "https://tu-instancia-n8n.com/webhook/nexum-contact";
```

### Estructura del Payload enviado por el formulario:

```json
{
  "nombre": "Juan Pérez",
  "empresa": "Laboratorios Austral S.A.",
  "email": "juan@empresa.com.ar",
  "telefono": "+54 9 11 1234-5678",
  "operacion": "primera_exportacion",
  "mensaje": "Buscamos exportar formulaciones a Paraguay y Bolivia.",
  "timestamp": "2026-09-28T20:20:00.000Z",
  "origen": "landing_nexum_web"
}
```

---

## 🗄️ Esquema de Tabla en Supabase

Ejecutá esta consulta SQL en el SQL Editor de tu proyecto de Supabase para crear la tabla de leads:

```sql
create table leads_nexum (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  nombre text not null,
  empresa text not null,
  email text not null,
  telefono text,
  operacion text,
  mensaje text,
  status text default 'nuevo' check (status in ('nuevo', 'contactado', 'reunion_agendada', 'descartado', 'cliente'))
);
```

---

## 🌐 Despliegue en GitHub Pages

1. Subir cambios a tu repositorio remoto:
   ```bash
   git add .
   git commit -m "feat: landing page nexum trade consulting v1"
   git push origin main
   ```
2. En GitHub: `Settings` → `Pages` → `Build and deployment` → Source: `Deploy from a branch` (`main` / `/root`).
