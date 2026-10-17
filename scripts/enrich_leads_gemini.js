const fs = require('fs');
const path = require('path');

// 1. Cargar variables de entorno desde stack.env
function loadEnv() {
    const stackEnvPath = 'C:\\Users\\juano\\.secrets\\stack.env';
    if (!fs.existsSync(stackEnvPath)) {
        throw new Error(`No se encontró el archivo de secretos en ${stackEnvPath}`);
    }
    const content = fs.readFileSync(stackEnvPath, 'utf8');
    const env = {};
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            env[key] = val;
        }
    }
    return env;
}

const env = loadEnv();
const GEMINI_KEYS = [
    { key: env.GEMINI_API_KEY, model: 'gemini-2.5-flash' },
    { key: env.GEMINI_API_KEY_NEXUM, model: 'gemini-3.8-flash' }
].filter(k => Boolean(k.key));

const SUPABASE_URL = env.SUPABASE_NEXUM_URL || 'https://wbcfmanuhotyevquiaht.supabase.co';
const SUPABASE_KEY = env.SUPABASE_NEXUM_SERVICE_ROLE_KEY;

if (GEMINI_KEYS.length === 0) {
    console.error('ERROR: Falta GEMINI_API_KEY en stack.env');
    process.exit(1);
}
if (!SUPABASE_KEY) {
    console.error('ERROR: Falta SUPABASE_NEXUM_SERVICE_ROLE_KEY en stack.env');
    process.exit(1);
}

// 2. Función para invocar Gemini con Search Grounding con fallback
async function enrichLeadWithGemini(empresa, sector, descripcion) {
    let lastError = null;

    for (const cred of GEMINI_KEYS) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${cred.model}:generateContent?key=${cred.key}`;

    const prompt = `Actuá como Especialista Senior en Comercio Exterior y Nomenclatura Arancelaria de NEXUM Trade Consulting.
Tu tarea es realizar una auditoría técnica comercial para la empresa argentina: "${empresa}".
Sector declarado: "${sector || 'Industria PyME'}".
Contexto adicional: "${descripcion || ''}".

Instrucciones de investigación web con Google Search:
1. Buscar el catálogo y productos oficiales de "${empresa}". Identificar su MANUFACTURA PRINCIPAL / PRODUCTO ESTRELLA (el equipo, insumo o producto con mayor potencial o valor agregado para exportar a países limítrofes).
2. Clasificar ese producto bajo la NOMENCLATURA COMÚN DEL MERCOSUR (NCM / AFIP / Sistema Armonizado) con su código oficial exacto a 8 DÍGITOS (formato XXXX.XX.XX).
3. Obtener la descripción oficial de la posición arancelaria.
4. Determinar el tratamiento arancelario real intrazona Mercosur (Acuerdo ACE 18 - 0% arancel con certificado de origen), derechos de exportación en Argentina y reintegros aplicables.
5. Seleccionar los 2 a 3 mercados regionales de mayor demanda y proximidad logística (ej: Paraguay, Brasil, Uruguay, Bolivia o Chile) y resumir brevemente el por qué.
6. Identificar las barreras técnicas y regulatorias clave requeridas en destino (ej: registro ante SENASA en Argentina y SENACSA en Paraguay, o MAPA en Brasil, o ANMAT/DINAVISA, rotulados, manuales, etc.).
7. Proponer el próximo paso operativo para una reunión técnica por Google Meet de 20 min.

IMPORTANTE: Respondé ÚNICAMENTE con un bloque JSON válido (sin markdown adicional fuera del bloque) con la siguiente estructura exacta:
{
  "producto_estrella": "Nombre específico del producto manufacturado estrella",
  "ncm_codigo": "XXXX.XX.XX (código exacto a 8 dígitos)",
  "ncm_descripcion": "Descripción oficial de la partida según el NCM",
  "aranceles_info": "Derechos de exportación: 0%. Reintegro aplicable: X%. Arancel intrazona Mercosur: 0% bajo ACE 18 con Certificado de Origen.",
  "mercados_sugeridos": "País 1 & País 2",
  "mercados_desc": "Breve explicación de demanda en destino, logística terrestre y canales distribuidores.",
  "normativas_clave": "Organismo nacional / Homologación requerida",
  "normativas_desc": "Detalle técnico de certificados de libre venta, registros ante agencias sanitarias/técnicas y rotulados.",
  "meet_desc": "Cálculo de precio FOB/EXW sugerido, costeo de salida y análisis de homologaciones en destino.",
  "web_oficial": "URL del sitio web oficial de la empresa"
}`;

    const requestBody = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        tools: [
            { googleSearch: {} }
        ],
        generationConfig: {
            temperature: 0.1
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(`Gemini Error: ${JSON.stringify(data.error)}`);
    }

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textPart = parts.find(p => !p.thought && p.text)?.text || parts[0]?.text || '';

    // Extraer JSON
    const jsonMatch = textPart.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error(`No se pudo extraer JSON de la respuesta: ${textPart.slice(0, 200)}`);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Extraer fuentes si existen
    const sources = (candidate?.groundingMetadata?.groundingChunks || [])
        .map(c => c.web?.uri || c.web?.title)
        .filter(Boolean)
        .slice(0, 3);

    parsed.fuentes_grounding = sources;
    return parsed;
        } catch (err) {
            lastError = err;
            console.warn(`      ⚠️  Fallo con ${cred.model} (${err.message.slice(0, 100)}). Intentando siguiente key...`);
        }
    }
    throw lastError || new Error("No se pudo obtener respuesta de ninguna key de Gemini");
}

// 3. Obtener leads de Supabase
async function fetchLeads(targetName = null) {
    let url = `${SUPABASE_URL}/rest/v1/leads_nexum?select=*&order=empresa.asc`;
    if (targetName) {
        url += `&empresa=ilike.*${encodeURIComponent(targetName)}*`;
    }
    const res = await fetch(url, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    return await res.json();
}

// 4. Actualizar lead en Supabase
async function saveLeadEnrichment(leadId, existingNotes, comexData) {
    const marker = '<!-- COMEX_DIAGNOSTICO:';
    let cleanNotes = existingNotes || '';
    
    // Si ya tenía diagnóstico previo, reemplazarlo
    if (cleanNotes.includes(marker)) {
        cleanNotes = cleanNotes.replace(/<!-- COMEX_DIAGNOSTICO:[\s\S]*?-->/g, '').trim();
    }

    const jsonString = JSON.stringify(comexData);
    const updatedNotes = cleanNotes 
        ? `${cleanNotes}\n\n<!-- COMEX_DIAGNOSTICO: ${jsonString} -->`
        : `<!-- COMEX_DIAGNOSTICO: ${jsonString} -->`;

    const patchPayload = {
        notas: updatedNotes
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads_nexum?id=eq.${leadId}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(patchPayload)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error actualizando Supabase (${res.status}): ${err}`);
    }
    return await res.json();
}

// 5. Función principal
async function main() {
    const args = process.argv.slice(2);
    const targetFilter = args[0] || null; // Ej: "Abelardo Cuffia" o null para todos
    const force = args.includes('--force');

    console.log('===============================================================');
    console.log('🚀 NEXUM TRADE CONSULTING - MOTOR DE ENRIQUECIMIENTO COMEX IA');
    console.log('===============================================================');
    console.log(`Conectando a Supabase: ${SUPABASE_URL}`);
    console.log(`Filtro: ${targetFilter ? `"${targetFilter}"` : 'Todos los prospectos PyME'}`);
    console.log(`Modo Force: ${force ? 'SI (re-investiga existentes)' : 'NO (salta ya investigados)'}\n`);

    const leads = await fetchLeads(targetFilter);
    console.log(`Leads encontrados: ${leads.length}\n`);

    let procesados = 0;
    let saltados = 0;

    for (const lead of leads) {
        // Filtrar cámaras y alianzas institucionales (solo investigar PyMEs industriales comerciales)
        if (lead.origen === 'alianza_institucional' || (lead.sector && lead.sector.toLowerCase().includes('alianza'))) {
            console.log(`⏭️  [SALTADO] ${lead.empresa} (Es alianza institucional / cámara)`);
            saltados++;
            continue;
        }

        const yaEnriquecido = lead.notas && lead.notas.includes('<!-- COMEX_DIAGNOSTICO:');
        if (yaEnriquecido && !force) {
            console.log(`✅ [YA INVESTIGADO] ${lead.empresa} (usar --force para recalcular)`);
            saltados++;
            continue;
        }

        console.log(`🔍 [INVESTIGANDO CON GEMINI] ${lead.empresa} (${lead.sector || 'PyME'})...`);
        try {
            const comexData = await enrichLeadWithGemini(lead.empresa, lead.sector, lead.notas);
            console.log(`   🌟 Producto: ${comexData.producto_estrella}`);
            console.log(`   📦 NCM: ${comexData.ncm_codigo} - ${comexData.ncm_descripcion?.slice(0, 60)}...`);
            console.log(`   🌎 Mercados: ${comexData.mercados_sugeridos}`);
            console.log(`   📋 Normativa: ${comexData.normativas_clave}`);

            await saveLeadEnrichment(lead.id, lead.notas, comexData);
            console.log(`   💾 Guardado con éxito en Supabase.\n`);
            procesados++;

            // Pequeña pausa para no saturar rate limit
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.error(`   ❌ Error procesando ${lead.empresa}:`, err.message, '\n');
        }
    }

    console.log('===============================================================');
    console.log(`🏁 FIN DEL PROCESO. Procesados: ${procesados} | Saltados: ${saltados}`);
    console.log('===============================================================');
}

main().catch(console.error);
