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
            <RouterLink to="/" class="d-flex align-items-center mb-2 mb-md-0">
                <img src="../images/logo.jpg" alt="FreeSteps" width="80px">
            </RouterLink>
            
            <div v-if="propSesion" class="text-center text-md-center flex-grow-1 mx-3 text-break">
                <h2 class="h5 mb-0" v-if="route.path=='/'">¡Bienvenid@, <strong>{{ propSesion.nombre }}!</strong></h2>
                <h2 class="h5 mb-0" v-else> Estás en <strong>{{ route.name }}</strong></h2>
            </div>
            
            <div class="d-flex justify-content-center flex-wrap">
                <RouterLink v-if="!propSesion" to="/login" class="btn btn-success btn-sm me-2 mb-2 mb-md-0">Iniciar sesión</RouterLink>
                <RouterLink v-if="!propSesion" to="/registro" class="btn btn-outline-success btn-sm me-2 mb-2 mb-md-0">Registrarse</RouterLink>
                <button v-if="propSesion" @click="cerrarSesion" class="btn btn-danger btn-sm mb-2 mb-md-0">Cerrar Sesión</button>
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