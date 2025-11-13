import { useState } from "react";

import { Navigate, useNavigate, Link } from "react-router-dom";

import {toast} from 'react-toastify';

import { useAuth } from "../components/AuthContext";

import '../App.css';

function LoginPage(){
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');

    //Hook de navegação
    const navigate = useNavigate();

    const {login} = useAuth();

    const enviar_login = (event) => {
        event.preventDefault();

        if(username ==='admin' && password === 'admin123'){
            toast.success('Login como gerente bem-sucedido');
           
            login('gerente');
            
            navigate('/'); //redireciona para a pagina principal
        }else if(username === 'cliente' && password === 'cliente123'){
            toast.success('Login como cliente bem-sucedido');

            login('cliente', 'cliente.teste@email.com');
            navigate('/');
        }else{
            toast.error('Usuario ou senha incorreto');
        }
    };
    return(
        <>
        
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

                    <p style={{textAlign: 'center', marginTop: '15px'}}>
                    Não tem conta? <Link to="/cadastro" style={{color: '#28a745', fontWeight: 'bold'}}>Cadastre-se</Link>
                    </p>
                </form>
            </section>
        </main>
        </>
    )
}

export default LoginPage;