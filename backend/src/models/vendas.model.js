import db from '../config/db.js';

// Model de vendas: só SQL.
// As funções que recebem "conn" rodam DENTRO da transação (usam a mesma conexão).
// As que usam "db" são consultas normais, fora de transação.

// ---------- Consultas ----------

export async function listar(empresaId, { inicio, fim, clienteId } = {}) {
  let sql = `
    SELECT v.id, v.data, v.total, v.cliente_id, c.nome AS cliente_nome,
           (SELECT COALESCE(SUM(i.quantidade), 0)
              FROM itens_venda i
             WHERE i.venda_id = v.id) AS quantidade_itens
      FROM vendas v
      LEFT JOIN clientes c ON c.id = v.cliente_id
     WHERE v.empresa_id = ?`;
  const valores = [empresaId];

  // Filtros opcionais: só entram no SQL se vierem na URL
  if (inicio) {
    sql += ' AND v.data >= ?';
    valores.push(inicio);
  }
  if (fim) {
    sql += ' AND v.data < DATE_ADD(?, INTERVAL 1 DAY)';
    valores.push(fim);
  }
  if (clienteId) {
    sql += ' AND v.cliente_id = ?';
    valores.push(clienteId);
  }

  sql += ' ORDER BY v.data DESC, v.id DESC';
  const [linhas] = await db.query(sql, valores);
  return linhas;
}

export async function buscarPorId(empresaId, id) {
  const [vendas] = await db.query(
    `SELECT v.id, v.data, v.total, v.cliente_id, c.nome AS cliente_nome
       FROM vendas v
       LEFT JOIN clientes c ON c.id = v.cliente_id
      WHERE v.empresa_id = ? AND v.id = ?`,
    [empresaId, id]
  );
  const venda = vendas[0];
  if (!venda) return undefined;

  const [itens] = await db.query(
    `SELECT i.id, i.produto_id, p.nome AS produto_nome, i.quantidade, i.preco_unit,
            i.quantidade * i.preco_unit AS subtotal
       FROM itens_venda i
       JOIN produtos p ON p.id = i.produto_id
      WHERE i.venda_id = ?
      ORDER BY i.id`,
    [id]
  );

  return { ...venda, itens };
}

export async function clienteExiste(empresaId, clienteId) {
  const [linhas] = await db.query(
    'SELECT id FROM clientes WHERE empresa_id = ? AND id = ?',
    [empresaId, clienteId]
  );
  return linhas.length > 0;
}

// ---------- Dentro da transação ----------

// FOR UPDATE "tranca" a linha do produto até o fim da transação.
// Assim, se duas vendas do mesmo produto acontecerem ao mesmo tempo,
// a segunda espera a primeira terminar e enxerga o estoque já atualizado.
export async function buscarProdutoParaVenda(conn, empresaId, produtoId) {
  const [linhas] = await conn.query(
    'SELECT id, nome, preco, estoque FROM produtos WHERE empresa_id = ? AND id = ? FOR UPDATE',
    [empresaId, produtoId]
  );
  return linhas[0];
}

export async function inserirVenda(conn, empresaId, clienteId, total) {
  const [resultado] = await conn.query(
    'INSERT INTO vendas (empresa_id, cliente_id, total) VALUES (?, ?, ?)',
    [empresaId, clienteId, total]
  );
  return resultado.insertId;
}

export async function inserirItem(conn, vendaId, produtoId, quantidade, precoUnit) {
  await conn.query(
    'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unit) VALUES (?, ?, ?, ?)',
    [vendaId, produtoId, quantidade, precoUnit]
  );
}

export async function baixarEstoque(conn, produtoId, quantidade) {
  await conn.query(
    'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
    [quantidade, produtoId]
  );
}

export async function buscarItensDaVenda(conn, empresaId, vendaId) {
  const [linhas] = await conn.query(
    `SELECT i.produto_id, i.quantidade
       FROM itens_venda i
       JOIN vendas v ON v.id = i.venda_id
      WHERE v.empresa_id = ? AND v.id = ?`,
    [empresaId, vendaId]
  );
  return linhas;
}

export async function devolverEstoque(conn, produtoId, quantidade) {
  await conn.query(
    'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
    [quantidade, produtoId]
  );
}

export async function removerVenda(conn, empresaId, vendaId) {
  // Os itens são apagados junto, por causa do ON DELETE CASCADE na tabela itens_venda
  const [resultado] = await conn.query(
    'DELETE FROM vendas WHERE empresa_id = ? AND id = ?',
    [empresaId, vendaId]
  );
  return resultado.affectedRows;
}