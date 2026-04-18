// 1. PEGA AQUÍ TU CONFIGURACIÓN REAL (La misma de script.js)
const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "bot-entradas.firebaseapp.com",
    projectId: "bot-entradas",
    storageBucket: "bot-entradas.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// 2. INICIALIZAR FIREBASE (Esto es lo que falta y causa el error)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3. LA FUNCIÓN DE REGISTRO
async function registrarEntrada() {
    const nombre = document.getElementById("regNombre").value.trim();
    const dni = document.getElementById("regDni").value.trim();
    const statusDiv = document.getElementById("status");

    if (nombre === "" || dni === "") {
        alert("El Nombre y el DNI son obligatorios");
        return;
    }

    try {
        // Guardamos usando el DNI como nombre del documento
        await db.collection("entradas").doc(dni).set({
            nombre: nombre,
            dni: dni,
            ingreso: false,
            fechaVenta: new Date().toLocaleString()
        });

        statusDiv.innerHTML = `<div class="alert alert-success">✅ Registrado con DNI: ${dni}</div>`;
        
        // Limpiar campos para la siguiente venta
        document.getElementById("regNombre").value = "";
        document.getElementById("regDni").value = "";
        document.getElementById("regNombre").focus();

    } catch (error) {
        // Si hay error de permisos, aquí nos dirá exactamente por qué
        console.error("Error al guardar:", error);
        statusDiv.innerHTML = `<div class="alert alert-danger">❌ Error: ${error.message}</div>`;
    }
}