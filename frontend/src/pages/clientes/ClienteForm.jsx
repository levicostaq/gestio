import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';

const vazio = { nome: '', cpf_cnpj: '', telefone: '', email: '' };

export default function ClienteForm() {
  const { id } = useParams();          // existe quando é edição
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/clientes/${id}`)
      .then(({ data }) => setForm({ ...vazio, ...data }))
      .catch((err) => setErro(mensagemDeErro(err)));
  }, [id]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      if (id) await api.put(`/clientes/${id}`, form);
      else await api.post('/clientes', form);
      navigate('/clientes');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar cliente' : 'Novo cliente'}</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form className="card border-0 shadow-sm p-4" style={{ maxWidth: 640 }} onSubmit={salvar}>
        <div className="mb-3">
          <label className="form-label">Nome *</label>
          <input className="form-control" name="nome" value={form.nome} onChange={alterar} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">CPF/CNPJ</label>
            <input className="form-control" name="cpf_cnpj" value={form.cpf_cnpj || ''} onChange={alterar} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Telefone</label>
            <input className="form-control" name="telefone" value={form.telefone || ''} onChange={alterar} />
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">E-mail</label>
          <input className="form-control" type="email" name="email" value={form.email || ''} onChange={alterar} />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-gestio" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/clientes')}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
