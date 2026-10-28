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

function fetchLeadsSemana2() {
  return new Promise((resolve, reject) => {
    const url = 'https://wbcfmanuhotyevquiaht.supabase.co/rest/v1/leads_nexum?origen=eq.crm_outbound_semana2&status=in.(nuevo,notificado)&order=created_at.asc';
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

const CUSTOM_DETAILS_SEMANA2 = {
  'Milagros del Cielo (Mar del Plata)': {
    producto: 'alfajores artesanales de autor galardonados y chocolatería fina',
    dolor: 'habilitaciones bromatológicas de exportación láctea/dulces, rotulado nutricional en destino (Uruguay/Chile) y armado de pedidos en pallets'
  },
  'Fuegos JL (Asadores de Diseño)': {
    producto: 'fogoneros, asadores criollos y parrillas de diseño de alta gama',
    dolor: 'encuadre arancelario NCM de manufacturas metálicas bajo acuerdos ACE Mercosur, cubicaje para exportación y logística de salida regional'
  },
  'Zafrán (Recetas Honestas)': {
    producto: 'snacks saludables, galletitas integrales y barras de frutos secos orgánicas certificadas',
    dolor: 'certificaciones de libre venta, requisitos bromatológicos en canales saludables de Chile y Uruguay, y adecuación de sellos frontales'
  },
  'Pampa Gourmet (Argentina Speciality S.R.L.)': {
    producto: 'salsas criollas, chimichurri artesanal, barbacoas y aderezos gourmet en frasco',
    dolor: 'normativas y tolerancias bromatológicas de ingreso regional, certificación de origen para arancel 0% Mercosur y búsqueda de distribuidores del canal delicatessen'
  },
  'Las Quinas (AGLH S.A.)': {
    producto: 'dulce de leche artesanal sin azúcar, miel pura orgánica y mermeladas Empresa B',
    dolor: 'certificación SENASA de establecimientos lácteos para exportación, homologación de registros orgánicos en destino y regularidad de envíos'
  },
  'Snat Snacks (Liofilizados)': {
    producto: 'frutas y vegetales liofilizados 100% naturales libres de gluten',
    dolor: 'clasificación arancelaria NCM de alimentos deshidratados, certificaciones sanitarias y apertura de canales retail saludables en el exterior'
  },
  'Cuchillería Argo (Tandil)': {
    producto: 'cuchillería criolla artesanal, hojas de acero seleccionadas y mangos de diseño regional',
    dolor: 'trámites aduaneros de salida para manufacturas artesanales, envíos internacionales por courier/carga aérea y aranceles de importación en destino'
  },
  'Arytza (Arytza S.R.L.)': {
    producto: 'mostazas artesanales tipo Dijon/antigua, salsas y aderezos 100% naturales sin TACC',
    dolor: 'homologación de sellos sin gluten y rotulado bromatológico regional, aranceles preferenciales Mercosur y canales gourmet en el exterior'
  },
  'Fuego Tostadores de Café': {
    producto: 'café de especialidad tostado en origen y micro-lotes en empaques trilaminados con válvula',
    dolor: 'trazabilidad aduanera de café tostado, requisitos fitosanitarios de re-exportación regional y logística para cafeterías de especialidad'
  },
  'Destilería La Alazana (Lago Puelo)': {
    producto: 'whisky Single Malt patagónico de autor destilado en alambique de cobre y premiado internacionalmente',
    dolor: 'análisis impositivo y arancelario de bebidas espirituosas en destino, adecuación de fajas y contraetiquetas, y canales de licorerías de lujo/duty free'
  }
};

async function run() {
  console.log('=== INICIANDO DESPACHO SEMANA 2 (10 PyMEs Boutique - Outreach Inicial) ===');
  const leads = await fetchLeadsSemana2();
  console.log(`Leads encontrados en estado nuevo: ${leads.length}`);

  if (leads.length === 0) {
    console.log('No hay leads pendientes de envío.');
    process.exit(0);
  }

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const details = CUSTOM_DETAILS_SEMANA2[lead.empresa] || {
      producto: lead.operacion || 'productos con alto valor agregado',
      dolor: 'auditoría regulatoria, aranceles, rotulado y canales de distribución'
    };

    const subject = `Nexum Trade Consulting / Expansión internacional y COMEX para ${lead.empresa}`;
    const bodyParagraphs = [
      `Estimado equipo de ${lead.empresa}, Dirección Comercial o Nuevos Proyectos:`,
      `Mi nombre es Juan Oviedo, socio de <strong>Nexum Trade Consulting</strong>. Somos una consultora especializada en comercio exterior y gestión técnica para empresas y fabricantes argentinos.`,
      `Me pongo en contacto con ustedes porque seguimos de cerca la trayectoria e innovación de sus líneas de <strong>${details.producto}</strong>. Nuestro objetivo es acompañar a empresas nacionales a abrir y consolidar nuevos mercados externos según su factibilidad técnica, resolviendo los puntos críticos del sector: ${details.dolor}.`,
      `Me gustaría proponerles una breve charla de 15 a 20 minutos (ya sea por llamada telefónica, videollamada o incluso intercambiando unas breves preguntas por este medio) para hacer un diagnóstico inicial sin compromiso y ver si podemos colaborar con ustedes.`,
      `Quedo a disposición por si les interesa coordinar o si consideran oportuno que hablemos más adelante.`
    ];

    console.log(`\n[${i+1}/${leads.length}] Enviando a: ${lead.empresa} (${lead.email})...`);
    try {
      const sendRes = await sendEmail({
        to: lead.email,
        subject: subject,
        bodyParagraphs: bodyParagraphs
      });
      console.log(` -> Correo enviado y guardado en Enviados:`, sendRes.success);

      const updateData = {
        status: 'contactado',
        proxima_accion: 'Seguimiento multicanal por WhatsApp/Llamada (Día 3 a 5)',
        fecha_proxima_accion: '2026-11-03',
        notas: `28/10/2026 (Semana 2): Enviado correo formal inicial de presentación COMEX a ${lead.email} enfocado en factibilidad técnica y diagnóstico inicial sin compromiso. Próximo paso: seguimiento directo por WhatsApp.`
      };

      const status = await updateLeadStatus(lead.id, updateData);
      console.log(` -> CRM actualizado (status ${status}) para ${lead.empresa}`);
    } catch (err) {
      console.error(` -> ERROR enviando a ${lead.empresa}:`, err.message);
    }

    if (i < leads.length - 1) {
      console.log('Esperando 3 segundos antes del siguiente envío para proteger entregabilidad...');
      await sleep(3000);
    }
  }

  console.log('\n=== DESPACHO SEMANA 2 COMPLETADO CON ÉXITO ===');
  process.exit(0);
}

run().catch(err => {
  console.error('Error fatal en ejecución:', err);
  process.exit(1);
});
