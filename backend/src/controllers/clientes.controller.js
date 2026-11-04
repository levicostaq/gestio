import * as service from '../services/clientes.service.js';

// Controller: recebe a requisição, chama o service e devolve a resposta.
// A empresa vem do usuário logado (req.usuario, preenchido pelo middleware autenticar).

export async function listar(req, res, next) {
  try {
    const clientes = await service.listar(req.usuario.empresa_id, req.query.busca);
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const cliente = await service.buscarPorId(req.usuario.empresa_id, req.params.id);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const cliente = await service.criar(req.usuario.empresa_id, req.body);
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req, res, next) {
  try {
    const cliente = await service.atualizar(req.usuario.empresa_id, req.params.id, req.body);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function remover(req, res, next) {
  try {
    await service.remover(req.usuario.empresa_id, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
