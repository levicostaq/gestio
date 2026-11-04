import { Navigate, Outlet } from 'react-router-dom';
import { lerSessao } from '../services/auth.js';

// Só deixa entrar quem está logado. Com somenteAdmin, só o administrador.
// Isso esconde as telas, mas quem protege os dados de verdade é a API.
export default function RotaProtegida({ somenteAdmin = false }) {
  const sessao = lerSessao();

  if (!sessao?.token) return <Navigate to="/login" replace />;
  if (somenteAdmin && sessao.usuario.perfil !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}
