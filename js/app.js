/**
 * Nexum Trade Consulting - Client-side Application Logic
 */

// ==========================================
// CONFIGURACIÓN DE INTEGRACIÓN (n8n / Webhook)
// ==========================================
// Pega aquí la URL de tu Webhook de n8n cuando lo tengas activo:
// Ejemplo: "https://n8n.tudominio.com/webhook/nexum-contact"
const N8N_WEBHOOK_URL = ""; 

// Número de WhatsApp para el botón flotante (formato internacional sin signos ni espacios, ej: 5491112345678)
const WHATSAPP_PHONE = "5491100000000"; 

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar iconos de Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Actualizar año en el Footer
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Menú Mobile Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Cerrar menú al hacer click en un enlace
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // 4. Configurar número de WhatsApp dinámicamente si se personaliza
  const whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn && WHATSAPP_PHONE !== "5491100000000") {
    const msg = encodeURIComponent(
      "Hola Carlos y equipo de Nexum Trade Consulting, me gustaría consultarles por la exportación de nuestros productos."
    );
    whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
  }

  // 5. Manejo del Formulario de Captura de Leads
  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnIcon = document.getElementById("btnIcon");
  const btnSpinner = document.getElementById("btnSpinner");
  const formSuccess = document.getElementById("formSuccess");
  const formError = document.getElementById("formError");
  const formErrorMsg = document.getElementById("formErrorMsg");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Resetear alertas
      formSuccess.classList.add("hidden");
      formError.classList.add("hidden");

      // Recopilar datos del formulario
      const formData = new FormData(form);
      const payload = {
        nombre: formData.get("nombre")?.toString().trim() || "",
        empresa: formData.get("empresa")?.toString().trim() || "",
        email: formData.get("email")?.toString().trim() || "",
        telefono: formData.get("telefono")?.toString().trim() || "",
        operacion: formData.get("operacion")?.toString().trim() || "",
        mensaje: formData.get("mensaje")?.toString().trim() || "",
        timestamp: new Date().toISOString(),
        origen: "landing_nexum_web",
      };

      // Estado visual de carga
      setLoading(true);

      try {
        if (!N8N_WEBHOOK_URL) {
          // MODO DEMO / SIMULACIÓN:
          // Si aún no configuraste la URL de n8n, simula el éxito tras 800ms
          console.log("[Nexum Demo Mode] Payload generado:", payload);
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          // MODO PRODUCCIÓN: Envío real al Webhook de n8n
          const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Error en el servidor: Código HTTP ${response.status}`);
          }
        }

        // Mostrar éxito y limpiar formulario
        formSuccess.classList.remove("hidden");
        form.reset();

        // Scroll suave al mensaje de éxito si es necesario
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });

      } catch (err) {
        console.error("Error al enviar lead:", err);
        formErrorMsg.textContent =
          "No pudimos conectar con el servidor en este momento. Por favor, reintentá o comunicate por WhatsApp o email directo.";
        formError.classList.remove("hidden");
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.textContent = "Procesando...";
      btnIcon.classList.add("hidden");
      btnSpinner.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      btnText.textContent = "Solicitar Diagnóstico Sin Costo";
      btnIcon.classList.remove("hidden");
      btnSpinner.classList.add("hidden");
    }
  }
});
