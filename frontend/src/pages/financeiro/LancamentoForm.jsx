import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';
import { hojeISO } from '../../utils/formatar.js';

const vazio = { tipo: 'saida', descricao: '', valor: '', vencimento: hojeISO(), status: 'pendente' };

export default function LancamentoForm() {
  const { id } = useParams(); // existe quando é edição
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/lancamentos/${id}`)
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
    const dados = { ...form, valor: Number(form.valor) };
    try {
      if (id) await api.put(`/lancamentos/${id}`, dados);
      else await api.post('/lancamentos', dados);
      navigate('/financeiro');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="mb-4">{id ? 'Editar lançamento' : 'Novo lançamento'}</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form className="card border-0 shadow-sm p-4" style={{ maxWidth: 640 }} onSubmit={salvar}>
        <div className="mb-3">
          <label className="form-label d-block">Tipo *</label>
          <div className="btn-group" role="group">
            <input type="radio" className="btn-check" name="tipo" id="tipo-saida" value="saida"
              checked={form.tipo === 'saida'} onChange={alterar} />
            <label className="btn btn-outline-danger" htmlFor="tipo-saida">A pagar (saída)</label>
            <input type="radio" className="btn-check" name="tipo" id="tipo-entrada" value="entrada"
              checked={form.tipo === 'entrada'} onChange={alterar} />
            <label className="btn btn-outline-success" htmlFor="tipo-entrada">A receber (entrada)</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição *</label>
          <input className="form-control" name="descricao" placeholder="Ex.: Aluguel da loja"
            value={form.descricao} onChange={alterar} required />
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Valor (R$) *</label>
            <input className="form-control" type="number" step="0.01" min="0.01" name="valor"
              value={form.valor} onChange={alterar} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Vencimento *</label>
            <input className="form-control" type="date" name="vencimento" value={form.vencimento} onChange={alterar} required />
          </div>
          <div className="col-md-4 mb-4">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={form.status} onChange={alterar}>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-gestio" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/financeiro')}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
