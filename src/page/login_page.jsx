    import { useState } from "react";

    import { Navigate, useNavigate, Link } from "react-router-dom";

    import {toast} from 'react-toastify';

    const API_URL = import.meta.env.VITE_API_URL;

    import { useAuth } from "../components/AuthContext";

    import '../App.css';

    function LoginPage(){
        const [email, set_email] = useState('');
        const [senha, set_senha] = useState('');

        //Hook de navegação
        const navigate = useNavigate();

        const {login} = useAuth();

        const enviar_login = async (event) => {
            event.preventDefault();

            try{
                console.log("Tentando logar em:", `${API_URL}/auth/login`);

                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, senha})
                });

                const data = await response.json();

                if(response.ok){
                    toast.success(`Bem vindo ${data.nome}!`);

                    login(data.perfil, data.email);

                    navigate('/');
                }else{
                    toast.error(data.message || 'Email ou senha incorretos');
                }
            }catch(error){
                console.error('Erro no login:', error);
                toast.error('Erro ao conectar com o servidor.');
            }
        };
        return(
            <>
            
            <main>
                <section className='login_card'>
                    <form id='form_login' onSubmit={enviar_login}>
                        <div>
                            <label htmlFor='email'>Email:</label>
                            <input type='text' id='email' placeholder="Digite seu email" value={email} onChange={(e) => set_email (e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor='password'>Senha</label>
                            <input type='password' id='password' placeholder='Digite sua senha' value={senha} onChange={(e) => set_senha(e.target.value)}/>
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