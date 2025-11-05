import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import '../App.css';
import { useState } from "react";

const API_URL = 'https://69010550ff8d792314bc5118.mockapi.io/farmacia_api';

function CarrosselProdutos(){
    const [produtos, set_produtos] = useState([]);
    const [carregar, set_carregar] = useState(true);

    useEffect(() => {
        async function buscarPromocoes() {
        console.log('Buscando Promoções...');
        set_carregar(true);
        try{
            const response = await fetch(`${API_URL}/remedios?promocao=true`);
            const data = await response.json();
            set_produtos(data);
        }catch(error){
            console.error('Erro ao buscar promoção:', error);
        }
    set_carregar(false);
    }
    buscarPromocoes();
    }, []);

    if(carregar){
        return <p>Carregando promoções...</p>
    }
        if(produtos.length === 0){
            return null;
        }
    return(
        <div className='carrossel-container'>
            <h2>Produtos em Destaque</h2>
            <div className="carrossel-trilho">
                {produtos.map((produto) =>(
                <div key={produto.id} className="remedio_card carrossel-card">
                    <img src={produto.image_url || produto.avatar} alt={produto.name} />
                    <h3>{produto.name}</h3>
                    <p className='preco'>R$ {produto.preco}</p>
                    <Link to = '/loja' className='carrossel-botao'>Ver na Loja</Link>
                </div>    
                ))}
            </div>
        </div>
    );
}

export default CarrosselProdutos;
    
