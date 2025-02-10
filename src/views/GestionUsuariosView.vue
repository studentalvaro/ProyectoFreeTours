<script setup>
import { ref } from "vue";

// Estado para los usuarios y roles disponibles
const usuarios = ref([]);
const rolesDisponibles = ["admin", "cliente", "guia"];

// Obtener la lista de usuarios desde la API
fetch('http://localhost/APIFreetours/api.php/usuarios', {
  method: 'GET',
})
  .then(response => response.json())
  .then(data => {
    usuarios.value = data;
  })
  .catch(error => console.error('Error al cargar usuarios:', error));

// Función para actualizar el rol de un usuario usando la API (PUT)
function actualizarRol(id, nuevoRol) {
  const updatedRole = { rol: nuevoRol };

  fetch(`http://localhost/APIFreetours/api.php/usuarios?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRole),
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Rol actualizado para el usuario con ID ${id}:`, data);
      alert(`Rol del usuario ${id} actualizado a ${nuevoRol}`);
    })
    .catch(error => console.error('Error al actualizar el rol:', error));
}

// Función para eliminar un usuario usando la API (DELETE)
function eliminarUsuario(id) {
  if (confirm(`¿Estás seguro de que deseas eliminar al usuario con ID ${id}?`)) {
    fetch(`http://localhost/APIFreetours/api.php/usuarios?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(`Usuario con ID ${id} eliminado:`, data);
        alert(`Usuario con ID ${id} eliminado correctamente`);
        // Actualizar la lista de usuarios eliminando el usuario localmente
        usuarios.value = usuarios.value.filter(usuario => usuario.id !== id);
      })
      .catch(error => console.error('Error al eliminar el usuario:', error));
  }
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="usuario in usuarios" :key="usuario.id">
        <td>{{ usuario.id }}</td>
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.email }}</td>
        <td>
          <select v-model="usuario.rol" @change="actualizarRol(usuario.id, usuario.rol)">
            <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">
              {{ rol }}
            </option>
          </select>
        </td>
        <td>
          <button @click="eliminarUsuario(usuario.id)" class="btn-eliminar">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f9e0e6;
  color: #8e0d1e;
}

select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button.btn-eliminar {
  background-color: #e34f65;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button.btn-eliminar:hover {
  background-color: #c13c52;
}
</style>