const imaps = require('imap-simple');
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

const config = {
  imap: {
    user: env.NEXUM_EMAIL_USER,
    password: env.NEXUM_EMAIL_PASS,
    host: 'imap.hostinger.com',
    port: 993,
    tls: true,
    authTimeout: 10000
  }
};

async function run() {
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');

  const searchCriteria = [['SINCE', '21-Oct-2026']];
  const fetchOptions = {
    bodies: ['HEADER', 'TEXT'],
    markSeen: false
  };

  const messages = await connection.search(searchCriteria, fetchOptions);
  console.log(`Mensajes encontrados hoy (21-Oct): ${messages.length}`);

  for (const item of messages) {
    const header = item.parts.find(part => part.which === 'HEADER');
    const from = header.body.from ? header.body.from[0] : '';
    const subject = header.body.subject ? header.body.subject[0] : '';
    const date = header.body.date ? header.body.date[0] : '';
    
    const textPart = item.parts.find(part => part.which === 'TEXT');
    const body = textPart && textPart.body ? textPart.body : '';

    console.log('==================================================');
    console.log(`FECHA: ${date}`);
    console.log(`DE: ${from}`);
    console.log(`ASUNTO: ${subject}`);
    
    // Buscar patrones de destinatario y error
    const rcptMatch = body.match(/<([^>]+@[^>]+)>:?\s*(.*)/i) || body.match(/Final-Recipient:[^;]+;\s*([^\s\r\n]+)/i);
    const errMatch = body.match(/said:\s*(\d{3}\s+[\s\S]*?\n)/i) || body.match(/Diagnostic-Code:[^;]+;\s*(.*)/i);

    console.log('DESTINATARIO DETECTADO:', rcptMatch ? rcptMatch[1] : 'No detectado por regex');
    if (errMatch) console.log('ERROR:', errMatch[1].trim());

    // Imprimir un fragmento más grande del cuerpo
    console.log('EXTRACTO DEL REPORTE:');
    const lines = body.split('\n').filter(l => l.trim().length > 0).slice(0, 15);
    console.log(lines.join('\n'));
  }

  connection.end();
}

run().catch(console.error);
