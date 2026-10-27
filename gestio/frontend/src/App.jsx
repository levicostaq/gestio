import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Painel from './pages/Painel.jsx';
import ClientesLista from './pages/clientes/ClientesLista.jsx';
import ClienteForm from './pages/clientes/ClienteForm.jsx';
import EmConstrucao from './pages/EmConstrucao.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Painel />} />

        <Route path="/clientes" element={<ClientesLista />} />
        <Route path="/clientes/novo" element={<ClienteForm />} />
        <Route path="/clientes/:id" element={<ClienteForm />} />

        <Route path="/produtos" element={<EmConstrucao titulo="Produtos" />} />
        <Route path="/vendas" element={<EmConstrucao titulo="Vendas" />} />
        <Route path="/financeiro" element={<EmConstrucao titulo="Financeiro" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
