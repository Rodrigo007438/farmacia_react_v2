import React, { useEffect } from "react";

import { Link } from "react-router-dom";



import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";



import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useState } from "react";

import '../App.css';

const API_URL = import.meta.env.VITE_API_URL;

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
            <Swiper className='carrossel-swiper' spaceBetween={30} slidesPerView={1} loop={true} modules={[Navigation, Pagination]} navigation pagination={{clickable: true}}>

                {produtos.map((produto) =>(

                <SwiperSlide key={produto.id} className="carrossel-slide">
                    <div className="remedio_card">
                        <img src={produto.imagem_url || produto.avatar} alt={produto.name} />
                        <h3>{produto.name}</h3>
                        <p className='preco'>R$ {produto.preco}</p>
                        <Link to = '/loja' className='home-cta-button'>Ver na Loja</Link>
                    </div>    
                </SwiperSlide>    
                ))}
            </Swiper>    
        </div>
    );
}

export default CarrosselProdutos;
    
