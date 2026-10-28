const { sendEmail } = require('./send_email.js');
const https = require('https');
const fs = require('fs');

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

function updateLead(empresaMatch, newEmail, notes) {
  return new Promise((resolve, reject) => {
    const url = `https://wbcfmanuhotyevquiaht.supabase.co/rest/v1/leads_nexum?empresa=ilike.*${encodeURIComponent(empresaMatch)}*`;
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
    req.write(JSON.stringify({
      email: newEmail,
      status: 'contactado',
      proxima_accion: 'Seguimiento multicanal por WhatsApp/Llamada (Día 3 a 5)',
      fecha_proxima_accion: '2026-11-03',
      notas: notes
    }));
    req.end();
  });
}

async function run() {
  console.log('=== REENVIANDO MAILS CORREGIDOS (SEMANA 2) ===');

  // 1. Snat / Pomona Foods (Mateo de la Rúa)
  const snatSubject = `Nexum Trade Consulting / Expansión internacional y COMEX para Snat Snacks / Pomona Foods`;
  const snatBody = [
    `Estimado Mateo y equipo de Snat Snacks / Pomona Foods, Dirección Comercial:`,
    `Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora especializada en comercio exterior y gestión técnica para empresas y fabricantes argentinos.`,
    `Me pongo en contacto con ustedes porque seguimos de cerca la trayectoria e innovación de sus líneas de <strong>frutas y vegetales liofilizados 100% naturales</strong>. Nuestro objetivo es acompañar a empresas nacionales a abrir y consolidar nuevos mercados externos según su factibilidad técnica, resolviendo los puntos críticos del sector: clasificación arancelaria NCM de alimentos deshidratados, certificaciones sanitarias y apertura de canales retail saludables en el exterior.`,
    `Me gustaría proponerles una breve charla de 15 a 20 minutos (ya sea por llamada telefónica, videollamada o incluso intercambiando unas breves preguntas por este medio) para hacer un diagnóstico inicial sin compromiso y ver si podemos colaborar con ustedes.`,
    `Quedo a disposición por si les interesa coordinar o si consideran oportuno que hablemos más adelante.`
  ];

  console.log('Enviando a Snat / Pomona Foods (info@pomonafoods.com.ar)...');
  try {
    const resSnat = await sendEmail({
      to: 'info@pomonafoods.com.ar',
      subject: snatSubject,
      bodyParagraphs: snatBody
    });
    console.log(' -> Snat reenviado con éxito:', resSnat.success);
    await updateLead('Snat', 'info@pomonafoods.com.ar', '28/10/2026: Reenviado con éxito a casilla corporativa activa de la planta fabricante info@pomonafoods.com.ar (Pomona Foods / Mateo de la Rúa).');
  } catch (err) {
    console.error(' -> Error Snat:', err.message);
  }

  await sleep(3000);

  // 2. Cuchillería Argo (Tandil)
  const argoSubject = `Nexum Trade Consulting / Expansión internacional y COMEX para Cuchillería Argo`;
  const argoBody = [
    `Estimado equipo de Cuchillería Argo, Dirección Comercial:`,
    `Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora especializada en comercio exterior y gestión técnica para empresas y talleres artesanales argentinos.`,
    `Me pongo en contacto con ustedes porque seguimos de cerca la trayectoria e innovación de sus líneas de <strong>cuchillería criolla artesanal, hojas de acero seleccionadas y mangos de diseño regional</strong>. Nuestro objetivo es acompañar a empresas nacionales a abrir y consolidar nuevos mercados externos según su factibilidad técnica, resolviendo los puntos críticos del sector: trámites aduaneros de salida para manufacturas artesanales, envíos internacionales por courier/carga aérea y aranceles de importación en destino.`,
    `Me gustaría proponerles una breve charla de 15 a 20 minutos (ya sea por llamada telefónica, videollamada o incluso intercambiando unas breves preguntas por este medio) para hacer un diagnóstico inicial sin compromiso y ver si podemos colaborar con ustedes.`,
    `Quedo a disposición por si les interesa coordinar o si consideran oportuno que hablemos más adelante.`
  ];

  console.log('Enviando a Cuchillería Argo (ventas@cuchillosargo.com.ar)...');
  try {
    const resArgo = await sendEmail({
      to: 'ventas@cuchillosargo.com.ar',
      subject: argoSubject,
      bodyParagraphs: argoBody
    });
    console.log(' -> Argo reenviado con éxito:', resArgo.success);
    await updateLead('Argo', 'ventas@cuchillosargo.com.ar', '28/10/2026: Reenviado con éxito a casilla de ventas activa de fábrica ventas@cuchillosargo.com.ar.');
  } catch (err) {
    console.error(' -> Error Argo:', err.message);
  }

  console.log('=== REENVÍO COMPLETADO ===');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
