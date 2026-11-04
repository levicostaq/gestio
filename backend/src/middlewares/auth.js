import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';
import { HttpError } from './errorHandler.js';

// Confere o token enviado no cabeçalho: Authorization: Bearer <token>
// Se for válido, coloca os dados do usuário em req.usuario
// (id, nome, perfil e empresa_id) para os controllers usarem.
export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Faça login para continuar.'));
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new HttpError(401, 'Sua sessão expirou. Faça login de novo.'));
  }
}

// Bloqueia a rota para quem não é administrador
export function somenteAdmin(req, res, next) {
  if (req.usuario?.perfil !== 'admin') {
    return next(new HttpError(403, 'Apenas o administrador pode acessar esta área.'));
  }
  next();
}
