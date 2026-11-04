// Guarda a sessão (token + dados do usuário) no navegador.
// O localStorage continua salvo mesmo fechando a aba, então o usuário não precisa logar toda hora.

const CHAVE = 'gestio_sessao';

export function salvarSessao(sessao) {
  localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE);
}

export function usuarioAtual() {
  return lerSessao()?.usuario || null;
}

export function ehAdmin() {
  return usuarioAtual()?.perfil === 'admin';
}
