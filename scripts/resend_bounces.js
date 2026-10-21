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

function updateLead(matchFilter, updateData) {
  return new Promise((resolve, reject) => {
    const url = `https://wbcfmanuhotyevquiaht.supabase.co/rest/v1/leads_nexum?${matchFilter}`;
    const req = https.request(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }, res => resolve(res.statusCode));
    req.on('error', reject);
    req.write(JSON.stringify(updateData));
    req.end();
  });
}

async function run() {
  console.log('=== INICIANDO REENVÍOS CORREGIDOS ===\n');

  // 1. DAMERO GIN
  console.log('1. Reenviando a Damero Gin (Damero2023@gmail.com)...');
  const dameroBody = [
    'Estimado equipo de Damero Gin, Dirección Comercial o Nuevos Proyectos:',
    'Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora especializada en comercio exterior y gestión técnica para empresas y laboratorios argentinos.',
    'Me pongo en contacto con ustedes porque seguimos de cerca la trayectoria e innovación de sus líneas de <strong>gin artesanal de autor y bebidas destiladas</strong>. Nuestro objetivo es acompañar a empresas nacionales a abrir y consolidar nuevos mercados externos según su factibilidad técnica, resolviendo los puntos críticos del sector: trámites de exportación de bebidas espirituosas, adecuación de packaging y contraetiquetas, y mapeo de importadores en mercados limítrofes.',
    'Me gustaría proponerles una breve charla de 15 a 20 minutos (ya sea por llamada telefónica, videollamada o incluso intercambiando unas breves preguntas por este medio) para hacer un diagnóstico inicial y ver si podemos colaborar con ustedes.',
    'Quedo a disposición por si les interesa coordinar o si consideran oportuno que hablemos más adelante.'
  ];

  try {
    const res1 = await sendEmail({
      to: 'Damero2023@gmail.com',
      subject: 'Nexum Trade Consulting / Expansión internacional y COMEX para Damero Gin',
      bodyParagraphs: dameroBody
    });
    console.log(' -> Correo enviado a Damero Gin:', res1.success);

    await updateLead('empresa=ilike.*Damero*', {
      email: 'Damero2023@gmail.com',
      status: 'contactado',
      proxima_accion: 'Seguimiento de email enviado (relevamiento 20 min)',
      fecha_proxima_accion: '2026-10-26',
      notas: '21/10/2026: Reenviado a correo verificado Damero2023@gmail.com tras corrección de dominio damerogin.com.ar.'
    });
    console.log(' -> CRM actualizado para Damero Gin');
  } catch (err) {
    console.error('Error Damero Gin:', err.message);
  }

  await sleep(3000);

  // 2. CERA (CÁMARA DE EXPORTADORES)
  console.log('\n2. Reenviando a CERA (contacto@cera.org.ar)...');
  const ceraBody = [
    'Estimadas autoridades y equipo de CERA (Cámara de Exportadores de la República Argentina):',
    'Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora técnica especializada en formulación de proyectos, auditoría regulatoria y apertura de mercados externos para empresas exportadoras y PyMEs nacionales.',
    'Nos ponemos en contacto con la Cámara porque seguimos de cerca su liderazgo histórico en la defensa, facilitación y fomento del comercio exterior argentino. Sabemos que muchas empresas asociadas cuentan con productos de gran calidad y competitividad, pero suelen requerir diagnósticos específicos en barreras arancelarias de destino, homologación técnica o estructuración de precios FOB.',
    'Nuestro interés es presentarnos formalmente y ponernos a disposición de la entidad para colaborar como facilitador técnico y soporte analítico en comercio exterior para aquellas firmas asociadas que requieran estudios de factibilidad o asesoría integral.',
    'Nos gustaría proponerles una breve charla de 15 minutos (por llamada telefónica, videollamada o intercambiando consultas por este medio) de presentación institucional para explorar puntos de sinergia y colaboración.',
    'Quedamos a su entera disposición y les enviamos un cordial saludo.'
  ];

  try {
    const res2 = await sendEmail({
      to: 'contacto@cera.org.ar',
      subject: 'Nexum Trade Consulting / Vinculación técnica y apoyo en Comercio Exterior para socios de CERA',
      bodyParagraphs: ceraBody
    });
    console.log(' -> Correo enviado a CERA:', res2.success);

    await updateLead('empresa=ilike.*CERA*', {
      email: 'contacto@cera.org.ar',
      status: 'contactado',
      proxima_accion: 'Seguimiento institucional de articulación técnica',
      fecha_proxima_accion: '2026-10-26',
      notas: '21/10/2026: Reenviado a casilla oficial verificada contacto@cera.org.ar tras corrección de dominio cera.org.ar.'
    });
    console.log(' -> CRM actualizado para CERA');
  } catch (err) {
    console.error('Error CERA:', err.message);
  }

  // 3. PRODUCTOS L.E.Q. (Actualizar nota para canal WhatsApp)
  console.log('\n3. Actualizando registro de Productos L.E.Q. para contacto por WhatsApp...');
  try {
    await updateLead('empresa=ilike.*Productos L.E.Q*', {
      proxima_accion: 'Contacto comercial por WhatsApp (+54 11 5429-4002)',
      fecha_proxima_accion: '2026-10-26',
      notas: '21/10/2026: Casilla acliente@productosleqsa.com.ar inactiva en su servidor. Se agenda contacto directo por WhatsApp comercial (+54 11 5429-4002) para el seguimiento del lunes.'
    });
    console.log(' -> CRM actualizado para Productos L.E.Q.');
  } catch (err) {
    console.error('Error Productos L.E.Q.:', err.message);
  }

  console.log('\n=== REENVÍOS COMPLETADOS CON ÉXITO ===');
  process.exit(0);
}

run().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
