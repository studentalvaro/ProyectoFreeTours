<template> 
    <div> 
      <input v-model="address" @keyup.enter="searchLocation" placeholder="Buscar dirección" 
  class="input" /> 
      <div id="map" style="height: 400px;"></div> 
    </div> 
</template>

<script setup> 
import { onMounted, ref } from 'vue'; 
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
    const address = ref(''); 
    let map, marker; 
 
    onMounted(() => { 
      map = L.map('map').setView([40.4168, -3.7038], 13); // Madrid por defecto 
 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        attribution: '&copy; OpenStreetMap contributors' 
      }).addTo(map); 
    }); 
 
    const searchLocation = async () => { 
      if (!address.value) return; 
 
      const response = await fetch( 
        
`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.
value)}` 
      ); 
      const data = await response.json(); 
       
      if (data.length > 0) { 
        let lat = data[0].lat; 
        let lon = data[0].lon; 
        if (marker) marker.remove(); 
        marker = L.marker([lat, lon]).addTo(map) 
          .bindPopup(address.value) 
          .openPopup(); 
        map.setView([lat, lon], 13); 
      } else { 
        alert('Dirección no encontrada'); 
      } 
    }; 
</script> 

<style>
.input {
 width: 100%;
 padding: 8px;
 margin-bottom: 10px;
}
</style>