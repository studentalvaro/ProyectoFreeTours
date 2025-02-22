<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

document.title = "Home";

const rutas = ref([]);
const sesion = ref(localStorage.getItem("sesion") !== null);
const router = useRouter();
const filtroCiudad = ref("");

function obtenerRutas() {
  fetch('http://localhost/APIFreetours/api.php/rutas', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    rutas.value = data;
  })
  .catch(error => console.error('Error:', error));
}

// Formatear hora a HH:mm
const formatearHora = (hora) => {
  if (!hora) return "";
  const [hh, mm] = hora.split(":");
  return `${hh}:${mm}`;
};

// Formatear fecha a dd/mm/yyyy
const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

// Filtrar rutas según el input del usuario
const rutasFiltradas = computed(() => {
  return rutas.value.map(ruta => ({
    ...ruta,
    horaFormateada: formatearHora(ruta.hora), // Agregar hora formateada
    fechaFormateada: formatearFecha(ruta.fecha) // Agregar fecha formateada
  })).filter(ruta =>
    ruta.localidad.toLowerCase().includes(filtroCiudad.value.toLowerCase())
  );
});

onMounted(() => {
  obtenerRutas();
});
</script>
<template>
  <!-- Sección Video -->
  <div class="video-container position-relative">
    <video autoplay loop muted class="w-100">
      <source src="../images/Travelling.mp4" type="video/mp4">
      <source src="../images/Travelling.ogg" type="video/ogg">
      <source src="../images/Travelling.webm" type="video/webm">
      Tu navegador no soporta el formato de video
    </video>

    <!-- Mensaje sobre el video -->
    <div class="video-text position-absolute text-center text-white">
      <h1 class="fw-bold">¿Buscando una aventura? <br> Encuéntrala en <span class="highlight">FreeSteps</span></h1>
    </div>
  </div>

  <!-- Buscador -->
  <div class="container mt-4">
    <input v-model="filtroCiudad" type="text" class="form-control mb-4" placeholder="¿A qué ciudad quieres viajar?">

    <!-- Tarjetas de Tours -->
    <div id="cards-tours" class="row">
      <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="ruta in rutasFiltradas" :key="ruta.id">
        <div class="card h-100 shadow-sm rounded-3">
          <img :src="ruta.foto" class="card-img-top rounded-3 p-3" alt="Imagen de la ruta" style="object-fit: cover; height: 200px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ ruta.titulo }}</h5>
            
            <!-- Icono de ubicación -->
            <p class="card-text">
              <i class="bi bi-geo-alt"></i> {{ ruta.localidad }}
            </p>
            
            <!-- Icono de calendario -->
            <p class="card-text">
              <i class="bi bi-calendar"></i> {{ ruta.fechaFormateada }} - {{ ruta.horaFormateada }}
            </p>

            <router-link v-if="sesion" :to="{ name: 'Reservar Ruta', params: { id: ruta.id } }" class="btn btn-success mt-auto">Reservar</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor del video */
.video-container {
  height: 400px;
  overflow: hidden;
}

/* Ajustes para que el video cubra la pantalla */
.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Mensaje sobre el video */
.video-text {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Resaltar FreeSteps */
.highlight {
  color: #FFD700; /* Dorado */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* Estilo para el párrafo de información */
.info-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1); /* Sombra arriba y abajo */
  padding: 40px;
  margin-top: 40px; /* Separación del video */
  text-align: center;
}

.info-text {
  font-size: 1.5rem; /* Aumentar el tamaño del texto */
  color: #018481; /* Color del texto igual al de los botones */
  line-height: 1.6;
}

.info-text strong {
  color: #018481; /* Verde oscuro para resaltar ciertas palabras */
}

/* Botones con clase btn-success */
.btn-success {
  background-color: #018481 !important;
  border-color: #018481 !important;
}

.btn-success:hover {
  background-color: #016f69 !important;
  border-color: #016f69 !important;
}

/* Para el hover en los botones de las cards de reserva */
.card .btn-success {
  color: #ffffff !important;
  background-color: #018481 !important;
  border-color: #018481 !important;
}

.card .btn-success:hover {
  color: #ffffff !important;
  background-color: #016f69 !important;
  border-color: #016f69 !important;
}
</style>