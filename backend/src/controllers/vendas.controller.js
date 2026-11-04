import * as service from '../services/vendas.service.js';

// Controller: recebe a requisição, chama o service e devolve a resposta.
// A empresa e o usuário vêm do login (req.usuario).

export async function listar(req, res, next) {
  try {
    const filtros = {
      inicio: req.query.inicio,
      fim: req.query.fim,
      clienteId: req.query.cliente_id,
    };
    const vendas = await service.listar(req.usuario.empresa_id, filtros);
    res.json(vendas);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const venda = await service.buscarPorId(req.usuario.empresa_id, req.params.id);
    res.json(venda);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    // Guarda também quem registrou a venda
    const venda = await service.criar(req.usuario.empresa_id, req.usuario.id, req.body);
    res.status(201).json(venda);
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
