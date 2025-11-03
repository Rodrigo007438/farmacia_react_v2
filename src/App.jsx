import { BrowserRouter, Routes, Route } from "react-router-dom";

//Importando as outras paginas

import FarmaciaPage from '../src/page/FarmaciaPage';
import LoginPage from '../src/page/login_page';
import LayoutPrincipal from "./components/LayoutPrincipal";



import LayoutProtegido from "./components/layout_protegido";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App(){
  return(
    <BrowserRouter>
    <ToastContainer autoClose={300} hideProgressBar />
      <Routes>

        <Route element={<LayoutPrincipal />}>

          <Route path="/login" element={<LoginPage/>}/>     

          <Route element={<LayoutProtegido/>}>
            <Route path='/' element={<FarmaciaPage/>}/>
          </Route>  

        </Route>
        
       </Routes>
        {/* <Route element={<Pagina_perfil/>}/> */}
      
    </BrowserRouter>
  )
}

export default App;