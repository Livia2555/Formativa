import { useState, useEffect } from 'react';
import './CriarDisciplina.css';

export function CriarDisciplina() {
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);

  const [formularioDisciplina, setFormularioDisciplina] = useState({
    id: null,
    nome: '',
    curso: '',
    cargaHoraria: '',
    descricao: '',
    professor: ''
  });

  const [idDisciplinaExcluir, setIdDisciplinaExcluir] = useState(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetch('http://localhost:8000/usuarios/?categoria=P', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProfessores(data.results || data));

    fetch('http://localhost:8000/disciplinas/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDisciplinas(data.results || data));
  }, [token]);

  const atualizarFormulario = (e) => {
    setFormularioDisciplina({ ...formularioDisciplina, [e.target.name]: e.target.value });
  };

  const verificarDisciplinaExistente = (nome) => {
    return disciplinas.some(d => d.nome.toLowerCase() === nome.toLowerCase());
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (!formularioDisciplina.id && verificarDisciplinaExistente(formularioDisciplina.nome)) {
      alert('Já existe uma disciplina com esse nome!');
      return;
    }

    const url = formularioDisciplina.id
      ? `http://localhost:8000/disciplinas/${formularioDisciplina.id}/`
      : 'http://localhost:8000/disciplinas/';
    const metodo = formularioDisciplina.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formularioDisciplina)
    });

    if (response.ok) {
      const data = await response.json();
      if (formularioDisciplina.id) {
        setDisciplinas(prev => prev.map(d => (d.id === data.id ? data : d)));
        setExibirModalEditar(false);
        alert('Disciplina atualizada!');
      } else {
        setDisciplinas(prev => [...prev, data]);
        setExibirModalCriar(false);
        alert('Disciplina criada!');
      }
      limparFormulario();
    } else {
      const erro = await response.json();
      alert('Erro: ' + JSON.stringify(erro));
    }
  };

  const limparFormulario = () => {
    setFormularioDisciplina({
      id: null,
      nome: '',
      curso: '',
      cargaHoraria: '',
      descricao: '',
      professor: ''
    });
  };

  const abrirModalEditar = (disciplina) => {
    setFormularioDisciplina(disciplina);
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdDisciplinaExcluir(id);
    setExibirModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    const response = await fetch(`http://localhost:8000/disciplinas/${idDisciplinaExcluir}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok || response.status === 204) {
      setDisciplinas(prev => prev.filter(d => d.id !== idDisciplinaExcluir));
      setExibirModalExcluir(false);
      alert('Disciplina excluída!');
    } else {
      alert('Erro ao excluir disciplina');
    }
  };

  return (
    <main className="container-disciplinas">
      <header>
        <h1>Gerenciamento de Disciplinas</h1>
        <button
          onClick={() => { limparFormulario(); setExibirModalCriar(true); }}
          className="botao-criar"
        >
          Nova Disciplina
        </button>
      </header>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? 'Adicionar' : 'Editar'} Disciplina</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <input
                name="nome"
                placeholder="Nome"
                value={formularioDisciplina.nome}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="curso"
                placeholder="Curso"
                value={formularioDisciplina.curso}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="cargaHoraria"
                type="number"
                placeholder="Carga Horária"
                value={formularioDisciplina.cargaHoraria}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="descricao"
                placeholder="Descrição"
                value={formularioDisciplina.descricao}
                onChange={atualizarFormulario}
                required
              />
              <select
                name="professor"
                value={formularioDisciplina.professor}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Selecione o professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
              <footer className="botoes">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => exibirModalCriar ? setExibirModalCriar(false) : setExibirModalEditar(false)}>
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
            <p>Tem certeza que deseja excluir esta disciplina?</p>
            <footer className="botoes">
              <button onClick={confirmarExclusao}>Sim</button>
              <button onClick={() => setExibirModalExcluir(false)}>Não</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaDisciplinas">
          <thead>
            <tr className="linhaDisciplinaCabecalho">
              <th>#</th>
              <th>Nome</th>
              <th>Curso</th>
              <th>Carga Horária</th>
              <th>Descrição</th>
              <th>Professor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina, index) => (
              <tr key={disciplina.id} className="linhaDisciplina">
                <td>{index + 1}</td>  {/*exibe o número da linha correspondente à disciplina, de forma sequencial. ex em vez de começar com 0 começa com 1 o professor */}
                
                <td>{disciplina.nome}</td>
                <td>{disciplina.curso}</td>
                <td>{disciplina.cargaHoraria}h</td>
                <td>{disciplina.descricao}</td>
                <td>{disciplina.professor || '---'}</td>
                <td>
                  <button
                    className="btnEditarDisciplina"
                    onClick={() => abrirModalEditar(disciplina)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btnExcluirDisciplina"
                    onClick={() => abrirModalExcluir(disciplina.id)}
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
