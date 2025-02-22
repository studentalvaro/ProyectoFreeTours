<script setup>
import { ref } from "vue";
import router from "@/router";

document.title = "Crear ruta";

const titulo = ref("");
const localidad = ref("");
const descripcion = ref("");
const foto = ref("");
const fecha = ref("");
const hora = ref("");
const latitud = ref("");
const longitud = ref("");
const guiaId = ref(null);
const mensaje = ref("");
const guiasDisponibles = ref([]);

const crearRuta = () => {
  mensaje.value = ""; //Limpiamos el mensaje

  const data = {
    titulo: titulo.value,
    localidad: localidad.value,
    descripcion: descripcion.value,
    foto: foto.value,
    fecha: fecha.value,
    hora: hora.value,
    latitud: latitud.value,
    longitud: longitud.value,
    guia_id: guiaId.value,
  };

  fetch("http://localhost/APIFreetours/api.php/rutas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      mensaje.value = result.message;
      if (result.status === "success") {
        router.push("/crearruta");
      }
    })
    .catch(error => {
      mensaje.value = "Error al crear la ruta.";
      console.error(error);
    });
};

const obtenerGuiasDisponibles = (newFecha) => {
  if (newFecha) {
    fetch(`http://localhost/APIFreetours/api.php/asignaciones?fecha=${newFecha}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        guiasDisponibles.value = data;
        console.log('Guias disponibles en la fecha:', data);
      })
      .catch(error => {
        console.error('Error al obtener guías disponibles:', error);
      });
  }
};
</script>

<template>
  <div class="form-container">
    <h2>Crear Nueva Ruta</h2>
    <form @submit.prevent="crearRuta">
      <div>
        <label for="titulo">Título:</label>
        <input id="titulo" v-model="titulo" type="text" required />
      </div>
      <div>
        <label for="localidad">Localidad:</label>
        <input id="localidad" v-model="localidad" type="text" required />
      </div>
      <div>
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="descripcion" required></textarea>
      </div>
      <div>
        <label for="foto">Foto (URL):</label>
        <input id="foto" v-model="foto" type="text" />
      </div>
      <div>
        <label for="fecha">Fecha:</label>
        <input id="fecha" v-model="fecha" type="date" @change="obtenerGuiasDisponibles($event.target.value)" required />
      </div>
      <div>
        <label for="hora">Hora:</label>
        <input id="hora" v-model="hora" type="time" required />
      </div>
      <div>
        <label for="latitud">Latitud:</label>
        <input id="latitud" v-model="latitud" type="number" step="any" required />
      </div>
      <div>
        <label for="longitud">Longitud:</label>
        <input id="longitud" v-model="longitud" type="number" step="any" required />
      </div>
      <div>
        <label for="guiaId">ID del Guía (Opcional):</label>
        <select id="guiaId" v-model="guiaId">
          <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">
            {{ guia.nombre }}
          </option>
        </select>
      </div>
      <button type="submit">Crear Ruta</button>
    </form>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 30px auto 0 auto;
  background: #f1f1f1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #018481;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #018481;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #00D6B4;
}

.mensaje {
  margin-top: 20px;
  font-weight: bold;
  color: #018481;
}
</style>

