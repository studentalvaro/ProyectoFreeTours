<script setup>
import router from '@/router';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
    propSesion: Object
});

const emit = defineEmits(["sesionCerrada"]);

function cerrarSesion() {
    localStorage.removeItem("sesion");
    emit("sesionCerrada");
    router.push('/');
}
</script>

<template>
    <header class="bg-light py-3 shadow-sm">
        <div class="container d-flex justify-content-between align-items-center flex-wrap">
            <RouterLink to="/" class="d-flex align-items-center">
                <img src="../images/logo.jpg" alt="FreeSteps" width="80px">
            </RouterLink>

            <div v-if="propSesion" class="text-center text-sm-start">
                <h2 class="h5 mb-0" v-if="route.path=='/'">¡Bienvenid@, {{ propSesion.nombre }}!</h2>
                <h2 class="h5 mb-0" v-else> Estás en {{ route.name }}</h2>
            </div>

            <div class="d-flex justify-content-center">
                <RouterLink v-if="!propSesion" to="/login" class="btn" :class="{'btn-success': true, 'me-2': true, 'btn-sm': true}">Iniciar sesión</RouterLink>
                <RouterLink v-if="!propSesion" to="/registro" class="btn btn-outline-success me-2 btn-sm">Registrarse</RouterLink>
                <button v-if="propSesion" @click="cerrarSesion" class="btn btn-danger btn-sm">Cerrar Sesión</button>
            </div>
        </div>
    </header>
</template>

<style scoped>
h2 {
    color: #018481;
}

img {
    border-radius: 45%;
}

.btn-success {
    background-color: #018481 !important;
    border-color: #018481 !important;
}

.btn-success:hover {
    background-color: #016f69 !important;
    border-color: #016f69 !important;
}

/* Para el botón de registrarse con clase btn-outline-success */
.btn-outline-success {
    color: #018481 !important;
    border-color: #018481 !important;
}

.btn-outline-success:hover {
    color: #ffffff !important;
    background-color: #018481 !important;
    border-color: #018481 !important;
}
</style>