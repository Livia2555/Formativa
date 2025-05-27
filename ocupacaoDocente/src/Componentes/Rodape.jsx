import estilo from './Rodape.module.css';

export function Rodape() {
    return (
        <footer className={estilo.container}>
                <p className={estilo.copy}>@Todos os direitos reservados Senai</p>
                <p>Projeto formativa</p>
        </footer>

    )
}
