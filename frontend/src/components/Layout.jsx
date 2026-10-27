import { NavLink, Outlet } from 'react-router-dom';

const menu = [
  { to: '/', icone: 'speedometer2', texto: 'Painel' },
  { to: '/clientes', icone: 'people', texto: 'Clientes' },
  { to: '/produtos', icone: 'box-seam', texto: 'Produtos' },
  { to: '/vendas', icone: 'cart-check', texto: 'Vendas' },
  { to: '/financeiro', icone: 'cash-stack', texto: 'Financeiro' },
];

export default function Layout() {
  return (
    <div className="d-flex flex-column flex-md-row">
      <aside className="sidebar p-3">
        <h1 className="h4 text-white fw-bold mb-4 px-2">Gestio</h1>
        <nav className="nav flex-md-column gap-1">
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link">
              <i className={`bi bi-${item.icone} me-2`}></i>
              {item.texto}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
