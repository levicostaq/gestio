import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as model from '../models/auth.model.js';
import { emTransacao } from '../config/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth.js';
import { HttpError } from '../middlewares/errorHandler.js';

const EMAIL = /^\S+@\S+\.\S+$/;

// Gera o token e a resposta de login
function sessao(usuario) {
  const dados = {
    id: usuario.id,
    nome: usuario.nome,
    perfil: usuario.perfil,
    empresa_id: usuario.empresa_id,
  };
  const token = jwt.sign(dados, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    usuario: { ...dados, email: usuario.email, empresa_nome: usuario.empresa_nome },
  };
}

export async function login({ email, senha }) {
  const usuario = await model.buscarPorEmail((email || '').trim().toLowerCase());

  // Mensagem genérica de propósito: não contar se o erro foi no e-mail ou na senha
  const senhaCerta = usuario && (await bcrypt.compare(senha || '', usuario.senha_hash));
  if (!senhaCerta) {
    throw new HttpError(401, 'E-mail ou senha inválidos.');
  }
  if (!usuario.ativo) {
    throw new HttpError(403, 'Este usuário foi desativado. Fale com o administrador.');
  }

  return sessao(usuario);
}

// Cadastro de uma empresa nova: cria a empresa e o dono como administrador
export async function registrar(dados) {
  const empresaNome = (dados.empresa_nome || '').trim();
  const nome = (dados.nome || '').trim();
  const email = (dados.email || '').trim().toLowerCase();
  const senha = dados.senha || '';

  if (empresaNome.length < 2) throw new HttpError(400, 'O nome da empresa é obrigatório.');
  if (nome.length < 2) throw new HttpError(400, 'O seu nome é obrigatório.');
  if (!EMAIL.test(email)) throw new HttpError(400, 'E-mail inválido.');
  if (senha.length < 6) throw new HttpError(400, 'A senha precisa ter pelo menos 6 caracteres.');

  if (await model.buscarPorEmail(email)) {
    throw new HttpError(409, 'Já existe uma conta com este e-mail.');
  }

  // Nunca guardar a senha pura: guarda só o hash (RNF02)
  const senhaHash = await bcrypt.hash(senha, 10);

  await emTransacao(async (conn) => {
    const empresaId = await model.criarEmpresa(conn, { nome: empresaNome, segmento: dados.segmento });
    await model.criarUsuario(conn, {
      empresa_id: empresaId,
      nome,
      email,
      senha_hash: senhaHash,
      perfil: 'admin',
    });
  });

  return login({ email, senha });
}
