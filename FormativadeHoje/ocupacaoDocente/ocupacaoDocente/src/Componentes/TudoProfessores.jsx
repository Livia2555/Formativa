import { useState, useEffect } from 'react';
import './TudoProfessores.css';

export function TudoProfessores() {
  const [professores, setProfessores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({
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
  const [categoriaUsuario, setCategoriaUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const categoria = localStorage.getItem('categoria');
    setCategoriaUsuario(categoria);

    fetch('http://localhost:8000/usuarios/?categoria=P', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar professores');
        return res.json();
      })
      .then(data => {
        console.log(data);
        setProfessores(data.results || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      console.log(form);
      const response = await fetch('http://localhost:8000/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao criar professor:', data);
        alert('Erro ao criar professor:\n' + JSON.stringify(data, null, 2));
        return;
      }

      alert('Professor criado com sucesso!');
      setMostrarFormulario(false);

      const res = await fetch('http://localhost:8000/usuarios/?categoria=P', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const listaAtualizada = await res.json();
      setProfessores(listaAtualizada.results || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado ao criar professor.');
    }
  };
  
  return (
    <div>
      <h2 className='titulo'>Lista de Professores</h2>
      <ul className="professores">
        {professores.map(prof => (
          <li key={prof.id}>
            <p>Nome: {prof.nome || 'Não informado'}</p>
            <p>Usuário: {prof.username}</p>
            <p>Email: {prof.email || 'Não informado'}</p>
            <p>Telefone: {prof.telefone || 'Não informado'}</p>
            <p>NI: {prof.NI || 'Não informado'}</p>
            <p>Data de Nascimento: {prof.dataNascimento || 'Não informada'}</p>
            <p>Data de Contratação: {prof.dataContratacao || 'Não informada'}</p>
          </li>
        ))}
      </ul>

      {categoriaUsuario === 'G' && (
        <div className='criar'>
          <button onClick={() => setMostrarFormulario(!mostrarFormulario)} >
            {mostrarFormulario ? 'Cancelar' : 'Criar Professor'}
          </button>

          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className='criarform'>
              <input name="NI" placeholder="NI" onChange={handleChange} required />
              <input name="nome" placeholder="Nome" onChange={handleChange} required />
              <input name="email" placeholder="Email" onChange={handleChange} required />
              <input name="telefone" placeholder="Telefone" onChange={handleChange} required />
              <input name="dataNascimento" type="date" onChange={handleChange} required />
              <input name="dataContratacao" type="date" onChange={handleChange} required />
              <input name="username" placeholder="Username" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Senha" onChange={handleChange} required />
              <button type="submit">Salvar</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
