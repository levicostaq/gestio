import * as model from '../models/painel.model.js';

// Monta o painel. As consultas rodam ao mesmo tempo (Promise.all), em vez de uma depois da outra.
// O resumo financeiro só aparece para o administrador.
export async function montar(empresaId, perfil) {
  const [vendasMes, produtosEmFalta, ultimasVendas, financeiro] = await Promise.all([
    model.vendasDoMes(empresaId),
    model.produtosEmFalta(empresaId),
    model.ultimasVendas(empresaId),
    perfil === 'admin' ? model.resumoFinanceiro(empresaId) : null,
  ]);

  return {
    vendas_mes: vendasMes,
    produtos_em_falta: produtosEmFalta,
    ultimas_vendas: ultimasVendas,
    financeiro: financeiro && {
      ...financeiro,
      saldo: Math.round((financeiro.entradas_pagas - financeiro.saidas_pagas) * 100) / 100,
    },
  };
}
