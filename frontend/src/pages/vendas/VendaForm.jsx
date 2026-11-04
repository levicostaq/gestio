import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';
import { moeda } from '../../utils/formatar.js';

export default function VendaForm() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]); // [{ produto, quantidade }]
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Carrega clientes e produtos ao mesmo tempo para montar os selects
  useEffect(() => {
    Promise.all([api.get('/clientes'), api.get('/produtos')])
      .then(([resClientes, resProdutos]) => {
        setClientes(resClientes.data);
        setProdutos(resProdutos.data);
      })
      .catch((err) => setErro(mensagemDeErro(err)));
  }, []);

  function adicionarItem() {
    setErro('');
    const produto = produtos.find((p) => p.id === Number(produtoId));
    const qtd = Number(quantidade);

    if (!produto) return setErro('Escolha um produto.');
    if (!Number.isInteger(qtd) || qtd <= 0) return setErro('A quantidade deve ser um número inteiro maior que zero.');

    // Se o produto já está na lista, soma a quantidade
    const existente = itens.find((i) => i.produto.id === produto.id);
    const totalPedido = (existente ? existente.quantidade : 0) + qtd;
    if (totalPedido > produto.estoque) {
      return setErro(`Estoque insuficiente para ${produto.nome}: disponível ${produto.estoque}.`);
    }

    if (existente) {
      setItens(itens.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: totalPedido } : i)));
    } else {
      setItens([...itens, { produto, quantidade: qtd }]);
    }
    setProdutoId('');
    setQuantidade(1);
  }

  function removerItem(id) {
    setItens(itens.filter((i) => i.produto.id !== id));
  }

  // O total aqui é só para mostrar na tela. Quem calcula o valor oficial é a API.
  const total = itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);

  async function registrar() {
    if (itens.length === 0) return setErro('Adicione pelo menos um produto.');
    setSalvando(true);
    setErro('');
    try {
      // Manda só cliente, produto e quantidade. Preço e total vêm do banco.
      await api.post('/vendas', {
        cliente_id: clienteId ? Number(clienteId) : null,
        itens: itens.map((i) => ({ produto_id: i.produto.id, quantidade: i.quantidade })),
      });
      navigate('/vendas');
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="mb-4">Nova venda</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="card border-0 shadow-sm p-4 mb-3">
        <label className="form-label">Cliente</label>
        <select className="form-select" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Sem cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-7">
            <label className="form-label">Produto</label>
            <select className="form-select" value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
              <option value="">Escolha um produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id} disabled={p.estoque === 0}>
                  {p.nome} · {moeda(p.preco)} · estoque {p.estoque}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Qtd.</label>
            <input type="number" min="1" step="1" className="form-control"
              value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>
          <div className="col-6 col-md-3">
            <button type="button" className="btn btn-outline-primary w-100" onClick={adicionarItem}>
              <i className="bi bi-plus-lg me-1"></i> Adicionar
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Preço</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted">Nenhum produto adicionado.</td></tr>
            )}
            {itens.map((i) => (
              <tr key={i.produto.id}>
                <td>{i.produto.nome}</td>
                <td>{i.quantidade}</td>
                <td>{moeda(i.produto.preco)}</td>
                <td>{moeda(i.produto.preco * i.quantidade)}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" title="Remover" onClick={() => removerItem(i.produto.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td className="fw-bold fs-5">{moeda(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-gestio" onClick={registrar} disabled={salvando || itens.length === 0}>
          {salvando ? 'Registrando...' : 'Registrar venda'}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/vendas')}>Cancelar</button>
      </div>
    </>
  );
}
