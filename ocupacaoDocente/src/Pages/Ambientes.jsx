import { BarraNavegacao } from '../Componentes/BarraNavegacao';
import { Cabecalho } from '../Componentes/Cabecalho';
import { CriarAmbiente } from '../Componentes/CriarAmbiente';
import { Rodape } from '../Componentes/Rodape';


export function Ambientes() {
  return (
    <div>
      <BarraNavegacao />
      <Cabecalho />
      <CriarAmbiente/>
      <Rodape />
    </div>
  );
}