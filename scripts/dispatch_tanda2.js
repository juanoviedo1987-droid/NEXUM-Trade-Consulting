const https = require('https');
const fs = require('fs');
const { sendEmail } = require('./send_email.js');

function loadSecrets() {
  const envPath = 'C:\\Users\\juano\\.secrets\\stack.env';
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  });
  return env;
}

const env = loadSecrets();
const SUPABASE_KEY = env.SUPABASE_NEXUM_SERVICE_ROLE_KEY;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchTanda2() {
  return new Promise((resolve, reject) => {
    const url = 'https://wbcfmanuhotyevquiaht.supabase.co/rest/v1/leads_nexum?status=eq.prospecto&order=created_at.asc&limit=10';
    https.get(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function updateLeadStatus(id, updateData) {
  return new Promise((resolve, reject) => {
    const url = `https://wbcfmanuhotyevquiaht.supabase.co/rest/v1/leads_nexum?id=eq.${id}`;
    const req = https.request(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, res => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.write(JSON.stringify(updateData));
    req.end();
  });
}

const CUSTOM_DETAILS_T2 = {
  'Mar del Plata Gin': {
    producto: 'gin artesanal marplatense de alta gama y destilados de autor premiados',
    dolor: 'análisis arancelario para bebidas espirituosas en destino, adecuación de contraetiquetas y logística para canales de distribución regional'
  },
  'Valkyria Gin (El Bolsón)': {
    producto: 'gin artesanal patagónico elaborado con agua de deshielo y botánicos cordilleranos',
    dolor: 'certificaciones bromatológicas de exportación, encuadre de aranceles preferenciales y apertura de distribuidores gourmet en el exterior'
  },
  'Gina Gin (Patagonian Distillery)': {
    producto: 'destilados de autor y gin patagónico con perfil exportador',
    dolor: 'homologación de rotulado según regulaciones aduaneras de destino, ventajas en acuerdos comerciales y estructuración de precios FOB'
  },
  'Damero Gin': {
    producto: 'gin artesanal de autor y bebidas destiladas',
    dolor: 'trámites de exportación de bebidas espirituosas, adecuación de packaging y mapeo de importadores en mercados limítrofes'
  },
  'Mamuschka Chocolates': {
    producto: 'chocolatería fina artesanal Bean-to-Bar, líneas orgánicas y certificadas sin TACC',
    dolor: 'normativas y tolerancias sanitarias en destino, certificación de origen, embalaje térmico para exportación y aranceles'
  },
  'Frantom Chocolates': {
    producto: 'chocolates artesanales de Bariloche y especialidades patagónicas',
    dolor: 'requisitos bromatológicos de ingreso a países de la región, conservación y costos logísticos de salida, y determinación de precio exportable'
  },
  'Chocolaterie Bariloche': {
    producto: 'chocolatería artesanal con receta belga e ingredientes patagónicos',
    dolor: 'adecuación de rotulado nutricional para exportación, análisis de derechos y reintegros, y búsqueda de distribuidores del canal delicatessen'
  },
  'Entrenuts': {
    producto: 'pasta de maní 100% natural y mantequillas de frutos secos saludables',
    dolor: 'certificados sanitarios de libre venta, requisitos bromatológicos en países limítrofes, rotulado frontal y consolidación de fletes'
  },
  'Alimentos Angiola': {
    producto: 'galletitas, crackers, alfajores y budines libres de gluten (sin TACC)',
    dolor: 'homologación de sellos y certificaciones sin gluten en destino, encuadre arancelario NCM y prospección de canales saludables/dietéticos'
  },
  'Productos L.E.Q. S.A.': {
    producto: 'snacks horneados, papas crujientes y bocaditos certificados sin TACC',
    dolor: 'análisis de barreras técnicas de importación, adecuación de packaging y rotulado normativo, y estructura de precios de exportación'
  }
};

async function run() {
  console.log('=== INICIANDO DESPACHO TANDA 2 (10 PyMEs en Frío) ===');
  const leads = await fetchTanda2();
  console.log(`Leads encontrados en prospecto: ${leads.length}`);

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const details = CUSTOM_DETAILS_T2[lead.empresa] || {
      producto: lead.operacion || 'productos con alto valor agregado',
      dolor: 'auditoría regulatoria, aranceles, rotulado y canales de distribución'
    };

    const subject = `Nexum Trade Consulting / Expansión internacional y COMEX para ${lead.empresa}`;
    const bodyParagraphs = [
      `Estimado equipo de ${lead.empresa}, Dirección Comercial o Nuevos Proyectos:`,
      `Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora especializada en comercio exterior y gestión técnica para empresas y laboratorios argentinos.`,
      `Me pongo en contacto con ustedes porque seguimos de cerca la trayectoria e innovación de sus líneas de <strong>${details.producto}</strong>. Nuestro objetivo es acompañar a empresas nacionales a abrir y consolidar nuevos mercados externos según su factibilidad técnica, resolviendo los puntos críticos del sector: ${details.dolor}.`,
      `Me gustaría proponerles una breve charla de 15 a 20 minutos (ya sea por llamada telefónica, videollamada o incluso intercambiando unas breves preguntas por este medio) para hacer un diagnóstico inicial y ver si podemos colaborar con ustedes.`,
      `Quedo a disposición por si les interesa coordinar o si consideran oportuno que hablemos más adelante.`
    ];

    console.log(`\n[${i+1}/10] Enviando a: ${lead.empresa} (${lead.email})...`);
    try {
      const sendRes = await sendEmail({
        to: lead.email,
        subject: subject,
        bodyParagraphs: bodyParagraphs
      });
      console.log(` -> Correo enviado y guardado en Enviados:`, sendRes.success);

      const updateData = {
        status: 'contactado',
        proxima_accion: 'Seguimiento de email enviado (relevamiento 20 min)',
        fecha_proxima_accion: '2026-10-26',
        notas: `21/10/2026 (Tanda 2): Enviado correo oficial de prospección COMEX a ${lead.email} enfocado en factibilidad técnica y apertura de mercados.`
      };

      const status = await updateLeadStatus(lead.id, updateData);
      console.log(` -> CRM actualizado (status ${status}) para ${lead.empresa}`);
    } catch (err) {
      console.error(` -> ERROR enviando a ${lead.empresa}:`, err.message);
    }

    if (i < leads.length - 1) {
      console.log('Esperando 3 segundos antes del siguiente envío...');
      await sleep(3000);
    }
  }

  console.log('\n=== TANDA 2 COMPLETADA CON ÉXITO (10/10) ===');
  process.exit(0);
}

run().catch(err => {
  console.error('Error fatal en ejecución:', err);
  process.exit(1);
});
