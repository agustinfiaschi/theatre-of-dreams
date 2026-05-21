async function obtenerProximoPartido() {
    // Llamamos a nuestro puente de Vercel en vez de ir directo a la API externa
    const url = '/api/proximo-partido';

    try {
        const respuesta = await fetch(url, {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!respuesta.ok) throw new Error('Error en el puente del servidor');

        const datos = await respuesta.json();
        
        if (datos.matches && datos.matches.length > 0) {
            mostrarPartido(datos.matches[0]);
        } else {
            document.getElementById('match-date').innerText = 'No hay partidos programados';
        }

    } catch (error) {
        console.error('Hubo un error:', error);
        document.getElementById('match-date').innerText = 'Error al cargar datos';
    }
}