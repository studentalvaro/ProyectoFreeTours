<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

document.title = "Home";

const rutas = ref([]);
const sesion = ref(localStorage.getItem("sesion") !== null);
const router = useRouter();

function obtenerRutas() {
  fetch('http://localhost/APIFreetours/api.php/rutas', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    rutas.value = data;
    console.log('Rutas:', data);
  })
  .catch(error => console.error('Error:', error));
}

onMounted(() => {
  obtenerRutas();
});
</script>

<template>
  <div>
    <h1>BIENVENIDO A FREE TOURS</h1>
    <div id="video-presentación"></div>
    <div id="cards-tours" class="row">
      <div class="col-md-4" v-for="ruta in rutas" :key="ruta.id">
        <div class="card mb-4">
          <img :src="ruta.foto" class="card-img-top" alt="Imagen de la ruta">
          <div class="card-body">
            <h5 class="card-title">{{ ruta.titulo }}</h5>
            <p class="card-text">{{ ruta.localidad }}</p>
            <p class="card-text">{{ ruta.fecha }}</p>
            <router-link v-if="sesion" :to="{ name: 'Reservar Ruta', params: { id: ruta.id } }" class="btn btn-primary">Reservar</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#cards-tours {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  width: 100%;
}
</style>