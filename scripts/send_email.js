/**
 * Helper de Despacho Oficial - Nexum Trade Consulting
 * 1. Envía el correo por SMTP autenticado desde juan.oviedo@nexumtc.com.ar
 * 2. Guarda automáticamente una copia en la carpeta "Enviados" (INBOX.Sent) por IMAP
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

const OFFICIAL_SIGNATURE_HTML = `
<br><br>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #334155; margin-top: 15px;">
  <tr>
    <td style="vertical-align: top; padding-right: 14px; border-right: 2px solid #0074A1;">
      <img src="https://nexumtradeconsulting.com.ar/assets/logo-3.png" alt="Nexum" width="55" height="55" style="display: block;">
    </td>
    <td style="vertical-align: top; padding-left: 14px; line-height: 1.4;">
      <strong style="color: #0f172a; font-size: 14px;">Juan Manuel Oviedo</strong><br>
      <span style="color: #0074A1; font-size: 11px; font-weight: bold; text-transform: uppercase;">Co-Fundador &bull; Nexum Trade Consulting</span><br>
      <span style="font-size: 11px; color: #64748b;">Consultoría Estratégica en Comercio Exterior para PyMEs</span><br>
      <span style="font-size: 11px; color: #475569;">📱 +54 9 11 7237-6197 &bull; 🌐 <a href="https://nexumtradeconsulting.com.ar" style="color: #0074A1; text-decoration: none;">nexumtradeconsulting.com.ar</a></span>
    </td>
  </tr>
</table>
`;

const OFFICIAL_SIGNATURE_TEXT = `
--
Juan Manuel Oviedo
Co-Fundador | Nexum Trade Consulting
Consultoría Estratégica en Comercio Exterior para PyMEs
Tel: +54 9 11 7237-6197
Web: https://nexumtradeconsulting.com.ar
`;

function buildMimeMessage({ user, to, subject, bodyParagraphs }) {
  const textBody = bodyParagraphs.join('\n\n') + '\n' + OFFICIAL_SIGNATURE_TEXT;
  const htmlBody = `
  <div style="font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; line-height: 1.6;">
    ${bodyParagraphs.map(p => `<p style="margin: 0 0 14px 0;">${p}</p>`).join('')}
    ${OFFICIAL_SIGNATURE_HTML}
  </div>
  `;

  const dateHeader = new Date().toUTCString();
  const boundary = 'nexum_' + Date.now();
  
  let message = `From: "Juan Manuel Oviedo - Nexum Trade Consulting" <${user}>\r\n`;
  message += `To: <${to}>\r\n`;
  message += `Subject: ${subject}\r\n`;
  message += `Date: ${dateHeader}\r\n`;
  message += `MIME-Version: 1.0\r\n`;
  message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

  message += `--${boundary}\r\n`;
  message += `Content-Type: text/plain; charset=UTF-8\r\n`;
  message += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
  message += textBody + `\r\n\r\n`;

  message += `--${boundary}\r\n`;
  message += `Content-Type: text/html; charset=UTF-8\r\n`;
  message += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
  message += htmlBody + `\r\n\r\n`;

  message += `--${boundary}--\r\n`;

  return message;
}

function sendSmtp({ user, pass, host, port, to, rawMessage }) {
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
        socket.write(rawMessage + '\r\n.\r\n');
      } else if (resp.startsWith('250') && step === 'SENDING') {
        step = 'DONE';
        socket.write('QUIT\r\n');
        resolve({ success: true, to });
      } else if (resp.startsWith('5') || resp.startsWith('4')) {
        reject(new Error(`SMTP Error [${step}]: ${resp.trim()}`));
        socket.end();
      }
    });

    socket.on('error', err => reject(err));
  });
}

function saveToSentImap({ user, pass, rawMessage }) {
  return new Promise((resolve) => {
    const socket = tls.connect(993, 'imap.hostinger.com', () => {});
    const msgBuffer = Buffer.from(rawMessage, 'utf8');
    const msgLen = msgBuffer.length;
    let step = 'INIT';

    socket.on('data', data => {
      const resp = data.toString();

      if (resp.includes('* OK') && step === 'INIT') {
        step = 'LOGIN';
        socket.write(`a1 LOGIN ${user} ${pass}\r\n`);
      } else if (resp.includes('a1 OK') && step === 'LOGIN') {
        step = 'APPEND';
        socket.write(`a2 APPEND "INBOX.Sent" (\\Seen) {${msgLen}}\r\n`);
      } else if (resp.startsWith('+') && step === 'APPEND') {
        step = 'SEND_BODY';
        socket.write(msgBuffer);
        socket.write('\r\n');
      } else if (resp.includes('a2 OK') && step === 'SEND_BODY') {
        step = 'DONE';
        socket.write('a3 LOGOUT\r\n');
        resolve(true);
      } else if (resp.includes('NO') || resp.includes('BAD')) {
        console.warn('IMAP Append Warning:', resp.trim());
        socket.end();
        resolve(false);
      }
    });

    socket.on('error', () => resolve(false));
  });
}

async function sendEmail({ to, subject, bodyParagraphs }) {
  const env = loadEnv();
  const user = env.NEXUM_EMAIL_USER || 'juan.oviedo@nexumtc.com.ar';
  const pass = env.NEXUM_EMAIL_PASS;
  const host = env.NEXUM_SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(env.NEXUM_SMTP_PORT || '465', 10);

  if (!pass) throw new Error('No se encontró NEXUM_EMAIL_PASS en stack.env');

  const rawMessage = buildMimeMessage({ user, to, subject, bodyParagraphs });

  // 1. Enviar por SMTP a destino
  const smtpRes = await sendSmtp({ user, pass, host, port, to, rawMessage });

  // 2. Guardar copia en la carpeta Enviados (INBOX.Sent) para verlo en Hostinger Webmail
  try {
    await saveToSentImap({ user, pass, rawMessage });
  } catch(e) {
    // Si falla el guardado local, el mail ya se envió igual
  }

  return smtpRes;
}

module.exports = { sendEmail, OFFICIAL_SIGNATURE_HTML, OFFICIAL_SIGNATURE_TEXT };
