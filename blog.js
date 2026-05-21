const RSS_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.newsnow.co.uk%2FH%2FSport%2FFootball%2FPremier+League%2FManchester+United%3Ff%3DRSS';

async function cargarNoticiasAutomatizadas() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    try {
        const respuesta = await fetch(RSS_FEED_URL);
        if (!respuesta.ok) throw new Error('Error de red');
        
        const datos = await respuesta.json();
        
        if (datos.items && datos.items.length > 0) {
            contenedor.innerHTML = ''; // Limpiamos el cargando
            
            // Mostramos las primeras 6 noticias
            const noticias = datos.items.slice(0, 6);
            
            for (let noticia of noticias) {
                // Traducimos el título rápido con Google
                let tituloEspañol = noticia.title;
                try {
                    const resTrad = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(noticia.title)}`);
                    const datosTrad = await resTrad.json();
                    tituloEspañol = datosTrad[0][0][0];
                } catch (e) {
                    console.log("No se pudo traducir este título, va en inglés");
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
    const imagen = noticia.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop';
    const fecha = new Date(noticia.pubDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

    contenedor.innerHTML += `
        <article class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between shadow-lg">
            <div>
                <div class="h-40 w-full overflow-hidden bg-zinc-900">
                    <img src="${imagen}" alt="News" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <h4 class="text-sm font-bold text-zinc-100 hover:text-red-500 transition">
                        <a href="${noticia.link}" target="_blank">${titulo}</a>
                    </h4>
                </div>
            </div>
            <div class="p-4 pt-0 text-[10px] text-zinc-500 flex justify-between">
                <span>${fecha}</span>
                <span class="text-red-500">Leer en UK →</span>
            </div>
        </article>
    `;
}

function usarNoticiasDeRespaldo() {
    const contenedor = document.getElementById('contenedor-noticias');
    contenedor.innerHTML = '';
    
    // Noticias fijas por si el servidor externo se cae o bloquea la IP
    const respaldo = [
        { title: 'Preparativos en Carrington de cara al próximo partido de la Premier', link: 'https://www.manutd.com', pubDate: new Date() },
        { title: 'Análisis de la plantilla: Los canteranos que piden pista en el primer equipo', link: 'https://www.manutd.com', pubDate: new Date() },
        { title: 'Declaraciones del DT sobre los objetivos del mercado de pases europeo', link: 'https://www.manutd.com', pubDate: new Date() }
    ];
    
    respaldo.forEach(nota => renderizarTarjeta({ thumbnail: '', link: nota.link, pubDate: nota.pubDate }, nota.title));
}

document.addEventListener('DOMContentLoaded', cargarNoticiasAutomatizadas);