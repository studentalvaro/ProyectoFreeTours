<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
    propSesion: Object
});
</script>

<template>
  <nav v-if="propSesion" class="navbar-container">
    <div class="container">
      <div class="row justify-content-center">
        
        <!--En caso de admin-->
        <div v-if="propSesion?.rol == 'admin'" class="col-12 text-center">
          <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
          <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
          <RouterLink to="/crearruta" class="nav-link">Crear ruta</RouterLink>
          <RouterLink to="/gestionarruta" class="nav-link">Gestión rutas</RouterLink>
          <RouterLink to="/gestionusuarios" class="nav-link">Gestión usuarios</RouterLink>
        </div>
        
        <!--En caso de guia-->
        <div v-if="propSesion?.rol == 'guia'" class="col-12 text-center">
          <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
          <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
          <RouterLink to="/verrutas" class="nav-link">Ver rutas</RouterLink>
        </div>
        
        <!--En caso de cliente-->
        <div v-if="propSesion?.rol == 'cliente'" class="col-12 text-center">
          <RouterLink to="/" class="nav-link">Ver tours</RouterLink>
          <RouterLink to="/contacto" class="nav-link">Sobre nosotros</RouterLink>
          <RouterLink to="/reservas" class="nav-link">Mis reservas</RouterLink>
        </div>
      </div>
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
  margin: 10px;
  transition: color 0.3s ease-in-out;
  display: block;
}

.nav-link:hover {
  color: #00D6B4;
  text-decoration: none;
}

@media (min-width: 768px) {
  .nav-link {
    display: inline-block;
  }
}
</style>
