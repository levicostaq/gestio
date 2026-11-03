import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';

const vazio = { nome: '', preco: '', estoque: 0, estoque_min: 0 };

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/produtos/${id}`)
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
    const dados = {
      nome: form.nome,
      preco: form.preco === '' ? '' : Number(form.preco),
      estoque: Number(form.estoque),
      estoque_min: Number(form.estoque_min),
    };
    try {
      if (id) await api.put(`/produtos/${id}`, dados);
      else await api.post('/produtos', dados);
      navigate('/produtos');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar produto' : 'Novo produto'}</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      <form className="card border-0 shadow-sm p-4" style={{ maxWidth: 640 }} onSubmit={salvar}>
        <div className="mb-3">
          <label className="form-label">Nome *</label>
          <input className="form-control" name="nome" value={form.nome} onChange={alterar} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Preço (R$) *</label>
          <input className="form-control" type="number" step="0.01" min="0" name="preco" value={form.preco} onChange={alterar} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label">Estoque</label>
            <input className="form-control" type="number" step="1" min="0" name="estoque" value={form.estoque} onChange={alterar} />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Estoque mínimo</label>
            <input className="form-control" type="number" step="1" min="0" name="estoque_min" value={form.estoque_min} onChange={alterar} />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-gestio" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/produtos')}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}