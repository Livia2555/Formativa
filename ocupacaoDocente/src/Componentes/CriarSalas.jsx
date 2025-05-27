import { useState, useEffect } from 'react';
import './CriarSalas.css';

export function CriarSalas() {
  const [salas, setSalas] = useState([]);
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);

  const [nome, setNome] = useState('');
  const [idEditar, setIdEditar] = useState(null);
  const [idExcluir, setIdExcluir] = useState(null);

  const token = localStorage.getItem('access_token');
  const categoria = localStorage.getItem('categoria');

  useEffect(() => {
    if (categoria === 'G' && token) {
      fetchSalas();
    }
  }, [categoria, token]);

  const fetchSalas = () => {
    fetch('http://localhost:8000/salas/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar salas');
        return res.json();
      })
      .then(data => setSalas(data.results || data))
      .catch(() => alert('Você não tem acesso para visualizar salas.'));
  };

  const abrirModalCriar = () => {
    setNome('');
    setMostrarModalCriar(true);
  };

  const abrirModalEditar = (sala) => {
    setNome(sala.nome);
    setIdEditar(sala.id);
    setMostrarModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdExcluir(id);
    setMostrarModalExcluir(true);
  };

  const fecharModais = () => {
    setMostrarModalCriar(false);
    setMostrarModalEditar(false);
    setMostrarModalExcluir(false);
    setNome('');
    setIdEditar(null);
    setIdExcluir(null);
  };

  const criarSala = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert('O nome da sala é obrigatório.');

    try {
      const response = await fetch('http://localhost:8000/salas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome })
      });

      if (response.ok) {
        const novaSala = await response.json();
        setSalas(prev => [...prev, novaSala]);
        fecharModais();
        alert('Sala criada com sucesso!');
      } else {
        alert('Erro ao criar a sala.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao criar a sala.');
    }
  };

  const editarSala = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert('O nome da sala é obrigatório.');

    try {
      const response = await fetch(`http://localhost:8000/salas/${idEditar}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome })
      });

      if (response.ok) {
        const salaAtualizada = await response.json();
        setSalas(prev =>
          prev.map(s => (s.id === salaAtualizada.id ? salaAtualizada : s))
        );
        fecharModais();
        alert('Sala atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar a sala.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar a sala.');
    }
  };

  const excluirSala = async () => {
    try {
      const response = await fetch(`http://localhost:8000/salas/${idExcluir}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setSalas(prev => prev.filter(s => s.id !== idExcluir));
        fecharModais();
        alert('Sala excluída com sucesso!');
      } else {
        alert('Erro ao excluir a sala.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir a sala.');
    }
  };

  if (categoria !== 'G') {
    return <p>Você não tem acesso para visualizar salas.</p>;
  }

  return (
    <div className="container-salas">
      <h1>Salas</h1>
      <button onClick={abrirModalCriar} className="btn-criar">Nova Sala</button>

      <table className="tabela-salas">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome da Sala</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala, i) => (
            <tr key={sala.id}>
              <td>{i + 1}</td>
              <td>{sala.nome}</td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => abrirModalEditar(sala)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => abrirModalExcluir(sala.id)}
                  title="Excluir"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Criar */}
      {mostrarModalCriar && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Criar Sala</h2>
            <form onSubmit={criarSala}>
              <input
                type="text"
                placeholder="Nome da Sala"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <div className="botoes-modal">
                <button type="submit">Salvar</button>
                <button type="button" onClick={fecharModais}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Sala</h2>
            <form onSubmit={editarSala}>
              <input
                type="text"
                placeholder="Nome da Sala"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <div className="botoes-modal">
                <button type="submit">Salvar</button>
                <button type="button" onClick={fecharModais}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {mostrarModalExcluir && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar Exclusão</h2>
            <p>Deseja realmente excluir esta sala?</p>
            <div className="botoes-modal">
              <button onClick={excluirSala}>Sim</button>
              <button onClick={fecharModais}>Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
