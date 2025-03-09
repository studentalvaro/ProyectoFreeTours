<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.title = "Mis reservas";

const sesion = JSON.parse(localStorage.getItem('sesion')) || {};
const userEmail = sesion.email || '';
const reservasPendientes = ref([]);
const reservasRealizadas = ref([]);
const mapas = ref({});
const modalVisible = ref(false);
const modalConfirmVisible = ref(false); // Modal de confirmación
const rutaValorada = ref(null);
const estrellas = ref(5);
const comentario = ref('');
const reservaAEliminar = ref(null); // Para almacenar la reserva a eliminar

const fetchReservas = () => {
    if (!userEmail) {
        console.error('No se encontró un email en el localStorage');
        return;
    }

    fetch(`http://localhost/APIFreetours/api.php/reservas?email=${userEmail}`)
        .then(response => response.json())
        .then(data => {
            console.log('Reservas obtenidas:', data);
            let reservasConDetalles = [];

            let totalReservas = data.length;
            let procesadas = 0;

            data.forEach(reserva => {
                fetchRuta(reserva.ruta_id, (rutaDetalles) => {
                    const fechaISO = rutaDetalles ? rutaDetalles.fecha : '';
                    const reservaConDetalles = {
                        id: rutaDetalles ? rutaDetalles.id : reserva.ruta_id,
                        id2: reserva.reserva_id,
                        titulo: rutaDetalles ? rutaDetalles.titulo : 'Sin título',
                        localidad: rutaDetalles ? rutaDetalles.localidad : 'Sin localidad',
                        fecha: fechaISO ? formatFecha(fechaISO) : 'Desconocida',
                        fechaISO: fechaISO,
                        hora: rutaDetalles ? formatHora(rutaDetalles.hora) : 'Desconocida',
                        foto: rutaDetalles ? rutaDetalles.foto : '',
                        latitud: rutaDetalles ? rutaDetalles.latitud : null,
                        longitud: rutaDetalles ? rutaDetalles.longitud : null,
                    };

                    reservasConDetalles.push(reservaConDetalles);

                    procesadas++;
                    if (procesadas === totalReservas) {
                        const now = new Date();
                        reservasPendientes.value = reservasConDetalles.filter(reserva => new Date(`${reserva.fechaISO}T${reserva.hora}`) >= now);
                        reservasRealizadas.value = reservasConDetalles.filter(reserva => new Date(`${reserva.fechaISO}T${reserva.hora}`) < now);

                        reservasConDetalles.forEach(reserva => {
                            if (reserva.latitud && reserva.longitud) {
                                initMap(reserva.id, reserva.latitud, reserva.longitud);
                            }
                        });
                    }
                });
            });
        })
        .catch(error => console.error('Error al obtener las reservas:', error));
};


const fetchRuta = (rutaId, callback) => {
    fetch(`http://localhost/APIFreetours/api.php/rutas?id=${rutaId}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Detalles de la ruta ${rutaId}:`, data);
            callback(data);
        })
        .catch(error => {
            console.error(`Error al obtener la ruta con ID ${rutaId}:`, error);
            callback(null);
        });
};

const eliminarReserva = () => {
    console.log('Intentando eliminar reserva con ID:', reservaAEliminar.value.id2);
    if (!reservaAEliminar.value) {
        console.error('Error: reservaAEliminar es undefined');
        return;
    }

    fetch(`http://localhost/APIFreetours/api.php/reservas?id=${reservaAEliminar.value.id2}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        reservasPendientes.value = reservasPendientes.value.filter(reserva => reserva.id !== reservaAEliminar.value.id);
        reservasRealizadas.value = reservasRealizadas.value.filter(reserva => reserva.id !== reservaAEliminar.value.id);
        cerrarModalConfirmacion(); // Cerrar el modal de confirmación
    })
    .catch(error => console.error('Error:', error));
};

const abrirModalConfirmacion = (reserva) => {
    reservaAEliminar.value = reserva; // Guardamos la reserva a eliminar
    modalConfirmVisible.value = true; // Abrimos el modal de confirmación
};

const cerrarModalConfirmacion = () => {
    modalConfirmVisible.value = false; // Cerramos el modal de confirmación
};

const formatFecha = (fechaISO) => {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const [year, month, day] = fechaISO.split('-');
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
};

const formatHora = (hora) => {
    const [hours, minutes] = hora.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const initMap = (reservaId, lat, lon) => {
    const mapContainer = document.getElementById(`map-${reservaId}`);
    if (mapContainer) {
        const map = L.map(mapContainer).setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map);
        mapas.value[reservaId] = map;
    }
};

const abrirModalValorar = (reserva) => {
    rutaValorada.value = reserva; // Se guarda la ruta, no la reserva
    estrellas.value = 5;
    comentario.value = '';
    modalVisible.value = true;
};

const cerrarModal = () => {
    modalVisible.value = false;
};

const enviarValoracion = () => {
    const nuevaValoracion = {
        user_id: sesion.id,
        ruta_id: rutaValorada.value.id, // Usamos el id de la ruta
        estrellas: estrellas.value,
        comentario: comentario.value
    };

    console.log(nuevaValoracion);
    
    fetch('http://localhost/APIFreetours/api.php/valoraciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaValoracion)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Valoración creada:', data);
        cerrarModal();
    })
    .catch(error => {
        console.error('Error al crear la valoración:', error);
    });
};

onMounted(fetchReservas);
</script>


<template>
    <div class="contenedor">        
        <h2 class="section-title">Rutas Pendientes</h2>
        <div class="row">
            <div class="col-12 mb-4" v-for="reserva in reservasPendientes" :key="reserva.id">
                <div class="card h-100 flex-row">
                    <img :src="reserva.foto" class="card-img-left img-thumbnail" alt="Foto de la ruta">
                    <div class="card-body">
                        <h5 class="card-title">{{ reserva.titulo }}</h5>
                        <p class="card-text"><strong>Localidad:</strong> {{ reserva.localidad }}</p>
                        <p class="card-text"><strong>Fecha:</strong> {{ reserva.fecha }}</p>
                        <p class="card-text"><strong>Hora:</strong> {{ reserva.hora }}</p>
                        <button class="btn btn-primary btn-sm">Modificar reserva</button>
                        <br>
                        <br>
                        <button class="btn btn-danger btn-sm" @click="abrirModalConfirmacion(reserva)">Cancelar reserva</button>
                    </div>
                    <div :id="`map-${reserva.id}`" class="map"></div>
                </div>
            </div>
        </div>

        <h2 class="section-title">Rutas Realizadas</h2>
        <div class="row">
            <div class="col-12 mb-4" v-for="reserva in reservasRealizadas" :key="reserva.id">
                <div class="card h-100 flex-row">
                    <img :src="reserva.foto" class="card-img-left img-thumbnail" alt="Foto de la ruta">
                    <div class="card-body">
                        <h5 class="card-title">{{ reserva.titulo }}</h5>
                        <p class="card-text"><strong>Localidad:</strong> {{ reserva.localidad }}</p>
                        <p class="card-text"><strong>Fecha:</strong> {{ reserva.fecha }}</p>
                        <p class="card-text"><strong>Hora:</strong> {{ reserva.hora }}</p>
                        <button class="btn btn-warning btn-sm" @click="abrirModalValorar(reserva)">Valorar</button>
                    </div>
                    <div :id="`map-${reserva.id}`" class="map"></div>
                </div>
            </div>
        </div>

        <!-- Modal de confirmación de eliminación -->
        <div v-if="modalConfirmVisible" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">¿Confirmar eliminación?</h5>
                        <button type="button" class="btn-close" @click="cerrarModalConfirmacion"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModalConfirmacion">Cancelar</button>
                        <button type="button" class="btn btn-danger" @click="eliminarReserva">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de valoración -->
        <div v-if="modalVisible" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Valorar Ruta</h5>
                        <button type="button" class="btn-close" @click="cerrarModal"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label for="estrellas">Estrellas</label>
                            <select v-model="estrellas" id="estrellas" class="form-select">
                                <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
                            </select>
                        </div>
                        <div class="mt-2">
                            <label for="comentario">Comentario (opcional)</label>
                            <textarea v-model="comentario" id="comentario" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="enviarValoracion">Enviar valoración</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.contenedor {
    max-width: 1200px;
    margin: auto;
}
.btn-primary {
    background-color: #018481;
}
.section-title {
    margin-top: 40px;
    margin-bottom: 20px;
    color: #018481;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
}

.card-img-left {
    width: 200px;
    height: auto;
    object-fit: cover;
    border-radius: 0;
}

.map {
    width: 300px;
    height: 200px;
    margin: 20px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-dialog {
    max-width: 400px;
}

.modal-header .btn-close {
    background-color: transparent;
    border: none;
}
.btn-warning{
    color: white;
}
</style>