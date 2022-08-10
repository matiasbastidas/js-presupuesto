const balance = document.getElementById("balance")
const entrada = document.getElementById("ingreso")
const salida = document.getElementById("gasto")
const lista = document.getElementById("lista")
const formulario = document.getElementById("formulario")
const texto = document.getElementById("texto")
const monto = document.getElementById("monto")

// Obtener transacciones del localstorage
const localStorageTransacciones = JSON.parse(localStorage.getItem("transacciones"))

let transacciones = localStorage.getItem("transacciones") !== null ? localStorageTransacciones : []

const agregarTransaccion = (e) => {
    e.preventDefault()
    if (texto.value.trim() === "" || monto.value.trim() === "") {document.getElementById("mensaje_error").innerHTML = 
    "<span >Error: Porfavor ingresar nombre/descripción y un monto</span>"
    setTimeout(
        () => (document.getElementById("mensaje_error").innerHTML = ""),
        5000
    )
    } else {
        const transaccion = {
            id: generarID(),
            texto: texto.value,
            monto: +monto.value,
        }
    transacciones.push(transaccion)
    agregarTransaccionDOM(transaccion)
    actualizarValores()
    actualizarLocalStorage()
    texto.value = ""
    monto.value = ""
    }
}


// Generar un ID random
const generarID = () => {
    return Math.floor(Math.random() * 100000000)
}


// Historial de transacciones
const agregarTransaccionDOM = (transaccion) => {
    // Obtener signo
    const signo = transaccion.monto < 0 ? "-" : "+"
    
    const item = document.createElement("li")

  // Agregar clase basado en el signo del monto
    item.classList.add(transaccion.monto < 0 ? "menos" : "mas")

    item.innerHTML = `
    ${transaccion.texto} ${signo}${Math.abs(transaccion.monto
    )} <button class="eliminar-btn" onclick="eliminarTransaccion(${transaccion.id
    })">X</button>`
    
    lista.appendChild(item)
}


const actualizarValores = () => {
    const montos = transacciones.map((transaccion) => transaccion.monto)

    const total = montos.reduce((bal, value) => (bal += value), 0)

    const ingreso = montos.filter((value) => value > 0)
    .reduce((bal, value) => (bal += value), 0)

    const gasto = montos.filter((value) => value < 0)
    .reduce((bal, value) => (bal += value), 0) * -(1)

    balance.innerText = `$${total}`
    entrada.innerText = `$${ingreso}`
    salida.innerText = `$${gasto}`
}



// Eliminar transaccion por ID
const eliminarTransaccion = (id) => {
    transacciones = transacciones.filter((transaccion) => transaccion.id !== id)

    actualizarLocalStorage()

    iniciar()
}



// Actualizar transacciones en el localstorage
const actualizarLocalStorage = () => {
    localStorage.setItem("transacciones", JSON.stringify(transacciones))
}

// Iniciar app
const iniciar = () => {
    lista.innerHTML = ""
    transacciones.forEach(agregarTransaccionDOM)
    actualizarValores()
}

iniciar()

formulario.addEventListener("submit", agregarTransaccion)