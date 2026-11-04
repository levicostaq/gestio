import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { mensagemDeErro } from '../../services/api.js';
import { moeda, dataHora } from '../../utils/formatar.js';

export default function VendaDetalhe() {
  const { id } = useParams();
  const [venda, setVenda] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/vendas/${id}`)
      .then(({ data }) => setVenda(data))
      .catch((err) => setErro(mensagemDeErro(err)));
  }, [id]);

  if (erro) return <div className="alert alert-danger">{erro}</div>;
  if (!venda) return <p className="text-muted">Carregando...</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Venda #{venda.id}</h2>
        <Link to="/vendas" className="btn btn-outline-secondary">Voltar</Link>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-3">
        <p className="mb-1"><strong>Data:</strong> {dataHora(venda.data)}</p>
        <p className="mb-0"><strong>Cliente:</strong> {venda.cliente_nome || 'Sem cliente'}</p>
      </div>

      <div className="table-responsive">
        <table className="table bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Preço unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens.map((i) => (
              <tr key={i.id}>
                <td>{i.produto_nome}</td>
                <td>{i.quantidade}</td>
                <td>{moeda(i.preco_unit)}</td>
                <td>{moeda(i.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td className="fw-bold fs-5">{moeda(venda.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
