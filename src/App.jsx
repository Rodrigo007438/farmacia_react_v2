import { BrowserRouter, Routes, Route } from "react-router-dom";

//Importando as outras paginas
import HomePage from "./page/HomePage";
import LojaPage from "./page/LojaPage";
import LoginPage from '../src/page/login_page';
import LayoutPrincipal from "./components/LayoutPrincipal";
import MeusPedidos from './page/MeusPedidos';

import AdminPedidos from "./page/AdminPedidos";
import AdminProdutos from "./page/AdminProdutos";

import { AuthProvider } from "./components/AuthContext";

import LayoutProtegido from "./components/layout_protegido";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App(){
  return(
    <AuthProvider>
    <BrowserRouter>
    <ToastContainer autoClose={300} hideProgressBar />
      <Routes>

        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<LayoutProtegido/>}>
            <Route path='/loja' element={<LojaPage/>}/>

            <Route path="/meus-pedidos" element={<MeusPedidos />} />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />
            <Route path="/admin/produtos" element={<AdminProdutos />} />

          </Route>  

        </Route>
        
       </Routes>
       
      
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App;