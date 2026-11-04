import db from '../config/db.js';

// Model do financeiro: contas a pagar (saída) e a receber (entrada).

const CAMPOS = 'id, tipo, descricao, valor, vencimento, status';

export async function listar(empresaId, { tipo, status, mes } = {}) {
  let sql = `SELECT ${CAMPOS} FROM lancamentos WHERE empresa_id = ?`;
  const valores = [empresaId];

  if (tipo) {
    sql += ' AND tipo = ?';
    valores.push(tipo);
  }
  if (status) {
    sql += ' AND status = ?';
    valores.push(status);
  }
  if (mes) {
    // mes chega como "2026-11": pega do dia 1 até o último dia do mês
    sql += ' AND vencimento >= ? AND vencimento < DATE_ADD(?, INTERVAL 1 MONTH)';
    valores.push(`${mes}-01`, `${mes}-01`);
  }

  sql += ' ORDER BY vencimento, id';
  const [linhas] = await db.query(sql, valores);
  return linhas;
}

export async function buscarPorId(empresaId, id) {
  const [linhas] = await db.query(
    `SELECT ${CAMPOS} FROM lancamentos WHERE empresa_id = ? AND id = ?`,
    [empresaId, id]
  );
  return linhas[0];
}

export async function criar(empresaId, { tipo, descricao, valor, vencimento, status }) {
  const [resultado] = await db.query(
    'INSERT INTO lancamentos (empresa_id, tipo, descricao, valor, vencimento, status) VALUES (?, ?, ?, ?, ?, ?)',
    [empresaId, tipo, descricao, valor, vencimento, status]
  );
  return resultado.insertId;
}

export async function atualizar(empresaId, id, { tipo, descricao, valor, vencimento, status }) {
  const [resultado] = await db.query(
    'UPDATE lancamentos SET tipo = ?, descricao = ?, valor = ?, vencimento = ?, status = ? WHERE empresa_id = ? AND id = ?',
    [tipo, descricao, valor, vencimento, status, empresaId, id]
  );
  return resultado.affectedRows;
}

export async function marcarComoPago(empresaId, id) {
  const [resultado] = await db.query(
    "UPDATE lancamentos SET status = 'pago' WHERE empresa_id = ? AND id = ?",
    [empresaId, id]
  );
  return resultado.affectedRows;
}

export async function remover(empresaId, id) {
  const [resultado] = await db.query(
    'DELETE FROM lancamentos WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return resultado.affectedRows;
}
