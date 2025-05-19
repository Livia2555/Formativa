import { useEffect, useState } from "react";
import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Rodape } from "../Componentes/Rodape";
import { CriarDisciplina } from "../Componentes/CriarDisciplina";

export function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);

  const carregarDisciplinas = () => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:8000/disciplinas/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDisciplinas(data));
  };

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const handleDisciplinaCriada = (nova) => {
    setDisciplinas((atual) => [...atual, nova]);
  };

  return (
    <div className="pagina">
      <BarraNavegacao />
      <CriarDisciplina onDisciplinaCriada={handleDisciplinaCriada} />

      <div style={{ padding: "1rem" }}>
        <h2>Disciplinas</h2>
        <ul>
          {disciplinas.map((d) => (
            <li key={d.id}>
              <strong>{d.nome}</strong> — {d.curso} ({d.cargaHoraria}h)
              <br />
              Professor: {d.professor_nome}
              <hr />
            </li>
          ))}
        </ul>
      </div>

      <Rodape />
    </div>
  );
}
