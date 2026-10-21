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

async function checkFolder(connection, folderName) {
  console.log(`\n--- REVISANDO CARPETA: ${folderName} ---`);
  try {
    await connection.openBox(folderName);
  } catch (err) {
    console.log(`No se pudo abrir ${folderName}: ${err.message}`);
    return;
  }

  // Buscar mensajes desde el 20 de octubre
  const searchCriteria = [['SINCE', '20-Oct-2026']];
  const fetchOptions = {
    bodies: ['HEADER', 'TEXT'],
    markSeen: false
  };

  const messages = await connection.search(searchCriteria, fetchOptions);
  console.log(`Total mensajes encontrados desde 20-Oct: ${messages.length}`);

  for (const item of messages) {
    const header = item.parts.find(part => part.which === 'HEADER');
    const from = header.body.from ? header.body.from[0] : 'Desconocido';
    const subject = header.body.subject ? header.body.subject[0] : 'Sin Asunto';
    const date = header.body.date ? header.body.date[0] : 'Sin Fecha';
    
    // Obtener un extracto del cuerpo
    const textPart = item.parts.find(part => part.which === 'TEXT');
    let snippet = '';
    if (textPart && textPart.body) {
      snippet = textPart.body.replace(/\r?\n|\r/g, ' ').substring(0, 200);
    }

    console.log(`\n📩 Mensaje:`);
    console.log(`  De: ${from}`);
    console.log(`  Asunto: ${subject}`);
    console.log(`  Fecha: ${date}`);
    console.log(`  Extracto: ${snippet}...`);
  }
}

async function run() {
  try {
    console.log('Conectando a imap.hostinger.com...');
    const connection = await imaps.connect(config);
    console.log('Conectado con éxito.');

    // Ver carpetas disponibles
    const boxes = await connection.getBoxes();
    console.log('Carpetas detectadas:', Object.keys(boxes));

    await checkFolder(connection, 'INBOX');
    
    // Probar posibles nombres de spam
    const spamCandidates = ['INBOX.Junk', 'INBOX.Spam', 'Junk', 'Spam'];
    for (const s of spamCandidates) {
      await checkFolder(connection, s);
    }

    connection.end();
  } catch (err) {
    console.error('Error revisando buzón:', err);
  }
}

run();
