<script setup>
import { ref, onMounted, nextTick } from "vue";

document.title = "Gestión de rutas";

const rutas = ref([]);
const mensaje = ref("");
const rutaParaDuplicar = ref(null);
const nuevaFecha = ref("");
const guiasDisponibles = ref([]);
const guiaSeleccionado = ref(null);
const duplicarModalRef = ref(null);
const eliminarModalRef = ref(null);
let duplicarModal = null;
let eliminarModal = null;
const rutaParaEliminar = ref(null);

const obtenerRutas = () => {
  fetch("http://localhost/APIFreetours/api.php/rutas", {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      rutas.value = data;
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

const eliminarRuta = () => {
  fetch(`http://localhost/APIFreetours/api.php/rutas?id=${rutaParaEliminar.value.id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(result => {
      mensaje.value = result.message;
      obtenerRutas();
      cerrarModalEliminar();
    })
    .catch(error => {
      console.error("Error al eliminar la ruta:", error);
    });
};

const obtenerGuiasDisponibles = (fecha) => {
  fetch(`http://localhost/APIFreetours/api.php/asignaciones?fecha=${fecha}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      guiasDisponibles.value = data;
    })
    .catch(error => {
      console.error('Error al obtener guías disponibles:', error);
    });
};

const mostrarModalDuplicar = (ruta) => {
  rutaParaDuplicar.value = ruta;
  nuevaFecha.value = "";
  guiaSeleccionado.value = null;
  if (duplicarModal) {
    duplicarModal.show();
  }
};

const cerrarModalDuplicar = () => {
  if (duplicarModal) {
    duplicarModal.hide();
  }
};

const mostrarModalEliminar = (ruta) => {
  rutaParaEliminar.value = ruta;
  if (eliminarModal) {
    eliminarModal.show();
  }
};

const cerrarModalEliminar = () => {
  if (eliminarModal) {
    eliminarModal.hide();
  }
};

const duplicarRuta = () => {
  if (!nuevaFecha.value) {
    mensaje.value = "Por favor, ingrese una nueva fecha.";
    return;
  }

  const rutaDuplicada = { ...rutaParaDuplicar.value, fecha: nuevaFecha.value, guia_id: guiaSeleccionado.value };
  delete rutaDuplicada.id;

  fetch("http://localhost/APIFreetours/api.php/rutas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rutaDuplicada),
  })
    .then(response => response.json())
    .then(result => {
      mensaje.value = result.message;
      obtenerRutas();
      cerrarModalDuplicar();
    })
    .catch(error => {
      console.error("Error al duplicar la ruta:", error);
    });
};

const handleFechaChange = (event) => {
  nuevaFecha.value = event.target.value;
  obtenerGuiasDisponibles(nuevaFecha.value);
};

onMounted(() => {
  obtenerRutas();
  nextTick(() => {
    if (duplicarModalRef.value) {
      duplicarModal = new bootstrap.Modal(duplicarModalRef.value);
    }
    if (eliminarModalRef.value) {
      eliminarModal = new bootstrap.Modal(eliminarModalRef.value);
    }
  });
});

const actualizarRuta = (ruta) => {
  const asignacionData = {
    ruta_id: ruta.id,
    guia_id: ruta.guia_id
  };

  fetch('http://localhost/APIFreetours/api.php/asignaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asignacionData)
  })
  .then(response => response.json())
  .then(data => console.log('Respuesta:', data))
  .catch(error => console.error('Error:', error));
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-center">Lista de Rutas</h2>
    <ul class="list-group">
      <li v-for="ruta in rutas" :key="ruta.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>{{ ruta.titulo }}</strong> - {{ ruta.localidad }} - {{ ruta.fecha }} - {{ ruta.hora }}</span>
        <div class="d-flex align-items-center">
          <!--Este select permite modificar el guia-->
          <select v-model="ruta.guia_id" @focus="obtenerGuiasDisponibles(ruta.fecha)" @change="actualizarRuta(ruta)" class="form-select form-select-sm me-2">
            <option :value="ruta.guia_id" disabled>{{ ruta.guia_nombre }}</option>
            <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}</option>
          </select>
          <button @click="mostrarModalDuplicar(ruta)" class="btn btn-success btn-sm me-2">Duplicar</button>
          <button @click="mostrarModalEliminar(ruta)" class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      </li>
    </ul>
    <p v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</p>

    <!-- Modal Eliminar -->
    <div class="modal fade" ref="eliminarModalRef" tabindex="-1" aria-labelledby="eliminarModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eliminarModalLabel">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" @click="cerrarModalEliminar" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ¿Estás seguro de que deseas eliminar esta ruta?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalEliminar">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="eliminarRuta">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Duplicar -->
    <div class="modal fade" ref="duplicarModalRef" tabindex="-1" aria-labelledby="duplicarModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="duplicarModalLabel">Duplicar Ruta</h5>
            <button type="button" class="btn-close" @click="cerrarModalDuplicar" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="nuevaFecha" class="form-label">Nueva Fecha</label>
              <input type="date" class="form-control" id="nuevaFecha" v-model="nuevaFecha" @change="handleFechaChange">
            </div>
            <div class="mb-3">
              <label for="guiaSeleccionado" class="form-label">Guía</label>
              <select class="form-select" id="guiaSeleccionado" v-model="guiaSeleccionado">
                <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalDuplicar">Cancelar</button>
            <button type="button" class="btn btn-success" @click="duplicarRuta">Duplicar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: #018481;
}
.btn-success {
  background-color: #018481;
  border-color: #016C6C;
  margin-right: 10px;
}

.btn-success:hover {
  background-color: #016C6C;
  border-color: #014F4F;
}
</style>