import db from '../config/db.js';

export async function buscarPorEmail(email) {
  const [linhas] = await db.query(
    `SELECT u.id, u.empresa_id, u.nome, u.email, u.senha_hash, u.perfil, u.ativo,
            e.nome AS empresa_nome
       FROM usuarios u
       JOIN empresas e ON e.id = u.empresa_id
      WHERE u.email = ?`,
    [email]
  );
  return linhas[0];
}

// Cria a empresa e o primeiro usuário (admin) dentro de uma transação
export async function criarEmpresa(conn, { nome, segmento }) {
  const [resultado] = await conn.query(
    'INSERT INTO empresas (nome, segmento) VALUES (?, ?)',
    [nome, segmento || null]
  );
  return resultado.insertId;
}

export async function criarUsuario(conn, { empresa_id, nome, email, senha_hash, perfil }) {
  const [resultado] = await conn.query(
    'INSERT INTO usuarios (empresa_id, nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?, ?)',
    [empresa_id, nome, email, senha_hash, perfil]
  );
  return resultado.insertId;
}
