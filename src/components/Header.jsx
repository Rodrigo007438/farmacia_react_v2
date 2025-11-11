import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom"; 

import '../App.css';

import { useAuth } from '../components/AuthContext';

function Header(){

    const {perfil, logout} = useAuth();
    const navigate = useNavigate();
    
    const handle_logout = () =>{
      logout();
      navigate('/login', {replace:true});
    };

    const perfil_nome = perfil ? perfil.charAt(0).toUpperCase() + perfil.slice(1) : '';


       return(
  
         <header className="site-header">
           <div className="container-layout">
              
             
              <Link to="/" className="header-logo">
                Farmácia Popular
              </Link>
 
                 <nav className="header-nav">

                  {perfil && (
                   <Link to = '/loja' className="nav-link">Loja</Link>
                  )}

                   {perfil === 'cliente' && (
                      <Link to='/meus-pedidos' className="nav-link"> Meus Pedidos </Link>
                   )}
                    {perfil === 'gerente' &&(
                      <>
                      
                        <Link to='/admin/pedidos' className="nav-link">Gererenciador de Pedidos</Link>
                        <Link to='/admin/produtos' className="nav-link">Gerenciador de Produtos</Link>
                        </>
                    )}

                    {perfil ? (
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