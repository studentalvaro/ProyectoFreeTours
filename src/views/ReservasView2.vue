<script setup>
import { ref, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.title = "Mis reservas";

const sesion = JSON.parse(localStorage.getItem('sesion')) || {};
const userEmail = sesion.email || '';
const reservasPendientes = ref([]);
const reservasRealizadas = ref([]);
const mapas = ref({});

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
                        id: reserva.reserva_id,
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
                        nextTick(() => {
                            reservasConDetalles.forEach(reserva => {
                                if (reserva.latitud && reserva.longitud) {
                                    initMap(reserva.id, reserva.latitud, reserva.longitud);
                                }
                            });
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

const eliminarReserva = (reservaId) => {
    console.log('Intentando eliminar reserva con ID:', reservaId);
    if (!reservaId) {
        console.error('Error: reservaId es undefined');
        return;
    }

    fetch(`http://localhost/APIFreetours/api.php/reservas?id=${reservaId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        reservasPendientes.value = reservasPendientes.value.filter(reserva => reserva.id !== reservaId);
        reservasRealizadas.value = reservasRealizadas.value.filter(reserva => reserva.id !== reservaId);
    })
    .catch(error => console.error('Error:', error));
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
        L.marker([lat, lon]).addTo(map)
        mapas.value[reservaId] = map;
    }
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
                        <button class="btn btn-danger btn-sm" @click="eliminarReserva(reserva.id)">Cancelar reserva</button>
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
                        <button class="btn btn-warning btn-sm">Valorar</button>
                    </div>
                    <div :id="`map-${reserva.id}`" class="map"></div>
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
.btn-primary{
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

.btn-warning {
    color: white !important;
}
</style>