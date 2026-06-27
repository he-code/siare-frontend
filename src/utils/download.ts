import { api } from '@/api/http';

export async function downloadPdf(endpoint: string, filename: string) {
  const response = await api.get<Blob>(endpoint, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
