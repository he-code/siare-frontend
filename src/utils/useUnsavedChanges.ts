import { onBeforeUnmount, watch, type Ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

export function useUnsavedChanges(dirty: Ref<boolean>) {
  function beforeunload(e: BeforeUnloadEvent) {
    if (dirty.value) {
      e.preventDefault();
    }
  }

  watch(dirty, (isDirty) => {
    if (isDirty) {
      window.addEventListener('beforeunload', beforeunload);
    } else {
      window.removeEventListener('beforeunload', beforeunload);
    }
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dirty.value) {
      const answer = window.confirm('Tienes cambios sin guardar. ¿Salir de todas formas?');
      if (!answer) return next(false);
    }
    next();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeunload);
  });
}
