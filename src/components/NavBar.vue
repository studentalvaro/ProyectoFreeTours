<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
    propSesion: Object
});
</script>

<template>
  <nav v-if="propSesion" class="navbar-container">
    <!--En caso de admin-->
    <div v-if="propSesion?.rol == 'admin'" class="d-flex justify-content-center">
      <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
      <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
      <RouterLink to="/crearruta" class="nav-link">Crear ruta</RouterLink>
      <RouterLink to="/gestionarruta" class="nav-link">Gestión rutas</RouterLink>
      <RouterLink to="/gestionusuarios" class="nav-link">Gestión usuarios</RouterLink>
    </div>
    
    <!--En caso de guia-->
    <div v-if="propSesion?.rol == 'guia'" class="d-flex justify-content-center">
      <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
      <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
      <RouterLink to="/verrutas" class="nav-link">Ver rutas</RouterLink>
    </div>
    
    <!--En caso de cliente-->
    <div v-if="propSesion?.rol == 'cliente'" class="d-flex justify-content-center">
      <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
      <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
      <RouterLink to="/reservas" class="nav-link">Mis reservas</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar-container {
  background-color: #018481;
  padding: 15px 0;
  border-bottom: 2px solid #016C6C;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  margin: 0 15px;
  transition: color 0.3s ease-in-out;
}

.nav-link:hover {
  color: #00D6B4;
  text-decoration: none;
}
</style>
