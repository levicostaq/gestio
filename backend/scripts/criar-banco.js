// Cria (ou recria) o banco do Gestio rodando o database/script.sql inteiro.
// Serve para o banco na nuvem, onde não dá para abrir o Workbench com facilidade:
//   cd backend
//   node --env-file=.env.nuvem scripts/criar-banco.js
// ATENÇÃO: o script.sql APAGA e recria o banco, com os dados de exemplo.
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

const sql = await readFile(new URL('../../database/script.sql', import.meta.url), 'utf8');

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  multipleStatements: true, // permite mandar o arquivo todo de uma vez
});

try {
  await conn.query(sql);
  const [empresas] = await conn.query('SELECT COUNT(*) AS total FROM gestio.empresas');
  const [usuarios] = await conn.query('SELECT COUNT(*) AS total FROM gestio.usuarios');
  console.log(`Banco criado em ${process.env.DB_HOST}: ${empresas[0].total} empresas, ${usuarios[0].total} usuários.`);
} catch (err) {
  console.error('Não deu certo:', err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
