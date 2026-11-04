import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../services/api.js';
import { usuarioAtual } from '../services/auth.js';
import { moeda, dataHora } from '../utils/formatar.js';

function Indicador({ titulo, valor, icone, detalhe, destaque }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <i className={`bi bi-${icone} fs-3`}></i>
          <p className="text-muted mb-1 mt-2">{titulo}</p>
          <p className={`fs-4 fw-bold mb-0 ${destaque || ''}`}>{valor}</p>
          {detalhe && <p className="small text-muted mb-0">{detalhe}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Painel() {
  const usuario = usuarioAtual();
  const [painel, setPainel] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/painel')
      .then(({ data }) => setPainel(data))
      .catch((err) => setErro(mensagemDeErro(err)));
  }, []);

  if (erro) return <div className="alert alert-danger">{erro}</div>;
  if (!painel) return <p className="text-muted">Carregando...</p>;

  const { vendas_mes, produtos_em_falta, ultimas_vendas, financeiro } = painel;

  return (
    <>
      <h2 className="mb-1">Painel</h2>
      <p className="text-muted mb-4">Olá, {usuario?.nome}. Este é o resumo do seu negócio.</p>

      <div className="row g-3 mb-4">
        <Indicador
          titulo="Vendas do mês"
          valor={moeda(vendas_mes.total)}
          icone="graph-up"
          detalhe={`${vendas_mes.quantidade} venda(s)`}
        />
        <Indicador
          titulo="Produtos em falta"
          valor={produtos_em_falta.length}
          icone="exclamation-triangle"
          detalhe="no estoque mínimo ou abaixo"
          destaque={produtos_em_falta.length > 0 ? 'text-danger' : ''}
        />
        {financeiro && (
          <>
            <Indicador
              titulo="Saldo do caixa"
              valor={moeda(financeiro.saldo)}
              icone="wallet2"
              detalhe="entradas pagas menos saídas pagas"
              destaque={financeiro.saldo < 0 ? 'text-danger' : 'text-success'}
            />
            <Indicador
              titulo="Contas pendentes"
              valor={moeda(financeiro.a_pagar)}
              icone="calendar-x"
              detalhe={`a pagar · ${financeiro.vencidos} vencida(s) · ${moeda(financeiro.a_receber)} a receber`}
            />
          </>
        )}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Produtos em falta</h3>
              {produtos_em_falta.length === 0 ? (
                <p className="text-muted mb-0">Nenhum produto em falta. 👍</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {produtos_em_falta.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between px-0">
                      <Link to={`/produtos/${p.id}`}>{p.nome}</Link>
                      <span className="text-danger fw-semibold">
                        {p.estoque} em estoque (mínimo {p.estoque_min})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Últimas vendas</h3>
                <Link to="/vendas/nova" className="btn btn-sm btn-gestio">Nova venda</Link>
              </div>
              {ultimas_vendas.length === 0 ? (
                <p className="text-muted mb-0">Nenhuma venda registrada ainda.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <tbody>
                      {ultimas_vendas.map((v) => (
                        <tr key={v.id}>
                          <td><Link to={`/vendas/${v.id}`}>#{v.id}</Link></td>
                          <td>{dataHora(v.data)}</td>
                          <td>{v.cliente_nome || <span className="text-muted">Sem cliente</span>}</td>
                          <td className="text-end fw-semibold">{moeda(v.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
