import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('../views/RegistroView.vue'),
    },
    {
      path: '/gestionusuarios',
      name: 'Gestión de usuarios',
      component: () => import('../views/GestionUsuariosView.vue'),
    },
    {
      path: '/cancelarruta',
      name: 'Cancelar Ruta',
      component: () => import('../views/CancelarRutasView.vue'),
    },
    {
      path: '/crearruta',
      name: 'Crear Ruta',
      component: () => import('../views/CrearRutaView.vue'),
    },
    {
      path: '/inforruta',
      name: 'Información de la ruta',
      component: () => import('../views/InfoRutaView.vue'),
    },
    {
      path: '/reservar',
      name: 'Reservar Ruta',
      component: () => import('../views/ReservarRutaView.vue'),
    },
    {
      path: '/reservas',
      name: 'Mis reservas',
      component: () => import('../views/ReservasView.vue'),
    },
    {
      path: '/verrutas',
      name: 'Ver Rutas',
      component: () => import('../views/VerRutasView.vue'),
    },
    {
      path: '/asistentes',
      name: 'Asistentes',
      component: () => import('../views/AsistentesView.vue'),
    },
  ],
})

export default router