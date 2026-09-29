/**
 * Nexum Trade Consulting - Client-side Application Logic
 */

// ==========================================
// CONFIGURACIÓN DE INTEGRACIÓN (Supabase & n8n)
// ==========================================
const SUPABASE_CONFIG = {
  url: "https://wbcfmanuhotyevquiaht.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY2ZtYW51aG90eWV2cXVpYWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MjcyNzcsImV4cCI6MjEwNjIwMzI3N30.9Lx4mXOP3WIfmqJ5AGbqEOYTA2nZ_KeSnD54OFrR__g",
  tableName: "leads_nexum"
};

// Si tenés una URL pública para n8n, podés agregarla acá (opcional):
const N8N_WEBHOOK_URL = ""; 

// Número de WhatsApp Business oficial
const WHATSAPP_PHONE = "5491172376197"; 

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

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Detección de idioma
  const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("/en/");

  // 4. Configurar número de WhatsApp
  const whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn && WHATSAPP_PHONE) {
    const defaultMsg = isEn
      ? "Hello Nexum team, I would like to inquire about exporting our products."
      : "Hola equipo de Nexum, me gustaría consultarles por la exportación de nuestros productos.";
    whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(defaultMsg)}`;
  }

  // 5. Manejo del Formulario de Captura de Leads (Envío directo a Supabase)
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
        origen: isEn ? "landing_nexum_en" : "landing_nexum_es",
      };

      // Estado visual de carga
      setLoading(true);

      try {
        // Inserción en Supabase en tiempo real (Base 24/7)
        const supabaseEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tableName}`;
        const response = await fetch(supabaseEndpoint, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_CONFIG.anonKey,
            "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error en Supabase: HTTP ${response.status}`);
        }

        // Si hay webhook de n8n configurado, enviar también en paralelo
        if (N8N_WEBHOOK_URL) {
          fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).catch((n8nErr) => console.warn("n8n webhook notification error:", n8nErr));
        }

        // Mostrar éxito y limpiar formulario
        formSuccess.classList.remove("hidden");
        form.reset();

        // Scroll suave al mensaje de éxito
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });

      } catch (err) {
        console.error("Error al enviar lead:", err);
        formErrorMsg.textContent = isEn
          ? "There was a technical issue saving your inquiry. Please contact us directly via WhatsApp at +54 9 11 7237-6197."
          : "Hubo un inconveniente técnico al guardar tu consulta. Por favor escribinos directamente por WhatsApp al +54 9 11 7237-6197.";
        formError.classList.remove("hidden");
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.textContent = isEn ? "Processing..." : "Procesando...";
      btnIcon.classList.add("hidden");
      btnSpinner.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      btnText.textContent = isEn ? "Request Free Assessment" : "Solicitar Diagnóstico Sin Costo";
      btnIcon.classList.remove("hidden");
      btnSpinner.classList.add("hidden");
    }
  }

  // 6. Acordeón interactivo para Preguntas Frecuentes (FAQ)
  const faqToggles = document.querySelectorAll(".faq-toggle");
  faqToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      const content = item.querySelector(".faq-content");
      const icon = item.querySelector(".faq-icon");
      const isOpen = !content.classList.contains("hidden");

      // Cerrar otros acordeones
      document.querySelectorAll(".faq-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.querySelector(".faq-content")?.classList.add("hidden");
          otherItem.querySelector(".faq-icon")?.classList.remove("rotate-180");
        }
      });

      if (isOpen) {
        content.classList.add("hidden");
        icon?.classList.remove("rotate-180");
      } else {
        content.classList.remove("hidden");
        icon?.classList.add("rotate-180");
      }
    });
  });
});
