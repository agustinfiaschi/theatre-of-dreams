const noticiasLocales = [
    {
        titulo: "El impacto de 'The Butcher': Por qué la salida limpia empieza en los pies de Licha Martínez",
        link: "https://www.bbc.com/sport/football/teams/manchester-united",
        imagen: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop",
        categoria: "Análisis de Agustín",
        fecha: "21 de Mayo"
    },
    {
        titulo: "Luke Shaw rompe el silencio: 'Corro como un loco cuando noto un gol'",
        link: "https://www.bbc.com/sport/football/teams/manchester-united",
        imagen: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500&auto=format&fit=crop",
        categoria: "Entrevista",
        fecha: "20 de Mayo"
    }
];

function cargarTablonDefinitivo() {
    const contenedor = document.getElementById('contenedor-noticias');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    
    noticiasLocales.forEach(noticia => {
        contenedor.innerHTML += `
            <article class="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 transition flex flex-col justify-between shadow-lg group">
                <div>
                    <div class="h-40 w-full overflow-hidden bg-zinc-900 relative">
                        <img src="${noticia.imagen}" alt="Manchester United" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <span class="absolute top-3 left-3 bg-red-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-lg">
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
                    <span class="text-red-500 font-bold group-hover:underline">Leer nota →</span>
                </div>
            </article>
        `;
    });
}

document.addEventListener('DOMContentLoaded', cargarTablonDefinitivo);