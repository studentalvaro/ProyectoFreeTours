<script setup>
import { ref } from "vue";
import router from "@/router";

const titulo = ref("");
const localidad = ref("");
const descripcion = ref("");
const foto = ref("");
const fecha = ref("");
const hora = ref("");
const latitud = ref("");
const longitud = ref("");
const guiaId = ref(null); // Opcional
const mensaje = ref("");
const guiasDisponibles = ref([]);

const crearRuta = async () => {
  mensaje.value = ""; // Limpiar mensaje previo

  const data = {
    titulo: titulo.value,
    localidad: localidad.value,
    descripcion: descripcion.value,
    foto: foto.value,
    fecha: fecha.value,
    hora: hora.value,
    latitud: latitud.value,
    longitud: longitud.value,
    guia_id: guiaId.value, // Puede ser null
  };

  try {
    const response = await fetch("http://localhost/APIFreetours/api.php/rutas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    mensaje.value = result.message;

    if (result.status === "success") {
      router.push("/crearruta"); // Redirigir tras la creación
    }
  } catch (error) {
    mensaje.value = "Error al crear la ruta.";
    console.error(error);
  }
};

const obtenerGuiasDisponibles = async (newFecha) => {
  if (newFecha) {
    try {
      const response = await fetch(`http://localhost/APIFreetours/api.php/asignaciones?fecha=${newFecha}`, {
        method: 'GET',
      });
      const data = await response.json();
      guiasDisponibles.value = data;
      console.log('Guias disponibles en la fecha:', data);
    } catch (error) {
      console.error('Error al obtener guías disponibles:', error);
    }
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
  margin: 0 auto;
  background: #f9e0e6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background: #8e0d1e;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #e34f65;
}

.mensaje {
  margin-top: 20px;
  font-weight: bold;
  color: #8e0d1e;
}
</style>