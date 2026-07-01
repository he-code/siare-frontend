<template>
  <main class="welcome-page">
    <header class="welcome-topbar">
      <RouterLink class="brand welcome-brand" to="/" aria-label="Inicio SIARE">
        <PackageCheck aria-hidden="true" />
        <span>SIARE</span>
      </RouterLink>

      <nav class="welcome-nav" aria-label="Acceso público">
        <a href="#modulos">Módulos</a>
        <a href="#proceso">Proceso</a>
        <RouterLink v-if="auth.user" class="welcome-login" to="/dashboard">Ir al sistema</RouterLink>
        <RouterLink v-else class="welcome-login" to="/login">Iniciar sesión</RouterLink>
      </nav>
    </header>

    <section class="welcome-hero">
      <div class="welcome-hero__content">
        <span class="welcome-kicker">Sistema institucional de actas e inventario</span>
        <h1>Control claro de materiales, actas y responsables.</h1>
        <p>
          SIARE organiza el ingreso, entrega y trazabilidad de materiales con un flujo pensado para el trabajo real de una institución, no como una plantilla genérica.
        </p>

        <div class="welcome-actions">
          <RouterLink v-if="auth.user" class="button button--primary" to="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            Entrar al dashboard
          </RouterLink>
          <RouterLink v-else class="button button--primary" to="/login">
            <LogIn aria-hidden="true" />
            Iniciar sesión
          </RouterLink>
          <a class="button button--secondary" href="#modulos">Ver módulos</a>
        </div>
      </div>

      <aside class="welcome-summary" aria-label="Resumen del sistema">
        <div class="welcome-summary__header">
          <ClipboardCheck aria-hidden="true" />
          <div>
            <strong>Flujo principal</strong>
            <span>Ingreso → inventario → entrega</span>
          </div>
        </div>
        <ul>
          <li>Actas de ingreso con materiales nuevos.</li>
          <li>Instituciones registradas junto con sus líderes.</li>
          <li>Catálogos ordenados sin submenús repetidos.</li>
          <li>Inventario con movimientos y ajustes controlados.</li>
        </ul>
      </aside>
    </section>

    <section id="modulos" class="welcome-section">
      <div class="welcome-section__title">
        <span>Módulos</span>
        <h2>Accesos pensados por proceso</h2>
      </div>

      <div class="welcome-feature-grid">
        <article class="welcome-feature-card">
          <FileInput aria-hidden="true" />
          <h3>Actas de ingreso</h3>
          <p>Registra materiales nuevos en el mismo formulario del acta.</p>
        </article>
        <article class="welcome-feature-card">
          <Building2 aria-hidden="true" />
          <h3>Instituciones y líderes</h3>
          <p>Permite asociar líderes desde el registro de cada institución.</p>
        </article>
        <article class="welcome-feature-card">
          <Boxes aria-hidden="true" />
          <h3>Inventario</h3>
          <p>Consulta existencias, movimientos y ajustes sin duplicar pantallas.</p>
        </article>
      </div>
    </section>

    <section id="proceso" class="welcome-process">
      <div>
        <span>Proceso recomendado</span>
        <h2>Primero registra el contexto, luego mueve materiales.</h2>
      </div>
      <ol>
        <li>Registrar autoridad distrital y proceso de adquisición.</li>
        <li>Crear institución con sus líderes.</li>
        <li>Generar acta de ingreso con materiales nuevos.</li>
        <li>Controlar entregas, movimientos y stock.</li>
      </ol>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  Boxes,
  Building2,
  ClipboardCheck,
  FileInput,
  LayoutDashboard,
  LogIn,
  PackageCheck,
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

import { useAuthStore } from '@/auth/session';

const auth = useAuthStore();
</script>
