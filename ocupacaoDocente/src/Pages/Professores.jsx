import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { TudoProfessores } from "../Componentes/TudoProfessores";
import { Rodape } from "../Componentes/Rodape";
import React, { useState, useEffect } from 'react';

export function Professores() {
  const [token, setToken] = useState(null);
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    const c = localStorage.getItem("categoria");
    setToken(t);
    setCategoria(c);
  }, []);

  return (
    <>
      <BarraNavegacao />
      <TudoProfessores />
      <Rodape />
    </>
  );
}
