const fs = require('fs');

let html = fs.readFileSync('procedimientos.html', 'utf-8');

const startTag = '<section id="sec-icp"';
const startIdx = html.indexOf(startTag);
if (startIdx === -1) {
  console.error('startTag not found');
  process.exit(1);
}

const endTag = '</section>';
const endIdx = html.indexOf(endTag, startIdx) + endTag.length;

const newSecContent = `<section id="sec-icp" class="content-section hidden space-y-6">
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <i data-lucide="target" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-1">
                  Regla Operativa #8 (Filtro Maestro)
                </span>
                <h2 class="font-heading font-bold text-lg text-slate-900">Perfil de Cliente Ideal (ICP) & Filtro Maestro de Prospección</h2>
                <p class="text-xs text-slate-500">Criterio unificado para seleccionar prospectos con alta receptividad, sin trabas internas y con capacidad de pago.</p>
              </div>
            </div>

            <!-- Principio de Oro / Filtro Maestro -->
            <div class="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 mb-6 text-xs text-emerald-950 leading-relaxed shadow-2xs">
              <div class="flex items-start gap-2.5">
                <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
                <div>
                  <strong class="font-bold text-emerald-950 block text-xs sm:text-sm mb-1">El Filtro Maestro: "No tener departamento de Comercio Exterior ya es motivo para contactar"</strong>
                  <p>Si la empresa fabrica un producto terminado de calidad con marca propia y <strong>NO cuenta con un área o analista interno de Comercio Exterior, califica automáticamente como prospecto ideal</strong>. Esto garantiza dos ventajas: no hay "fuego amigo" interno que bloquee la propuesta, y para el dueño Nexum representa una solución llave en mano inmediata sin asumir el costo fijo mensual de un empleado propio ($1.8M+).</p>
                </div>
              </div>
            </div>

            <!-- Los Pilares del Perfil de Prospecto -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6 text-xs">
              
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">1</span>
                  <span>Cero Departamento de COMEX Interno</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  No cuentan con analista de comercio exterior ni estructura dedicada a exportar. Pueden no haber exportado nunca o haberlo hecho de forma esporádica / reactiva por un pedido puntual que les llegó desde el exterior.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">2</span>
                  <span>Dotación Flexible (10 a 80+ Empleados)</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  No nos limita la cantidad de operarios en planta. Una fábrica o taller con 40, 60 u 80 personas en producción y apenas 3 o 4 en administración es un cliente perfecto: tiene escala de producción y excelente capacidad financiera.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">3</span>
                  <span>Producto Terminado con Marca Propia</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  <strong>Nunca materias primas a granel.</strong> Producto con packaging comercial listo para góndola o uso final, con habilitaciones nacionales básicas (RPE/RNPA, ANMAT o IRAM/ISO) y validación en el mercado argentino.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">4</span>
                  <span>Decisor Directo Accesible</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  El Fundador, Dueño, Socio Gerente o Director Comercial toma las decisiones y está a una llamada, WhatsApp comercial o mensaje directo de LinkedIn de distancia, sin conmutadores corporativos complejos.
                </p>
              </div>

            </div>

            <!-- Tabla Comparativa: A Quién Buscar vs A Quién Descartar -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 mb-6 text-xs">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-heading">
                    <th class="p-3 w-1/2 text-emerald-800 bg-emerald-50/60">
                      <span class="flex items-center gap-1.5 font-bold">
                        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                        PROSPECTO IDEAL NEXUM (APROBADO)
                      </span>
                    </th>
                    <th class="p-3 w-1/2 text-rose-800 bg-rose-50/60">
                      <span class="flex items-center gap-1.5 font-bold">
                        <i data-lucide="x-circle" class="w-4 h-4 text-rose-600"></i>
                        DESCARTAR INMEDIATAMENTE
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td class="p-3 bg-emerald-50/20">Fábrica o empresa de 10 a 80 personas <strong>sin área de Comercio Exterior</strong>.</td>
                    <td class="p-3 bg-rose-50/20">Empresa con Gerente o Jefe de Comercio Exterior / Exportaciones interno.</td>
                  </tr>
                  <tr>
                    <td class="p-3 bg-emerald-50/20">El dueño o socio no tiene claro cómo costear un FOB o habilitar en Uruguay/Chile.</td>
                    <td class="p-3 bg-rose-50/20">Empresa que ya exporta contenedores mensuales de forma estandarizada.</td>
                  </tr>
                  <tr>
                    <td class="p-3 bg-emerald-50/20">Teléfono o WhatsApp de atención atendido por el dueño o ventas directas.</td>
                    <td class="p-3 bg-rose-50/20">Conmutador corporativo con menú interactivo o casillas robot inaccesibles.</td>
                  </tr>
                  <tr>
                    <td class="p-3 bg-emerald-50/20">Producto de alto valor agregado con packaging y marca propia.</td>
                    <td class="p-3 bg-rose-50/20">Commodities a granel, granos o productos sin marca diferenciada.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Cadencia de Contacto Multicanal Oficial -->
            <div class="border border-brand-200 bg-brand-50/40 rounded-xl p-4 text-xs">
              <div class="flex items-center gap-2 mb-3">
                <i data-lucide="calendar" class="w-4 h-4 text-brand-600"></i>
                <h4 class="font-bold text-slate-900 text-xs sm:text-sm">Cadencia Oficial de Contacto (Paso a Paso)</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3 bg-white rounded-lg border border-brand-100 shadow-2xs">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-brand-700">Paso 1 (Día 1): Email Institucional</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-semibold">Plantar Bandera</span>
                  </div>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    Se envía un correo formal y pulcro desde la casilla corporativa con firma oficial y link a la web de Nexum. Deja constancia de profesionalismo y seriedad corporativa.
                  </p>
                </div>
                <div class="p-3 bg-white rounded-lg border border-brand-100 shadow-2xs">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-emerald-700">Paso 2 (Día 3 a 5): WhatsApp / Llamada</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Cierre de Reunión</span>
                  </div>
                  <p class="text-slate-600 text-[11px] leading-relaxed">
                    Contacto directo al celular/WhatsApp comercial: <em>"Hola [Nombre], te escribí hace unos días un correo desde Nexum sobre [su producto]. Te contacto directo para ver si le pudiste dar una mirada..."</em>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>`;

html = html.substring(0, startIdx) + newSecContent + html.substring(endIdx);
fs.writeFileSync('procedimientos.html', html, 'utf-8');
console.log('SUCCESS: procedimientos.html updated with master criterion!');
