import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AutenticacaoProvedor } from './contexto/AutenticacaoContexto';
import BarraNavegacao from './componentes/BarraNavegacao';
import RotaProtegida from './componentes/RotaProtegida';
import Inicio from './paginas/Inicio';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Perfil from './paginas/Perfil';
import Pesquisa from './paginas/Pesquisa';
import PerfilAtletaVisualizacao from './paginas/PerfilAtletaVisualizacao';
import Feed from './paginas/Feed';
import Interesses from './paginas/Interesses';
import Mensagens from './paginas/Mensagens';

export default function App() {
    return (<BrowserRouter>
      <AutenticacaoProvedor>
        <BarraNavegacao />
        <Routes>
          <Route path="/" element={<Inicio />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/cadastro" element={<Cadastro />}/>

          <Route path="/perfil" element={<RotaProtegida>
                <Perfil />
              </RotaProtegida>}/>
          <Route path="/pesquisa" element={<RotaProtegida>
                <Pesquisa />
              </RotaProtegida>}/>
          <Route path="/atleta/:usuarioId" element={<RotaProtegida>
                <PerfilAtletaVisualizacao />
              </RotaProtegida>}/>
          <Route path="/feed" element={<RotaProtegida>
                <Feed />
              </RotaProtegida>}/>
          <Route path="/interesses" element={<RotaProtegida>
                <Interesses />
              </RotaProtegida>}/>
          <Route path="/mensagens" element={<RotaProtegida>
                <Mensagens />
              </RotaProtegida>}/>
        </Routes>
      </AutenticacaoProvedor>
    </BrowserRouter>);
}
