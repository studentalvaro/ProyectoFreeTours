<script setup>
import { ref, onMounted } from "vue";

document.title = "Ver rutas";

const asignaciones = ref([]);
const rutas = ref([]);

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
            /*Estaba intentando hacer 2 fetch, por una parte el de las asignaciones por id del guia
            después obteniendo el id de la ruta de cada asignación, para hacer un fetch de las rutas
            por id de la ruta, pero no me salió, así que lo hice de la siguiente manera:
            */
            const rutasPromises = data.map(asignacion =>
                fetch(`http://localhost/APIFreetours/api.php/rutas?id=${asignacion.ruta_id}`)
                    .then(res => res.json())
            );
            
            Promise.all(rutasPromises).then(results => {
                rutas.value = results;
            });
        })
        .catch(error => console.error("Error al obtener las asignaciones o rutas:", error));
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
                <span>Asistentes: {{ ruta.asistentes }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    h2 {
        color: #018481;
    }
    .text-success {
        color: #018481 !important;
    }
</style>
