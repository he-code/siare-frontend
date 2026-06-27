import { defineStore } from 'pinia';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

let nextToastId = 1;

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
  }),
  actions: {
    push(type: ToastMessage['type'], text: string) {
      const id = nextToastId++;
      this.messages.push({ id, type, text });
      window.setTimeout(() => this.dismiss(id), 4500);
    },
    success(text: string) {
      this.push('success', text);
    },
    error(text: string) {
      this.push('error', text);
    },
    info(text: string) {
      this.push('info', text);
    },
    dismiss(id: number) {
      this.messages = this.messages.filter((message) => message.id !== id);
    },
  },
});
