// Usamos un feed de noticias global de fútbol de SkySports / BBC enfocado en el United
const RSS_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fsport%2Ffootball%2Fteams%2Fmanchester-united%2Frss.xml';

async function cargarNoticiasAutomatizadas() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    try {
        // Consultamos el feed de la BBC Sport sobre el United
        const respuesta = await fetch(RSS_FEED_URL);
        if (!respuesta.ok) throw new Error('Error de conexión');
        
        const datos = await respuesta.json();
        
        if (datos.items && datos.items.length > 0) {
            contenedor.innerHTML = ''; // Limpiamos el mensaje de "Cargando..."
            
            // Tomamos las últimas 6 noticias reales
            const noticias = datos.items.slice(0, 6);
            
            for (let noticia of noticias) {
                // Traducimos el título al español en vivo
                let tituloEspañol = noticia.title;
                try {
                    const resTrad = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(noticia.title)}`);
                    const datosTrad = await resTrad.json();
                    tituloEspañol = datosTrad[0][0][0];
                } catch (e) {
                    console.log("No se pudo traducir, se usa el original");
                }
                
                renderizarTarjeta(noticia, tituloEspañol);
            }
        } else {
            usarNoticiasDeRespaldo();
        }
    } catch (error) {
        console.error(error);
        usarNoticiasDeRespaldo();
    }
}

function renderizarTarjeta(noticia, titulo) {
    const contenedor = document.getElementById('contenedor-noticias');
    
    // Si la noticia no trae imagen, le asignamos fotos espectaculares de partidos de fútbol rotativas de Unsplash
    const imagenesPorDefecto = [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577223625856-45e5204dd743?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500&auto=format&fit=crop'
    ];
    
    // Elegimos una foto del array basada en el largo del título para que varíen entre las tarjetas
    const fotoIndex = titulo.length % imagenesPorDefecto.length;
    const imagen = noticia.thumbnail || noticia.enclosure?.link || imagenesPorDefecto[fotoIndex];
    
    // Formateamos la fecha a estilo argentino
    const fecha = noticia.pubDate ? new Date(noticia.pubDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : 'Hoy';

    contenedor.innerHTML += `
        <article class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between shadow-lg group">
            <div>
                <div class="h-44 w-full overflow-hidden bg-zinc-900 relative">
                    <img src="${imagen}" alt="News" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-2 right-2 bg-red-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                        UK Premium
                    </span>
                </div>
                <div class="p-4">
                    <h4 class="text-sm font-bold text-zinc-100 hover:text-red-500 transition leading-snug">
                        <a href="${noticia.link}" target="_blank" class="block">${titulo}</a>
                    </h4>
                </div>
            </div>
            <div class="p-4 pt-0 text-[10px] text-zinc-500 flex justify-between items-center border-t border-zinc-900/50 mt-2">
                <span>📅 ${fecha}</span>
                <span class="text-red-500 font-bold group-hover:underline">Leer nota completa →</span>
            </div>
        </article>
    `;
}

function usarNoticiasDeRespaldo() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    
    const respaldo = [
        { title: 'Actualidad en Carrington: El plantel prepara los esquemas tácticos para la Premier', link: 'https://www.bbc.com/sport/football/teams/manchester-united' },
        { title: 'Análisis del Mercado: La dirigencia evalúa opciones para reforzar el centro del campo', link: 'https://www.bbc.com/sport/football/teams/manchester-united' },
        { title: 'Voces desde Old Trafford: Los hinchas se organizan para el próximo gran partido', link: 'https://www.bbc.com/sport/football/teams/manchester-united' }
    ];
    
    respaldo.forEach(nota => renderizarTarjeta({ pubDate: new Date(), link: nota.link }, nota.title));
}

document.addEventListener('DOMContentLoaded', cargarNoticiasAutomatizadas);