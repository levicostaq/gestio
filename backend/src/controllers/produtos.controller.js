import * as service from '../services/produtos.service.js';

// Controller: recebe a requisição, chama o service e devolve a resposta.
// A empresa vem do usuário logado (req.usuario, preenchido pelo middleware autenticar).

export async function listar(req, res, next) {
  try {
    const produtos = await service.listar(req.usuario.empresa_id, req.query.busca);
    res.json(produtos);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const produto = await service.buscarPorId(req.usuario.empresa_id, req.params.id);
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const produto = await service.criar(req.usuario.empresa_id, req.body);
    res.status(201).json(produto);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req, res, next) {
  try {
    const produto = await service.atualizar(req.usuario.empresa_id, req.params.id, req.body);
    res.json(produto);
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
