import * as service from '../services/lancamentos.service.js';

export async function listar(req, res, next) {
  try {
    const filtros = { tipo: req.query.tipo, status: req.query.status, mes: req.query.mes };
    const lancamentos = await service.listar(req.usuario.empresa_id, filtros);
    res.json(lancamentos);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const lancamento = await service.buscarPorId(req.usuario.empresa_id, req.params.id);
    res.json(lancamento);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const lancamento = await service.criar(req.usuario.empresa_id, req.body);
    res.status(201).json(lancamento);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req, res, next) {
  try {
    const lancamento = await service.atualizar(req.usuario.empresa_id, req.params.id, req.body);
    res.json(lancamento);
  } catch (err) {
    next(err);
  }
}

export async function marcarComoPago(req, res, next) {
  try {
    const lancamento = await service.marcarComoPago(req.usuario.empresa_id, req.params.id);
    res.json(lancamento);
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
