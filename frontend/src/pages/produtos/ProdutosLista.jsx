import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';

const formatarPreco = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProdutosLista() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar(termo = '') {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await api.get('/produtos', { params: { busca: termo } });
      setProdutos(data);
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

  async function excluir(produto) {
    if (!window.confirm(`Excluir ${produto.nome}?`)) return;
    try {
      await api.delete(`/produtos/${produto.id}`);
      setProdutos(produtos.filter((p) => p.id !== produto.id));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Produtos</h2>
        <Link to="/produtos/novo" className="btn btn-gestio">
          <i className="bi bi-plus-lg me-1"></i> Novo
        </Link>
      </div>

      <form className="d-flex gap-2 mb-3" onSubmit={pesquisar}>
        <input
          className="form-control"
          placeholder="Buscar por nome..."
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
              <th>Preço</th>
              <th>Estoque</th>
              <th>Mínimo</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan="5" className="text-center text-muted">Carregando...</td></tr>
            )}
            {!carregando && produtos.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted">Nenhum produto encontrado.</td></tr>
            )}
            {produtos.map((p) => {
              const baixo = p.estoque <= p.estoque_min;
              return (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{formatarPreco(p.preco)}</td>
                  <td className={baixo ? 'text-danger fw-bold' : ''}>
                    {p.estoque}
                    {baixo && <span className="badge bg-danger ms-2">Baixo</span>}
                  </td>
                  <td>{p.estoque_min}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/produtos/${p.id}`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" title="Excluir" onClick={() => excluir(p)}>
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