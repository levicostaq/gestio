import db from '../config/db.js';

const CAMPOS = 'id, nome, preco, estoque, estoque_min, criado_em';

export async function listar(empresaId, busca = '') {
  const [linhas] = await db.query(
    `SELECT ${CAMPOS}
       FROM produtos
      WHERE empresa_id = ?
        AND nome LIKE ?
      ORDER BY nome`,
    [empresaId, `%${busca}%`]
  );
  return linhas;
}

export async function buscarPorId(empresaId, id) {
  const [linhas] = await db.query(
    `SELECT ${CAMPOS} FROM produtos WHERE empresa_id = ? AND id = ?`,
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
