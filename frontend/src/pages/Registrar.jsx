import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { mensagemDeErro } from '../services/api.js';
import { salvarSessao } from '../services/auth.js';

const vazio = { empresa_nome: '', segmento: '', nome: '', email: '', senha: '' };

export default function Registrar() {
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function cadastrar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      // A API cria a empresa, cria você como administrador e já devolve o login
      const { data } = await api.post('/auth/registrar', form);
      salvarSessao(data);
      navigate('/');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="tela-acesso d-flex align-items-center justify-content-center p-3">
      <form className="card border-0 shadow p-4 w-100" style={{ maxWidth: 480 }} onSubmit={cadastrar}>
        <h1 className="h3 fw-bold text-center mb-1">Cadastre a sua empresa</h1>
        <p className="text-muted text-center mb-4">Grátis, para negócios de qualquer ramo</p>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <div className="row">
          <div className="col-md-7 mb-3">
            <label className="form-label">Nome da empresa *</label>
            <input className="form-control" name="empresa_nome" value={form.empresa_nome} onChange={alterar} required />
          </div>
          <div className="col-md-5 mb-3">
            <label className="form-label">Ramo</label>
            <input className="form-control" name="segmento" placeholder="Ex.: Comércio" value={form.segmento} onChange={alterar} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Seu nome *</label>
          <input className="form-control" name="nome" value={form.nome} onChange={alterar} required />
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail *</label>
          <input className="form-control" type="email" name="email" value={form.email} onChange={alterar} required />
        </div>
        <div className="mb-4">
          <label className="form-label">Senha * (mínimo 6 caracteres)</label>
          <input className="form-control" type="password" name="senha" minLength={6} value={form.senha} onChange={alterar} required />
        </div>

        <button className="btn btn-gestio w-100 mb-3" type="submit" disabled={salvando}>
          {salvando ? 'Cadastrando...' : 'Criar conta'}
        </button>
        <p className="text-center mb-0 small">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
