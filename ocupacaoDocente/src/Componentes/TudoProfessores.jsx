import { useState, useEffect } from 'react';
import './TudoProfessores.css';

export function TudoProfessores() {
  const [professores, setProfessores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [form, setForm] = useState({
    id: null,
    NI: '',
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    dataContratacao: '',
    username: '',
    password: '',
    categoria: 'P',
  });
  const [idExcluir, setIdExcluir] = useState(null);
  const [categoriaUsuario, setCategoriaUsuario] = useState(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const categoria = localStorage.getItem('categoria');
    setCategoriaUsuario(categoria);
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    const res = await fetch('http://localhost:8000/usuarios/?categoria=P', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfessores(data.results || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limparFormulario = () => {
    setForm({
      id: null,
      NI: '',
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      dataContratacao: '',
      username: '',
      password: '',
      categoria: 'P',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metodo = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost:8000/usuarios/${form.id}/`
      : 'http://localhost:8000/usuarios/';

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert(`Professor ${form.id ? 'atualizado' : 'criado'} com sucesso!`);
      setMostrarFormulario(false);
      setMostrarModalEditar(false);
      limparFormulario();
      carregarProfessores();
    } else {
      const data = await response.json();
      alert('Erro:\n' + JSON.stringify(data, null, 2));
    }
  };

  const abrirEditar = (professor) => {
    setForm({
      id: professor.id,
      NI: professor.NI || '',
      nome: professor.nome || '',
      email: professor.email || '',
      telefone: professor.telefone || '',
      dataNascimento: professor.dataNascimento || '',
      dataContratacao: professor.dataContratacao || '',
      username: professor.username || '',
      password: '', // Não preencher senha ao editar
      categoria: 'P',
    });
    setMostrarModalEditar(true);
  };

  const abrirExcluir = (id) => {
    setIdExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExcluir = async () => {
    const response = await fetch(`http://localhost:8000/usuarios/${idExcluir}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok || response.status === 204) {
      alert('Professor excluído com sucesso!');
      setMostrarModalExcluir(false);
      carregarProfessores();
    } else {
      alert('Erro ao excluir professor');
    }
  };

  return (
    <div>
      <h2 className='titulo'>Lista de Professores</h2>

      {categoriaUsuario === 'G' && (
        <div className='acoes'>
          <button className="novo" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? 'Cancelar' : 'Novo Professor'}
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className='criarform'>
          <label>NI</label>
          <input name="NI" placeholder="NI" onChange={handleChange} required />

          <label>Nome</label>
          <input name="nome" placeholder="Nome" onChange={handleChange} required />

          <label>Email</label>
          <input name="email" placeholder="Email" onChange={handleChange} required />

          <label>Telefone</label>
          <input name="telefone" placeholder="Telefone" onChange={handleChange} required />

          <label>Data de Nascimento</label>
          <input name="dataNascimento" type="date" onChange={handleChange} required />

          <label>Data de Contratação</label>
          <input name="dataContratacao" type="date" onChange={handleChange} required />

          <label>Username</label>
          <input name="username" placeholder="Username" onChange={handleChange} required />

          <label>Senha</label>
          <input name="password" type="password" placeholder="Senha" onChange={handleChange} required />

          <button type="submit" className="salvar">Salvar</button>
        </form>
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal modal-medio">
            <h2>Editar Professor</h2>
            <form onSubmit={handleSubmit} className="formulario">
              <label>NI</label>
              <input name="NI" placeholder="NI" onChange={handleChange} value={form.NI} required />

              <label>Nome</label>
              <input name="nome" placeholder="Nome" onChange={handleChange} value={form.nome} required />

              <label>Email</label>
              <input name="email" placeholder="Email" onChange={handleChange} value={form.email} required />

              <label>Telefone</label>
              <input name="telefone" placeholder="Telefone" onChange={handleChange} value={form.telefone} required />

              <label>Data de Nascimento</label>
              <input name="dataNascimento" type="date" onChange={handleChange} value={form.dataNascimento} required />

              <label>Data de Contratação</label>
              <input name="dataContratacao" type="date" onChange={handleChange} value={form.dataContratacao} required />

              <label>Username</label>
              <input name="username" placeholder="Username" onChange={handleChange} value={form.username} required />

              <label>Nova Senha</label>
              <input name="password" type="password" placeholder="Nova Senha" onChange={handleChange} value={form.password} />

              <div className="botoes">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setMostrarModalEditar(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal Excluir */}
      {mostrarModalExcluir && (
        <div className="modal-overlay">
          <div className="modal modal-pequeno">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este professor?</p>
            <div className="botoes">
              <button onClick={confirmarExcluir}>Sim</button>
              <button onClick={() => setMostrarModalExcluir(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

      <div className="container-tabela">
        <table className="tabela-professores">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody >
            {professores.map((prof, index) => (
              <tr key={prof.id}>
                <td>{index + 1}</td>
                <td>{prof.nome || '—'}</td>
                <td>{prof.email || '—'}</td>
                <td>{prof.telefone || '—'}</td>
                <td>{prof.username || '—'}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirEditar(prof)}>✏️</button>
                  <button className="btn-excluir" onClick={() => abrirExcluir(prof.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
