// Erro com status HTTP definido, lançado pelos services
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Captura qualquer erro das rotas e devolve um JSON padronizado
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    erro: status === 500 ? 'Erro interno no servidor' : err.message,
  });
}
