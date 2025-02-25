<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

document.title = "Reservar";

const route = useRoute();
const ruta = ref(null);
const numPersonas = ref(1);
const mensaje = ref("");
const reservaModalRef = ref(null);
let reservaModal = null;

const obtenerRuta = () => {
  fetch(`http://localhost/APIFreetours/api.php/rutas?id=${route.params.id}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    ruta.value = data;
    console.log('Ruta:', data);
  })
  .catch(error => console.error('Error:', error));
};

const mostrarModalReserva = () => {
  if (reservaModal) {
    reservaModal.show();
  }
};

const cerrarModalReserva = () => {
  if (reservaModal) {
    reservaModal.hide();
  }
};

const crearReserva = () => {
  const reservaData = {
    email: JSON.parse(localStorage.getItem("sesion")).email,
    ruta_id: route.params.id,
    num_personas: numPersonas.value
  };

  fetch('http://localhost/APIFreetours/api.php/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservaData)
  })
  .then(response => response.json())
  .then(data => {
    mensaje.value = data.message;
    console.log('Respuesta:', data);
    cerrarModalReserva();
  })
  .catch(error => {
    mensaje.value = "Error al crear la reserva";
    console.error('Error:', error);
  });
};

const formatHora = (hora) => {
  const [hours, minutes] = hora.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

onMounted(() => {
  obtenerRuta();
  reservaModal = new bootstrap.Modal(reservaModalRef.value);
});
</script>

<template>
  <div class="container mt-4">
    <div v-if="ruta" class="ruta-container">
      <h1 class="ruta-titulo">{{ ruta.titulo }}</h1>
      <img :src="ruta.foto" alt="Imagen de la ruta" class="img-fluid ruta-imagen mb-4">
      <p><strong>Localidad:</strong> {{ ruta.localidad }}</p>
      <p><strong>Fecha:</strong> {{ ruta.fecha }} - {{ formatHora(ruta.hora) }}</p>
      <p><strong>Descripción:</strong> {{ ruta.descripcion }}</p>
      <button class="btn btn-primary mt-3" @click="mostrarModalReserva">Reservar</button>
    </div>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

    <!-- Modal para crear reserva -->
    <div class="modal fade" id="reservaModal" ref="reservaModalRef" tabindex="-1" aria-labelledby="reservaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reservaModalLabel">Crear Reserva</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cerrarModalReserva"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="numPersonas" class="form-label">Número de Personas</label>
              <input type="number" id="numPersonas" v-model="numPersonas" class="form-control" min="1" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalReserva">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="crearReserva">Reservar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ruta-container {
  text-align: center;
}

.ruta-titulo {
  color: #018481;
  margin-bottom: 20px;
}

.ruta-imagen {
  border-radius: 10px;
}

.mensaje {
  margin-top: 20px;
  font-weight: bold;
  color: #018481;
}

.btn-primary {
  background-color: #018481;
  border-color: #018481;
}

.btn-primary:hover {
  background-color: #016C6C;
  border-color: #016C6C;
}
</style>