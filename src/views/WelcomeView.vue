<template>
  <main class="welcome-page">
    <header class="welcome-topbar">
      <RouterLink class="brand welcome-brand" to="/" aria-label="Inicio SIARE">
        <PackageCheck aria-hidden="true" />
        <span>SIARE</span>
      </RouterLink>

      <nav class="welcome-nav" aria-label="Acceso público">
        <a href="#modulos">Módulos</a>
        <a href="#caracteristicas">Características</a>
        <a href="#proceso">Proceso</a>
        <RouterLink v-if="auth.user" class="welcome-login" to="/dashboard">Ir al sistema</RouterLink>
        <RouterLink v-else class="welcome-login" to="/login">Iniciar sesión</RouterLink>
      </nav>
    </header>

    <section class="welcome-hero">
      <div class="welcome-hero__content">
        <span class="welcome-kicker">Sistema Integral de Administración de Recursos y Existencias</span>
        <h1>Inventario, actas y trazabilidad en un solo lugar.</h1>
        <p class="welcome-hero__lead">
          SIARE organiza el ingreso, entrega y control de materiales institucionales con documentos formales que garantizan trazabilidad. Todo el flujo está pensado para el trabajo real, no como una plantilla genérica.
        </p>

        <div class="welcome-hero__stats">
          <div class="welcome-hero__stat">
            <strong>3</strong>
            <span>Roles de acceso</span>
          </div>
          <div class="welcome-hero__stat">
            <strong>7+</strong>
            <span>Catálogos administrativos</span>
          </div>
          <div class="welcome-hero__stat">
            <strong>2</strong>
            <span>Tipos de actas</span>
          </div>
        </div>

        <div class="welcome-actions">
          <RouterLink v-if="auth.user" class="button button--primary" to="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            Entrar al dashboard
          </RouterLink>
          <RouterLink v-else class="button button--primary" to="/login">
            <LogIn aria-hidden="true" />
            Iniciar sesión
          </RouterLink>
          <a class="button button--secondary" href="#modulos">
            <ArrowDown aria-hidden="true" />
            Explorar módulos
          </a>
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
          <li>Actas de ingreso con creación de materiales en línea.</li>
          <li>Actas de entrega-recepción con descuento automático de stock.</li>
          <li>Instituciones registradas con líderes asociados.</li>
          <li>Catálogos modulares sin submenús redundantes.</li>
          <li>Inventario con alertas de bajo stock.</li>
        </ul>
        <div class="welcome-summary__footer">
          <span class="welcome-summary__tag">Seguridad</span>
          <span class="welcome-summary__tag">Trazabilidad</span>
          <span class="welcome-summary__tag">Sin ajustes manuales</span>
        </div>
      </aside>
    </section>

    <section id="modulos" class="welcome-section">
      <div class="welcome-section__title">
        <span>Módulos</span>
        <h2>Todo lo que necesitas para gestionar tu inventario</h2>
        <p>Módulos diseñados para cubrir cada etapa del ciclo de vida de los materiales institucionales.</p>
      </div>

      <div class="welcome-feature-grid">
        <article class="welcome-feature-card">
          <FileInput aria-hidden="true" />
          <h3>Actas de ingreso</h3>
          <p>Registra materiales nuevos directamente en el formulario del acta. Sin pasos intermedios ni pantallas adicionales.</p>
        </article>
        <article class="welcome-feature-card">
          <FileOutput aria-hidden="true" />
          <h3>Actas de entrega</h3>
          <p>Genera actas de entrega-recepción con descuento automático de existencias. Cada salida queda documentada.</p>
        </article>
        <article class="welcome-feature-card">
          <PackageCheck aria-hidden="true" />
          <h3>Catálogos</h3>
          <p>Administra materiales, categorías, unidades de medida, instituciones, autoridades y procesos de adquisición.</p>
        </article>
        <article class="welcome-feature-card">
          <Boxes aria-hidden="true" />
          <h3>Inventario</h3>
          <p>Consulta existencias actuales, movimientos históricos y alertas de bajo stock en tiempo real.</p>
        </article>
        <article class="welcome-feature-card">
          <UsersRound aria-hidden="true" />
          <h3>Usuarios y roles</h3>
          <p>Gestión de usuarios con tres niveles de acceso: administrador, asistente de actas y consulta.</p>
        </article>
        <article class="welcome-feature-card">
          <LayoutDashboard aria-hidden="true" />
          <h3>Dashboard</h3>
          <p>Panel resumen con métricas clave, alertas de stock bajo y movimientos recientes para tomar decisiones rápidas.</p>
        </article>
      </div>
    </section>

    <section id="caracteristicas" class="welcome-section welcome-section--alt">
      <div class="welcome-section__title">
        <span>Características</span>
        <h2>Seguridad y control en cada operación</h2>
        <p>El sistema está diseñado para evitar modificaciones directas del stock y mantener trazabilidad completa.</p>
      </div>

      <div class="welcome-features-alt">
        <div class="welcome-feature-alt">
          <div class="welcome-feature-alt__icon">
            <ShieldCheck aria-hidden="true" />
          </div>
          <div>
            <h3>Sin ajustes manuales</h3>
            <p>El stock solo se modifica mediante actas documentadas. No existen botones para ajustar cantidades directamente.</p>
          </div>
        </div>
        <div class="welcome-feature-alt">
          <div class="welcome-feature-alt__icon">
            <History aria-hidden="true" />
          </div>
          <div>
            <h3>Trazabilidad completa</h3>
            <p>Cada movimiento queda registrado con fecha, responsable y documento de origen. Auditoría en tiempo real.</p>
          </div>
        </div>
        <div class="welcome-feature-alt">
          <div class="welcome-feature-alt__icon">
            <KeyRound aria-hidden="true" />
          </div>
          <div>
            <h3>Control por roles</h3>
            <p>Tres niveles de acceso con permisos granulares. La interfaz se adapta automáticamente al rol del usuario.</p>
          </div>
        </div>
        <div class="welcome-feature-alt">
          <div class="welcome-feature-alt__icon">
            <FileText aria-hidden="true" />
          </div>
          <div>
            <h3>Documentos formales</h3>
            <p>Cada operación genera un acta con número de folio, firmas de responsables y detalle de materiales.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="proceso" class="welcome-process">
      <div>
        <span>Proceso recomendado</span>
        <h2>Primero configura el contexto, luego opera el inventario.</h2>
        <p>Sigue este flujo para mantener la integridad de tus datos desde el primer día.</p>
      </div>
      <ol>
        <li><strong>Registra autoridades</strong> — Crea autoridades distritales y procesos de adquisición.</li>
        <li><strong>Crea instituciones</strong> — Da de alta instituciones y asigna sus líderes responsables.</li>
        <li><strong>Configura catálogos</strong> — Define materiales, categorías y unidades de medida.</li>
        <li><strong>Ingresa materiales</strong> — Genera actas de ingreso para aumentar existencias.</li>
        <li><strong>Controla entregas</strong> — Registra salidas mediante actas de entrega-recepción.</li>
        <li><strong>Monitorea stock</strong> — Consulta existencias, movimientos y alertas de bajo stock.</li>
      </ol>
    </section>

    <footer class="welcome-footer">
      <div class="welcome-footer__inner">
        <div class="welcome-footer__brand">
          <PackageCheck aria-hidden="true" />
          <span>SIARE</span>
        </div>
        <p>Sistema Integral de Administración de Recursos y Existencias — Proyecto de portafolio.</p>
        <p class="welcome-footer__copy">Desarrollado por <a href="https://github.com/he-code" target="_blank" rel="noopener noreferrer">he-code</a></p>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  Boxes,
  Building2,
  ClipboardCheck,
  FileInput,
  FileOutput,
  FileText,
  History,
  KeyRound,
  LayoutDashboard,
  LogIn,
  PackageCheck,
  ShieldCheck,
  UsersRound,
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

import { useAuthStore } from '@/auth/session';

const auth = useAuthStore();
</script>
