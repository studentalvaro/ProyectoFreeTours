<script setup>
import { ref, onMounted } from "vue";
import { Modal } from 'bootstrap';

document.title = "Ver rutas";

const asignaciones = ref([]);
const rutas = ref([]);
const asistentes = ref([]);
const rutaSeleccionada = ref(null);
let modalInstance = null;

onMounted(() => {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    if (!sesion || !sesion.id) {
        console.error("No se encontró el ID del guía en la sesión.");
        return;
    }
    
    const guiaId = sesion.id;
    fetch(`http://localhost/APIFreetours/api.php/asignaciones?guia_id=${guiaId}`)
        .then(response => response.json())
        .then(data => {
            asignaciones.value = data;
            rutas.value = data.map(asignacion => ({
                id: asignacion.ruta_id,
                titulo: asignacion.ruta_titulo,
                localidad: asignacion.ruta_localidad,
                fecha: asignacion.ruta_fecha,
                hora: asignacion.ruta_hora,
                reserva: asignacion.reservas
            }));
        })
        .catch(error => console.error("Error al obtener las asignaciones:", error));
});

const mostrarModalAsistentes = (ruta) => {
    rutaSeleccionada.value = ruta;
        if (modalInstance) {
                modalInstance.show();
        }

};

const cerrarModalAsistentes = () => {
    if (modalInstance) {
        modalInstance.hide();
    }
};

onMounted(() => {
    const modalElement = document.getElementById('asistentesModal');
    if (modalElement) {
        modalInstance = new Modal(modalElement);
    }
});
</script>

<template>
    <div class="container mt-4">
        <h2 class="text-success">Rutas asignadas</h2>
        <ul class="list-group">
            <li class="list-group-item" v-for="ruta in rutas" :key="ruta.id">
                <strong>{{ ruta.titulo }}</strong><br>
                <span>Localidad: {{ ruta.localidad }}</span><br>
                <span>Fecha: {{ ruta.fecha }}</span><br>
                <span>Hora: {{ ruta.hora }}</span><br>
                <button class="btn btn-primary btn-sm mt-2" @click="mostrarModalAsistentes(ruta)">Ver Asistentes</button>
            </li>
        </ul>
    </div>

    <!-- Modal Asistentes -->
    <div class="modal fade" id="asistentesModal" tabindex="-1" aria-labelledby="asistentesModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #018481; color: white;">
                    <h5 class="modal-title" id="asistentesModalLabel">Asistentes</h5>
                    <button type="button" class="btn-close" @click="cerrarModalAsistentes" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Ruta:</strong> {{ rutaSeleccionada?.titulo }}</p>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="reserva in rutaSeleccionada?.reserva">
                            {{ reserva.cliente.nombre }} - {{ reserva.num_personas }} asistentes
                        </li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="cerrarModalAsistentes">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h2 {
    color: #018481;
}
.text-success {
    color: #018481 !important;
}
.btn-primary {
    background-color: #018481 !important;
    border-color: #018481 !important;
}
.btn-primary:hover {
    background-color: #016f69 !important;
    border-color: #016f69 !important;
}
</style>
