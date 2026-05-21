async function cargarTablonNoticias() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('noticias.json');
        if (!respuesta.ok) throw new Error('Error al cargar base local');
        const noticias = await respuesta.json();
        
        if (noticias && noticias.length > 0) {
            contenedor.innerHTML = '';
            
            noticias.forEach(noticia => {
                // Si la nota la escribiste vos, le metemos una mística roja diferente
                const esColumnaAutor = noticia.categoria.includes("Agustín") || noticia.categoria.includes("Autor");
                const claseBorde = esColumnaAutor ? 'border-red-600/50 shadow-red-950/20' : 'border-zinc-800 hover:border-zinc-700';
                const badgeColor = esColumnaAutor ? 'bg-red-600' : 'bg-zinc-800 border border-zinc-700';

                contenedor.innerHTML += `
                    <article class="bg-zinc-950 border ${claseBorde} rounded-xl overflow-hidden transition flex flex-col justify-between shadow-xl group">
                        <div>
                            <div class="h-44 w-full overflow-hidden bg-zinc-900 relative">
                                <img src="${noticia.imagen}" alt="Manchester United" class="w-full h-full object-cover group-hover:scale-103 transition duration-500">
                                <span class="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-lg ${badgeColor}">
                                    ${noticia.categoria}
                                </span>
                            </div>
                            <div class="p-4">
                                <h4 class="text-sm font-bold text-zinc-100 hover:text-red-500 transition leading-snug">
                                    <a href="${noticia.link}" target="_blank" class="block">${noticia.titulo}</a>
                                </h4>
                            </div>
                        </div>
                        <div class="p-4 pt-0 text-[10px] text-zinc-500 flex justify-between items-center border-t border-zinc-900/50 mt-2">
                            <span>📅 ${noticia.fecha}</span>
                            <span class="text-red-500 font-bold group-hover:underline">Leer artículo →</span>
                        </div>
                    </article>
                `;
            });
        }
    } catch (error) {
        contenedor.innerHTML = `<div class="col-span-full text-center py-12 text-zinc-500 text-xs">⚠️ Panel en mantenimiento temporal.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarTablonNoticias);