import mysql from 'mysql2/promise';

// Pool de conexões: reaproveita conexões em vez de abrir uma por requisição
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  decimalNumbers: true, // DECIMAL do MySQL chega como número, não como texto
  dateStrings: ['DATE'], // colunas DATE chegam como "2026-11-04", sem fuso horário
  waitForConnections: true,
  connectionLimit: 10,
});

// Executa várias operações como um bloco só (transação).
// Se tudo der certo: COMMIT, as mudanças ficam salvas.
// Se qualquer passo der erro: ROLLBACK, o banco volta exatamente como estava.
export async function emTransacao(funcao) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const resultado = await funcao(conn);
    await conn.commit();
    return resultado;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release(); // devolve a conexão para o pool
  }
}

export default pool;
