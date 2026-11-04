import db from '../config/db.js';

// Consultas de resumo para o painel. Cada uma devolve números já somados pelo banco.

export async function vendasDoMes(empresaId) {
  const [linhas] = await db.query(
    `SELECT COALESCE(SUM(total), 0) AS total, COUNT(*) AS quantidade
       FROM vendas
      WHERE empresa_id = ?
        AND data >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`,
    [empresaId]
  );
  return linhas[0];
}

export async function resumoFinanceiro(empresaId) {
  const [linhas] = await db.query(
    `SELECT
       COALESCE(SUM(CASE WHEN tipo = 'entrada' AND status = 'pago' THEN valor END), 0) AS entradas_pagas,
       COALESCE(SUM(CASE WHEN tipo = 'saida' AND status = 'pago' THEN valor END), 0) AS saidas_pagas,
       COALESCE(SUM(CASE WHEN tipo = 'entrada' AND status = 'pendente' THEN valor END), 0) AS a_receber,
       COALESCE(SUM(CASE WHEN tipo = 'saida' AND status = 'pendente' THEN valor END), 0) AS a_pagar,
       COUNT(CASE WHEN status = 'pendente' AND vencimento < CURDATE() THEN 1 END) AS vencidos
     FROM lancamentos
     WHERE empresa_id = ?`,
    [empresaId]
  );
  return linhas[0];
}

export async function produtosEmFalta(empresaId) {
  const [linhas] = await db.query(
    `SELECT id, nome, estoque, estoque_min
       FROM produtos
      WHERE empresa_id = ? AND estoque <= estoque_min
      ORDER BY estoque, nome`,
    [empresaId]
  );
  return linhas;
}

export async function ultimasVendas(empresaId) {
  const [linhas] = await db.query(
    `SELECT v.id, v.data, v.total, c.nome AS cliente_nome
       FROM vendas v
       LEFT JOIN clientes c ON c.id = v.cliente_id
      WHERE v.empresa_id = ?
      ORDER BY v.data DESC, v.id DESC
      LIMIT 5`,
    [empresaId]
  );
  return linhas;
}
