// Funções de formatação usadas em várias telas

// 39.9 → "R$ 39,90"
export function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2026-11-02T22:13:58.000Z" (UTC, como vem da API) → "02/11/2026 19:13" (horário local)
export function dataHora(texto) {
  return new Date(texto).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// "2026-11-10" (coluna DATE) → "10/11/2026"
// Separa o texto em vez de usar new Date(), que poderia mudar o dia por causa do fuso horário
export function data(texto) {
  if (!texto) return '';
  const [ano, mes, dia] = texto.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Data de hoje no formato "2026-11-04", no horário local
export function hojeISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
