// 1. Configuración de Firebase (PON TUS CLAVES AQUÍ)
const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "bot-entradas.firebaseapp.com",
    projectId: "bot-entradas",
    storageBucket: "bot-entradas.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

// 2. Función de Validación
async function validarAcceso() {
    const input = document.getElementById("inputCodigo");
    const dni = input.value.trim();
    if (!dni) return;

    mostrarMensaje("Buscando...", "secondary");

    try {
        const docRef = db.collection("entradas").doc(dni);
        const doc = await docRef.get();

        if (!doc.exists) {
            mostrarMensaje("❌ NO REGISTRADO", "danger");
        } else {
            const datos = doc.data();
            if (datos.ingreso) {
                mostrarMensaje(`⚠️ YA ENTRÓ: ${datos.nombre}`, "warning");
            } else {
                await docRef.update({ ingreso: true });
                mostrarMensaje(`✅ BIENVENIDO: ${datos.nombre}`, "success");
            }
        }
    } catch (e) { mostrarMensaje("Error de conexión", "danger"); }
    input.value = ""; input.focus();
}

// 3. Función de Mensajes
function mostrarMensaje(texto, tipo) {
    const resDiv = document.getElementById("resultado");
    const colores = { success: "#28a745", danger: "#dc3545", warning: "#ffc107", secondary: "#6c757d" };
    resDiv.innerHTML = `<h5>${texto}</h5>`;
    resDiv.style.backgroundColor = colores[tipo];
    resDiv.style.color = "white";
}

// 4. Carga de Datos y Tabla en Tiempo Real
function inicializarApp() {
    const tabla = document.getElementById("tablaAsistentes");
    const cTotal = document.getElementById("countTotal");
    const cIngresos = document.getElementById("countIngresos");
    const cFaltan = document.getElementById("countFaltan");

    db.collection("entradas").onSnapshot((snapshot) => {
        let lista = [];
        let ingresados = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            lista.push(data);
            if (data.ingreso) ingresados++;
        });

        // Actualizar Contadores
        cTotal.innerText = lista.length;
        cIngresos.innerText = ingresados;
        cFaltan.innerText = lista.length - ingresados;

        // Ordenar y Dibujar
        lista.sort((a, b) => parseInt(b.dni) - parseInt(a.dni));
        tabla.innerHTML = "";
        lista.forEach(p => {
            tabla.innerHTML += `<tr>
                <td>${p.dni}</td>
                <td>${p.nombre}</td>
                <td><span class="badge ${p.ingreso ? 'bg-success' : 'bg-secondary'}">${p.ingreso ? 'ADENTRO' : 'PENDIENTE'}</span></td>
            </tr>`;
        });
    });
}

// 5. Filtro de Búsqueda
function filtrarTabla() {
    const texto = document.getElementById("buscadorTabla").value.toLowerCase();
    const filas = document.querySelectorAll("#tablaAsistentes tr");
    filas.forEach(f => f.style.display = f.innerText.toLowerCase().includes(texto) ? "" : "none");
}

// ARRANCAR TODO
window.onload = inicializarApp;