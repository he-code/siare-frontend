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

registerAuthHandlers({
  refresh: () => auth.refreshToken(),
  unauthorized: () => {
    auth.clearSession();
  },
});

auth.restore().finally(() => {
  app.mount('#app');
});
