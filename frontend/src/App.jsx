import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Login from './pages/Login.jsx';
import Registrar from './pages/Registrar.jsx';
import Painel from './pages/Painel.jsx';
import ClientesLista from './pages/clientes/ClientesLista.jsx';
import ClienteForm from './pages/clientes/ClienteForm.jsx';
import ProdutosLista from './pages/produtos/ProdutosLista.jsx';
import ProdutoForm from './pages/produtos/ProdutoForm.jsx';
import VendasLista from './pages/vendas/VendasLista.jsx';
import VendaForm from './pages/vendas/VendaForm.jsx';
import VendaDetalhe from './pages/vendas/VendaDetalhe.jsx';
import LancamentosLista from './pages/financeiro/LancamentosLista.jsx';
import LancamentoForm from './pages/financeiro/LancamentoForm.jsx';
import UsuariosLista from './pages/usuarios/UsuariosLista.jsx';

export default function App() {
  return (
    <Routes>
      {/* Telas abertas, sem menu */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />

      {/* Telas que exigem login */}
      <Route element={<RotaProtegida />}>
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

          {/* Só o administrador */}
          <Route element={<RotaProtegida somenteAdmin />}>
            <Route path="/financeiro" element={<LancamentosLista />} />
            <Route path="/financeiro/novo" element={<LancamentoForm />} />
            <Route path="/financeiro/:id" element={<LancamentoForm />} />
            <Route path="/usuarios" element={<UsuariosLista />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
