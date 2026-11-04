import axios from 'axios';
import { lerSessao, encerrarSessao } from './auth.js';

// Todas as chamadas à API passam por aqui.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Antes de cada pedido: coloca o token do login no cabeçalho
api.interceptors.request.use((config) => {
  const token = lerSessao()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Depois de cada resposta: se a API disser 401 (sem login ou sessão expirada),
// limpa a sessão e manda para a tela de login
api.interceptors.response.use(
  (resposta) => resposta,
  (err) => {
    const ehRotaDeLogin = err.config?.url?.startsWith('/auth');
    if (err.response?.status === 401 && !ehRotaDeLogin) {
      encerrarSessao();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function mensagemDeErro(err) {
  return err.response?.data?.erro || 'Não foi possível conectar com a API.';
}

export default api;
