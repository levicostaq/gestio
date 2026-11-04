import * as service from '../services/usuarios.service.js';

export async function listar(req, res, next) {
  try {
    res.json(await service.listar(req.usuario.empresa_id));
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    res.status(201).json(await service.criar(req.usuario.empresa_id, req.body));
  } catch (err) {
    next(err);
  }
}

export async function definirAtivo(req, res, next) {
  try {
    const usuario = await service.definirAtivo(
      req.usuario.empresa_id, req.usuario.id, req.params.id, req.body.ativo
    );
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}
