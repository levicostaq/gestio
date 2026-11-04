import { useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../../services/api.js';
import { usuarioAtual } from '../../services/auth.js';

const vazio = { nome: '', email: '', senha: '', perfil: 'funcionario' };

export default function UsuariosLista() {
  const eu = usuarioAtual();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get('/usuarios')
      .then(({ data }) => setUsuarios(data))
      .catch((err) => setErro(mensagemDeErro(err)));
  }, []);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function adicionar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const { data } = await api.post('/usuarios', form);
      setUsuarios([...usuarios, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      setForm(vazio);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(usuario) {
    try {
      const { data } = await api.patch(`/usuarios/${usuario.id}/ativo`, { ativo: !usuario.ativo });
      setUsuarios(usuarios.map((u) => (u.id === data.id ? data : u)));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      <h2 className="mb-4">Usuários</h2>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form className="card border-0 shadow-sm p-4 mb-4" onSubmit={adicionar}>
        <h3 className="h6 mb-3">Adicionar usuário</h3>
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label">Nome</label>
            <input className="form-control" name="nome" value={form.nome} onChange={alterar} required />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">E-mail</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={alterar} required />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Senha</label>
            <input className="form-control" type="password" minLength={6} name="senha" value={form.senha} onChange={alterar} required />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Perfil</label>
            <select className="form-select" name="perfil" value={form.perfil} onChange={alterar}>
              <option value="funcionario">Funcionário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="col-12 col-md-2">
            <button className="btn btn-gestio w-100" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table bg-white shadow-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Situação</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}{u.id === eu?.id && <span className="text-muted"> (você)</span>}</td>
                <td>{u.email}</td>
                <td>{u.perfil === 'admin' ? 'Administrador' : 'Funcionário'}</td>
                <td>
                  {u.ativo
                    ? <span className="badge bg-success">Ativo</span>
                    : <span className="badge bg-secondary">Desativado</span>}
                </td>
                <td className="text-end">
                  {u.id !== eu?.id && (
                    <button className={`btn btn-sm ${u.ativo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => alternarAtivo(u)}>
                      {u.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
