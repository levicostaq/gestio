import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Painel from './pages/Painel.jsx';
import ClientesLista from './pages/clientes/ClientesLista.jsx';
import ClienteForm from './pages/clientes/ClienteForm.jsx';
import ProdutosLista from './pages/produtos/ProdutosLista.jsx';
import ProdutoForm from './pages/produtos/ProdutoForm.jsx';
import EmConstrucao from './pages/EmConstrucao.jsx';
import VendasLista from './pages/vendas/VendasLista.jsx';
import VendaForm from './pages/vendas/VendaForm.jsx';
import VendaDetalhe from './pages/vendas/VendaDetalhe.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Painel />} />
        <Route path="/clientes" element={<ClientesLista />} />
        <Route path="/clientes/novo" element={<ClienteForm />} />
        <Route path="/clientes/:id" element={<ClienteForm />} />

        <Route path="/produtos" element={<ProdutosLista />} />
        <Route path="/produtos/novo" element={<ProdutoForm />} />
        <Route path="/produtos/:id" element={<ProdutoForm />} />
        <Route path="/vendas" element={<VendasLista />} />
        <Route path="/vendas/nova" element={<VendaForm />} />
        <Route path="/vendas/:id" element={<VendaDetalhe />} />
        <Route path="/financeiro" element={<EmConstrucao titulo="Financeiro" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
