import { BarraNavegacao } from '../Componentes/BarraNavegacao';
import { Cabecalho } from '../Componentes/Cabecalho';
import { Rodape } from '../Componentes/Rodape';
import { CriarSalas } from '../Componentes/CriarSalas';
import './Salas.css'; 

export function Salas() {
  return (
    <div>
      <BarraNavegacao />
      <Cabecalho />
      <CriarSalas/>
      <Rodape />
    </div>
  );
}