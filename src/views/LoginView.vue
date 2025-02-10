<script setup>
import { ref } from "vue";
import router from "@/router";

document.title = "Login";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: '', password: '' });
const aviso = ref('');

//Función para iniciar sesión
async function iniciarSesion() {
    try {
        const data = {
            email: form.value.email,
            contraseña: form.value.password
        };

        const response = await fetch('http://localhost/APIFreetours/api.php/usuarios?login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            aviso.value = "Email o contraseña incorrectos";
            return;
        }

        const responseData = await response.json();

        //Si todo va bien, guaradamos los datos en localStorage, mostramos un mensaje de redirección y emitimos el evento.
        localStorage.setItem("sesion", JSON.stringify(responseData.user))
        emit("sesionIniciada", responseData.user);
        aviso.value = "Login correcto, redirigiendo...";
        setTimeout(() => {
            router.push('/');
        }, 5000);

    } catch (error) {
        aviso.value = "Error de conexión, revisa tu internet";
        console.error(`Error en el inicio de sesión: ${error.message}`);
    }
}
</script>

<template>
    <form action="">
        <p>{{ aviso }}</p>
        <label for="user"></label>
        <input v-model="form.email" name="user" type="text" placeholder="Usuario">
        <label for=""></label>
        <input v-model="form.password" name="pass" type="password" placeholder="Contraseña">
        <button @click.prevent="iniciarSesion()" type="submit">Iniciar sesión</button>
    </form>
</template>

<style scoped></style>