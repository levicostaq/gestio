import * as service from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    res.json(await service.login(req.body));
  } catch (err) {
    next(err);
  }
}

export async function registrar(req, res, next) {
  try {
    res.status(201).json(await service.registrar(req.body));
  } catch (err) {
    next(err);
  }
}

// Devolve quem está logado (os dados vêm do token)
export function eu(req, res) {
  res.json(req.usuario);
}
