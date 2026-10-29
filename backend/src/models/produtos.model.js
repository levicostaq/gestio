import db from '../config/db.js';

// Model: só SQL. Toda consulta filtra por empresa_id,
// é isso que mantém os dados de cada empresa separados.

export async function listar(empresaId, busca = '') {
  const termo = `%${busca}%`;
  const [linhas] = await db.query(
    `SELECT id, nome, preco, estoque, estoque_min, criado_em
       FROM produtos
      WHERE empresa_id = ?
        AND nome LIKE ?
      ORDER BY nome`,
    [empresaId, termo]
  );
  return linhas;
}

export async function buscarPorId(empresaId, id) {
  const [linhas] = await db.query(
    'SELECT id, nome, preco, estoque, estoque_min, criado_em FROM produtos WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return linhas[0];
}

export async function criar(empresaId, { nome, preco, estoque, estoque_min }) {
  const [resultado] = await db.query(
    'INSERT INTO produtos (empresa_id, nome, preco, estoque, estoque_min) VALUES (?, ?, ?, ?, ?)',
    [empresaId, nome, preco, estoque, estoque_min]
  );
  return resultado.insertId;
}

export async function atualizar(empresaId, id, { nome, preco, estoque, estoque_min }) {
  const [resultado] = await db.query(
    'UPDATE produtos SET nome = ?, preco = ?, estoque = ?, estoque_min = ? WHERE empresa_id = ? AND id = ?',
    [nome, preco, estoque, estoque_min, empresaId, id]
  );
  return resultado.affectedRows;
}

export async function remover(empresaId, id) {
  const [resultado] = await db.query(
    'DELETE FROM produtos WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return resultado.affectedRows;
}