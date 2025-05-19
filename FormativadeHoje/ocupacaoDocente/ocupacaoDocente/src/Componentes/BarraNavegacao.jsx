import estilo from './BarraNavegacao.module.css';
import { Link } from 'react-router-dom';

export function BarraNavegacao() {
    return (
        <nav className={estilo.container}>
            <ul className={estilo.barra}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/Escola">Missão</Link></li>
                <li><Link to="/Escola">Visão</Link></li>
                <li><Link to="/Escola">Valores</Link></li>
            </ul>
        </nav>
    );
}
