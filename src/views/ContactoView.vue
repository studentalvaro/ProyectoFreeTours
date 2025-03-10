<script setup>
import { ref, onMounted } from 'vue';

document.title = "Sobre nosotros";

// Refs para los elementos del DOM
const medio = ref(null);
const play = ref('\u25BA');
const silenciar = ref("🔊");

// Controles del video
const accionPlay = () => {
  if (!medio.value.paused && !medio.value.ended) {
    medio.value.pause();
    play.value = '\u25BA'; // El ícono de Play
    document.body.style.backgroundColor = '#fff';
  } else {
    medio.value.play();
    play.value = '||'; // El ícono de Pause
    document.body.style.backgroundColor = 'grey';
  }
};

const accionReiniciar = () => {
  medio.value.currentTime = 0;
  medio.value.play();
  play.value = '||';
};

const accionRetrasar = () => {
  if (medio.value.currentTime > 1) {
    medio.value.currentTime -= 1;
  } else {
    medio.value.currentTime = 0;
  }
};

const accionAdelantar = () => {
  if (medio.value.currentTime + 1 > medio.value.duration) {
    medio.value.currentTime += 1;
  } else {
    medio.value.currentTime = medio.value.duration;
  }
};

const accionSilenciar = () => {
  if (medio.value.muted) {
    medio.value.muted = false;
    silenciar.value = "🔊"; // Vuelve al ícono de volumen
  } else {
    medio.value.muted = true;
    silenciar.value = "🔇"; // Muestra el ícono de silencio
  }
};

const accionMasVolumen = () => {
  if (medio.value.volume < 1) {
    medio.value.volume = Math.min(medio.value.volume + 0.1, 1);
  }
};

const accionMenosVolumen = () => {
  if (medio.value.volume > 0) {
    medio.value.volume = Math.max(medio.value.volume - 0.1, 0);
  }
};

// Inicializar los eventos
const iniciar = () => {
  // Establecer los valores predeterminados al cargar la página
  play.value = '\u25BA';  // Ícono de Play
  silenciar.value = "🔊";  // Ícono de volumen
};

onMounted(iniciar);
</script>


<template>
  <div class="contenido">
    <div class="video-y-descripcion">
      <div id="videoparacentrar" class="video-container">
        <video ref="medio" width="720" height="400">
          <source src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" type="video/mp4">
        </video>
        <nav class="video-controls">
            <input type="button" @click="accionReiniciar" value="Reiniciar" class="btn-control">
            <input type="button" @click="accionRetrasar" value="&laquo;" class="btn-control">
            <input type="button" @click="accionPlay" :value="play" class="btn-control">
            <input type="button" @click="accionAdelantar" value="&raquo;" class="btn-control">
            <input type="button" @click="accionSilenciar" :value="silenciar" class="btn-control">
            <input type="button" @click="accionMenosVolumen" value="-" class="btn-control">
            <input type="button" @click="accionMasVolumen" value="+" class="btn-control">
        </nav>
      </div>
      <div class="descripcion">
        <h2 class="titulo-descripcion">¡Descubre la magia de los Free Tours en España!</h2>
        <p class="descripcion-texto">Los Free Tours te permiten explorar las ciudades más hermosas de España con un guía local, y con la oportunidad de decidir lo que quieres pagar según tu experiencia. ¡Es la manera perfecta de conocer los rincones ocultos, la historia y la cultura de cada lugar!</p>
        <p class="descripcion-texto">Somos apasionados de descubrir. Es por esto que animamos a nuestros clientes a embarcarse en experiencias culturales, gastronómicas, rurales... Descubrir mundo es ganar vida.</p>
      
      </div>
    </div>


  </div>
</template>

<style scoped>
.contenido {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f1f1f1;
}

.video-y-descripcion {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.video-container {
  flex: 0 1 720px; /* El video ocupará un ancho fijo de 720px */
  margin-right: 30px;
}

video {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.descripcion {
  flex: 1; /* El texto ocupará el espacio restante */
  text-align: left;
}

.titulo-descripcion {
  font-size: 2em;
  color: #018481;
  margin-bottom: 15px;
}

.descripcion-texto {
  font-size: 1.2em;
  color: #2d2d2d;
  line-height: 1.5;
  max-width: 600px;
}

.video-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.video-controls input{
    margin-left: 5px;
    margin-right: 5px;
}
.btn-control {
  background-color: #018481;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-control:hover {
  background-color: #00D6B4;
}

label {
  margin-right: 10px;
}
</style>
