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

## 🗄️ Base de Datos en Supabase (Proyecto Dedicado)

El proyecto exclusivo **`nexum-trade-consulting`** ya se encuentra activo en Supabase (Región: `sa-east-1` São Paulo):
* **Project ID:** `wbcfmanuhotyevquiaht`
* **URL:** `https://wbcfmanuhotyevquiaht.supabase.co`
* **Tabla principal:** `leads_nexum` (con políticas de Row Level Security para inserciones seguras).

---

| Color | HEX | RGB | Rol / Aplicación |
| :--- | :--- | :--- | :--- |
| **Petróleo Oscuro** | `#002529` | `rgb(0, 37, 41)` | **Color Oficial Primario (Oscuro):** Fondos de hero, encabezados, footer y autoridad institucional. |
| **Azul Cerúleo** | `#0074A1` | `rgb(0, 116, 161)` | **Color Oficial Secundario (Acento):** Botones de llamado a la acción (CTAs), isotipo, badges y enlaces. |
| **Blanco Puro** | `#FFFFFF` | `rgb(255, 255, 255)` | **Color Oficial Primario (Luz & Fondo):** Color oficial de marca utilizado frecuentemente como fondo principal en piezas gráficas, presentaciones comerciales, papelería y secciones web para máxima claridad y elegancia. |
| **Verde Esmeralda** | `#10B981` | `rgb(16, 185, 129)` | **Funcional / Conversión:** Botón de WhatsApp Business, estados activos y checks de validación. |
| **Celeste Hielo** | `#38BDF8` | `rgb(56, 189, 248)` | **Funcional / Resaltado:** Resaltados técnicos, iluminación sutil y textos destacados sobre fondos oscuros. |

> **Nota de Identidad:** El **Blanco Puro (#FFFFFF)** es un pilar oficial de la paleta de Nexum Trade Consulting; se concibe como color de fondo principal para transmitir transparencia, modernidad y alto contraste frente a la sobriedad del Petróleo Oscuro y la vivacidad del Azul Cerúleo.

### Tipografía Oficial
* **Títulos y Encabezados:** `Plus Jakarta Sans` (Extrabold / Bold)
* **Cuerpo y Lectura:** `Inter` (Regular / Medium / Semibold)
* **Activos de Marca:**
  * `assets/logo-1.png`: Logo horizontal institucional completo.
  * `assets/logo-3.png`: Isotipo de flechas ascendentes (Favicon y pie de página).
  * `assets/og-banner.png`: Tarjeta de previsualización para WhatsApp y LinkedIn (1200x630 px).

---

## 🌐 Despliegue en GitHub Pages y Dominio Personalizado

* **Repositorio:** [juanoviedo1987-droid/NEXUM-Trade-Consulting](https://github.com/juanoviedo1987-droid/NEXUM-Trade-Consulting)
* **Dominio Oficial:** `https://nexumtradeconsulting.com.ar`
* **CDN / SSL:** Cloudflare (Nameservers: `tessa.ns.cloudflare.com` y `tony.ns.cloudflare.com`).

