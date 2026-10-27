import axios from 'axios';

// Todas as chamadas à API passam por aqui.
// Quando o login existir, é aqui que o token JWT vai ser adicionado.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export function mensagemDeErro(err) {
  return err.response?.data?.erro || 'Não foi possível conectar com a API.';
}

export default api;
