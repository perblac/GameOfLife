/**
 * @author Ruben Perblac
 * @description A small game of life
 */
let boton = document.getElementById("Iniciar");
boton.onclick = function () {
    ejecutar(
        boton.form.ancho.value,
        boton.form.alto.value,
        boton.form.velocidad.value,
        boton.form.ciclos.value);
};

function ejecutar(ancho, alto, velocidad, ciclos) {
    let celdas = crearArrayDeCeldas(ancho, alto);
    generarTabla(ancho, alto, celdas);
    celdas = inicializarCeldas(celdas);
    // Ejecución
    let timer = 0;
    for (let i = 1; i <= ciclos; i++) {
        timer = i * velocidad;
        setTimeout(() => {
            pintar(celdas);
            celdas = paso(celdas);
        }, timer);
    }
}

function paso(celdas) {
    // Recorremos las celdas
    for (let celda of celdas) {
        // Si la celda esta viva (estado = 1) aumentamos la edad
        if (celda.estado == 1)
            celda.edad++;

        // Recorremos los vecinos para ver cuantos vivos hay
        let cuentaVecinos = 0; // número de celdas adyacentes vivas

        const adyacentes = new Set();
        for (let vecino of Object.entries(celda.vecinos)) {
            // Object.entries --> [ [nombre_vecino,{x,y}], ...]
            // Sumamos el estado de la celda vecina:
            // - sacamos la posicion del vecino vx, vy
            [, {
                    x: vx,
                    y: vy
                }
            ] = vecino;

            adyacentes.add([vx, vy]);
        }

        // - para sumar el estado del vecino:
        cuentaVecinos += celdas
        .filter(
            /* filtramos la posicion vx, vy que es la celda vecina */
            (celdaExaminada) => {
            for (let arr of adyacentes) {
                if (celdaExaminada.x == arr[0] && celdaExaminada.y == arr[1])
                    return true;
            }
            return false;
        })
        .map(/* y sacamos su estado */(celdaVecina) => celdaVecina.estado).reduce((ac, e) => ac + e);

        // Comprobamos si la celda vive o muere en el siguiente ciclo:
        // menos de 2 vecinos -> inanicion
        // mas de 3 vecinos -> superpoblacion
        // 3 vecinos exactos -> nacimiento
        if (cuentaVecinos < 2 || cuentaVecinos > 3) {
            celda.siguienteEstado = 0;
            celda.edad = 0;
        } else if (cuentaVecinos == 3) {
            celda.siguienteEstado = 1;
        } else
            celda.siguienteEstado = celda.estado;
    }

    // Cambio de estados al siguiente ciclo
    for (let celda of celdas) {
        celda.estado = celda.siguienteEstado;
    }

    return celdas;
}

// Creación del array de celdas
function crearArrayDeCeldas(ancho, alto) {
    const finalX = ancho - 1;
    const finalY = alto - 1;
    const celdas = [];
    for (let j = 0; j < alto; j++) {
        for (let i = 0; i < ancho; i++) {
            const celda = {};
            const nombre = `X${i.toString().padStart(2, "0")}-Y${j.toString().padStart(2, "0")}`;
            celda.nombre = nombre;
            celda.x = i;
            celda.y = j;
            celda.vecinos = {};
            // vecino Superior Izquierda
            celda.vecinos.si = {};{
                let x = i > 0 ? i - 1 : finalX;
                let y = j > 0 ? j - 1 : finalY;
                celda.vecinos.si.x = x;
                celda.vecinos.si.y = y;
            }
            // vecino Superior Centro
            celda.vecinos.sc = {};{
                let x = celda.x;
                let y = j > 0 ? j - 1 : finalY;
                celda.vecinos.sc.x = x;
                celda.vecinos.sc.y = y;
            }
            // vecino Superior Derecha
            celda.vecinos.sd = {};{
                let x = i < finalX ? i + 1 : 0;
                let y = j > 0 ? j - 1 : finalY;
                celda.vecinos.sd.x = x;
                celda.vecinos.sd.y = y;
            }
            // vecino Centro Izquierda
            celda.vecinos.ci = {};{
                let x = i > 0 ? i - 1 : finalX;
                let y = celda.y;
                celda.vecinos.ci.x = x;
                celda.vecinos.ci.y = y;
            }
            // vecino Centro Derecha
            celda.vecinos.cd = {};{
                let x = i < finalX ? i + 1 : 0;
                let y = celda.y;
                celda.vecinos.cd.x = x;
                celda.vecinos.cd.y = y;
            }
            // vecino Inferior Izquierda
            celda.vecinos.ii = {};{
                let x = i > 0 ? i - 1 : finalX;
                let y = j < finalY ? j + 1 : 0;
                celda.vecinos.ii.x = x;
                celda.vecinos.ii.y = y;
            }
            // vecino Inferior Centro
            celda.vecinos.ic = {};{
                let x = celda.x;
                let y = j < finalY ? j + 1 : 0;
                celda.vecinos.ic.x = x;
                celda.vecinos.ic.y = y;
            }
            // vecino Inferior Derecha
            celda.vecinos.id = {};{
                let x = i < finalX ? i + 1 : 0;
                let y = j < finalY ? j + 1 : 0;
                celda.vecinos.id.x = x;
                celda.vecinos.id.y = y;
            }
            celda.estado = 0;
            celda.edad = 0;
            celda.siguienteEstado = 0;

            // Pasa la celda al array de celdas
            celdas.push(celda);
        }
    }
    return celdas;
}

// Inicialización de celdas aleatoria
function inicializarCeldas(celdas) {
    for (let celda of celdas) {
        celda.estado = Math.floor(Math.random() * 2);
    }
    return celdas;
}

/*
// slider{
celdas[1].estado = 1;
celdas[10].estado = 1;
celdas[16].estado = 1;
celdas[17].estado = 1;
celdas[18].estado = 1;
}
 */

/*
// lwss
{
celdas[17].estado = 1;
celdas[18].estado = 1;
celdas[19].estado = 1;
celdas[20].estado = 1;
celdas[24].estado = 1;
celdas[28].estado = 1;
celdas[36].estado = 1;
celdas[40].estado = 1;
celdas[43].estado = 1;
}
 */

function pintar(celdas) {
    // representar celdas
    for (let celda of celdas) {
        let casilla = document.getElementById(celda.nombre);
        if (casilla != null) {
            if (celda.estado == 1) {
                casilla.style.backgroundColor = "black";
            } else {
                casilla.style.backgroundColor = "white";
            }
        }
    }
}

function generarTabla(ancho, alto, celdas) {
    const datosTabla = celdas
        .map((celda) => {
        const numCelda = celda.x + ancho * celda.y;
        let salida = numCelda == 0 || numCelda % ancho == 0 ? `<tr>` : "";
        salida += `<td id="${celda.nombre}"></td>`;
        salida += (numCelda + 1) % ancho == 0 ? `</tr>` : "";
        return salida;
    })
        .join("");
    const interior = document.querySelector("#tablaInterior");
    interior.innerHTML = datosTabla;
}
