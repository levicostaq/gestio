import * as service from '../services/painel.service.js';

export async function mostrar(req, res, next) {
  try {
    const painel = await service.montar(req.usuario.empresa_id, req.usuario.perfil);
    res.json(painel);
  } catch (err) {
    next(err);
  }
}
