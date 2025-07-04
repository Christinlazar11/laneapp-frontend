import api from './axios';
 
export async function adminLogin(email: string, password: string): Promise<{ token?: string; message?: string }> {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
} 