// Usamos un feed RSS público de noticias del Manchester United en inglés
const RSS_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.newsnow.co.uk%2FH%2FSport%2FFootball%2FPremier+League%2FManchester+United%3Ff%3DRSS';

async function cargarNoticiasAutomatizadas() {
    try {
        const respuesta = await fetch(RSS_FEED_URL);
        if (!respuesta.ok) throw new Error('No se pudo conectar con el feed de noticias');
        
        const datos = await respuesta.json();
        
        if (datos.items && datos.items.length > 0) {
            // Limpiamos el mensaje de "Cargando..."
            document.getElementById('contenedor-noticias').innerHTML = '';
            
            // Tomamos las últimas 6 noticias para no saturar la pantalla
            const noticias = datos.items.slice(0, 6);
            
            for (let noticia of noticias) {
                // Traducimos el título al español usando una API pública y libre de traducción
                const tituloTraducido = await traducirTexto(noticia.title);
                renderizarTarjeta(noticia, tituloTraducido);
            }
        } else {
            mostrarError('No se encontraron noticias recientes.');
        }
    } catch (error) {
        console.error(error);
        mostrarError('El servidor de Manchester está saturado. Reintentando conexión...');
    }
}

// Función auxiliar para traducir los títulos en milisegundos de forma gratuita
async function traducirTexto(textoIngles) {
    try {
        // Usamos un servidor espejo libre de la API de traducción
        const res = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=" + encodeURIComponent(textoIngles));
        const datos = await res.json();
        return datos[0][0][0]; // Extrae la frase traducida pura limpia
    } catch (e) {
        return textoIngles; // Si la traducción falla por red, muestra el original en inglés para no dejar vacío
    }
}

function renderizarTarjeta(noticia, tituloEspañol) {
    const contenedor = document.getElementById('contenedor-noticias');
    
    // Si la noticia no trae imagen, usamos una foto épica de prensa del United por defecto
    const imagenUrl = noticia.enclosure.link || noticia.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop';
    
    // Formatear la fecha
    const fecha = new Date(noticia.pubDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

    const tarjetaHTML = `
        <article class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between shadow-lg">
            <div>
                <div class="h-40 w-full overflow-hidden bg-zinc-900 relative">
                    <img src="${imagenUrl}" alt="Noticia" class="w-full h-full object-cover">
                    <span class="absolute bottom-2 left-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-[9px] font-bold text-zinc-300 px-2 py-0.5 rounded">
                        NewsNow UK
                    </span>
                </div>
                <div class="p-4">
                    <h4 class="text-sm font-bold text-zinc-100 tracking-tight leading-snug hover:text-red-500 transition cursor-pointer">
                        <a href="${noticia.link}" target="_blank">${tituloEspañol}</a>
                    </h4>
                </div>
            </div>
            <div class="p-4 pt-0 text-[10px] text-zinc-500 font-medium flex justify-between">
                <span>Actualizado: ${fecha}</span>
                <span class="text-red-500">Leer nota →</span>
            </div>
        </article>
    `;
    
    contenedor.innerHTML += tarjetaHTML;
}

function mostrarError(mensaje) {
    document.getElementById('contenedor-noticias').innerHTML = `
        <div class="col-span-full text-center py-12 text-zinc-500 text-xs">
            ⚠️ ${mensaje}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', cargarNoticiasAutomatizadas);