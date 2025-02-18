<script setup>
import { ref } from "vue";
import router from "@/router";

document.title = "Login";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: '', password: '' });
const aviso = ref('');

//Función para iniciar sesión
function iniciarSesion() {
    const loginData = {
        email: form.value.email,
        contraseña: form.value.password
    };
    fetch('http://localhost/APIFreetours/api.php/usuarios?login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Login exitoso:', data.user);
            // Si todo va bien, guardamos los datos en localStorage, mostramos un mensaje de redirección y emitimos el evento.
            localStorage.setItem("sesion", JSON.stringify(data.user));
            emit("sesionIniciada", data.user);
            aviso.value = "Login correcto, redirigiendo...";
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } else {
            aviso.value = "Error de login: " + data.message;
            console.log('Error de login:', data.message);
        }
    })
    .catch(error => {
        aviso.value = "Error de conexión, revisa tu internet";
        console.error('Error en el inicio de sesión:', error);
    });
}
</script>

<template>
    <form @submit.prevent="iniciarSesion">
        <p>{{ aviso }}</p>
        <label for="user">Usuario</label>
        <input v-model="form.email" name="user" type="text" placeholder="Usuario" required>
        <label for="pass">Contraseña</label>
        <input v-model="form.password" name="pass" type="password" placeholder="Contraseña" required>
        <button type="submit">Iniciar sesión</button>
    </form>
</template>

<style scoped></style>