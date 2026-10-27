import * as model from '../models/clientes.model.js';
import { HttpError } from '../middlewares/errorHandler.js';

// Service: regras de negócio e validações.

function validar(dados) {
  if (!dados.nome || dados.nome.trim().length < 2) {
    throw new HttpError(400, 'O nome do cliente é obrigatório.');
  }
  if (dados.email && !/^\S+@\S+\.\S+$/.test(dados.email)) {
    throw new HttpError(400, 'E-mail inválido.');
  }
}

export function listar(empresaId, busca) {
  return model.listar(empresaId, busca);
}

export async function buscarPorId(empresaId, id) {
  const cliente = await model.buscarPorId(empresaId, id);
  if (!cliente) throw new HttpError(404, 'Cliente não encontrado.');
  return cliente;
}

export async function criar(empresaId, dados) {
  validar(dados);
  const id = await model.criar(empresaId, dados);
  return model.buscarPorId(empresaId, id);
}

export async function atualizar(empresaId, id, dados) {
  validar(dados);
  const alterados = await model.atualizar(empresaId, id, dados);
  if (!alterados) throw new HttpError(404, 'Cliente não encontrado.');
  return model.buscarPorId(empresaId, id);
}

export async function remover(empresaId, id) {
  const removidos = await model.remover(empresaId, id);
  if (!removidos) throw new HttpError(404, 'Cliente não encontrado.');
}
