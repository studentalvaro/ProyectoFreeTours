<script setup>
import {RouterView} from 'vue-router'
import {ref} from 'vue';
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'

const datosSesion = ref(localStorage.getItem("sesion"));

//Función que actualiza los datos de sesión
function actualizaDatosSesion(usuario){
  datosSesion.value=usuario;
}
</script>

<template>
  <!--Header-->
  <Header :propSesion="datosSesion" @sesionCerrada="actualizaDatosSesion"></Header>
  <!--Nav-->
  <NavBar :propSesion="datosSesion"></NavBar>

  <!--Views-->
  <RouterView @sesionIniciada="actualizaDatosSesion"></RouterView>

  <!--Footer-->
  <Footer></Footer>
</template>

<style scoped></style>
