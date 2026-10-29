import * as model from '../models/produtos.model.js';
import { HttpError } from '../middlewares/errorHandler.js';

// Service: regras de negócio e validações.

function validar(dados) {
  const nome = (dados.nome || '').trim();
  const preco = Number(dados.preco);
  const estoque = Number(dados.estoque ?? 0);
  const estoqueMin = Number(dados.estoque_min ?? 0);

  if (nome.length < 2) {
    throw new HttpError(400, 'O nome do produto é obrigatório.');
  }
  if (dados.preco === undefined || dados.preco === '' || Number.isNaN(preco) || preco < 0) {
    throw new HttpError(400, 'O preço deve ser um número maior ou igual a zero.');
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    throw new HttpError(400, 'O estoque deve ser um número inteiro maior ou igual a zero.');
  }
  if (!Number.isInteger(estoqueMin) || estoqueMin < 0) {
    throw new HttpError(400, 'O estoque mínimo deve ser um número inteiro maior ou igual a zero.');
  }

  return { nome, preco, estoque, estoque_min: estoqueMin };
}

export function listar(empresaId, busca) {
  return model.listar(empresaId, busca);
}

export async function buscarPorId(empresaId, id) {
  const produto = await model.buscarPorId(empresaId, id);
  if (!produto) throw new HttpError(404, 'Produto não encontrado.');
  return produto;
}

export async function criar(empresaId, dados) {
  const produto = validar(dados);
  const id = await model.criar(empresaId, produto);
  return model.buscarPorId(empresaId, id);
}

export async function atualizar(empresaId, id, dados) {
  const produto = validar(dados);
  const alterados = await model.atualizar(empresaId, id, produto);
  if (!alterados) throw new HttpError(404, 'Produto não encontrado.');
  return model.buscarPorId(empresaId, id);
}

export async function remover(empresaId, id) {
  const removidos = await model.remover(empresaId, id);
  if (!removidos) throw new HttpError(404, 'Produto não encontrado.');
}