import * as model from '../models/lancamentos.model.js';
import { HttpError } from '../middlewares/errorHandler.js';

const TIPOS = ['entrada', 'saida'];
const STATUS = ['pendente', 'pago'];

// Confere se o texto é uma data real no formato AAAA-MM-DD (ex.: barra 2026-02-31)
function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto || '')) return false;
  const data = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().startsWith(texto);
}

function validar(dados) {
  const descricao = (dados.descricao || '').trim();
  const valor = Number(dados.valor);
  const status = dados.status || 'pendente';

  if (!TIPOS.includes(dados.tipo)) {
    throw new HttpError(400, 'O tipo deve ser "entrada" ou "saida".');
  }
  if (descricao.length < 2) {
    throw new HttpError(400, 'A descrição é obrigatória.');
  }
  if (Number.isNaN(valor) || valor <= 0) {
    throw new HttpError(400, 'O valor deve ser maior que zero.');
  }
  if (!dataValida(dados.vencimento)) {
    throw new HttpError(400, 'Informe uma data de vencimento válida.');
  }
  if (!STATUS.includes(status)) {
    throw new HttpError(400, 'O status deve ser "pendente" ou "pago".');
  }

  return { tipo: dados.tipo, descricao, valor, vencimento: dados.vencimento, status };
}

export function listar(empresaId, filtros) {
  if (filtros.tipo && !TIPOS.includes(filtros.tipo)) throw new HttpError(400, 'Filtro de tipo inválido.');
  if (filtros.status && !STATUS.includes(filtros.status)) throw new HttpError(400, 'Filtro de status inválido.');
  if (filtros.mes && !/^\d{4}-\d{2}$/.test(filtros.mes)) throw new HttpError(400, 'Filtro de mês inválido.');
  return model.listar(empresaId, filtros);
}

export async function buscarPorId(empresaId, id) {
  const lancamento = await model.buscarPorId(empresaId, id);
  if (!lancamento) throw new HttpError(404, 'Lançamento não encontrado.');
  return lancamento;
}

export async function criar(empresaId, dados) {
  const lancamento = validar(dados);
  const id = await model.criar(empresaId, lancamento);
  return model.buscarPorId(empresaId, id);
}

export async function atualizar(empresaId, id, dados) {
  const lancamento = validar(dados);
  const alterados = await model.atualizar(empresaId, id, lancamento);
  if (!alterados) throw new HttpError(404, 'Lançamento não encontrado.');
  return model.buscarPorId(empresaId, id);
}

export async function marcarComoPago(empresaId, id) {
  const alterados = await model.marcarComoPago(empresaId, id);
  if (!alterados) throw new HttpError(404, 'Lançamento não encontrado.');
  return model.buscarPorId(empresaId, id);
}

export async function remover(empresaId, id) {
  const removidos = await model.remover(empresaId, id);
  if (!removidos) throw new HttpError(404, 'Lançamento não encontrado.');
}
