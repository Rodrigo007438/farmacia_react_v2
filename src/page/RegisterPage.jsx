import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL;

function Register_page(){
    const [form_data, set_data] = useState({
        name:'',
        email:'',
        senha:'',
        perfil:'cliente'
    });

    const navigate = useNavigate();

    const carregando = (e) =>{
        set_data({
            ...form_data,
            [e.target.name]: e.target.value
        });
    };

    const submetendo = async (e) =>{
        e.preventDefault();

        try{
            const response = await fetch(`${API_URL}/auth/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_data)
            });

            const data = await response.json();

            if(response.ok){
                toast.success('Conta criada com sucesso! Faça login.');
                navigate('/login');
            }else{
                toast.error(data.message || 'Erro ao criar conta');
            }
        }catch(error){
            console.error('Erro no cadastro:', error);
            toast.error('Erro ao conectar com o servidor.');
        }
    };

    return (
        <main>
            <section className="login_card">
                <h2 style={{textAlign: 'center'}}>Crie sua Conta</h2>
                <form id="form_login" onSubmit={submetendo}>
                    <div>
                        <label htmlFor="nome">Nome Completo:</label>
                        <input type="text" id="nome" name="nome" value={form_data.nome} onChange={carregando} required />
                    </div>
                    
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={form_data.email} onChange={carregando} required />
                    </div>

                    <div>
                        <label htmlFor="senha">Senha:</label>
                        <input type="password" id="senha" name="senha" value={form_data.senha} onChange={carregando} required />
                    </div>

                    {/* Seletor de Perfil (Para Testes) */}
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="perfil">Eu sou:</label>
                        <select 
                            id="perfil" 
                            name="perfil" 
                            value={form_data.perfil} 
                            onChange={carregando}
                            style={{width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc'}}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="gerente">Gerente</option>
                        </select>
                    </div>

                    <button type="submit">Cadastrar</button>
                </form>

                <p style={{textAlign: 'center', marginTop: '15px'}}>
                    Já tem uma conta? <Link to="/login" style={{color: '#28a745', fontWeight: 'bold'}}>Entrar</Link>
                </p>
            </section>
        </main>
    );

}

export default Register_page;

