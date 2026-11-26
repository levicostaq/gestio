import mysql from 'mysql2/promise';

// Fuso do negócio. No PC de vocês o MySQL e o Node já estão em -03:00, mas na nuvem
// (Vercel e TiDB) tudo roda em UTC; sem isso, uma venda das 18h apareceria como 15h.
const FUSO = process.env.DB_TIMEZONE || '-03:00';

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
  timezone: FUSO, // como o Node interpreta as colunas DATETIME
  // Banco na nuvem exige conexão criptografada (TLS). No PC (localhost) fica desligado.
  ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL) || 10,
});

// Cada conexão nova passa a usar o mesmo fuso, para NOW() e CURRENT_TIMESTAMP
pool.pool.on('connection', (conn) => {
  conn.query(`SET time_zone = '${FUSO}'`);
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
