import * as service from '../services/clientes.service.js';

// Controller: recebe a requisição, chama o service e devolve a resposta.
// Regra de negócio NÃO fica aqui.

// Até o login existir, a empresa vem do .env
const empresaId = () => Number(process.env.EMPRESA_PADRAO) || 1;

export async function listar(req, res, next) {
  try {
    const clientes = await service.listar(empresaId(), req.query.busca);
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const cliente = await service.buscarPorId(empresaId(), req.params.id);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const cliente = await service.criar(empresaId(), req.body);
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req, res, next) {
  try {
    const cliente = await service.atualizar(empresaId(), req.params.id, req.body);
    res.json(cliente);
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
