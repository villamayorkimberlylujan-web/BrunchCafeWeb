// =========================================================================
//                  institutoV2.js - Lógica Completa
// =========================================================================

// --- NAVEGACIÓN (Mostrar/Ocultar Secciones) ---

const SECCIONES = document.querySelectorAll('.seccion');
const NAV_BUTTONS = document.querySelectorAll('nav button');

function mostrarSeccion(idSeccion) {
    // 1. Ocultar todas las secciones y resetear estilos de botones
    SECCIONES.forEach(s => s.classList.add('hidden'));
    NAV_BUTTONS.forEach(btn => btn.classList.remove('font-extrabold', 'underline', 'text-blue-900'));
    
    // 2. Mostrar la sección solicitada
    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
        seccionActiva.classList.remove('hidden');
    }

    // 3. Resaltar el botón activo
    const botonActivo = document.querySelector(`nav button[data-id="${idSeccion}"]`);
    if (botonActivo) {
        botonActivo.classList.add('font-extrabold', 'underline', 'text-blue-900');
    }

    // 4. Si se carga el listado, actualizar la tabla
    if (idSeccion === 'listado') {
        cargarAlumnos();
    }
}

// Inicialización: Mostrar la sección 'home' por defecto
document.addEventListener('DOMContentLoaded', () => {
    // La primera carga del script activa la sección 'home'
    mostrarSeccion('home');
    cargarAlumnos(); // Carga la lista inicial al empezar
    actualizarOpcionesCurso(); // Llena el dropdown de filtrado
});


// --- CLIMA (Widget de la Home) ---

// **NOTA: Debes reemplazar esta clave con una válida de OpenWeatherMap**
const apiKey = "ab1aa1b81bb50ba27432a398bab06ab7"; // Clave de ejemplo
const buscarBtn = document.getElementById("buscarBtn");
const ciudadInput = document.getElementById("ciudadInput");
const climaResultado = document.getElementById("climaResultado");

// Event Listeners para buscar
buscarBtn.addEventListener("click", obtenerClima);
ciudadInput.addEventListener("keypress", e => { if (e.key === "Enter") obtenerClima(); });

async function obtenerClima() {
    const ciudad = ciudadInput.value.trim();
    if (!ciudad) return alert("Ingrese una ciudad.");

    climaResultado.innerHTML = "<p class='text-gray-500'>Cargando...</p>";

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&lang=es&units=metric`);
        const data = await res.json();
        
        if (data.cod !== 200) {
            return climaResultado.innerHTML = `<p class='text-red-500'>❌ Ciudad no encontrada o error en la clave API.</p>`;
        }

        climaResultado.innerHTML = `
            <div class="flex flex-col items-center space-y-2 mt-4 animate-fadeIn">
                <h3 class="text-2xl font-bold text-blue-800">${data.name}, ${data.sys.country}</h3>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="w-20 h-20">
                <p class="capitalize text-lg text-gray-700 font-medium">${data.weather[0].description}</p>
                <p class="text-5xl font-extrabold text-blue-700">${Math.round(data.main.temp)}°C</p>
                <p class="text-gray-600">Sensación térmica: ${Math.round(data.main.feels_like)}°C</p>
                <div class="flex justify-center gap-6 mt-3 text-sm text-gray-700">
                    <p>💧 Humedad: ${data.main.humidity}%</p>
                    <p>🌬️ Viento: ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
                </div>
            </div>`;
    } catch (error) {
        climaResultado.innerHTML = `<p class='text-red-500'>Hubo un error al intentar conectarse.</p>`;
    }
}


// --- CRUD DE ALUMNOS (Cargar y Listar) ---

const formAlumno = document.getElementById('formAlumno');
const tablaAlumnos = document.getElementById('tablaAlumnos'); 
const filtroCurso = document.getElementById('filtroCurso');
const formMessage = document.getElementById('formMessage');

// Inicializa el array de alumnos desde el Local Storage o como array vacío
let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

// Event Listener para guardar alumno
formAlumno.addEventListener('submit', guardarAlumno);
// Event Listener para filtrar por curso
filtroCurso.addEventListener('change', cargarAlumnos);


// Función para guardar alumno con validación (REQUISITO)
function guardarAlumno(e) {
    e.preventDefault(); // Detiene la recarga de la página

    const dni = document.getElementById('dni').value.trim();
    
    // 1. Validación de DNI existente
    if (alumnos.some(alumno => alumno.dni === dni)) {
        formMessage.className = 'md:col-span-2 text-center py-2 rounded-lg bg-red-100 text-red-700';
        formMessage.textContent = '❌ Error: Ya existe un alumno con ese DNI.';
        formMessage.classList.remove('hidden');
        return;
    }

    // 2. Creación del objeto alumno
    const nuevoAlumno = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        dni: dni,
        curso: document.getElementById('curso').value,
        email: document.getElementById('email').value.trim()
    };
    
    // 3. Guardar en el array y Local Storage
    alumnos.push(nuevoAlumno);
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
    
    // 4. Mostrar éxito y limpiar
    formMessage.className = 'md:col-span-2 text-center py-2 rounded-lg bg-green-100 text-green-700';
    formMessage.textContent = '✅ Alumno guardado con éxito.';
    formMessage.classList.remove('hidden');
    formAlumno.reset();

    // 5. Actualizar la lista y las opciones de filtro
    cargarAlumnos();
    actualizarOpcionesCurso(); 
}

// Función para actualizar el dropdown de filtro
function actualizarOpcionesCurso() {
    const cursosExistentes = [...new Set(alumnos.map(a => a.curso))].sort();
    
    // Guardar la opción seleccionada actualmente
    const cursoSeleccionado = filtroCurso.value;
    
    filtroCurso.innerHTML = '<option value="todos">Mostrar todos los cursos</option>';
    cursosExistentes.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        filtroCurso.appendChild(option);
    });

    // Re-seleccionar la opción si existe, sino seleccionar "todos"
    filtroCurso.value = cursosExistentes.includes(cursoSeleccionado) ? cursoSeleccionado : 'todos';
}

// Función para cargar y mostrar alumnos en la tabla (incluye Filtrado)
function cargarAlumnos() {
    // Recargar el array desde el Storage por si otra función lo modificó
    alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    tablaAlumnos.innerHTML = '';
    
    const cursoAFiltrar = filtroCurso.value;
    const alumnosFiltrados = cursoAFiltrar === 'todos' 
                             ? alumnos 
                             : alumnos.filter(a => a.curso === cursoAFiltrar);

    if (alumnos.length === 0) {
        tablaAlumnos.innerHTML = '<tr><td colspan="6" class="py-4 text-gray-500">No hay alumnos cargados.</td></tr>';
        return;
    }
    
    if (alumnosFiltrados.length === 0) {
        tablaAlumnos.innerHTML = `<tr><td colspan="6" class="py-4 text-orange-500">No hay alumnos en el curso ${cursoAFiltrar}.</td></tr>`;
        return;
    }

    alumnosFiltrados.forEach((alumno) => {
        const fila = document.createElement('tr');
        fila.classList.add('hover:bg-sky-50', 'transition');

        fila.innerHTML = `
            <td class="py-2 px-3 border border-gray-200">${alumno.nombre}</td>
            <td class="py-2 px-3 border border-gray-200">${alumno.apellido}</td>
            <td class="py-2 px-3 border border-gray-200 font-semibold">${alumno.curso}</td>
            <td class="py-2 px-3 border border-gray-200">${alumno.dni}</td>
            <td class="py-2 px-3 border border-gray-200">${alumno.email}</td>
            <td class="py-2 px-3 border border-gray-200">
                <button onclick="eliminarAlumno('${alumno.dni}')" class="text-red-600 hover:text-red-800 font-semibold transition">
                    🗑️ Eliminar
                </button>
            </td>
        `;
        tablaAlumnos.appendChild(fila);
    });
}

// Función para eliminar (Eliminar del CRUD)
function eliminarAlumno(dni) {
    if (confirm(`¿Estás seguro de eliminar el alumno con DNI ${dni}? Esta acción no se puede deshacer.`)) {
        
        // Filtrar y crear un nuevo array sin el alumno a eliminar
        alumnos = alumnos.filter(alumno => alumno.dni !== dni); 
        
        // Guardar la nueva lista en Local Storage
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        
        // Recargar la tabla y opciones de filtro
        cargarAlumnos(); 
        actualizarOpcionesCurso();
    }
}

// Función para borrar todos los datos (Opcional, pero útil para testing)
function limpiarStorage() {
    if (confirm('ADVERTENCIA: ¿Desea eliminar TODA la información de alumnos guardada?')) {
        localStorage.removeItem('alumnos');
        alumnos = [];
        cargarAlumnos();
        actualizarOpcionesCurso();
        alert('Datos de alumnos eliminados con éxito.');
        mostrarSeccion('home');
    }
}