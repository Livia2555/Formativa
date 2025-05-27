import { useNavigate } from 'react-router-dom';
import { BarraNavegacao } from '../Componentes/BarraNavegacao';
import { FormLogin } from '../Componentes/FormLogin';
import { Rodape } from '../Componentes/Rodape';

export function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (categoria) => {
    
    console.log('Login bem-sucedido. Categoria:', categoria);
    navigate('/');
  };

  return (
    <>
      <BarraNavegacao />
      <FormLogin onLoginSuccess={handleLoginSuccess} />
      <Rodape />
    </>
  );
}
