/**
 * Nexum Trade Consulting - Client-side Application Logic
 */

// ==========================================
// CONFIGURACIÓN DE INTEGRACIÓN (Supabase & n8n)
// ==========================================
const SUPABASE_CONFIG = {
  url: "https://hlvovocufifroigdlhmv.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsdm92b2N1Zmlmcm9pZ2RsaG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMDM3MjksImV4cCI6MjEwNTY3OTcyOX0.7KGejvoqjyTAZhEGYODz_Jm2DpddYiLUyIKdhhLxsr0",
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

  // 4. Configurar número de WhatsApp
  const whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn && WHATSAPP_PHONE) {
    const msg = encodeURIComponent(
      "Hola Carlos y equipo de Nexum Trade Consulting, me gustaría consultarles por la exportación de nuestros productos."
    );
    whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
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
        origen: "landing_nexum_web",
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
        formErrorMsg.textContent =
          "Hubo un inconveniente técnico al guardar tu consulta. Por favor escribinos directamente por WhatsApp al +54 9 11 7237-6197.";
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
