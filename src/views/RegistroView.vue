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
    <div class="registro-container">
        <form @submit.prevent="crearUsuario" class="p-4 border rounded shadow-sm bg-white">
            <div class="mb-3">
                <label for="name" class="form-label"><strong>Nombre</strong></label>
                <input v-model="form.nombre" name="name" id="name" type="text" class="form-control" placeholder="Nombre" required />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label"><strong>Email</strong></label>
                <input v-model="form.email" name="email" id="email" type="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label"><strong>Contraseña</strong></label>
                <input v-model="form.password" name="password" type="password" class="form-control" placeholder="Contraseña" required />
            </div>
            <div class="mb-3">
                <label for="passwordCheck" class="form-label"><strong>Repetir contraseña</strong></label>
                <input v-model="form.password2" name="passwordCheck" type="password" class="form-control" placeholder="Repetir contraseña" required />
            </div>
            <p style="color:red">{{ aviso }}</p>
            <button type="submit" class="btn btn-custom">Registrarse</button>
            <br>
            <br>
            <p>¿Ya tienes cuenta? <RouterLink to="/login" style="color: #018481;">Iniciar sesión</RouterLink></p>

        </form>
    </div>
</template>

<style scoped>
.registro-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('@/images/registro-bg.jpg');
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
