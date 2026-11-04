import bcrypt from 'bcryptjs';
import * as model from '../models/usuarios.model.js';
import { HttpError } from '../middlewares/errorHandler.js';

export function listar(empresaId) {
  return model.listar(empresaId);
}

// O admin cadastra funcionários (ou outro admin) da própria empresa (RF02)
export async function criar(empresaId, dados) {
  const nome = (dados.nome || '').trim();
  const email = (dados.email || '').trim().toLowerCase();
  const senha = dados.senha || '';
  const perfil = dados.perfil || 'funcionario';

  if (nome.length < 2) throw new HttpError(400, 'O nome é obrigatório.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'E-mail inválido.');
  if (senha.length < 6) throw new HttpError(400, 'A senha precisa ter pelo menos 6 caracteres.');
  if (!['admin', 'funcionario'].includes(perfil)) throw new HttpError(400, 'Perfil inválido.');
  if (await model.emailExiste(email)) throw new HttpError(409, 'Já existe um usuário com este e-mail.');

  const senhaHash = await bcrypt.hash(senha, 10);
  const id = await model.criar(empresaId, { nome, email, senha_hash: senhaHash, perfil });
  return model.buscarPorId(empresaId, id);
}

// Desativar em vez de excluir: as vendas antigas continuam mostrando quem vendeu
export async function definirAtivo(empresaId, usuarioLogadoId, id, ativo) {
  if (Number(id) === usuarioLogadoId && !ativo) {
    throw new HttpError(400, 'Você não pode desativar o seu próprio usuário.');
  }
  const alterados = await model.definirAtivo(empresaId, id, Boolean(ativo));
  if (!alterados) throw new HttpError(404, 'Usuário não encontrado.');
  return model.buscarPorId(empresaId, id);
}
