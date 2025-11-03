import React, { useEffect, useState } from "react";
// O 'Link' é necessário para o logo
import { Link, useNavigate } from "react-router-dom"; 

import '../App.css';

function Header(){
    const [logado, set_logado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const perfil = localStorage.getItem('perfil_usuario'); 
        
        if(perfil){
            set_logado(true);
        }else{
            set_logado(false);
        }
        window.addEventListener('storageChange', checar_login)

        return() => {
            window.removeEventListener('storageChange', checar_login);
        }
    }, []);

    const checar_login = () => {
        const perfil = localStorage.getItem('perfil_usuario');
        set_logado(!!perfil);
    };

    const handle_logout = () => {
        localStorage.removeItem('perfil_usuario');
        localStorage.removeItem('email_usuario');
        window.dispatchEvent(new Event('storageChange'));
        navigate('/login');
    };

    return(
        // CORREÇÃO 1: Nomes das classes (className) com hífen
        <header className="site-header">
            <div className="container-layout">
              
              {/* CORREÇÃO 2: Adicionando o Link/Logo de volta */}
              <Link to="/" className="header-logo">
                Farmácia Popular
              </Link>
            
                <nav>
                    {logado && (
                        // CORREÇÃO 1: Nome da classe do botão
                        <button onClick={handle_logout} className="header-logout-btn">
                          Sair
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;