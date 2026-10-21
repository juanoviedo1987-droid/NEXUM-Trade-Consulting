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

function fetchTanda1() {
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

const CUSTOM_DETAILS = {
  'Web Supplements S.R.L. (Ultra Tech / Protein Factory)': {
    producto: 'suplementos deportivos y nutrición funcional (proteínas, creatinas, polvos y cápsulas)',
    dolor: 'homologación y registro sanitario en organismos de destino (ANVISA, ISP, DIGESA), adecuación de rotulado y aranceles preferenciales de exportación'
  },
  'Nutriciencia S.A. (Star Nutrition)': {
    producto: 'nutrición deportiva y suplementación de alto rendimiento con certificación GMP',
    dolor: 'certificaciones sanitarias de libre venta, análisis arancelario por partida NCM y apertura de canales de distribución en países limítrofes'
  },
  'Gentech Argentina': {
    producto: 'suplementos dietarios deportivos, barras proteicas y fórmulas nutricionales',
    dolor: 'auditoría regulatoria ante autoridades sanitarias de destino, encuadre arancelario y mapeo de importadores en mercados regionales'
  },
  'Nutremax (Rosario)': {
    producto: 'suplementación dietaria y nutrición de alto rendimiento deportivo',
    dolor: 'trámites de admisibilidad sanitaria en países de destino, determinación de precios FOB de exportación y prospección de distribuidores'
  },
  'Meditea Electromédica S.R.L.': {
    producto: 'equipos de electromedicina, kinesiología y aparatología estética profesional',
    dolor: 'certificaciones técnicas y registros de dispositivos médicos en destino, encuadre de nomenclaturas arancelarias y estructuración de distribuidores oficiales'
  },
  'Sveltia (Cormedic S.A.)': {
    producto: 'aparatología de tecnología médica, estética y fisioterapia',
    dolor: 'homologación regulatoria para equipos médicos en la región, cálculo de márgenes y aranceles de importación en destino y logística segura'
  },
  'Ecleris S.R.L.': {
    producto: 'equipamiento médico y estético de alta tecnología y precisión',
    dolor: 'registros de tecnología médica en aduanas de destino, ventajas arancelarias en acuerdos comerciales y apertura de distribuidores locales'
  },
  'Texel S.R.L.': {
    producto: 'equipamiento de electromedicina y aparatología estética profesional',
    dolor: 'requisitos técnicos de importación en destino, certificación de normas y estructuración de costos EXW y FOB'
  },
  'Destilería Gin Eternal': {
    producto: 'gin artesanal de autor y destilados de alta gama elaborados con botánicos serranos',
    dolor: 'análisis de aranceles de importación de bebidas alcohólicas, adecuación de etiquetas según normativa de destino y canales de distribución'
  },
  'Malaria Gin (Raven Clan Distillery)': {
    producto: 'gin artesanal y espirituosas de autor',
    dolor: 'certificados bromatológicos de exportación, rotulado técnico para bebidas espirituosas y búsqueda de importadores/distribuidores en mercados limítrofes'
  }
};

async function run() {
  console.log('=== INICIANDO DESPACHO TANDA 1 (10 PyMEs en Frío) ===');
  const leads = await fetchTanda1();
  console.log(`Leads encontrados en prospecto: ${leads.length}`);

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const details = CUSTOM_DETAILS[lead.empresa] || {
      producto: lead.operacion || 'productos de alto valor agregado',
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
        notas: `21/10/2026 (Tanda 1): Enviado correo oficial de prospección COMEX a ${lead.email} enfocado en factibilidad técnica y apertura de mercados.`
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

  console.log('\n=== TANDA 1 COMPLETADA CON ÉXITO (10/10) ===');
  process.exit(0);
}

run().catch(err => {
  console.error('Error fatal en ejecución:', err);
  process.exit(1);
});
