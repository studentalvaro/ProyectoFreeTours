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
    <div class="login-container">
        <form @submit.prevent="iniciarSesion" class="p-4 border rounded shadow-sm bg-white">
            <p>{{ aviso }}</p>
            <div class="mb-3">
                <label for="user" class="form-label"><strong>Usuario</strong></label>
                <input v-model="form.email" name="user" type="text" class="form-control" placeholder="Usuario" required>
            </div>
            <div class="mb-3">
                <label for="pass" class="form-label"><strong>Contraseña</strong></label>
                <input v-model="form.password" name="pass" type="password" class="form-control" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-custom">Iniciar sesión</button>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('@/images/login-bg.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #f1f1f1;
}

form {
    max-width: 400px;
    width: 100%;
}

.btn-custom {
    background-color: #018481;
    color: white;
    width: 100%;
    border: none;
    padding: 10px;
    font-size: 16px;
}

.btn-custom:hover {
    background-color: #016C6C;
}
</style>
