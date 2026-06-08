// ==========================================
// 1. DEFINICIÓN DE COMPONENTES (PLANTILLAS)
// ==========================================
// Inyección dinámica de la barra de navegación para demostrar uso de componentes/plantillas
document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("nav-component");
    if (navPlaceholder) {
        navPlaceholder.innerHTML = `
            <h2>Contenido Dinámico</h2>
            <ul>
                <li><a href="index.html">Página Principal</a></li>
                <li><a href="trivia.html">4. Trivia</a></li>
                <li><a href="datos_curiosos.html">5. Datos Curiosos</a></li>
                <li><a href="pelicula.html">6. Película</a></li>
            </ul>
        `;
    }
    
    // Cargar los datos del XML automáticamente si estamos en la página que despliega tablas
    if (document.getElementById("tabla-datos")) {
        cargarYFiltrarXML("todos");
    }
});

// ==========================================================
// 2. RECUPERAR DE UN XML Y 4. FUNCIONES DE FILTRADO DE DATOS
// ==========================================================
function cargarYFiltrarXML(filtroTipo) {
    fetch("datos.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const elementos = xmlDoc.getElementsByTagName("elemento");
            
            let tbody = document.getElementById("tabla-datos");
            tbody.innerHTML = ""; // Limpiar tabla antes de renderizar

            for (let i = 0; i < elementos.length; i++) {
                let tipo = elementos[i].getAttribute("tipo");
                
                // Aplicar lógica de filtrado solicitada
                if (filtroTipo === "todos" || tipo === filtroTipo) {
                    let nombre = elementos[i].getElementsByTagName("nombre")[0].textContent;
                    let ubicacion = elementos[i].getElementsByTagName("ubicacion")[0].textContent;
                    let peligro = elementos[i].getElementsByTagName("peligro")[0].textContent;

                    let fila = `<tr>
                        <td><strong>${nombre}</strong></td>
                        <td>${tipo.toUpperCase()}</td>
                        <td>${ubicacion}</td>
                        <td>${peligro}</td>
                    </tr>`;
                    tbody.innerHTML += fila;
                }
            }
        })
        .catch(err => console.error("Error al leer el XML:", err));
}

// ==========================================================
// 3. VALIDAR DATOS CONTRA EL XML (USUARIOS VÁLIDOS)
// ==========================================================
function validarUsuario() {
    const usernameInput = document.getElementById("username").value.trim();
    const resultadoDiv = document.getElementById("resultado-validacion");

    fetch("datos.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const usuarios = xmlDoc.getElementsByTagName("usuario");
            let usuarioValido = false;
            let rolUsuario = "";

            // Recorrer el XML buscando coincidencia
            for (let i = 0; i < usuarios.length; i++) {
                let usernameXML = usuarios[i].getElementsByTagName("username")[0].textContent;
                if (usernameXML === usernameInput) {
                    usuarioValido = true;
                    rolUsuario = usuarios[i].getElementsByTagName("rol")[0].textContent;
                    break;
                }
            }

            // Desplegar respuesta de la validación
            if (usuarioValido) {
                resultadoDiv.innerHTML = `<p style="color: green;">✔ Acceso concedido. Rol: ${rolUsuario}</p>`;
            } else {
                resultadoDiv.innerHTML = `<p style="color: red;">❌ Usuario no registrado en el XML.</p>`;
            }
        });
}