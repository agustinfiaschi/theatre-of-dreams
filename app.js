// CONFIGURACIÓN DE TU API - PEGÁ TU LLAVE ENTRE LAS COMILLAS:
const API_KEY = '4c49b5f6bbd343d5983bd748a8d9d6b0'; 
const TEAM_ID = 66; // El ID del Manchester United

async function obtenerProximoPartido() {
    // El filtro 'competitions=PL' es el que hace que la API gratuita responda bien en producción
    const url = `https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED&competitions=PL&limit=1`;

    try {
        const respuesta = await fetch(url, {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!respuesta.ok) throw new Error('Error al conectar con la API');

        const datos = await respuesta.json();
        
        if (datos.matches && datos.matches.length > 0) {
            const partido = datos.matches[0];
            mostrarPartido(partido);
        } else {
            document.getElementById('match-date').innerText = 'No hay partidos programados';
        }

    } catch (error) {
        console.error('Hubo un error:', error);
        document.getElementById('match-date').innerText = 'Error al cargar datos';
    }
}

function mostrarPartido(partido) {
    // Extraemos los datos que nos devuelve el servidor en vivo
    const localNombre = partido.homeTeam.name;
    const localLogo = partido.homeTeam.crest;
    const visitanteNombre = partido.awayTeam.name;
    const visitanteLogo = partido.awayTeam.crest;
    const fechaUtc = partido.utcDate; 

    // El estadio cambia solo: si la API lo da lo usa, sino calcula según la localía
    const estadio = partido.venue || (partido.homeTeam.id === TEAM_ID ? 'Old Trafford' : 'Estadio Visitante');

    // Convertidor automático a hora de Argentina según tu PC
    const opciones = { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    const fechaLocal = new Date(fechaUtc).toLocaleDateString('es-AR', opciones);

    // Inyectamos todo en el HTML dinámicamente
    document.getElementById('home-name').innerText = reescribirNombre(localNombre);
    document.getElementById('away-name').innerText = reescribirNombre(visitanteNombre);
    document.getElementById('match-date').innerText = fechaLocal + ' (Arg)';
    document.getElementById('match-venue').innerText = estadio;

    // Colocamos los escudos oficiales que trae la API
    const imgLocal = document.getElementById('home-logo');
    imgLocal.src = localLogo;
    imgLocal.classList.remove('hidden');

    const imgVisitante = document.getElementById('away-logo');
    imgVisitante.src = visitanteLogo;
    imgVisitante.classList.remove('hidden');
}

// Función para limpiar los nombres y que no queden largos en la tarjeta
function reescribirNombre(nombre) {
    return nombre.replace(' FC', '').replace(' Tottenham Hotspur', 'Tottenham').replace(' AFC', '');
}

// Ejecutar la función apenas se cargue la página
document.addEventListener('DOMContentLoaded', obtenerProximoPartido);