<script setup>
</script>

<template>
    <footer class="footer-container py-4 mt-5">
        <div class="container text-center">
            <!-- Sección de derechos de autor -->
            <p class="copyright">&copy; Realizado por Álvaro Beltrán Santiago. Todos los derechos reservados.</p>

            <!-- Enlaces importantes -->
            <div class="footer-links">
                <router-link to="/" class="footer-link">Inicio</router-link>
                <router-link to="/" class="footer-link">Rutas</router-link>
                <router-link to="/" class="footer-link">Contacto</router-link>
            </div>

            <!-- Redes sociales -->
            <div class="social-icons">
                <a href="https://facebook.com" target="_blank" class="social-icon bi bi-facebook"></a>
                <a href="https://twitter.com" target="_blank" class="social-icon bi bi-twitter"></a>
                <a href="https://instagram.com" target="_blank" class="social-icon bi bi-instagram"></a>
                <a href="https://linkedin.com" target="_blank" class="social-icon bi bi-linkedin"></a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-container {
    background-color: #018481; /* Verde oscuro */
    color: #ffffff; /* Texto blanco */
    padding: 20px 0;
}

.copyright {
    margin-bottom: 10px;
    font-size: 14px;
}

.footer-links {
    margin-bottom: 15px;
}

.footer-link {
    color: #ffffff;
    text-decoration: none;
    margin: 0 10px;
    font-weight: bold;
    transition: color 0.3s;
}

.footer-link:hover {
    color: #00D6B4; /* Verde claro */
}

.social-icons {
    font-size: 1.5rem;
}

.social-icon {
    color: #ffffff;
    margin: 0 10px;
    transition: color 0.3s;
}

.social-icon:hover {
    color: #00D6B4; /* Verde claro */
}
</style>
