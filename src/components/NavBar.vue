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
    <RouterLink>Ver rutas</RouterLink>
    <RouterLink>Asistentes</RouterLink>
</div>
<div v-if="propSesion?.rol=='cliente'">
    <RouterLink>Ver rutas</RouterLink>
    <RouterLink>Reservar rutas</RouterLink>
    <RouterLink>Cancelar rutas</RouterLink>
</div>
</template>

<style scoped>

</style>