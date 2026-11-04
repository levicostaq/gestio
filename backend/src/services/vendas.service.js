import * as model from '../models/vendas.model.js';
import { emTransacao } from '../config/db.js';
import { HttpError } from '../middlewares/errorHandler.js';

// Service de vendas: regras de negócio.
// O front manda só QUAIS produtos e QUANTOS. Preço e total são calculados aqui,
// com o preço do banco, para ninguém conseguir mandar um preço falso pela API.

function validar(dados) {
  const clienteId = dados.cliente_id ? Number(dados.cliente_id) : null;
  if (clienteId !== null && (!Number.isInteger(clienteId) || clienteId <= 0)) {
    throw new HttpError(400, 'Cliente inválido.');
  }

  if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
    throw new HttpError(400, 'A venda precisa ter pelo menos um item.');
  }

  // Se o mesmo produto vier duas vezes, soma as quantidades numa linha só
  const agrupados = new Map();
  for (const item of dados.itens) {
    const produtoId = Number(item.produto_id);
    const quantidade = Number(item.quantidade);

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      throw new HttpError(400, 'Produto inválido.');
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new HttpError(400, 'A quantidade deve ser um número inteiro maior que zero.');
    }
    agrupados.set(produtoId, (agrupados.get(produtoId) || 0) + quantidade);
  }

  const itens = [...agrupados].map(([produto_id, quantidade]) => ({ produto_id, quantidade }));
  return { cliente_id: clienteId, itens };
}

export function listar(empresaId, filtros) {
  return model.listar(empresaId, filtros);
}

export async function buscarPorId(empresaId, id) {
  const venda = await model.buscarPorId(empresaId, id);
  if (!venda) throw new HttpError(404, 'Venda não encontrada.');
  return venda;
}

export async function criar(empresaId, usuarioId, dados) {
  const venda = validar(dados);

  if (venda.cliente_id && !(await model.clienteExiste(empresaId, venda.cliente_id))) {
    throw new HttpError(404, 'Cliente não encontrado.');
  }

  // Tudo daqui até o fim do bloco acontece numa transação só
  const vendaId = await emTransacao(async (conn) => {
    const itensComPreco = [];
    let total = 0;

    // 1. Confere cada produto: existe? tem estoque suficiente?
    for (const item of venda.itens) {
      const produto = await model.buscarProdutoParaVenda(conn, empresaId, item.produto_id);
      if (!produto) {
        throw new HttpError(404, `Produto ${item.produto_id} não encontrado.`);
      }
      if (produto.estoque < item.quantidade) {
        throw new HttpError(400, `Estoque insuficiente para ${produto.nome}: disponível ${produto.estoque}.`);
      }
      itensComPreco.push({ ...item, preco_unit: produto.preco });
      total += produto.preco * item.quantidade;
    }

    total = Math.round(total * 100) / 100; // evita 59.800000000001

    // 2. Cria a venda
    const id = await model.inserirVenda(conn, empresaId, venda.cliente_id, usuarioId, total);

    // 3. Cria os itens e dá baixa no estoque
    for (const item of itensComPreco) {
      await model.inserirItem(conn, id, item.produto_id, item.quantidade, item.preco_unit);
      await model.baixarEstoque(conn, item.produto_id, item.quantidade);
    }

    return id;
  });

  return model.buscarPorId(empresaId, vendaId);
}

// Cancelar uma venda: apaga a venda e devolve os produtos ao estoque
export async function remover(empresaId, id) {
  await emTransacao(async (conn) => {
    const itens = await model.buscarItensDaVenda(conn, empresaId, id);
    const removidas = await model.removerVenda(conn, empresaId, id);
    if (!removidas) throw new HttpError(404, 'Venda não encontrada.');

    for (const item of itens) {
      await model.devolverEstoque(conn, item.produto_id, item.quantidade);
    }
  });
}
