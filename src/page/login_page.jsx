import { useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import {toast} from 'react-toastify';

import '../App.css';

function LoginPage(){
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');

    //Hook de navegação
    const navigate = useNavigate();

    const enviar_login = (event) => {
        event.preventDefault();

        if(username ==='admin' && password === 'admin123'){
            toast.success('Login como gerente bem-sucedido');
            localStorage.setItem('perfil_usuario', 'gerente');
            
            window.dispatchEvent(new Event('storageChange'));
            
            navigate('/'); //redireciona para a pagina principal
        }else if(username === 'cliente' && password === 'cliente123'){
            toast.success('Login como cliente bem-sucedido');
            localStorage.setItem('perfil_usuario', 'cliente');

            window.dispatchEvent(new Event('storageChange'));

            localStorage.setItem('email_usuario' , 'cliente.teste@email.com');

            navigate('/');
        }else{
            toast.error('Usuario ou senha incorreto');
        }
    };
    return(
        <>
        <header>
            <h1>Farmacia Popular - Login</h1>
        </header>
        <main>
            <section className='login_card'>
                <form id='form_login' onSubmit={enviar_login}>
                    <div>
                        <label htmlFor='username'>Usuário:</label>
                        <input type='text' id='username' placeholder='digite admin ou cliente' value={username} onChange={(e) => set_username (e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor='password'>Senha</label>
                        <input type='password' id='password' placeholder='Digite sua senha' value={password} onChange={(e) => set_password(e.target.value)}/>
                    </div>
                    <button type='submit'>Entrar</button>
                </form>
            </section>
        </main>
        </>
    )
}

export default LoginPage;