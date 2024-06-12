const tituloCalendario = document.getElementById('titulo-calendario');
const cuerpoCalendario = document.getElementById('cuerpo-calendario');
const modalEvento = document.getElementById('modal-evento');
const fechaEvento = document.getElementById('fecha-evento');
const horaEvento = document.getElementById('hora-evento');
const descripcionEvento = document.getElementById('descripcion-evento');
const participantesEvento = document.getElementById('participantes-evento');
const tituloModal = document.getElementById('titulo-modal');

function actualizarCalendario() {
    cuerpoCalendario.innerHTML = '';

    switch (vistaActual) {
        case 'mensual':
            actualizarVistaMensual();
            break;
        case 'anual':
            actualizarVistaAnual();
            break;
        case 'diaria':
            actualizarVistaDiaria();
            break;
        default:
            console.error('Vista de calendario no reconocida:', vistaActual);
    }
}
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}


function actualizarVistaDiaria() {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const dia = fechaActual.getDate();
    const claveFecha = `${año}-${mes + 1}-${dia}`;

    const nombreMes = capitalizarPrimeraLetra(fechaActual.toLocaleString('default', { month: 'long' }));
    const nombreDia = capitalizarPrimeraLetra(fechaActual.toLocaleString('default', { weekday: 'long' }));

    tituloCalendario.innerText = `${nombreDia} ${dia} de ${nombreMes}, ${año}`;
    cuerpoCalendario.style.gridTemplateColumns = '1fr';

    cuerpoCalendario.innerHTML = '';

    const elementoDia = document.createElement('div');
    elementoDia.style.padding = '20px';

    elementoDia.style.color = '#fff';

    const textoEvento = eventos[claveFecha] ? `Evento: ` : 'No hay eventos';
    const elementoEvento = document.createElement('div');
    elementoEvento.innerText = textoEvento;
    elementoEvento.style.color = 'black';

    elementoDia.appendChild(elementoEvento);
    cuerpoCalendario.appendChild(elementoDia);
}



const fechaActual = new Date();
let vistaActual = 'mensual';
const eventos = JSON.parse(localStorage.getItem('eventosCalendario')) || {};
let fechaSeleccionada;

function actualizarVistaMensual() {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();

    const nombreMes = capitalizarPrimeraLetra(fechaActual.toLocaleString('default', { month: 'long' }));
    tituloCalendario.innerText = `${nombreMes} ${año}`;

    cuerpoCalendario.innerHTML = '';

    for (let i = 0; i < primerDia; i++) {
        const divVacio = document.createElement('div');
        cuerpoCalendario.appendChild(divVacio);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const elementoDia = document.createElement('div');
        elementoDia.innerText = dia;
        const claveFecha = `${año}-${mes + 1}-${dia}`;
        if (eventos[claveFecha]) {
            elementoDia.classList.add('evento');
            elementoDia.title = `${eventos[claveFecha].descripcion}\n${eventos[claveFecha].participantes}`;
        }
        if (dia === fechaActual.getDate() && mes === fechaActual.getMonth() && año === fechaActual.getFullYear()) {
            elementoDia.classList.add('hoy');
        }
        elementoDia.onclick = () => abrirModal(claveFecha);
        cuerpoCalendario.appendChild(elementoDia);
    }
}


function actualizarVistaAnual() {
    const año = fechaActual.getFullYear();
    const nombreMeses = new Array(12).fill(0).map((_, mes) =>
        capitalizarPrimeraLetra(new Date(año, mes).toLocaleString('default', { month: 'long' }))
    );
    tituloCalendario.innerText = `${año}`;
    cuerpoCalendario.style.gridTemplateColumns = 'repeat(3, 1fr)';

    cuerpoCalendario.innerHTML = '';

    for (let mes = 0; mes < 12; mes++) {
        const elementoMes = document.createElement('div');
        elementoMes.innerText = nombreMeses[mes];
        elementoMes.style.background = '#ffc107';
        elementoMes.style.color = '#fff';
        elementoMes.style.padding = '10px';
        elementoMes.style.margin = '5px';
        elementoMes.style.borderRadius = '5px';
        elementoMes.setAttribute('data-mes', mes);
        elementoMes.onclick = () => {
            const mesSeleccionado = parseInt(elementoMes.getAttribute('data-mes'));
            fechaActual.setMonth(mesSeleccionado);
            vistaActual = 'mensual';
            actualizarCalendario();
        };
        cuerpoCalendario.appendChild(elementoMes);
    }
}


function anterior() {
    if (vistaActual === 'mensual') {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
    } else if (vistaActual === 'anual') {
        fechaActual.setFullYear(fechaActual.getFullYear() - 1);
    } else if (vistaActual === 'diaria') {
        fechaActual.setDate(fechaActual.getDate() - 1);
    }
    actualizarCalendario();
}

function siguiente() {
    if (vistaActual === 'mensual') {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
    } else if (vistaActual === 'anual') {
        fechaActual.setFullYear(fechaActual.getFullYear() + 1);
    } else if (vistaActual === 'diaria') {
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    actualizarCalendario();
}

function guardarCambios() {
    for (let hora = 0; hora < 24; hora++) {
        for (let minuto of [0, 30]) {
            const opcion = document.createElement('option');
            const horaFormateada = hora.toString().padStart(2, '0');
            const minutoFormateado = minuto.toString().padStart(2, '0');
            opcion.value = `${horaFormateada}:${minutoFormateado}`;
            opcion.text = `${horaFormateada}:${minutoFormateado}`;
            horaEvento.appendChild(opcion);
        }
    }
}

function cambiarVista(vista, columnas) {
    vistaActual = vista;
    cuerpoCalendario.style.gridTemplateColumns = columnas;
    actualizarCalendario();
}

function mostrarVistaMensual() {
    cambiarVista('mensual', 'repeat(7, 1fr)');
}

function mostrarVistaAnual() {
    cambiarVista('anual', 'repeat(3, 1fr)');
}

function mostrarVistaDiaria() {
    cambiarVista('diaria', '1fr');
}

function abrirModal(claveFecha) {
    fechaSeleccionada = claveFecha;
    const evento = eventos[claveFecha] || { hora: "00:00", descripcion: '', participantes: '' };

    fechaEvento.value = claveFecha;
    horaEvento.value = evento.hora;
    descripcionEvento.value = evento.descripcion;
    participantesEvento.value = evento.participantes;

    modalEvento.style.display = 'flex';
}

function cerrarModal() {
    modalEvento.style.display = 'none';
}

function guardarEvento() {
    if (!horaEvento.value || !descripcionEvento.value.trim() || !participantesEvento.value.trim()) {
        alert('Por favor completa todos los campos del evento.');
        return;
    }

    const evento = {
        fecha: fechaSeleccionada,
        hora: horaEvento.value,
        descripcion: descripcionEvento.value.trim(),
        participantes: participantesEvento.value.trim()
    };

    eventos[fechaSeleccionada] = evento;

    localStorage.setItem('eventosCalendario', JSON.stringify(eventos));

    cerrarModal();

    actualizarCalendario();
}

function eliminarEvento() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este evento?');
    if (!confirmacion) {
        return;
    }
    delete eventos[fechaSeleccionada];
    localStorage.setItem('eventosCalendario', JSON.stringify(eventos));
    cerrarModal();
    actualizarCalendario();
}

guardarCambios();
actualizarCalendario();

