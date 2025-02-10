<script setup>
import router from '@/router';
import { RouterLink, useRoute } from 'vue-router';
import { ref } from 'vue';

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
    <header>
        <RouterLink to="/">
            <img src="../images/logo.webp" alt="Free Tours Jaén" width="50px">
        </RouterLink>

        <div v-if="propSesion">
            <h2 v-if="route.path=='/'">¡Bienvenid@, {{ propSesion.nombre }}!</h2>
            <h2 v-else> Estás en {{ route.name }}</h2>
        </div>

        <div>
            <button v-if="!propSesion">
                <RouterLink to="/login">Iniciar sesión</RouterLink>
            </button>
            <button v-if="!propSesion">
                <RouterLink to="/registro">Registrarse</RouterLink>
            </button>
            <button v-if="propSesion" @click="cerrarSesion">
                Cerrar Sesión
            </button>
        </div>
    </header>
</template>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f9e0e6;
}

button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #8e0d1e;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #e34f65;
}
</style>