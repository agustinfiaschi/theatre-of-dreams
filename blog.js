// Usamos un feed RSS público de la BBC Sport exclusivo del Manchester United (Indestructible)
const RSS_FEED_URL = 'https://cors-anywhere.herokuapp.com/https://feeds.bbci.co.uk/sport/football/teams/manchester-united/rss.xml';

async function cargarTablonIntegrado() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    try {
        // Consultamos el feed de la BBC
        const respuesta = await fetch(RSS_FEED_URL);
        if (!respuesta.ok) throw new Error('Servidor de noticias fuera de rango');
        
        const textoXml = await respuesta.text();
        
        // Convertimos el XML en datos legibles
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textoXml, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');

        if (items.length > 0) {
            contenedor.innerHTML = ''; // Limpiamos el cargando
            
            // Tomamos las últimas 2 noticias para que queden flotando a la derecha
            const cantidad = Math.min(items.length, 2);
            
            for (let i = 0; i < cantidad; i++) {
                const tituloIngles = items[i].getElementsByTagName('title')[0].textContent;
                const linkOriginal = items[i].getElementsByTagName('link')[0].textContent;
                const fechaRaw = items[i].getElementsByTagName('pubDate')[0].textContent;

                // Traducimos el título al español en vivo
                let tituloEspañol = tituloIngles;
                try {
                    const resTrad = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(tituloIngles)}`);
                    const datosTrad = await resTrad.json();
                    tituloEspañol = datosTrad[0][0][0];
                } catch (e) {
                    console.log("No se pudo traducir, se usa el original");
                }
                
                renderizarTarjetaElegante(tituloEspañol, linkOriginal, fechaRaw);
            }
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<div class="col-span-full text-center py-10 text-zinc-500 text-xs">⚠️ No se pudo conectar con el feed en vivo. Intentalo de nuevo más tarde.</div>`;
    }
}

function renderizarTarjetaElegante(titulo, link, fechaRaw) {
    const contenedor = document.getElementById('contenedor-noticias');
    
    // Fotos futboleras de alta calidad fijas para que las tarjetas no queden con el logo roto
    const fotosRotativas = [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=500&auto=format&fit=crop'
    ];
    
    const foto = fotosRotativas[titulo.length % fotosRotativas.length];
    const fecha = new Date(fechaRaw).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

    contenedor.innerHTML += `
        <article class="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 hover:shadow-red-950/20 transition flex flex-col justify-between shadow-lg group">
            <div>
                <div class="h-40 w-full overflow-hidden bg-zinc-900 relative">
                    <img src="${foto}" alt="Noticia" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-2 right-2 bg-red-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
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

document.addEventListener('DOMContentLoaded', cargarTablonIntegrado);