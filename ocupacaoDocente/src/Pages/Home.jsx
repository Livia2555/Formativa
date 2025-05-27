import { BarraNavegacao } from '../Componentes/BarraNavegacao';
import { Cabecalho } from '../Componentes/Cabecalho';
import { Conteudo } from '../Componentes/Conteudo';
import { Rodape } from '../Componentes/Rodape';
import './Home.css'; 

export function Home() {
  return (
    <div className="pagina">
      <BarraNavegacao />
      <Cabecalho />
      <main className="conteudo">
        <Conteudo />
      </main>
      <Rodape />
    </div>
  );
}