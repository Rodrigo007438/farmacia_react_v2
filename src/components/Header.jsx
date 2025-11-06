import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom"; 

import '../App.css';

function Header(){
    const [logado, set_logado] = useState(false);
    const [perfil_nome, set_perfil_nome] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

      checar_login();

      
        window.addEventListener('storageChange', checar_login)

        return() => {
          window.removeEventListener('storageChange', checar_login);
        }
    }, []);

    const checar_login = () => {
      const perfil = localStorage.getItem('perfil_usuario');
      if(perfil){
        set_logado(true);
        const primeira_letra = perfil.charAt(0).toUpperCase() + perfil.slice(1);
        set_perfil_nome(primeira_letra);
      }else{
        set_logado(false);
        set_perfil_nome('');
      }
    };

    const handle_logout = () => {
        localStorage.removeItem('perfil_usuario');
        localStorage.removeItem('email_usuario');
        window.dispatchEvent(new Event('storageChange'));
        navigate('/login');
     };

       return(
  
         <header className="site-header">
           <div className="container-layout">
              
             
              <Link to="/" className="header-logo">
                Farmácia Popular
              </Link>
 
                 <nav className="header-nav">

                  {logado && (
                   <Link to = '/loja' className="nav-link">Loja</Link>
                  )}

                   {perfil_nome === 'cliente' && (
                      <Link to='/meus-pedidos' className="nav-link"> Meus Pedidos </Link>
                   )}
                    {perfil_nome === 'gerente' &&(
                      <Link to="/admin/pedidos" className="nav-link">Painel</Link>
                   )}
                   {logado ? (
                      <div className="user-info-group">
                        <span className="user-name-tag">{perfil_nome}</span>
                        <button onClick={handle_logout} className="header-logout-btn">Sair</button>
                      </div>
                    ):(
                      <Link to='/login' className="nav-link">Entrar</Link>
                    )}    
                  </nav>
            </div>
          </header>
       );
}

export default Header;