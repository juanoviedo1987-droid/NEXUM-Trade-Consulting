const fs = require('fs');

let html = fs.readFileSync('procedimientos.html', 'utf-8');

const navPlantillas = '<button onclick="mostrarSeccion(\'plantillas\')" id="nav-plantillas" class="nav-item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-100 transition active:scale-[0.98]">\r\n          <i data-lucide="send" class="w-4 h-4 text-brand-500 shrink-0"></i>\r\n          <span>Plantillas de Prospección</span>\r\n        </button>';

const navIcp = '\r\n\r\n        <button onclick="mostrarSeccion(\'icp\')" id="nav-icp" class="nav-item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-100 transition active:scale-[0.98]">\r\n          <i data-lucide="target" class="w-4 h-4 text-rose-500 shrink-0"></i>\r\n          <span>Perfil ICP & Criterio PyME</span>\r\n        </button>';

if (!html.includes(navPlantillas)) {
  console.error('ERROR: navPlantillas not found');
  process.exit(1);
}
html = html.replace(navPlantillas, navPlantillas + navIcp);
console.log('Sidebar button added.');

const secPlantillasEnd = '</section>\r\n\r\n      </div>\r\n    </main>';

const secIcpContent = `</section>

        <!-- ================= SECCIÓN: PERFIL ICP & CRITERIO DE PROSPECCIÓN ================= -->
        <section id="sec-icp" class="content-section hidden space-y-6">
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <i data-lucide="target" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-1">
                  Regla Operativa #8 (Filtro Quirúrgico)
                </span>
                <h2 class="font-heading font-bold text-lg text-slate-900">Perfil de Cliente Ideal (ICP) & Filtro Anti-Burocracia</h2>
                <p class="text-xs text-slate-500">Criterios obligatorios para seleccionar prospectos con alta tasa de respuesta y necesidad real de consultoría.</p>
              </div>
            </div>

            <!-- Principio de Oro -->
            <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200 mb-6 text-xs text-amber-900 leading-relaxed">
              <div class="flex items-start gap-2.5">
                <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
                <div>
                  <strong class="font-bold text-amber-950 block text-xs sm:text-sm mb-1">Principio Operativo: ¿Por qué NO prospectamos empresas medianas/grandes?</strong>
                  <p>Una empresa de más de 40 empleados o con departamento propio de Comercio Exterior ya tiene despachante corporativo, acuerdos cerrados o estructuras burocráticas donde los correos en frío se pierden en filtros de recepción. <strong>Nexum está diseñado para la PyME chica de 5 a 30 empleados</strong>, donde el dueño toma las decisiones, no puede pagar un salario fijo de Comex ($1.8M+) y necesita facturar en dólares para sostener su fábrica.</p>
                </div>
              </div>
            </div>

            <!-- Los 5 Filtros Obligatorios (Cards) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6 text-xs">
              
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">1</span>
                  <span>Dotación: 5 a 30 Empleados</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  Fábricas boutique, talleres artesanales o pequeñas plantas industriales. Tienen volumen de producción constante pero estructura administrativa ágil sin mandos medios innecesarios.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">2</span>
                  <span>Producto Terminado con Marca Propia</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  <strong>Nunca materias primas a granel.</strong> Producto con packaging comercial, habilitación bromatológica/industrial (RPE/RNPA o ANMAT) y código de barras listo para góndola o mostrador.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">3</span>
                  <span>Sin Departamento de COMEX Propio</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  No cuentan con analista ni gerencia de exportaciones. Pueden no haber exportado nunca o haberlo hecho de forma esporádica / reactiva por un cliente que vino a buscar producto.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">4</span>
                  <span>Decisor Directo al Teléfono / WhatsApp</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  El Fundador, Dueño o Socio Gerente está en la operación cotidiana y atiende directamente llamadas o mensajes de WhatsApp comercial sin pasar por conmutadores complejos.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition md:col-span-2">
                <div class="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-mono flex items-center justify-center text-xs">5</span>
                  <span>Capacidad de Pago Validada ($500 USD)</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  Venden productos con buen ticket o margen en el mercado local (ej: asadores premium, alfajores de autor, aderezos gourmet, liofilizados, cuchillería fina). El valor del diagnóstico ($500 USD) equivale a 1 o 2 ventas unitarias o a una fracción mínima de su facturación mensual.
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
                    <td class="p-3 bg-emerald-50/20">Fábrica familiar o taller de 10 a 25 personas.</td>
                    <td class="p-3 bg-rose-50/20">Empresa mediana/grande con más de 40-50 empleados.</td>
                  </tr>
                  <tr>
                    <td class="p-3 bg-emerald-50/20">El dueño no sabe cómo costear un FOB o habilitar en Uruguay/Chile.</td>
                    <td class="p-3 bg-rose-50/20">Empresa que ya exporta contenedores mensuales de forma habitual.</td>
                  </tr>
                  <tr>
                    <td class="p-3 bg-emerald-50/20">Teléfono o WhatsApp de atención atendido por el dueño o ventas directas.</td>
                    <td class="p-3 bg-rose-50/20">Conmutador corporativo con menú interactivo o casillas robot.</td>
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
        </section>\r\n\r\n      </div>\r\n    </main>`.replace(/\n/g, '\r\n');

if (!html.includes(secPlantillasEnd)) {
  console.error('ERROR: secPlantillasEnd not found');
  process.exit(1);
}
html = html.replace(secPlantillasEnd, secIcpContent);
console.log('Content section sec-icp added.');

fs.writeFileSync('procedimientos.html', html, 'utf-8');
console.log('SUCCESS: procedimientos.html updated with ICP module!');
