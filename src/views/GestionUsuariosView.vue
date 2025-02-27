<script setup>
import { ref } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

document.title = "Gestión de usuarios";

const usuarios = ref([]);
const rolesDisponibles = ["admin", "cliente", "guia"];
const usuarioAEliminar = ref(null);
let eliminarModal = null;

// Obtener la lista de usuarios
fetch('http://localhost/APIFreetours/api.php/usuarios', {
  method: 'GET',
})
  .then(response => response.json())
  .then(data => {
    usuarios.value = data;
  })
  .catch(error => console.error('Error al cargar usuarios:', error));

// Función para actualizar el rol de un usuario
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
    })
    .catch(error => console.error('Error al actualizar el rol:', error));
}

// Función para abrir el modal de confirmación
function confirmarEliminacion(usuario) {
  usuarioAEliminar.value = usuario;
  eliminarModal = new bootstrap.Modal(document.getElementById('confirmarEliminacionModal'));
  eliminarModal.show();
}

// Función para eliminar un usuario
function eliminarUsuario() {
  if (usuarioAEliminar.value) {
    fetch(`http://localhost/APIFreetours/api.php/usuarios?id=${usuarioAEliminar.value.id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(`Usuario con ID ${usuarioAEliminar.value.id} eliminado:`, data);
        usuarios.value = usuarios.value.filter(usuario => usuario.id !== usuarioAEliminar.value.id);
        eliminarModal.hide();
      })
      .catch(error => console.error('Error al eliminar el usuario:', error));
  }
}
</script>

<template>
  <div class="usuarios-container">
    <h2>Gestión de Usuarios</h2>
    <table class="usuarios-table table table-striped table-hover">
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
            <select v-model="usuario.rol" @change="actualizarRol(usuario.id, usuario.rol)" class="form-select">
              <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">
                {{ rol }}
              </option>
            </select>
          </td>
          <td>
            <button @click="confirmarEliminacion(usuario)" class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal de confirmación -->
  <div class="modal fade" id="confirmarEliminacionModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Confirmar eliminación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{{ usuarioAEliminar?.nombre }}</strong>?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="eliminarUsuario">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usuarios-container {
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;
}

h2 {
  text-align: center;
  color: #018481;
}
</style>
