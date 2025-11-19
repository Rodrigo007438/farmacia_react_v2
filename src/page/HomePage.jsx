import React from "react";

import { Link } from "react-router-dom";

import '../App.css';

import CarrosselProdutos from "../components/CarrosselProdutos";

function HomePage(){
    return(
        <>
        <div className="login_card">
            <h2 style={{textAlign: 'center', marginTop: 0}}>Bem-Vindo a Farmácia Popular!</h2>
        

            <p>Fundada em 2024, nossa farmácia nasceu com a missão de trazer saúde e bem-estar 
            para a comunidade, combinando a tradição e o cuidado das farmácias de bairro 
            com a conveniência da tecnologia moderna.</p>

            <p>
            Explore nosso catálogo completo de medicamentos e produtos de higiene. 
            Oferecemos tudo o que você precisa com os melhores preços e a confiança 
            que você já conhece.
            </p>


            <Link to='/loja' className="home-cta-button"> Ver produtos </Link>

        </div>
        <CarrosselProdutos />
        </>
    );
}

export default HomePage;