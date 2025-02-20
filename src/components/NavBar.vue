<script setup>
import router from '@/router';
import { RouterLink } from 'vue-router';

const props = defineProps({
    propSesion: Object
});

</script>

<template>
<div v-if="propSesion?.rol == 'admin'">
    <RouterLink to="/crearruta">Crear ruta</RouterLink>
    <RouterLink to="/gestionarruta">Gestionar rutas</RouterLink>
    <RouterLink to="/gestionusuarios">Gestion usuarios</RouterLink>
</div>
<div v-if="propSesion?.rol== 'guia'">
    <RouterLink to="/verrutas">Ver rutas</RouterLink>
    <RouterLink to="/asistentes">Asistentes</RouterLink>
</div>
<div v-if="propSesion?.rol=='cliente'">
    <RouterLink to="/reservas">Mis reservas</RouterLink>
    <!--<RouterLink to="/reservar">Reservar rutas</RouterLink> //esto se supone que no aparecerá en el NavBar sino en la propia card de la ruta-->
</div>
</template>

<style scoped>

</style>