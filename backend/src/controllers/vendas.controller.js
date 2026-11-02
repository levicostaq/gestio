import * as service from '../services/vendas.service.js';

// Controller: recebe a requisição, chama o service e devolve a resposta.

// Até o login existir, a empresa vem do .env
const empresaId = () => Number(process.env.EMPRESA_PADRAO) || 1;

export async function listar(req, res, next) {
  try {
    const filtros = {
      inicio: req.query.inicio,
      fim: req.query.fim,
      clienteId: req.query.cliente_id,
    };
    const vendas = await service.listar(empresaId(), filtros);
    res.json(vendas);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const venda = await service.buscarPorId(empresaId(), req.params.id);
    res.json(venda);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const venda = await service.criar(empresaId(), req.body);
    res.status(201).json(venda);
  } catch (err) {
    next(err);
  }
}

export async function remover(req, res, next) {
  try {
    await service.remover(empresaId(), req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}