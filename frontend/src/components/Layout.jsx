import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { usuarioAtual, encerrarSessao } from '../services/auth.js';

const menu = [
  { to: '/', icone: 'speedometer2', texto: 'Painel' },
  { to: '/clientes', icone: 'people', texto: 'Clientes' },
  { to: '/produtos', icone: 'box-seam', texto: 'Produtos' },
  { to: '/vendas', icone: 'cart-check', texto: 'Vendas' },
  { to: '/financeiro', icone: 'cash-stack', texto: 'Financeiro', somenteAdmin: true },
  { to: '/usuarios', icone: 'person-gear', texto: 'Usuários', somenteAdmin: true },
];

export default function Layout() {
  const navigate = useNavigate();
  const usuario = usuarioAtual();
  const admin = usuario?.perfil === 'admin';

  function sair() {
    encerrarSessao();
    navigate('/login');
  }

  return (
    <div className="d-flex flex-column flex-md-row">
      <aside className="sidebar p-3 d-flex flex-column">
        <h1 className="h4 text-white fw-bold mb-1 px-2">Gestio</h1>
        <p className="small px-2 mb-4" style={{ color: '#aeb8c8' }}>{usuario?.empresa_nome}</p>

        <nav className="nav flex-md-column gap-1">
          {menu
            .filter((item) => !item.somenteAdmin || admin)
            .map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link">
                <i className={`bi bi-${item.icone} me-2`}></i>
                {item.texto}
              </NavLink>
            ))}
        </nav>

        <div className="mt-md-auto pt-3 px-2 border-top" style={{ borderColor: '#2a3b5f' }}>
          <p className="text-white mb-0 small fw-semibold">{usuario?.nome}</p>
          <p className="small mb-2" style={{ color: '#aeb8c8' }}>
            {admin ? 'Administrador' : 'Funcionário'}
          </p>
          <button className="btn btn-sm btn-outline-light" onClick={sair}>
            <i className="bi bi-box-arrow-right me-1"></i> Sair
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
