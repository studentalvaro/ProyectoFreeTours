<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
    propSesion: Object
});
</script>

<template>
  <nav v-if="propSesion" class="navbar-container">
    <div v-if="propSesion?.rol == 'admin'" class="d-flex justify-content-center">
      <RouterLink to="/crearruta" class="nav-link">Crear ruta</RouterLink>
      <RouterLink to="/gestionarruta" class="nav-link">Gestionar rutas</RouterLink>
      <RouterLink to="/gestionusuarios" class="nav-link">Gestión usuarios</RouterLink>
    </div>
    
    <div v-if="propSesion?.rol == 'guia'" class="d-flex justify-content-center">
      <RouterLink to="/verrutas" class="nav-link">Ver rutas</RouterLink>
      <RouterLink to="/asistentes" class="nav-link">Asistentes</RouterLink>
    </div>
    
    <div v-if="propSesion?.rol == 'cliente'" class="d-flex justify-content-center">
      <RouterLink to="/reservas" class="nav-link">Mis reservas</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar-container {
  background-color: #018481; /* Fondo verde oscuro */
  padding: 15px 0;
  border-bottom: 2px solid #016C6C; /* Línea de separación más oscura */
}

.nav-link {
  color: #ffffff; /* Texto blanco para contraste */
  text-decoration: none;
  font-weight: bold;
  margin: 0 15px; /* Espaciado entre enlaces */
  transition: color 0.3s ease-in-out;
}

.nav-link:hover {
  color: #00D6B4; /* Verde claro para hover */
  text-decoration: none;
}
</style>
