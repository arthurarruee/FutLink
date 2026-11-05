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
import NaoEncontrada from './paginas/NaoEncontrada';
import CentralAjuda from './paginas/CentralAjuda';
import Admin from './paginas/Admin';
import Rodape from './componentes/Rodape';

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
          <Route path="/pesquisa" element={<RotaProtegida tipos={['empresario']}>
                <Pesquisa />
              </RotaProtegida>}/>
          <Route path="/atleta/:usuarioId" element={<RotaProtegida>
                <PerfilAtletaVisualizacao />
              </RotaProtegida>}/>
          <Route path="/feed" element={<RotaProtegida tipos={['atleta']}>
                <Feed />
              </RotaProtegida>}/>
          <Route path="/interesses" element={<RotaProtegida>
                <Interesses />
              </RotaProtegida>}/>
          <Route path="/mensagens" element={<RotaProtegida>
                <Mensagens />
              </RotaProtegida>}/>
          <Route path="/ajuda" element={<CentralAjuda />}/>
          <Route path="/admin" element={<RotaProtegida somenteAdmin>
                <Admin />
              </RotaProtegida>}/>
          <Route path="*" element={<NaoEncontrada />}/>
        </Routes>
        <Rodape />
      </AutenticacaoProvedor>
    </BrowserRouter>);
}
