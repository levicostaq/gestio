const indicadores = [
  { titulo: 'Vendas do mês', valor: 'R$ --', icone: 'graph-up' },
  { titulo: 'Saldo do caixa', valor: 'R$ --', icone: 'wallet2' },
  { titulo: 'Produtos em falta', valor: '--', icone: 'exclamation-triangle' },
];

export default function Painel() {
  return (
    <>
      <h2 className="mb-4">Painel</h2>
      <div className="row g-3">
        {indicadores.map((ind) => (
          <div className="col-12 col-md-4" key={ind.titulo}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <i className={`bi bi-${ind.icone} fs-3`}></i>
                <p className="text-muted mb-1 mt-2">{ind.titulo}</p>
                <p className="fs-4 fw-bold mb-0">{ind.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted mt-4">Os indicadores serão ligados à API na Sprint 3.</p>
    </>
  );
}
