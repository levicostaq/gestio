import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';
import { moeda, data, hojeISO } from '../../utils/formatar.js';

const filtroVazio = { tipo: '', status: '', mes: '' };

export default function LancamentosLista() {
  const [lancamentos, setLancamentos] = useState([]);
  const [filtro, setFiltro] = useState(filtroVazio);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar(filtros = filtroVazio) {
    setCarregando(true);
    setErro('');
    try {
      // Só manda na URL os filtros preenchidos
      const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor));
      const { data: lista } = await api.get('/lancamentos', { params });
      setLancamentos(lista);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function alterarFiltro(e) {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  }

  function filtrar(e) {
    e.preventDefault();
    carregar(filtro);
  }

  function limpar() {
    setFiltro(filtroVazio);
    carregar();
  }

  async function pagar(lancamento) {
    try {
      const { data: atualizado } = await api.patch(`/lancamentos/${lancamento.id}/pagar`);
      setLancamentos(lancamentos.map((l) => (l.id === atualizado.id ? atualizado : l)));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  async function excluir(lancamento) {
    if (!window.confirm(`Excluir "${lancamento.descricao}"?`)) return;
    try {
      await api.delete(`/lancamentos/${lancamento.id}`);
      setLancamentos(lancamentos.filter((l) => l.id !== lancamento.id));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  const hoje = hojeISO();
  const somar = (tipo) => lancamentos.filter((l) => l.tipo === tipo).reduce((s, l) => s + l.valor, 0);
  const entradas = somar('entrada');
  const saidas = somar('saida');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Financeiro</h2>
        <Link to="/financeiro/novo" className="btn btn-gestio">
          <i className="bi bi-plus-lg me-1"></i> Novo lançamento
        </Link>
      </div>

      <form className="row g-2 align-items-end mb-3" onSubmit={filtrar}>
        <div className="col-6 col-md-3">
          <label className="form-label mb-1">Tipo</label>
          <select className="form-select" name="tipo" value={filtro.tipo} onChange={alterarFiltro}>
            <option value="">Todos</option>
            <option value="entrada">A receber (entrada)</option>
            <option value="saida">A pagar (saída)</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label mb-1">Status</label>
          <select className="form-select" name="status" value={filtro.status} onChange={alterarFiltro}>
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label mb-1">Mês do vencimento</label>
          <input type="month" className="form-control" name="mes" value={filtro.mes} onChange={alterarFiltro} />
        </div>
        <div className="col-6 col-md-3 d-flex gap-2">
          <button className="btn btn-outline-secondary" type="submit">
            <i className="bi bi-funnel me-1"></i> Filtrar
          </button>
          <button className="btn btn-link" type="button" onClick={limpar}>Limpar</button>
        </div>
      </form>

      <div className="row g-3 mb-3">
        <div className="col-4">
          <div className="card border-0 shadow-sm"><div className="card-body py-2">
            <p className="small text-muted mb-0">Entradas</p>
            <p className="fw-bold text-success mb-0">{moeda(entradas)}</p>
          </div></div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm"><div className="card-body py-2">
            <p className="small text-muted mb-0">Saídas</p>
            <p className="fw-bold text-danger mb-0">{moeda(saidas)}</p>
          </div></div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm"><div className="card-body py-2">
            <p className="small text-muted mb-0">Diferença</p>
            <p className="fw-bold mb-0">{moeda(entradas - saidas)}</p>
          </div></div>
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="table-responsive">
        <table className="table table-hover bg-white shadow-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Status</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan="6" className="text-center text-muted">Carregando...</td></tr>
            )}
            {!carregando && lancamentos.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted">Nenhum lançamento encontrado.</td></tr>
            )}
            {lancamentos.map((l) => {
              const vencido = l.status === 'pendente' && l.vencimento < hoje;
              return (
                <tr key={l.id}>
                  <td>
                    {l.tipo === 'entrada'
                      ? <span className="badge bg-success"><i className="bi bi-arrow-down-left me-1"></i>Entrada</span>
                      : <span className="badge bg-danger"><i className="bi bi-arrow-up-right me-1"></i>Saída</span>}
                  </td>
                  <td>{l.descricao}</td>
                  <td className={vencido ? 'text-danger fw-semibold' : ''}>{data(l.vencimento)}</td>
                  <td>{moeda(l.valor)}</td>
                  <td>
                    {l.status === 'pago' && <span className="badge bg-secondary">Pago</span>}
                    {l.status === 'pendente' && !vencido && <span className="badge bg-warning text-dark">Pendente</span>}
                    {vencido && <span className="badge bg-danger">Vencido</span>}
                  </td>
                  <td className="text-end text-nowrap">
                    {l.status === 'pendente' && (
                      <button className="btn btn-sm btn-outline-success me-1" title="Marcar como pago" onClick={() => pagar(l)}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}
                    <Link to={`/financeiro/${l.id}`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" title="Excluir" onClick={() => excluir(l)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
