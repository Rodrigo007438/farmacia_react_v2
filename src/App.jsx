import { BrowserRouter, Routes, Route } from "react-router-dom";

//Importando as outras paginas


import FarmaciaPage from "../src/page/FarmaciaPage";
import LoginPage from '../src/page/login_page';
import LayoutPrincipal from "./components/LayoutPrincipal";
import HomePage from "./page/HomePage";




import LayoutProtegido from "./components/layout_protegido";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App(){
  return(
    <BrowserRouter>
    <ToastContainer autoClose={300} hideProgressBar />
      <Routes>

        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<LayoutProtegido/>}>
            <Route path='/loja' element={<FarmaciaPage/>}/>

          </Route>  

        </Route>
        
       </Routes>
       
      
    </BrowserRouter>
  )
}

export default App;