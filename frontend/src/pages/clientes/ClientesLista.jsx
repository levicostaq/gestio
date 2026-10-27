import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';

export default function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar(termo = '') {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await api.get('/clientes', { params: { busca: termo } });
      setClientes(data);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function pesquisar(e) {
    e.preventDefault();
    carregar(busca);
  }

  async function excluir(cliente) {
    if (!window.confirm(`Excluir ${cliente.nome}?`)) return;
    try {
      await api.delete(`/clientes/${cliente.id}`);
      setClientes(clientes.filter((c) => c.id !== cliente.id));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Clientes</h2>
        <Link to="/clientes/novo" className="btn btn-gestio">
          <i className="bi bi-plus-lg me-1"></i> Novo
        </Link>
      </div>

      <form className="d-flex gap-2 mb-3" onSubmit={pesquisar}>
        <input
          className="form-control"
          placeholder="Buscar por nome ou CPF/CNPJ..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="table-responsive">
        <table className="table table-hover bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan="5" className="text-center text-muted">Carregando...</td></tr>
            )}
            {!carregando && clientes.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted">Nenhum cliente encontrado.</td></tr>
            )}
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.cpf_cnpj}</td>
                <td>{c.telefone}</td>
                <td>{c.email}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/clientes/${c.id}`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" title="Excluir" onClick={() => excluir(c)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
