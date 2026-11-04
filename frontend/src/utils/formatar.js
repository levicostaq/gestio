// Funções de formatação usadas em várias telas

// 39.9 → "R$ 39,90"
export function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2026-11-02T22:13:58.000Z" (UTC, como vem da API) → "02/11/2026 19:13" (horário local)
export function dataHora(texto) {
  return new Date(texto).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
