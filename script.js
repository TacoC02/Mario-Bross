// ================== Obtención de elementos HTML con querySelector ==================
// Variables para almacenar referencias a elementos HTML del DOM

let nivel = document.querySelector(".nivel");        // Variable para gestionar el nivel actual del juego
let puntaje = document.querySelector(".score");        // Variable para llevar la puntuación del jugador
let bandera = document.querySelector(".bandera");         // Referencia a la bandera del nivel
let botonCambiarColor = document.querySelector(".cambiar-color");     // Botón para cambiar el color de fondo
let botonFinalizarJuego = document.querySelector(".finalizar");         // Botón para terminar el juego

// ================== Estado del Juego ==================
// Variables que controlan el movimiento y acciones de Mario

let derechaPresionado = false; // Indica si la tecla derecha está presionada
let izquierdaPresionado = false; // Indica si la tecla izquierda está presionada
let abajoPresionado = false; // Indica si la tecla abajo (agacharse) está presionada
let saltarPresionado = 0; // Contador para gestionar el salto
let tiempoDeSalto = 10; // Duración total del salto en ciclos (frames)
let juegoActivo = true; // Estado general del juego (true = en marcha)

// Puedes agregar aquí variables adicionales para gestionar otros aspectos del estado de Mario
// por ejemplo: si Mario está grande, si tiene monedas, etc.

let marioGrande = false;
let TieneMoneda = false;
let yoshiMario = false;

// ================== Elementos de personajes y objetos ==================
// Referencias a elementos HTML relacionados con personajes y objetos del juego

let mario = document.querySelector(".mario"); // Elemento HTML de Mario
let moneda = document.querySelector(".moneda"); // Elemento HTML de una moneda
let hongo = document.querySelector(".hongo"); // Elemento HTML de un hongo
let boomBoom = document.querySelector(".boomBoom");
let yoshi = document.querySelector(".yoshi");

// ================== Configuración de enemigos ==================
// Parámetros y referencias para los enemigos en el escenario

// Enemigo Goomba
let goomba = document.querySelector(".goomba");
let goombaDireccion = 1; // 1 = mueve hacia la derecha, -1 = hacia la izquierda
const goombaVelocidad = 5; // Velocidad de movimiento en píxeles por ciclo
const limiteIzquierdaGoomba = 300; // Límite izquierdo en píxeles
const limiteDerechaGoomba = 600; // Límite derecho en píxeles

// Enemigo Goomba_alado
let goombaAlado = document.querySelector(".goombaAlado");
let goombaAladoDireccion = 1; // Dirección inicial
const goombaAladoVelocidad = 5; // Velocidad en px
const limiteIzquierdaGoombaAlado = 900;
const limiteDerechaGoombaAlado = 1200;

// Enemigo BoomBoom
let boomBoomDireccion = 1;
const boomBoomVelocidad = 9; // 
const limiteSuperiorBoomBoom = 20; 
const limiteInferiorBoomBoom = 143;

// ================== Recursos de sonido ==================
// Carga de efectos de sonido ubicados en la carpeta "sonidos"

const TemaFondo = new Audio("./sonidos/Theme.wav"); // Música de fondo
const sonidoMuerte = new Audio("./sonidos/Die.wav");
const GameOver = new Audio("./sonidos/Game_over.wav");
const SonidoMoneda = new Audio("./sonidos/Coin.wav");
const SonidoSalto = new Audio("./sonidos/Jump.wav");
const LevelClear = new Audio("./sonidos/Level_Clear.wav");
const Pause = new Audio("./sonidos/Pause.wav");
const Powerup = new Audio("./sonidos/Powerup.wav");
const SonidoYoshi = new Audio("./sonidos/Sonido_yoshi.mp3");


// ================== Ciclo principal del juego ==================
// Ejecuta el ciclo del juego cuando la ventana se carga
window.onload = () => {
  gameLoop(); // Inicia el ciclo de actualización continua
};

// Función que inicia el ciclo del juego, llamando a 'actualizar' 20 veces por segundo
function gameLoop() {
  setInterval(actualizar, 1000 / 20); // Ejecuta la función 'actualizar' cada 50 ms
}

// ================== Función principal de actualización ==================
// Se ejecuta en cada ciclo del juego para actualizar el estado y movimientos
function actualizar() {
  if (juegoActivo) {
    // Reproduce la música de fondo si aún no se está reproduciendo
    TemaFondo.play();

    // Llamadas a funciones que controlan la lógica del juego
    
    moverGoomba(); // Movimiento del enemigo Goomba
    moverGoombaAlado(); // Movimiento del enemigo Goomba_alado
    detectarColisionGoomba(); // Verificar colisiones con Goomba
    detectarColisionGoombaAlado(); // Verificar colisiones con Goomba_alado
    detectarColisionBandera(); // Verificar si Mario llega a la bandera
    moverBoomBoom();
    detectarColisionBoomBoom();
    agarrarYoshi();

    // Tu objetivo es crear las siguientes funciones:

    derecha(); // Control para mover a Mario a la derecha
    izquierda(); // Control para mover a Mario a la izquierda
    saltar(); // Control del salto
    agarrarMoneda(); // Comprobar si Mario recoge una moneda
    agarrarHongo(); // Comprobar si Mario recoge un hongo
  }
}

// ================== Control de teclado ==================
// Detecta cuando se presionan las teclas y actualiza las variables de control

// Evento para cuando se presiona una tecla
window.addEventListener("keydown", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && !izquierdaPresionado) {
      // Flecha izquierda
      izquierdaPresionado = true;
    } else if (event.keyCode == 39 && !derechaPresionado) {
      // Flecha derecha
      derechaPresionado = true;
    } else if (event.keyCode == 32) {
      // Barra espaciadora para saltar
      if (saltarPresionado == 0) {
        saltarPresionado = 1; // Inicia el salto
      }
    } else if (event.keyCode == 40 && !abajoPresionado && juegoActivo) {
      // Flecha abajo (agacharse)
      abajoPresionado = true;

        if (abajoPresionado == true && marioGrande == false && yoshiMario == false) {

      mario.src = "./imagenes/Mario_Agachado_Peque.png"
      mario.style.width = "33px"
      mario.style.height = "33px"
        }

        if (abajoPresionado == true && marioGrande == true && yoshiMario == false) {

          mario.src = "./imagenes/Mario_Agachado_Grande.png"
                mario.style.width = "60px"
                mario.style.height = "50px"
        }
    }
  }, 1);
});

// Evento para cuando se suelta una tecla
window.addEventListener("keyup", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && izquierdaPresionado) {
      // Soltar flecha izquierda
      izquierdaPresionado = false;
    } else if (event.keyCode == 39 && derechaPresionado) {
      // Soltar flecha derecha
      derechaPresionado = false;
    } else if (event.keyCode == 40 && abajoPresionado) {
      // Soltar abajo (agacharse)
      abajoPresionado = false;

      if (abajoPresionado == false && marioGrande == false && yoshiMario == false) {

      mario.src = "./imagenes/Mario_Peque.gif"
      mario.style.height = "50px"
          }

          if (abajoPresionado == false && marioGrande == true && yoshiMario == false) {

            mario.src = "./imagenes/Mario_Grande.gif";
                  mario.style.width = "80px";
                  mario.style.height = "80px";
          }    


    }
  }, 1);
});


// ================== Funciones de movimiento y acciones ==================
// Control del salto
function saltar() {
  if (saltarPresionado != 0 && saltarPresionado < tiempoDeSalto) {
    
      mario.style.bottom = "120px"
      saltarPresionado++;

    }else{
      mario.style.bottom = "35px"
      saltarPresionado =0;

    }

    
    // Aquí debes agregar la lógica para hacer que Mario salte hacia arriba
    // y gestionar la subida y bajada usando la variable 'saltarPresionado'
  
}

// Movimiento a la derecha
function derecha() {
  if (derechaPresionado) {
    let posicionActual = parseInt(mario.style.left) || 75;
    let pasos = 10;
    let limiteDe = 1300;

    let nuevaPosicion = posicionActual + pasos;
    if (nuevaPosicion <= limiteDe) {
      mario.style.left = nuevaPosicion + "px";
      mario.classList.remove("flip");
    }
    // Aquí agregas la lógica para mover a Mario hacia la derecha
  }
}

// Movimiento a la izquierda
function izquierda() {
  if (izquierdaPresionado) {

    let posicionActual = parseInt(mario.style.left) || 75;
    let pasos = 10;
    let limiteIz = 0;

    let nuevaPosicion = posicionActual - pasos;
    if (nuevaPosicion >= limiteIz) {
      mario.style.left = nuevaPosicion + "px";
      mario.classList.add("flip");
    }
    // Aquí agregas la lógica para mover a Mario hacia la izquierda
  }
}

// ================== Funciones de recolección de objetos ==================
// Detecta si Mario recoge una moneda
function agarrarMoneda() {
  if (moneda.style.display != "none") {
    let monedaPos= moneda.getBoundingClientRect();
    let marioPosA = mario.getBoundingClientRect();
  
    if (
      marioPosA.left < monedaPos.right &&
      marioPosA.right > monedaPos.left &&
      marioPosA.bottom > monedaPos.top &&
      marioPosA.top < monedaPos.bottom
    ) {
      moneda.style.display = "none";
      SonidoMoneda.play();
      puntaje.innerHTML = parseInt(puntaje.innerHTML) + 1;
      TieneMoneda = true;
  
    // Lógica para que Mario recoja la moneda, por ejemplo:
    // moneda.style.display = "none";
    // incrementar puntaje, etc.
  }
  }
}

// Detecta si Mario recoge a Yoshi
function agarrarYoshi() {
  if (yoshi.style.display != "none") {
    let yoshiPos= yoshi.getBoundingClientRect();
    let marioPosY = mario.getBoundingClientRect();
  
    if (
      marioPosY.left < yoshiPos.right &&
      marioPosY.right > yoshiPos.left &&
      marioPosY.bottom > yoshiPos.top &&
      marioPosY.top < yoshiPos.bottom
    ) {
      yoshi.style.display = "none";
      mario.src = "./imagenes/Mario_y_Yoshi.gif"
      mario.style.height = "70px"
      SonidoYoshi.play();
      puntaje.innerHTML = parseInt(puntaje.innerHTML) + 1;
      yoshiMario = true;
  }
  }
}

// Detecta si Mario recoge un hongo
function agarrarHongo() {
  if (hongo.style.display != "none") {
    let hongoPos= hongo.getBoundingClientRect();
    let marioPosB = mario.getBoundingClientRect();
  
    if (
      marioPosB.left < hongoPos.right &&
      marioPosB.right > hongoPos.left &&
      marioPosB.bottom > hongoPos.top &&
      marioPosB.top < hongoPos.bottom &&
      yoshiMario == false
    ) {

      hongo.style.display = "none"
      Powerup.play()
      mario.src = "./imagenes/Mario_Grande.gif"
      mario.style.width = "80px"
      mario.style.height = "80px"
      marioGrande = true;
    }
    
    // Lógica para que Mario recoja el hongo
    // por ejemplo, hacer crecer a Mario
  }
}



// ================== Movimiento de enemigos ==================
// Función que anima el movimiento constante del Goomba
function moverGoomba() {
  if (juegoActivo) {
    let posicionActual = parseInt(goomba.style.left) || 600;
    let nuevaPosicion = posicionActual + goombaVelocidad * goombaDireccion;

    // Cambio de dirección si llega a los límites
    if (nuevaPosicion >= limiteDerechaGoomba) {
      nuevaPosicion = limiteDerechaGoomba;
      goombaDireccion = -1; // Cambia a moverse hacia la izquierda
      goomba.classList.remove("flip");
    } else if (nuevaPosicion <= limiteIzquierdaGoomba) {
      nuevaPosicion = limiteIzquierdaGoomba;
      goombaDireccion = 1; // Cambia a moverse hacia la derecha
      goomba.classList.add("flip");
    }
    goomba.style.left = nuevaPosicion + "px"; // Actualiza la posición en pantalla
  }
}

//movimiento de boomBoom
function moverBoomBoom() {
  if (juegoActivo) {
    let posicionActual = parseInt(boomBoom.style.top) || 300; // Posición inicial en píxeles
    let nuevaPosicion = posicionActual + boomBoomVelocidad * boomBoomDireccion;

    // Cambio de dirección si llega a los límites
    if (nuevaPosicion >= limiteInferiorBoomBoom) {
      nuevaPosicion = limiteInferiorBoomBoom;
      boomBoomDireccion = -1; // Cambia a moverse hacia arriba
    } else if (nuevaPosicion <= limiteSuperiorBoomBoom) {
      nuevaPosicion = limiteSuperiorBoomBoom;
      boomBoomDireccion = 1; // Cambia a moverse hacia abajo
    }

    boomBoom.style.top = nuevaPosicion + "px"; // Actualiza la posición en pantalla
  }
}

// Función que anima el movimiento del Goomba_alado
function moverGoombaAlado() {
  if (juegoActivo) {
    let posicionActual = parseInt(goombaAlado.style.left) || 800;
    let nuevaPosicion =
      posicionActual + goombaAladoVelocidad * goombaAladoDireccion;

    if (nuevaPosicion >= limiteDerechaGoombaAlado) {
      nuevaPosicion = limiteDerechaGoombaAlado;
      goombaAladoDireccion = -1; // Cambia a izquierda
      goombaAlado.classList.remove("flip");
    } else if (nuevaPosicion <= limiteIzquierdaGoombaAlado) {
      nuevaPosicion = limiteIzquierdaGoombaAlado;
      goombaAladoDireccion = 1; // Cambia a derecha
      goombaAlado.classList.add("flip");
    }
    goombaAlado.style.left = nuevaPosicion + "px"; // Actualiza la posición
  }
}

// ================== Colisiones con la bandera ==================
// Detecta si Mario llega a la bandera para ganar el nivel
function detectarColisionBandera() {
  let marioPosj = mario.getBoundingClientRect(); // Posición de Mario en pantalla
  let banderaPos = bandera.getBoundingClientRect(); // Posición de la bandera

  if (
    marioPosj.left < banderaPos.right &&
    marioPosj.right > banderaPos.left &&
    marioPosj.bottom > banderaPos.top &&
    marioPosj.top < banderaPos.bottom &&
    TieneMoneda == true
  ) {
    // Cambia la imagen de Mario a la de ganador
    mario.src = "./imagenes/Mario_Gana.png";
    mario.style.width = "70px";
    mario.style.height = "70px";

    // Reproduce sonido de victoria
    LevelClear.play(); // Cambié 'nivel.play()' por 'LevelClear.play()' para usar el sonido correcto
    TemaFondo.pause(); // Detiene la música de fondo
    TemaFondo.currentTime = 0; // Reinicia la música de fondo
    juegoActivo = false; // Detiene el ciclo principal del juego

    // Reinicio del nivel después de 6 segundos
    setTimeout(() => {
      location.reload(); // Recarga la página para reiniciar el nivel
    }, 6000);
  }
}


// ================== Acciones de botones ==================
// Cambiar color de fondo cuando se hace clic en el botón correspondiente
botonCambiarColor.onclick = function () {

  document.body.style.backgroundColor = "white"
  // Agrega aquí la lógica para cambiar el color de fondo
};

// Finalizar el juego cuando se hace clic en el botón correspondiente
botonFinalizarJuego.onclick = function () {
  setTimeout(() => {
    // Agrega aquí la lógica para terminar el juego, como mostrar mensaje o reiniciar
    nivel.innerHTML="Game Over TacoCj";
    TemaFondo.pause();
    GameOver.play();
    juegoActivo =false;
  }, 1);
};

// ================== Colisiones con enemigos ==================
// Detecta colisión entre Mario y BoomBoom
function detectarColisionBoomBoom() {
  let marioPos = mario.getBoundingClientRect(); // Posición de Mario
  let boomBoomPos = boomBoom.getBoundingClientRect(); // Posición de BoomBoom

  if (
    marioPos.left < boomBoomPos.right &&
    marioPos.right > boomBoomPos.left &&
    marioPos.bottom > boomBoomPos.top &&
    marioPos.top < boomBoomPos.bottom &&
    yoshiMario == false
  ) {
    // Colisión detectada: Mario pierde
    juegoActivo = false; // Detiene el juego
    sonidoMuerte.play(); // Reproduce sonido de muerte
    TemaFondo.pause(); // Pausa la música de fondo
    TemaFondo.currentTime = 0; // Reinicia la música de fondo
    mario.src = "./imagenes/Mario_Muerto.png"; // Cambia la imagen de Mario a "muerto"
    mario.style.width = "40px";
    mario.style.height = "40px";

    // Animación de muerte: Mario sube y luego baja
    mario.style.transition = "bottom 0.5s ease";
    mario.style.bottom = "120px"; // Sube para el efecto de muerte
    setTimeout(() => {
      mario.style.bottom = "-120px"; // Baja para el efecto de muerte
      setTimeout(() => {
        location.reload(); // Reinicia el juego después de 2 segundos
      }, 2000);
    }, 1000);
  }

  if (
    marioPos.left < boomBoomPos.right &&
    marioPos.right > boomBoomPos.left &&
    marioPos.bottom > boomBoomPos.top &&
    marioPos.top < boomBoomPos.bottom &&
    yoshiMario == true
  ) {
    boomBoom.src = "./imagenes/Huevo.gif";
    boomBoom.style.height = "50px";
    boomBoom.style.bottom = "28px";
    boomBoomDireccion = 0;
}
}

// Detecta colisión entre Mario y Goomba
function detectarColisionGoomba() {
  let marioPos = mario.getBoundingClientRect();
  let goombaPos = goomba.getBoundingClientRect();

  if (
    marioPos.left < goombaPos.right &&
    marioPos.right > goombaPos.left &&
    marioPos.bottom > goombaPos.top &&
    marioPos.top < goombaPos.bottom &&
    yoshiMario == false
  ) {


    // Colisión detectada: Mario pierde
    juegoActivo = false; // Detiene el juego
    sonidoMuerte.play(); // Reproduce sonido de muerte
    TemaFondo.pause(); // Pausa música
    TemaFondo.currentTime = 0; // Reinicia música
    mario.src = "./imagenes/Mario_Muerto.png"; // Imagen de Mario muerto
    mario.style.width = "40px";
    mario.style.height = "40px";

    // Animación de muerte: hace que Mario suba y baje
    mario.style.transition = "bottom 0.5s ease";
    mario.style.bottom = "120px"; // Sube para efecto
    setTimeout(() => {
      mario.style.bottom = "-120px"; // Baja para efecto
      setTimeout(() => {
        location.reload(); // Reinicia el juego
      }, 2000);
    }, 1000);
  }

  if (
    marioPos.left < goombaPos.right &&
    marioPos.right > goombaPos.left &&
    marioPos.bottom > goombaPos.top &&
    marioPos.top < goombaPos.bottom &&
    yoshiMario == true
  ) {
    goomba.src = "./imagenes/Huevo.gif";
    goomba.style.height = "50px";
    goomba.style.bottom = "28px";
    goombaDireccion = 0;
  }
}

// Detecta colisión con Goomba_alado
function detectarColisionGoombaAlado() {
  let marioPos = mario.getBoundingClientRect();
  let goombaAladoPos = goombaAlado.getBoundingClientRect();

  if (
    marioPos.left < goombaAladoPos.right &&
    marioPos.right > goombaAladoPos.left &&
    marioPos.bottom > goombaAladoPos.top &&
    marioPos.top < goombaAladoPos.bottom &&
    yoshiMario == false
  ) {
    // Colisión detectada: Mario pierde
    juegoActivo = false;
    sonidoMuerte.play();
    TemaFondo.pause();
    TemaFondo.currentTime = 0;
    mario.src = "./imagenes/Mario_Muerto.png"; // Imagen de Mario muerto
    mario.style.width = "40px";
    mario.style.height = "40px";

    // Animación de muerte
    mario.style.transition = "bottom 0.5s ease";
    mario.style.bottom = "120px"; // Subir
    setTimeout(() => {
      mario.style.bottom = "-120px"; // Bajar
      setTimeout(() => {
        location.reload(); // Reiniciar
      }, 2000);
    }, 1000);
  }

  if (
    marioPos.left < goombaAladoPos.right &&
    marioPos.right > goombaAladoPos.left &&
    marioPos.bottom > goombaAladoPos.top &&
    marioPos.top < goombaAladoPos.bottom &&
    yoshiMario == true
  ) {
    goombaAlado.src = "./imagenes/Huevo.gif";
    goombaAlado.style.height = "50px";
    goombaAlado.style.bottom = "28px";
    goombaAladoDireccion = 0;
  }
}

const btnIzquierda = document.querySelector('.btn-movil.izquierda');
const btnDerecha = document.querySelector('.btn-movil.derecha');
const btnAbajo = document.querySelector('.btn-movil.abajo');
const btnSalto = document.querySelector('.btn-movil.salto');

if (btnIzquierda && btnDerecha && btnAbajo && btnSalto) {
  // Izquierda
  btnIzquierda.addEventListener('touchstart', e => {
    e.preventDefault();
    izquierdaPresionado = true;
  });
  btnIzquierda.addEventListener('touchend', e => {
    e.preventDefault();
    izquierdaPresionado = false;
  });

  // Derecha
  btnDerecha.addEventListener('touchstart', e => {
    e.preventDefault();
    derechaPresionado = true;
  });
  btnDerecha.addEventListener('touchend', e => {
    e.preventDefault();
    derechaPresionado = false;
  });

  // Abajo
  btnAbajo.addEventListener('touchstart', e => {
    e.preventDefault();
    abajoPresionado = true;
    //agacharse
    if (abajoPresionado && !marioGrande && !yoshiMario) {
      mario.src = "./imagenes/Mario_Agachado_Peque.png"
      mario.style.width = "33px"
      mario.style.height = "33px"
    }
    if (abajoPresionado && marioGrande && !yoshiMario) {
      mario.src = "./imagenes/Mario_Agachado_Grande.png"
      mario.style.width = "60px"
      mario.style.height = "50px"
    }
  });
  btnAbajo.addEventListener('touchend', e => {
    e.preventDefault();
    abajoPresionado = false;
    //agacharse
    if (!abajoPresionado && !marioGrande && !yoshiMario) {
      mario.src = "./imagenes/Mario_Peque.gif"
      mario.style.height = "50px"
    }
    if (!abajoPresionado && marioGrande && !yoshiMario) {
      mario.src = "./imagenes/Mario_Grande.gif";
      mario.style.width = "80px";
      mario.style.height = "80px";
    }
  });

  // Salto
  btnSalto.addEventListener('touchstart', e => {
    e.preventDefault();
    if (saltarPresionado == 0) {
      saltarPresionado = 1;
    }
  });
  btnSalto.addEventListener('touchend', e => {
    e.preventDefault();

  });
}