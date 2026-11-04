import db from '../config/db.js';

export async function listar(empresaId) {
  const [linhas] = await db.query(
    'SELECT id, nome, email, perfil, ativo, criado_em FROM usuarios WHERE empresa_id = ? ORDER BY nome',
    [empresaId]
  );
  return linhas;
}

export async function emailExiste(email) {
  const [linhas] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  return linhas.length > 0;
}

export async function criar(empresaId, { nome, email, senha_hash, perfil }) {
  const [resultado] = await db.query(
    'INSERT INTO usuarios (empresa_id, nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?, ?)',
    [empresaId, nome, email, senha_hash, perfil]
  );
  return resultado.insertId;
}

export async function buscarPorId(empresaId, id) {
  const [linhas] = await db.query(
    'SELECT id, nome, email, perfil, ativo, criado_em FROM usuarios WHERE empresa_id = ? AND id = ?',
    [empresaId, id]
  );
  return linhas[0];
}

export async function definirAtivo(empresaId, id, ativo) {
  const [resultado] = await db.query(
    'UPDATE usuarios SET ativo = ? WHERE empresa_id = ? AND id = ?',
    [ativo, empresaId, id]
  );
  return resultado.affectedRows;
}
