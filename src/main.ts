import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { registerAuthHandlers } from '@/api/http';
import { useAuthStore } from '@/auth/session';
import router from '@/routes';
import '@/styles.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const auth = useAuthStore(pinia);

function redirectToLoginAfterUnauthorized() {
  const currentRoute = router.currentRoute.value;

  if (currentRoute.name === 'login' || currentRoute.meta.public) {
    return;
  }

  void router.replace({
    name: 'login',
    query: { redirect: currentRoute.fullPath, session: 'expired' },
  });
}

registerAuthHandlers({
  refresh: () => auth.refreshToken(),
  unauthorized: () => {
    auth.clearSession();
    redirectToLoginAfterUnauthorized();
  },
});

app.mount('#app');
