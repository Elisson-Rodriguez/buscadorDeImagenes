const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDIV = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual;
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);

}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de busqueda');
        return;
    }

    buscarImagenes(terminoBusqueda);

}

//Geneardor que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;

    }
}

function mostrarAlerta(msg) {
    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class"block sm:inline">${msg}</span>
    `;
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;
    const key = '43219068-f127e9bd100b15428fae86f23';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page="${registrosPorPagina}&page=${paginaActual}"`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(result => {
            totalPaginas = calcularPaginas(result.totalHits);
            mostrarImagenes(result.hits);
        })
}
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(images) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el arreglo de imagenes y construir el html
    images.forEach(img => {
        const { likes, views, largeImageURL, previewURL, totalHits } = img;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p>
                            ${likes}<span class="font-light"> Me Gusta</span>
                        </p>
                        <p>
                            ${views}<span class="font-light"> Visitas</span>
                        </p>
                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}"
                            target="_blank"
                            rel="noopener noreferrer"
                            >Ver Imagen</a>
                    </div>
                </div>
            </div>
        `;
    });

    //Limpiar el paginador previo
    while(paginacionDIV.firstChild){
        paginacionDIV.removeChild(paginacionDIV.firstChild);
    };
    imprimirPaginador();
}

function imprimirPaginador() {
    const iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        // Si no se cumple genera un boton para cada elemento en el generador
        const btn = document.createElement('A');
        btn.href = '#';
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-1', 'uppercase', 'rounded');

        btn.onclick = () =>{
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDIV.appendChild(btn);
    }
}