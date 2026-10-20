/**
 * Helper de Despacho SMTP Oficial - Nexum Trade Consulting
 * Remitente: juan.oviedo@nexumtc.com.ar
 */
const tls = require('tls');
const fs = require('fs');

function loadEnv() {
  const envPath = 'C:\\Users\\juano\\.secrets\\stack.env';
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  });
  return env;
}

function sendEmail({ to, subject, htmlBody, textBody }) {
  const env = loadEnv();
  const user = env.NEXUM_EMAIL_USER || 'juan.oviedo@nexumtc.com.ar';
  const pass = env.NEXUM_EMAIL_PASS;
  const host = env.NEXUM_SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(env.NEXUM_SMTP_PORT || '465', 10);

  if (!pass) throw new Error('No se encontró NEXUM_EMAIL_PASS en stack.env');

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, () => {});
    let step = 'INIT';

    socket.on('data', data => {
      const resp = data.toString();

      if (resp.startsWith('220') && step === 'INIT') {
        step = 'EHLO';
        socket.write('EHLO localhost\r\n');
      } else if (resp.startsWith('250') && step === 'EHLO') {
        step = 'AUTH';
        socket.write('AUTH LOGIN\r\n');
      } else if (resp.startsWith('334') && step === 'AUTH') {
        step = 'USER';
        socket.write(Buffer.from(user).toString('base64') + '\r\n');
      } else if (resp.startsWith('334') && step === 'USER') {
        step = 'PASS';
        socket.write(Buffer.from(pass).toString('base64') + '\r\n');
      } else if (resp.startsWith('235') && step === 'PASS') {
        step = 'FROM';
        socket.write(`MAIL FROM:<${user}>\r\n`);
      } else if (resp.startsWith('250') && step === 'FROM') {
        step = 'TO';
        socket.write(`RCPT TO:<${to}>\r\n`);
      } else if (resp.startsWith('250') && step === 'TO') {
        step = 'DATA';
        socket.write('DATA\r\n');
      } else if (resp.startsWith('354') && step === 'DATA') {
        step = 'SENDING';
        const dateHeader = new Date().toUTCString();
        const boundary = 'nexum_boundary_' + Date.now();
        
        let message = `From: "Juan Manuel Oviedo - Nexum Trade Consulting" <${user}>\r\n`;
        message += `To: <${to}>\r\n`;
        message += `Subject: ${subject}\r\n`;
        message += `Date: ${dateHeader}\r\n`;
        message += `MIME-Version: 1.0\r\n`;
        message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

        // Plain text
        message += `--${boundary}\r\n`;
        message += `Content-Type: text/plain; charset=UTF-8\r\n`;
        message += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
        message += (textBody || '') + `\r\n\r\n`;

        // HTML version con firma
        message += `--${boundary}\r\n`;
        message += `Content-Type: text/html; charset=UTF-8\r\n`;
        message += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
        message += (htmlBody || '') + `\r\n\r\n`;

        message += `--${boundary}--\r\n.\r\n`;

        socket.write(message);
      } else if (resp.startsWith('250') && step === 'SENDING') {
        step = 'DONE';
        socket.write('QUIT\r\n');
        resolve({ success: true, to, subject });
      } else if (resp.startsWith('5') || resp.startsWith('4')) {
        reject(new Error(`SMTP Error [${step}]: ${resp.trim()}`));
        socket.end();
      }
    });

    socket.on('error', err => reject(err));
  });
}

// Ejecución vía CLI si se llama directo
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Uso: node send_email.js <to> <subject> <body_file_or_text>');
    process.exit(1);
  }
  const [to, subject, body] = args;
  sendEmail({ to, subject, htmlBody: body, textBody: body })
    .then(r => console.log('Enviado OK:', r))
    .catch(e => { console.error('Fallo:', e); process.exit(1); });
}

module.exports = { sendEmail };
