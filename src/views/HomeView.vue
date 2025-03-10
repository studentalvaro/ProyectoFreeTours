<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

document.title = "Home";

const rutas = ref([]);
const sesion = ref(localStorage.getItem("sesion") !== null);
const router = useRouter();
const filtroCiudad = ref("");

// Variables para la paginación
const currentPage = ref(1);
const itemsPerPage = 6;

// Obtener rutas desde la API
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
//Esta función filtra por el buscador y por la fecha. Para ello usamos COMPUTED y además comparamos la fecha.
const rutasFiltradas = computed(() => {
  return rutas.value.map(ruta => ({
    ...ruta,
    horaFormateada: formatearHora(ruta.hora),
    fechaFormateada: formatearFecha(ruta.fecha)
  })).filter(ruta =>
    ruta.localidad.toLowerCase().includes(filtroCiudad.value.toLowerCase()) && ruta.fecha >= new Date().toISOString()
  );
});

// Calcular el número total de páginas
const totalPages = computed(() => {
  return Math.ceil(rutasFiltradas.value.length / itemsPerPage);
});

/* Obtener las rutas para la página actual, teniendo en cuenta la fecha de esta para solo mostrar las que son futuras
 y no pasadas*/
const rutasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return rutasFiltradas.value.slice(start, end);
});

// Cambiar de página
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
      <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="ruta in rutasPaginadas" :key="ruta.id">
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

    <!-- Controles de Paginación -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">Siguiente</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.video-container {
  height: 400px;
  overflow: hidden;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-text {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.highlight {
  color: #FFD700;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* Estilo para el párrafo de información que creo que no voy a usar */
.info-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-top: 40px;
  text-align: center;
}

.info-text {
  font-size: 1.5rem;
  color: #018481;
  line-height: 1.6;
}

.info-text strong {
  color: #018481;
}
/*He utilizado !important puesto que como la clase de bootstrap ya tiene sus valores por defecto,
para interponer mis colores tengo que utilizar !important sí o sí.*/
.btn-success {
  background-color: #018481 !important;
  border-color: #018481 !important;
}

.btn-success:hover {
  background-color: #016f69 !important;
  border-color: #016f69 !important;
}

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

/* Estilos personalizados para la paginación */
.pagination .page-link {
  color: #018481 !important;
}

.pagination .page-item.active .page-link {
  background-color: #018481 !important;
  border-color: #018481 !important;
  color: white !important;
}

.pagination .page-link:hover {
  background-color: #016f69 !important;
  border-color: #016f69 !important;
  color: #ffffff !important;
}
</style>