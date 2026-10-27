import db from '../config/db.js';

// Model: só SQL. Toda consulta filtra por empresa_id,
// é isso que mantém os dados de cada empresa separados.

export async function listar(empresaId, busca = '') {
  const termo = `%${busca}%`;
  const [linhas] = await db.query(
    `SELECT id, nome, cpf_cnpj, telefone, email, criado_em
       FROM clientes
      WHERE empresa_id = ?
        AND (nome LIKE ? OR cpf_cnpj LIKE ?)
      ORDER BY nome`,
    [empresaId, termo, termo]
  );
  return linhas;
}

export async function buscarPorId(empresaId, id) {
  const [linhas] = await db.query(
    'SELECT id, nome, cpf_cnpj, telefone, email, criado_em FROM clientes WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return linhas[0];
}

export async function criar(empresaId, { nome, cpf_cnpj, telefone, email }) {
  const [resultado] = await db.query(
    'INSERT INTO clientes (empresa_id, nome, cpf_cnpj, telefone, email) VALUES (?, ?, ?, ?, ?)',
    [empresaId, nome, cpf_cnpj || null, telefone || null, email || null]
  );
  return resultado.insertId;
}

export async function atualizar(empresaId, id, { nome, cpf_cnpj, telefone, email }) {
  const [resultado] = await db.query(
    'UPDATE clientes SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ? WHERE empresa_id = ? AND id = ?',
    [nome, cpf_cnpj || null, telefone || null, email || null, empresaId, id]
  );
  return resultado.affectedRows;
}

export async function remover(empresaId, id) {
  const [resultado] = await db.query(
    'DELETE FROM clientes WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return resultado.affectedRows;
}
