const fs = require('fs');

let html = fs.readFileSync('procedimientos.html', 'utf-8');

const targetStr = '              <!-- Las 5 Preguntas Clave del Relevamiento -->';

const whatsappCard = `              <!-- Estructura Oficial para WhatsApp (Estilo Juan) -->
              <div class="mt-6 border-t border-slate-100 pt-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 mb-3">
                  <div>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                      <i data-lucide="message-circle" class="w-3 h-3"></i>
                      WhatsApp Directo al Decisor (Estilo Juan)
                    </span>
                    <h3 class="font-bold text-xs text-slate-900">Guion Corto para WhatsApp / Mensajería Directa</h3>
                    <p class="text-[11px] text-slate-600">Lenguaje rioplatense natural, simple, sin chamuyo corporativo ni rodeos.</p>
                  </div>
                  <button 
                    onclick="copiarTexto(document.getElementById('whatsappJuanCode').innerText, 'Guion de WhatsApp Juan')" 
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    <span>Copiar Guion</span>
                  </button>
                </div>

                <div class="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed space-y-2 select-all" id="whatsappJuanCode">
                  <p>¡Hola [Nombre]! ¿Cómo estás?</p>
                  <p>Te habla Juan, socio de Nexum.</p>
                  <p>Te escribí hace unos días un correo sobre [su producto]. Me interesa ver si podemos darles una mano para colocar producto afuera o habilitar en [Uruguay / Chile / etc.].</p>
                  <p>Cuando quieras coordinamos una videollamada o hablamos por acá, lo que te sea más cómodo.</p>
                </div>
              </div>

`;

if (!html.includes(targetStr)) {
  console.error('ERROR: targetStr not found in procedimientos.html');
  process.exit(1);
}

html = html.replace(targetStr, whatsappCard + targetStr);
fs.writeFileSync('procedimientos.html', html, 'utf-8');
console.log('SUCCESS: WhatsApp Juan card injected into procedimientos.html');
