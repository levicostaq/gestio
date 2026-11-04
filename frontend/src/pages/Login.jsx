import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { mensagemDeErro } from '../services/api.js';
import { salvarSessao } from '../services/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function entrar(e) {
    e.preventDefault();
    setEntrando(true);
    setErro('');
    try {
      const { data } = await api.post('/auth/login', form);
      salvarSessao(data); // guarda o token para as próximas chamadas
      navigate('/');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="tela-acesso d-flex align-items-center justify-content-center p-3">
      <form className="card border-0 shadow p-4 w-100" style={{ maxWidth: 400 }} onSubmit={entrar}>
        <h1 className="h3 fw-bold text-center mb-1">Gestio</h1>
        <p className="text-muted text-center mb-4">Entre para gerenciar o seu negócio</p>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input className="form-control" type="email" name="email" value={form.email} onChange={alterar} required autoFocus />
        </div>
        <div className="mb-4">
          <label className="form-label">Senha</label>
          <input className="form-control" type="password" name="senha" value={form.senha} onChange={alterar} required />
        </div>

        <button className="btn btn-gestio w-100 mb-3" type="submit" disabled={entrando}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center mb-0 small">
          Ainda não tem conta? <Link to="/registrar">Cadastre a sua empresa</Link>
        </p>
      </form>
    </div>
  );
}
