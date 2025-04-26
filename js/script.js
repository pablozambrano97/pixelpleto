// Función para obtener juegos de la API de FreeToGame y mostrar una cantidad específica
async function obtenerYMostrarJuegos(url, contenedorId, cantidad) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = '<p>Cargando juegos...</p>';

    try {
        const response = await fetch(url);
        const data = await response.json();
        contenedor.innerHTML = ''; // Limpiar el mensaje de carga
        const juegosAMostrar = cantidad !== undefined ? data.slice(0, cantidad) : data;
        juegosAMostrar.forEach(juego => {
            const divCol = document.createElement('div');
            divCol.classList.add('col-md-4', 'mb-4'); // Volvemos a la disposición en columnas
            divCol.innerHTML = `
                <div class="card" style="height: 100%;">
                    <img src="${juego.thumbnail}" alt="${juego.title}" class="card-img-top" style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${juego.title}</h5>
                        <p class="card-text small">Plataforma: ${juego.platform}</p>
                        <a href="detalle.html?id=${juego.id}" class="btn btn-primary">Ver detalles</a>
                    </div>
                </div>
            `;
            contenedor.appendChild(divCol);
        });
    } catch (error) {
        console.error(`Error al cargar juegos desde ${url}:`, error);
        contenedor.innerHTML = '<p class="text-danger">Error al cargar los juegos.</p>';
    }
}

// Para la página de acción (todos los juegos de acción)
function cargarJuegosAccion() {
    const apiUrl = 'https://www.freetogame.com/api/games?category=shooter'; // Puedes ajustar la categoría
    obtenerYMostrarJuegos(apiUrl, 'juegos-accion-lista'); // Apuntamos al ID correcto
}

// Para la página de aventura (todos los juegos de aventura)
function cargarJuegosAventura() {
    const apiUrl = 'https://www.freetogame.com/api/games?category=social';
    obtenerYMostrarJuegos(apiUrl, 'juegos-aventura-lista');
}

function cargarJuegosRPG() {
    const apiUrl = 'https://www.freetogame.com/api/games?category=mmorpg'; // Probamos con "mmorpg"
    obtenerYMostrarJuegos(apiUrl, 'lista-juegos-rpg');
}
// Para la página de inicio - Juegos gratuitos para PC (4 juegos)
function cargarJuegosGratisPCInicio() {
    const apiUrl = 'https://www.freetogame.com/api/games?platform=pc';
    obtenerYMostrarJuegos(apiUrl, 'lista-juegos-gratuitos', 4);
}

function cargarJuegosGratisPagina() {
    const apiUrl = 'https://www.freetogame.com/api/games';
    const contenedor = document.getElementById('contenedor-gratis');
    if (!contenedor) return;
    contenedor.innerHTML = '<p>Cargando juegos gratuitos...</p>';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            contenedor.innerHTML = '';
            data.forEach(juego => {
                const divCol = document.createElement('div');
                divCol.classList.add('col-md-4', 'mb-4'); // Añadimos la clase col-md-4
                divCol.innerHTML = `
                    <div class="card" style="height: 100%;">
                        <img src="${juego.thumbnail}" alt="${juego.title}" class="card-img-top" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${juego.title}</h5>
                            <p class="card-text small">Plataforma: ${juego.platform}</p>
                            <a href="detalle.html?id=${juego.id}" class="btn btn-info">Ver detalles</a>
                        </div>
                    </div>
                `;
                contenedor.appendChild(divCol);
            });
        })
        .catch(error => {
            console.error('Error al cargar todos los juegos gratuitos:', error);
            contenedor.innerHTML = '<p class="text-danger">Error al cargar los juegos gratuitos.</p>';
        });
}

// Para mostrar los detalles del juego en detalle.html
async function obtenerDetallesJuego() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    const contenedor = document.getElementById('detalles-juego');
    if (!contenedor) return;
    contenedor.innerHTML = '<p>Cargando detalles del juego...</p>';

    if (gameId) {
        const apiUrl = `https://www.freetogame.com/api/game?id=${gameId}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            contenedor.innerHTML = `
                <h2>${data.title}</h2>
                <img src="${data.screenshots[0]?.image || data.thumbnail}" alt="${data.title}" class="img-fluid rounded mb-3">
                <p><strong>Plataforma:</strong> ${data.platform}</p>
                <p><strong>Publicador:</strong> ${data.publisher}</p>
                <p><strong>Género:</strong> ${data.genre}</p>
                <p><strong>Descripción:</strong> ${data.description}</p>
                <a href="${data.game_url}" class="btn btn-success" target="_blank" rel="noopener noreferrer">Jugar ahora</a>
            `;
        } catch (error) {
            console.error('Error al obtener detalles del juego:', error);
            contenedor.innerHTML = '<p class="text-danger">Error al cargar los detalles del juego.</p>';
        }
    } else {
        contenedor.innerHTML = '<p class="text-warning">No se seleccionó ningún juego.</p>';
    }
}

// Llamar a las funciones correspondientes en cada página
if (window.location.pathname.includes('paginas/index.html')) {
    cargarJuegosGratisPCInicio();
} else if (window.location.pathname.includes('paginas/accion.html')) {
    cargarJuegosAccion();
} else if (window.location.pathname.includes('paginas/aventura.html')) {
    cargarJuegosAventura();
} else if (window.location.pathname.includes('paginas/rpg.html')) {
    cargarJuegosRPG();
} else if (window.location.pathname.includes('paginas/gratis.html')) {
    cargarJuegosGratisPagina();
} else if (window.location.pathname.includes('paginas/detalle.html')) {
    obtenerDetallesJuego();
}