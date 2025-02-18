<script setup>
import { ref, onMounted, nextTick } from "vue";

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

const obtenerRutas = async () => {
  try {
    const response = await fetch("http://localhost/APIFreetours/api.php/rutas", {
      method: "GET",
    });
    const data = await response.json();
    rutas.value = data;
    console.log("Rutas:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

const eliminarRuta = async () => {
  try {
    const response = await fetch(`http://localhost/APIFreetours/api.php/rutas?id=${rutaParaEliminar.value.id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    mensaje.value = result.message;
    obtenerRutas(); // Actualizar la lista de rutas
    cerrarModalEliminar();
  } catch (error) {
    console.error("Error al eliminar la ruta:", error);
  }
};

const obtenerGuiasDisponibles = async (fecha) => {
  try {
    const response = await fetch(`http://localhost/APIFreetours/api.php/asignaciones?fecha=${fecha}`, {
      method: 'GET',
    });
    const data = await response.json();
    guiasDisponibles.value = data;
    console.log('Guias disponibles en la fecha:', data);
  } catch (error) {
    console.error('Error al obtener guías disponibles:', error);
  }
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

const duplicarRuta = async () => {
  if (!nuevaFecha.value) {
    mensaje.value = "Por favor, ingrese una nueva fecha.";
    return;
  }

  const rutaDuplicada = { ...rutaParaDuplicar.value, fecha: nuevaFecha.value, guia_id: guiaSeleccionado.value };
  delete rutaDuplicada.id; // Eliminar el ID para crear una nueva ruta

  try {
    const response = await fetch("http://localhost/APIFreetours/api.php/rutas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rutaDuplicada),
    });
    const result = await response.json();
    mensaje.value = result.message;
    obtenerRutas(); // Actualizar la lista de rutas
    cerrarModalDuplicar();
  } catch (error) {
    console.error("Error al duplicar la ruta:", error);
  }
};

const handleFechaChange = async (event) => {
  nuevaFecha.value = event.target.value;
  await obtenerGuiasDisponibles(nuevaFecha.value);
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
</script>

<template>
  <div class="rutas-container">
    <h2>Lista de Rutas</h2>
    <ul>
      <li v-for="ruta in rutas" :key="ruta.id">
        <div>
          <strong>{{ ruta.titulo }}</strong> - {{ ruta.localidad }} - {{ ruta.fecha }} - {{ ruta.hora }}
          <button @click="mostrarModalEliminar(ruta)" class="btn btn-danger btn-sm">Eliminar</button>
          <button @click="mostrarModalDuplicar(ruta)" class="btn btn-primary btn-sm">Duplicar</button>
        </div>
      </li>
    </ul>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

    <!-- Modal para duplicar ruta -->
    <div class="modal fade" id="duplicarModal" ref="duplicarModalRef" tabindex="-1" aria-labelledby="duplicarModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="duplicarModalLabel">Duplicar Ruta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cerrarModalDuplicar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="nuevaFecha" class="form-label">Nueva Fecha</label>
              <input type="date" id="nuevaFecha" v-model="nuevaFecha" @change="handleFechaChange" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="guiaSeleccionado" class="form-label">Guía Disponible</label>
              <select id="guiaSeleccionado" v-model="guiaSeleccionado" class="form-select" required>
                <option value="" disabled>Seleccione guía</option>
                <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">
                  {{ guia.nombre }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalDuplicar">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="duplicarRuta">Duplicar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div class="modal fade" id="eliminarModal" ref="eliminarModalRef" tabindex="-1" aria-labelledby="eliminarModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eliminarModalLabel">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cerrarModalEliminar"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro de que desea eliminar esta ruta?</p>
            <p><strong>{{ rutaParaEliminar?.titulo }}</strong> - {{ rutaParaEliminar?.localidad }} - {{ rutaParaEliminar?.fecha }} - {{ rutaParaEliminar?.hora }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalEliminar">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="eliminarRuta">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rutas-container {
  max-width: 800px;
  margin: 0 auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #ddd;
}

.mensaje {
  margin-top: 20px;
  font-weight: bold;
  color: #8e0d1e;
}
</style>