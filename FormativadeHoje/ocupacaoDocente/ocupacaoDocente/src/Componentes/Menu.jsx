import { Link } from 'react-router-dom';
import estilo from './Menu.module.css';
import professores from '../assets/professores.png';
import livros from '../assets/livros.png';
import gestor from '../assets/gestor.png';
import Ambientes from '../assets/Ambientes.png';

export function Menu() {
    return (
        <div className={estilo.conteiner}>
            <table>
                <tbody>
                    <tr>
                        <td className={estilo.item}>
                            <Link to='/Professores'>
                                <img src={professores} alt="Professores" className={estilo.icone} />
                                <p>Professores</p>
                            </Link>
                        </td>
                        <td className={estilo.item}>
                            <Link to='/Diretor'>
                                <img src={gestor} alt="Gestores" className={estilo.icone} />
                                <p>Gestores</p>
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td className={estilo.item}>
                            <Link to='/Disciplinas'>
                                <img src={livros} alt="Disciplinas" className={estilo.icone} />
                                <p>Disciplinas</p> {/* Corrigido aqui também */}
                            </Link>
                        </td>
                        <td className={estilo.item}>
                            <Link to='/Ambientes'>
                                <img src={Ambientes} alt="Ambiente" className={estilo.icone} />
                                <p>Ambientes</p>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
