import { Routes, Route } from 'react-router-dom';
import { Home } from '../Pages/Home';
import { Login } from '../Pages/Login';
import { Professores } from '../Pages/Professores';
import { Disciplinas } from '../Pages/Disciplinas';
import { Salas } from '../Pages/Salas';
import { Ambientes } from '../Pages/Ambientes';


export function Rotas() {
    return (
        <Routes>
            <Route path='/' element={<Home />} ></Route>
            <Route path='/Login' element={<Login />} ></Route>
            <Route path='/Professores' element={<Professores />} ></Route>
            <Route path='/Disciplinas' element={<Disciplinas />} ></Route>
            <Route path='/Salas' element={<Salas />} ></Route>
            <Route path='/Ambientes' element={<Ambientes />} ></Route>

        </Routes >
    )
}