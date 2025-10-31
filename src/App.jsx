import { BrowserRouter, Routes, Route } from "react-router-dom";

//Importando as outras paginas

import FarmaciaPage from '../src/page/FarmaciaPage';
import LoginPage from '../src/page/login_page';

import LayoutProtegido from "./components/layout_protegido";

function App(){
  return(
    <BrowserRouter>
      <Routes>

        <Route path='/login' element={<LoginPage />}/>
     

        <Route element={<LayoutProtegido/>}>
          <Route path='/' element={<FarmaciaPage/>}/>
        </Route>  
       </Routes>
        {/* <Route element={<Pagina_perfil/>}/> */}
      
    </BrowserRouter>
  )
}

export default App;