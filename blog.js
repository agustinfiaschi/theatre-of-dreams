// El cable de noticias oficial de la BBC de Londres exclusivo del Manchester United
const BBC_UNITED_FEED = 'https://corsproxy.io/?' + encodeURIComponent('https://feeds.bbci.co.uk/sport/football/teams/manchester-united/rss.xml');

async function traerNoticiasRealesYTraducir() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    try {
        // Le pedimos el archivo XML real a la BBC usando un puente de red libre (CORS Proxy)
        const respuesta = await fetch(BBC_UNITED_FEED);
        if (!respuesta.ok) throw new Error('Servidor de la BBC fuera de rango');
        
        const textoXml = await respuesta.text();
        
        // Convertimos ese texto plano en código que JavaScript pueda leer
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textoXml, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');

        if (items.length > 0) {
            contenedor.innerHTML = ''; // Limpiamos el "Cargando..."
            
            // Tomamos las últimas 6 noticias del día de hoy
            const cantidad = Math.min(items.length, 6);
            
            for (let i = 0; i < cantidad; i++) {
                const tituloIngles = items[i].getElementsByTagName('title')[0].textContent;
                const linkOriginal = items[i].getElementsByTagName('link')[0].textContent;
                const fechaRaw = items[i].getElementsByTagName('pubDate')[0].textContent;

                // Traducimos el título de la BBC al español usando el servidor directo de Google
                let tituloEspañol = tituloIngles;
                try {
                    const resTrad = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(tituloIngles)}`);
                    const datosTrad = await resTrad.json();
                    tituloEspañol = datosTrad[0][0][0];
                } catch (e) {
                    console.log("Fallo temporal de Google Translate, sale en inglés");
                }

                inyectarTarjetaReal(tituloEspañol, linkOriginal, fechaRaw, i);
            }
        }
    } catch (error) {
        console.error("Error en el sistema dinámico:", error);
        contenedor.innerHTML = `<div class="col-span-full text-center py-12 text-zinc-500 text-xs">⚠️ No se pudieron sincronizar las noticias en vivo. Reintentando...</div>`;
    }
}

function inyectarTarjetaReal(titulo, link, fechaRaw, index) {
    const contenedor = document.getElementById('contenedor-noticias');
    
    // Fotos futboleras de alta calidad fijas para que las tarjetas no queden con el logo roto
    const fotosRotativas = [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577223625856-45e5204dd743?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1431324155629-1a6edd1d126c?q=80&w=500&auto=format&fit=crop'
    ];

    const foto = fotosRotativas[index % fotosRotativas.length];
    const fecha = new Date(fechaRaw).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

    contenedor.innerHTML += `
        <article class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between shadow-lg group">
            <div>
                <div class="h-44 w-full overflow-hidden bg-zinc-900 relative">
                    <img src="${foto}" alt="Fútbol" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 bg-red-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-lg">
                        BBC Sport UK
                    </span>
                </div>
                <div class="p-4">
                    <h4 class="text-sm font-bold text-zinc-100 hover:text-red-500 transition leading-snug">
                        <a href="${link}" target="_blank" class="block">${titulo}</a>
                    </h4>
                </div>
            </div>
            <div class="p-4 pt-0 text-[10px] text-zinc-500 flex justify-between items-center border-t border-zinc-900/50 mt-2">
                <span>📅 Actualizado: ${fecha}</span>
                <span class="text-red-500 font-bold group-hover:underline">Leer en inglés →</span>
            </div>
        </article>
    `;
}

document.addEventListener('DOMContentLoaded', traerNoticiasRealesYTraducir);