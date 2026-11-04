// Configuração do login (JWT).
// Se alguém esquecer de colocar JWT_SECRET no .env, usa um valor de desenvolvimento
// para a API não quebrar. Em produção (Render), o JWT_SECRET precisa ser definido.
export const JWT_SECRET = process.env.JWT_SECRET || 'gestio-segredo-de-desenvolvimento';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
