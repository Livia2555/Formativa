import { useState, useEffect } from 'react';
import './CriarAmbiente.css';

export function CriarAmbiente() {
  const [ambientes, setAmbientes] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [salas, setSalas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);

  const [formulario, setFormulario] = useState({
    id: null,
    dataInicio: '',
    dataTermino: '',
    periodo: '',
    salas: '',
    professor: '',
    disciplina: ''
  });

  const [idAmbienteExcluir, setIdAmbienteExcluir] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');

  const token = localStorage.getItem('access_token');

  const getDisciplinasDoProfessor = (professorId) => {
    const professorSelecionado = professores.find(p => p.id === professorId);
    const nomeProfessor = professorSelecionado ? professorSelecionado.nome : '';
    const disciplinasDoProfessor = disciplinas.filter(d => d.professor === nomeProfessor);
    return disciplinasDoProfessor;
  };

  useEffect(() => {
    fetch('http://localhost:8000/ambientes/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAmbientes(data.results || data));

    fetch('http://localhost:8000/usuarios/?categoria=P', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setProfessores(data.results || data));

    fetch('http://localhost:8000/salas/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setSalas(data.results || data));

    fetch('http://localhost:8000/disciplinas/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setDisciplinas(data.results || data));
  }, [token]);

  const atualizarFormulario = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    setMensagemErro('');
  };

  const validarConflito = () => {
    const dataInicio = new Date(formulario.dataInicio);
    const dataTermino = new Date(formulario.dataTermino);
  
    if (dataInicio > dataTermino) {
      setMensagemErro("A data de início não pode ser posterior à data de término.");
      return true; 
    }
  
    const sala = Number(formulario.salas);
    const periodo = formulario.periodo;
  
  
    const conflito = ambientes.some(amb => {
      const ambDataInicio = new Date(amb.dataInicio);
      const ambDataTermino = new Date(amb.dataTermino);
  
      return amb.salas === sala &&
             amb.periodo === periodo &&
             ambDataInicio <= dataTermino &&
             ambDataTermino >= dataInicio &&
             amb.id !== formulario.id;
    });
  
    if (conflito) {
      setMensagemErro("Esta sala já está reservada nesse período.");
      return true;
    }
  
    setMensagemErro('');
    return false;
  };
  

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (validarConflito()) {
      return;
    }

    const url = formulario.id
      ? `http://localhost:8000/ambientes/${formulario.id}/`
      : 'http://localhost:8000/ambientes/';
    const metodo = formulario.id ? 'PUT' : 'POST';

    const payload = {
      dataInicio: formulario.dataInicio,
      dataTermino: formulario.dataTermino,
      periodo: formulario.periodo,
      salas: Number(formulario.salas),
      professor: Number(formulario.professor),
      disciplina: Number(formulario.disciplina)
    };

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      if (formulario.id) {
        setAmbientes(prev => prev.map(a => (a.id === data.id ? data : a)));
        setExibirModalEditar(false);
        alert('Ambiente atualizado!');
      } else {
        setAmbientes(prev => [...prev, data]);
        setExibirModalCriar(false);
        alert('Ambiente criado!');
      }
      limparFormulario();
    } else {
      const erro = await response.json();
      setMensagemErro('Erro: ' + JSON.stringify(erro));
    }
  };

  const limparFormulario = () => {
    setFormulario({
      id: null,
      dataInicio: '',
      dataTermino: '',
      periodo: '',
      salas: '',
      professor: '',
      disciplina: ''
    });
    setMensagemErro('');
  };

  const abrirModalEditar = (ambiente) => {
    setFormulario({
      id: ambiente.id,
      dataInicio: ambiente.dataInicio,
      dataTermino: ambiente.dataTermino,
      periodo: ambiente.periodo,
      salas: ambiente.salas,
      professor: ambiente.professor,
      disciplina: ambiente.disciplina
    });
    setMensagemErro('');
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdAmbienteExcluir(id);
    setExibirModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    const response = await fetch(`http://localhost:8000/ambientes/${idAmbienteExcluir}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok || response.status === 204) {
      setAmbientes(prev => prev.filter(a => a.id !== idAmbienteExcluir));
      setExibirModalExcluir(false);
      alert('Ambiente excluído!');
    } else {
      alert('Erro ao excluir ambiente');
    }
  };

  const getNomeSala = (id) => {
    const sala = salas.find(s => s.id === id);
    return sala ? sala.nome : id;
  };

  const getNomeProfessor = (id) => {
    const prof = professores.find(p => p.id === id);
    return prof ? prof.nome : id;
  };

  const getNomeDisciplina = (id) => {
    const d = disciplinas.find(d => d.id === id);
    return d ? d.nome : id;
  };

  return (
    <main className="container-ambientes">
      <header>
        <button
          onClick={() => { limparFormulario(); setExibirModalCriar(true); }}
          className="botao-criar"
        >
          Novo Ambiente
        </button>
      </header>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? 'Adicionar' : 'Editar'} Ambiente</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <label>Data Início:</label>
              <input
                type="date"
                name="dataInicio"
                value={formulario.dataInicio}
                onChange={atualizarFormulario}
                required
              />

              <label>Data Término:</label>
              <input
                type="date"
                name="dataTermino"
                value={formulario.dataTermino}
                onChange={atualizarFormulario}
                required
              />

              <label>Período:</label>
              <select name="periodo" value={formulario.periodo} onChange={atualizarFormulario} required>
                <option value="">Selecione o período</option>
                <option value="M">Manhã</option>
                <option value="T">Tarde</option>
                <option value="N">Noite</option>
              </select>

              <label>Sala:</label>
              <select name="salas" value={formulario.salas} onChange={atualizarFormulario} required>
                <option value="">Selecione a sala</option>
                {salas.map(sala => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nome}
                  </option>
                ))}
              </select>

              <label>Professor:</label>
              <select name="professor" value={formulario.professor} onChange={atualizarFormulario} required>
                <option value="">Selecione o professor</option>
                {professores.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>

              <label>Disciplina:</label>
              <select
                name="disciplina"
                value={formulario.disciplina}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Selecione a disciplina</option>
                {getDisciplinasDoProfessor(Number(formulario.professor)).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>

              {mensagemErro && <p className="erro">{mensagemErro}</p>}

              <footer className="botoes">
                <button type="submit">Salvar</button>
                <button
                  type="button"
                  onClick={() => {
                    exibirModalCriar ? setExibirModalCriar(false) : setExibirModalEditar(false);
                    setMensagemErro('');
                  }}
                >
                  Cancelar
                </button>
              </footer>
            </form>
          </article>
        </section>
      )}

      {exibirModalExcluir && (
        <section className="modal-overlay">
          <article className="modal modal-pequeno">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este ambiente?</p>
            <footer className="botoes">
              <button onClick={confirmarExclusao}>Sim</button>
              <button onClick={() => setExibirModalExcluir(false)}>Não</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaAmbientes">
          <thead>
            <tr>
              <th>#</th>
              <th>Período</th>
              <th>Data Início</th>
              <th>Data Término</th>
              <th>Sala</th>
              <th>Professor</th>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ambientes.map((amb, index) => (
              <tr key={amb.id}>
                <td>{index + 1}</td>
                <td>{amb.periodo}</td>
                <td>{amb.dataInicio}</td>
                <td>{amb.dataTermino}</td>
                <td>{getNomeSala(amb.salas)}</td>
                <td>{getNomeProfessor(amb.professor)}</td>
                <td>{getNomeDisciplina(amb.disciplina)}</td>
                <td>
                  <button
                    className="btnEditarAmbiente"
                    onClick={() => abrirModalEditar(amb)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btnExcluirAmbiente"
                    onClick={() => abrirModalExcluir(amb.id)}
                    title="Excluir"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
