import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';
import { moeda, dataHora } from '../../utils/formatar.js';

export default function VendasLista() {
  const [vendas, setVendas] = useState([]);
  const [filtro, setFiltro] = useState({ inicio: '', fim: '' });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar(filtros = {}) {
    setCarregando(true);
    setErro('');
    try {
      // Só manda na URL os filtros que foram preenchidos
      const params = {};
      if (filtros.inicio) params.inicio = filtros.inicio;
      if (filtros.fim) params.fim = filtros.fim;
      const { data } = await api.get('/vendas', { params });
      setVendas(data);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function filtrar(e) {
    e.preventDefault();
    carregar(filtro);
  }

  function limpar() {
    setFiltro({ inicio: '', fim: '' });
    carregar();
  }

  async function cancelar(venda) {
    if (!window.confirm(`Cancelar a venda #${venda.id}? Os produtos voltam para o estoque.`)) return;
    try {
      await api.delete(`/vendas/${venda.id}`);
      setVendas(vendas.filter((v) => v.id !== venda.id));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  const totalPeriodo = vendas.reduce((soma, v) => soma + v.total, 0);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Vendas</h2>
        <Link to="/vendas/nova" className="btn btn-gestio">
          <i className="bi bi-plus-lg me-1"></i> Nova venda
        </Link>
      </div>

      <form className="row g-2 align-items-end mb-3" onSubmit={filtrar}>
        <div className="col-6 col-md-3">
          <label className="form-label mb-1">De</label>
          <input type="date" className="form-control" value={filtro.inicio}
            onChange={(e) => setFiltro({ ...filtro, inicio: e.target.value })} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label mb-1">Até</label>
          <input type="date" className="form-control" value={filtro.fim}
            onChange={(e) => setFiltro({ ...filtro, fim: e.target.value })} />
        </div>
        <div className="col-12 col-md-auto d-flex gap-2">
          <button className="btn btn-outline-secondary" type="submit">
            <i className="bi bi-funnel me-1"></i> Filtrar
          </button>
          <button className="btn btn-link" type="button" onClick={limpar}>Limpar</button>
        </div>
      </form>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="table-responsive">
        <table className="table table-hover bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Total</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan="6" className="text-center text-muted">Carregando...</td></tr>
            )}
            {!carregando && vendas.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted">Nenhuma venda encontrada.</td></tr>
            )}
            {vendas.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{dataHora(v.data)}</td>
                <td>{v.cliente_nome || <span className="text-muted">Sem cliente</span>}</td>
                <td>{v.quantidade_itens}</td>
                <td>{moeda(v.total)}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/vendas/${v.id}`} className="btn btn-sm btn-outline-primary me-1" title="Ver detalhes">
                    <i className="bi bi-eye"></i>
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" title="Cancelar venda" onClick={() => cancelar(v)}>
                    <i className="bi bi-x-circle"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {vendas.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="4" className="text-end fw-bold">Total do período</td>
                <td className="fw-bold">{moeda(totalPeriodo)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}
