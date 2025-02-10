<script setup>
import { ref } from "vue";
import router from '@/router'

document.title = "Registro";

const form = ref({ nombre: '', email: '', password: '', password2: '' });
const aviso = ref('');

//COMPROBACION 1: Función que comprueba si los campos están vacíos.
function isEmpty(str) {
    return str.trim().length === 0;
}
//COMPROBACION 2: Función que comprueba si la contraseña tiene todos los requisitos.
function validacontrasena(password) {
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
    return password.match(passwordPattern);
}

//Función que realiza las comprobaciones y crea el usuario.
function crearUsuario() {
    if (isEmpty(form.value.nombre) || isEmpty(form.value.email) || isEmpty(form.value.password) || isEmpty(form.value.password2)) {
        aviso.value = "Usuario, contraseña y repetir contraseña son obligatorios.";
    } else if (!validacontrasena(form.value.password)) {
        aviso.value = "La contraseña debe incluir al menos una mayúscula, un número y un carácter especial.";
    } else if (form.value.password !== form.value.password2) {
        aviso.value = "Las contraseñas no coinciden.";
    } else {
        aviso.value = "Usuario registrado";

        // Datos para enviar en el fetch
        const data = {
            nombre: form.value.nombre,
            email: form.value.email,
            contraseña: form.value.password
        };

        // Fetch de registro
        fetch('http://localhost/APIFreetours/api.php/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Usuario registrado', true);
            })
            .catch(error => console.log(`Error al crear el alumno: ${error.message}`, false));

        //Tras hacer el fecth, vamos a redirigir a la página de inicio tras un periodo de 5 segundos.
        setTimeout(() => {
            router.push('/');
        }, 5000);
    }
}

</script>

<template>

    <body>
        <div>
            <form action="">
                <p>{{ aviso }}</p>
                <label for="name">Nombre</label>
                <input v-model="form.nombre" name="name" id="name" type="text" placeholder="Nombre" required />
                <label for="email">Email</label>
                <input v-model="form.email" name="email" id="email" type="email" placeholder="Email" required>
                <label for="password">Contraseña</label>
                <input v-model="form.password" name="password" type="password" placeholder="Contraseña" required>
                <label for="passwordCheck">Repetir contraseña</label>
                <input v-model="form.password2" name="passwordCheck" type="password" placeholder="Repetir contraseña"
                    required>
                <button type="submit" @click.prevent="crearUsuario()">Registrarse</button>
            </form>
        </div>
    </body>
</template>

<style scoped></style>