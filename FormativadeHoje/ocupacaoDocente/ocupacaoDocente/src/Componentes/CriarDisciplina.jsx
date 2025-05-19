import { useState, useEffect } from 'react';
import './CriarDisciplina.css';

export function CriarDisciplina() {
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);

  // Estado para formulário (tanto criar quanto editar)
  const [form, setForm] = useState({
    id: null, // para editar
    nome: '',
    curso: '',
    cargaHoraria: '',
    descricao: '',
    professor: ''
  });

  // ID da disciplina para excluir
  const [idExcluir, setIdExcluir] = useState(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // Buscar professores
    fetch('http://localhost:8000/usuarios/?categoria=P', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProfessores(data.results || []));

    // Buscar disciplinas
    fetch('http://localhost:8000/disciplinas/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDisciplinas(data));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Criar nova disciplina
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se tem id, é editar
    if (form.id) {
      // Editar disciplina
      const response = await fetch(`http://localhost:8000/disciplinas/${form.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        setDisciplinas(prev => prev.map(d => (d.id === data.id ? data : d)));
        setMostrarModalEditar(false);
        limparFormulario();
        alert('Disciplina atualizada!');
      } else {
        alert('Erro ao atualizar disciplina');
      }
    } else {
      // Criar nova disciplina
      const response = await fetch('http://localhost:8000/disciplinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        setDisciplinas(prev => [...prev, data]);
        setMostrarModal(false);
        limparFormulario();
        alert('Disciplina criada!');
      } else {
        alert('Erro ao criar disciplina');
      }
    }
  };

  const limparFormulario = () => {
    setForm({
      id: null,
      nome: '',
      curso: '',
      cargaHoraria: '',
      descricao: '',
      professor: ''
    });
  };

  // Abrir modal de editar e preencher formulário
  const abrirEditar = (disciplina) => {
    setForm({
      id: disciplina.id,
      nome: disciplina.nome,
      curso: disciplina.curso,
      cargaHoraria: disciplina.cargaHoraria,
      descricao: disciplina.descricao,
      professor: disciplina.professor
    });
    setMostrarModalEditar(true);
  };

  // Abrir modal de excluir
  const abrirExcluir = (id) => {
    setIdExcluir(id);
    setMostrarModalExcluir(true);
  };

  // Confirmar exclusão
  const confirmarExcluir = async () => {
    const response = await fetch(`http://localhost:8000/disciplinas/${idExcluir}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok || response.status === 204) {
      setDisciplinas(prev => prev.filter(d => d.id !== idExcluir));
      setMostrarModalExcluir(false);
      alert('Disciplina excluída!');
    } else {
      alert('Erro ao excluir disciplina');
    }
  };

  return (
    <div className="container-disciplinas">
      <button onClick={() => { limparFormulario(); setMostrarModal(true); }} className="botao-criar">
        Nova Disciplina
      </button>

      {/* Modal Criar */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal modal-medio">
            <h2>Criar Disciplina</h2>
            <form onSubmit={handleSubmit} className="formulario">
              <input name="nome" placeholder="Nome" onChange={handleChange} value={form.nome} required />
              <input name="curso" placeholder="Curso" onChange={handleChange} value={form.curso} required />
              <input name="cargaHoraria" type="number" placeholder="Carga Horária" onChange={handleChange} value={form.cargaHoraria} required />
              <input name="descricao" placeholder="Descrição" onChange={handleChange} value={form.descricao} required />

              <select name="professor" onChange={handleChange} value={form.professor} required>
                <option value="">Selecione o professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.nome}</option>
                ))}
              </select>

              <div className="botoes">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal modal-medio">
            <h2>Editar Disciplina</h2>
            <form onSubmit={handleSubmit} className="formulario">
              <input name="nome" placeholder="Nome" onChange={handleChange} value={form.nome} required />
              <input name="curso" placeholder="Curso" onChange={handleChange} value={form.curso} required />
              <input name="cargaHoraria" type="number" placeholder="Carga Horária" onChange={handleChange} value={form.cargaHoraria} required />
              <input name="descricao" placeholder="Descrição" onChange={handleChange} value={form.descricao} required />

              <select name="professor" onChange={handleChange} value={form.professor} required>
                <option value="">Selecione o professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.nome}</option>
                ))}
              </select>

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
            <p>Tem certeza que deseja excluir esta disciplina?</p>
            <div className="botoes">
              <button onClick={confirmarExcluir}>Sim</button>
              <button onClick={() => setMostrarModalExcluir(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

      <table className="tabela-disciplinas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Curso</th>
            <th>Carga Horária</th>
            <th>Descrição</th>
            <th>Professor</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((disciplina, index) => (
            <tr key={disciplina.id}>
              <td>{index + 1}</td>
              <td>{disciplina.nome}</td>
              <td>{disciplina.curso}</td>
              <td>{disciplina.cargaHoraria}h</td>
              <td>{disciplina.descricao}</td>
              <td>{disciplina.professor_nome || '---'}</td>
              <td>
                <button className="btn-editar" onClick={() => abrirEditar(disciplina)}>✏️</button>
              </td>
              <td>
                <button className="btn-excluir" onClick={() => abrirExcluir(disciplina.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
