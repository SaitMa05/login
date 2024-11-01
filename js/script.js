document.addEventListener("DOMContentLoaded", () => {
    checkScreen();
});
function checkScreen() {
    const screenW = window.innerWidth;
    if (screenW < 640) {
        window.location.href = "error.html";
    }
}
const palabraAEncontrar = document.querySelector(".titulo");

const container = document.getElementById('fireworks-container');

// Configurar y crear la instancia de Fireworks
const fireworks = new Fireworks(container, {
    maxRockets: 6,          // Número máximo de cohetes a lanzar por vez
    rocketSpawnInterval: 150,  // Intervalo entre lanzamientos de cohetes en milisegundos
    numParticles: 100,      // Número de partículas por explosión
    explosionMinHeight: 0.2, // Altura mínima de la explosión (relativa a la altura del contenedor)
    explosionMaxHeight: 0.9, // Altura máxima de la explosión (relativa a la altura del contenedor)
    explosionChance: 0.09    // Probabilidad de que un cohete explote antes de alcanzar el máximo de altura
});



$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

})

let puntaje = 0;
let puntajeHTML = document.querySelector(".puntaje-num");

let inicioJuego = false;


const gameContains = document.querySelector("#gameContainer");
const sopa = document.querySelector(".sopa");
const stylee = document.querySelector(".style");
const palabras = [];
const posicionesPalabras = [];
let celdasSeleccionadas = [];
let palabrasEncontradas = 0;
let estaSeleccionado = false;
let seleccionarCelda = null;

function agregarPalabra() {
    const tituloPalabra = document.querySelector(".tituloPalabra");
    const palabra = document.getElementById("entradaPalabra").value.toLowerCase().trim();
    
    if(palabras.length >= 9){
        if(gameContains.classList.contains("d-n")){
            gameContains.classList.remove("d-n");
        }
    }
    if(palabra == ""){
        toastr["error"]("El campo no puede estar vacio", "Error");
        return;
    }
    if(palabra.includes(" ") || /\d/.test(palabra)) {
        toastr["error"]("La palabra no puede contener espacios o numeros", "Error");
        return;
    }
    if(palabra.length < 3){
        toastr["error"]("La palabra debe tener al menos 3 caracteres", "Error");
        return;
    }

    if (palabras.includes(palabra) && palabra.length !== 0) {
        toastr["error"]("No se puede colocar una palabra igual", "Error");
    }

    if (palabra && !palabras.includes(palabra)) {
        palabras.push(palabra);
        const listaPalabrasDiv = document.getElementById("listaPalabras");

        // Crear el elemento para la nueva palabra
        const palabraElemento = document.createElement("div");
        palabraElemento.classList.add("palabraElemento");

        const parrafo = document.createElement("p");
        parrafo.classList.add("palabras-text");
        parrafo.textContent = palabra;

        const btnEliminarPalabra = document.createElement("button");
        btnEliminarPalabra.textContent = "X";
        btnEliminarPalabra.classList.add("btnEliminarPalabra");

        // Añadir evento al botón de eliminar
        btnEliminarPalabra.addEventListener("click", (e) => {
            e.preventDefault();
            eliminarPalabra(palabra);
            if(palabras.length <= 9){
                // inicioJuego = false;
                toastr["error"]("Tienes que agregar mas palabras", "Error");
                gameContains.classList.add("d-n");
                // inicioJuego = false;
                return;
            }
            if(inicioJuego == true){
                reiniciarTablero();
            }
        });

        // Añadir elementos al contenedor
        palabraElemento.appendChild(parrafo);
        palabraElemento.appendChild(btnEliminarPalabra);
        listaPalabrasDiv.appendChild(palabraElemento);

        // Actualizar el título
        if (parrafo) {
            tituloPalabra.classList.add("d-n");
        }

        // Actualizar el texto de palabras a encontrar
        palabraAEncontrar.textContent = `Palabras a encontrar (${palabras.length}):`;
    }
    if(inicioJuego == true){
        reiniciarTablero();
    }
    // Limpiar la entrada de palabra
    document.getElementById("entradaPalabra").value = "";
    console.log(palabras);

}
function reiniciarTablero() {
    // if(palabras.length < 10){
    //     inicioJuego = false;
    // }
    if (palabras.length === 0) {
        toastr["error"]("Es Obligatorio Colocar Almenos 10 Palabras Para Iniciar", "Error");
        return;
    }

    if(palabras.length <= 1){
        toastr["error"]("debes tener al menos 10 palabras", "Error");
        return;
    }

    const tamañoCuadricula = 16;
    const sopaDeLetras = document.getElementById("sopaDeLetras");
    sopaDeLetras.innerHTML = "";

    const cuadricula = Array.from({ length: tamañoCuadricula }, () => Array(tamañoCuadricula).fill(''));
    palabras.forEach(palabra => colocarPalabraEnCuadricula(palabra, cuadricula, tamañoCuadricula));



    for (let i = 0; i < tamañoCuadricula; i++) {
        for (let j = 0; j < tamañoCuadricula; j++) {
            const celda = document.createElement("div");
            celda.textContent = cuadricula[i][j] || obtenerLetraAleatoria();
            celda.classList.add("celda");
            celda.setAttribute("data-fila", i);
            celda.setAttribute("data-columna", j);
            celda.onmousedown = (event) => comenzarDibujo(event, celda, true);
            celda.onmousemove = (event) => dibujar(event, celda);
            celda.onmouseup = finalizarDibujo;
            sopaDeLetras.appendChild(celda);
        }
    }
    document.addEventListener("mouseup", finalizarDibujo);
}
function eliminarPalabra(palabra) {
    const index = palabras.indexOf(palabra);
    if (index > -1) {
        palabras.splice(index, 1);
        actualizarListaPalabras();
    }
}

function actualizarListaPalabras() {
    const listaPalabrasDiv = document.getElementById("listaPalabras");
    listaPalabrasDiv.innerHTML = "";

    palabras.forEach(palabra => {
        const palabraElemento = document.createElement("div");
        palabraElemento.classList.add("palabraElemento");

        const parrafo = document.createElement("p");
        parrafo.classList.add("palabras-text");
        parrafo.textContent = palabra;

        const btnEliminarPalabra = document.createElement("button");
        btnEliminarPalabra.textContent = "X";
        btnEliminarPalabra.classList.add("btnEliminarPalabra");

        btnEliminarPalabra.addEventListener("click", (e) => {
            e.preventDefault();
            eliminarPalabra(palabra);
            if(palabras.length <= 9){
                // inicioJuego = false;
                toastr["error"]("Tienes que agregar mas palabras", "Error");
                gameContains.classList.add("d-n");
                // inicioJuego = false;

                return;
            }
            
            if(inicioJuego == true){
                reiniciarTablero();
            }
            

        });

        palabraElemento.appendChild(parrafo);
        palabraElemento.appendChild(btnEliminarPalabra);
        listaPalabrasDiv.appendChild(palabraElemento);
    });

    palabraAEncontrar.textContent = `Palabras a encontrar (${palabras.length}):`;
}


function iniciarJuego() {
    
    if(inicioJuego == true){
        toastr["error"]("El juego ya inicio", "Error");
        return;
    }
    if (palabras.length >= 10 && palabras.length < 16){
        inicioJuego = true;
    }
    // inicioJuego = true;
    stylee.classList.add("grid")
    if (palabras.length === 0) {
        toastr["error"]("Es Obligatorio Colocar Almenos 10 Palabras Para Iniciar", "Error");
        return;
    }
    if(palabras.length < 10){
        toastr["error"]("requieres al menos 10 palabras para poder iniciar el juego", "Error");
        return;
    }
    if(palabras.length > 16){
        toastr["error"]("El maximo de palabras es 16", "Error");
        return;
    }
    startCountdown();
    
    const tamañoCuadricula = 16;
    const sopaDeLetras = document.getElementById("sopaDeLetras");
    sopaDeLetras.innerHTML = "";

    const cuadricula = Array.from({ length: tamañoCuadricula }, () => Array(tamañoCuadricula).fill(''));
    palabras.forEach(palabra => colocarPalabraEnCuadricula(palabra, cuadricula, tamañoCuadricula));



    for (let i = 0; i < tamañoCuadricula; i++) {
        for (let j = 0; j < tamañoCuadricula; j++) {
            const celda = document.createElement("div");
            celda.textContent = cuadricula[i][j] || obtenerLetraAleatoria();
            celda.classList.add("celda");
            celda.setAttribute("data-fila", i);
            celda.setAttribute("data-columna", j);
            celda.onmousedown = (event) => comenzarDibujo(event, celda, true);
            celda.onmousemove = (event) => dibujar(event, celda);
            celda.onmouseup = finalizarDibujo;
            sopaDeLetras.appendChild(celda);
        }
    }
    document.addEventListener("mouseup", finalizarDibujo);
}

function colocarPalabraEnCuadricula(palabra, cuadricula, tamañoCuadricula) {
    const direcciones = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 }
    ];
    let colocada = false;
    while (!colocada) {
        const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
        const filaInicio = Math.floor(Math.random() * tamañoCuadricula);
        const columnaInicio = Math.floor(Math.random() * tamañoCuadricula);

        let cabe = true;
        let posicionTemporal = [];
        for (let k = 0; k < palabra.length; k++) {
            const fila = filaInicio + k * direccion.y;
            const columna = columnaInicio + k * direccion.x;
            if (fila < 0 || fila >= tamañoCuadricula || columna < 0 || columna >= tamañoCuadricula || (cuadricula[fila][columna] !== '' && cuadricula[fila][columna] !== palabra[k])) {
                cabe = false;
                break;
            }
            posicionTemporal.push({ fila, columna });

        }
        if (cabe) {
            posicionTemporal.forEach((pos, index) => {
                cuadricula[pos.fila][pos.columna] = palabra[index];
                console.log({ posicionTemporal, cuadricula });
            });
            posicionesPalabras.push({ palabra, posiciones: posicionTemporal });
            colocada = true;
        }
    }
}
function obtenerLetraAleatoria() {
    const letras = "abcdefghijklmnopqrstuvwxyz";
    return letras[Math.floor(Math.random() * letras.length)];
}
function comenzarDibujo(event, celda, si) {
    estaSeleccionado = si;
    seleccionarCelda = celda;
    celdasSeleccionadas = [celda];
    celda.classList.add("seleccionada");
}
function dibujar(event, celda) {
    if (estaSeleccionado && !celdasSeleccionadas.includes(celda)) {
        const ultimaCelda = celdasSeleccionadas[celdasSeleccionadas.length - 1];
        const filaInicio = parseInt(seleccionarCelda.getAttribute("data-fila"));
        const columnaInicio = parseInt(seleccionarCelda.getAttribute("data-columna"));
        const filaActual = parseInt(celda.getAttribute("data-fila"));
        const columnaActual = parseInt(celda.getAttribute("data-columna"));
        const deltaFila = filaActual - filaInicio;
        const deltaColumna = columnaActual - columnaInicio;
        if (Math.abs(deltaFila) === Math.abs(deltaColumna) || deltaFila === 0 || deltaColumna === 0) {
            celda.classList.add("seleccionada");
            celdasSeleccionadas.push(celda);
        }
    }
}
let timeLeft = 600;

function finalizarDibujo() {
    if (estaSeleccionado) {
        const palabraSeleccionada = celdasSeleccionadas.map(celda => celda.textContent).join('');
        const palabraInversa = celdasSeleccionadas.map(celda => celda.textContent).reverse().join('');
        if (palabras.includes(palabraSeleccionada) || palabras.includes(palabraInversa)) {
            celdasSeleccionadas.forEach(celda => {
                celda.classList.remove("seleccionada");
                celda.classList.add("encontrada");
            });
            let timeLeftInt = parseInt(timeLeft);
            // console.log(timeLeftInt);
            palabrasEncontradas++;
            
            let nPuntajeAlto = 1000;
            let nPuntajeMedioAlto = 800;
            let nPuntajeMedio = 600;
            let nPuntajeBajo = 200;
            if(palabrasEncontradas == palabras.length && timeLeft >= 570){
                puntaje = puntaje + nPuntajeAlto;
                puntaje = (puntaje + nPuntajeMedioAlto + nPuntajeMedio + nPuntajeBajo) * 3;
                puntajeHTML.innerHTML = puntaje;
            }else if(palabrasEncontradas == palabras.length && timeLeft >= 540){
                puntaje = puntaje + nPuntajeAlto;
                puntaje = puntaje + nPuntajeMedioAlto + nPuntajeMedio + nPuntajeBajo;
                puntajeHTML.innerHTML = puntaje;
            }else if(palabrasEncontradas > 6 && timeLeft >= 480){
                puntaje = puntaje + nPuntajeMedioAlto;
                puntajeHTML.innerHTML = puntaje;
            }else if(palabrasEncontradas >= 3 && timeLeft >= 420){
                puntaje = puntaje + nPuntajeMedio;
                puntajeHTML.innerHTML = puntaje;
            } else if (timeLeft > 300) {
                puntaje = puntaje + nPuntajeBajo;
                puntajeHTML.innerHTML = puntaje;
            }


            if (palabrasEncontradas === palabras.length) {
                toastr["success"]("Haz Finalizado el Juego!", "Felicidades!!!");
                container.style.zIndex = 100
                fireworks.start();
                const celdaHTML = document.querySelectorAll('.celda');
                celdaHTML.forEach((celda) => {
                    celda.classList.add("juego");
                })

                setInterval(() => {
                    document.location.reload();
                }, 10000);

            }
            const parra = document.querySelectorAll(".palabras-text");
            parra.forEach((palabra) => {
                if (palabra.textContent === palabraSeleccionada || palabra.textContent === palabraInversa) {
                    palabra.classList.add("line");
                    if (palabras.length !== 1) {
                        toastr["success"]("Haz encontrado " + ` "${palabra.textContent}"`, "Bien Ahi!");
                    }

                }
            })
        } else if (!palabras.includes(palabraSeleccionada)) {
            celdasSeleccionadas.forEach(celda => celda.classList.remove("seleccionada"));
        }
        celdasSeleccionadas = [];
        estaSeleccionado = false;
    }
}


// function puntajeFunction(puntaje) {
//     const countdownElement = document.getElementById('countdown');
 

//     // Puedes usar `timeLeft` para validar el tiempo restante
//     console.log(`Tiempo restante: ${timeLeft} segundos`);
//     // Realiza cualquier validación o lógica basada en `timeLeft`
//     // Ejemplo: Si el tiempo restante es menor a cierto valor, hacer algo
//     if (timeLeft < 300) { // Ejemplo: Si quedan menos de 5 minutos
//         console.log('Quedan menos de 5 minutos!');
//     }
// }

function startCountdown() {
    // Obtener el elemento del contador
    const countdownElement = document.getElementById('countdown');

    // Función para actualizar el contador cada segundo
    const countdownInterval = setInterval(() => {
        // Calcular los minutos y segundos restantes
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        // Formatear los minutos y segundos como cadenas con dos dígitos
        let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        // Mostrar el tiempo restante en el elemento del contador
        countdownElement.textContent = formattedMinutes + ':' + formattedSeconds;

        // Decrementar el tiempo restante en un segundo
        timeLeft--;

        // Detener el cronómetro cuando el tiempo llegue a cero
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "00:00"; // Mostrar 00:00 cuando el tiempo llega a cero
            window.location.href = "juego.html"
        }
    }, 1000); // Actualizar el contador cada segundo
}
