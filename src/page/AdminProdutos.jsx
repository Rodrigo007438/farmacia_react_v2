import { useState, useEffect } from "react";

import '../App.css';

import { toast } from "react-toastify";

const API_URL = 'https://69010550ff8d792314bc5118.mockapi.io/farmacia_api';

function AdminProdutos(){

    const [remedios, set_remedios] = useState([]);
    const [carrega, set_carrega] = useState(true);

    const [confirmar, set_confirmar] = useState(false);
    const [produto_deletar, set_produto_deleta] = useState(null);

    useEffect(() => {
        async function buscarRemedios() {
            set_carrega(true);
            try{
                const response = await fetch(`${API_URL}/remedios`);
                const data = await response.json();
                set_remedios(data);
            }catch(error){
                console.error('Erro ao buscar remédios:', error);
                toast.error('Não foi possivel carregar os produtos.');
            }
            set_carrega(false);
        }
        buscarRemedios();
    }, []);

    const deletando = (produto) => {
        set_produto_deleta(produto);
        set_confirmar(true);
    };

    const cancela_delete = () =>{
        set_confirmar(false);
        set_produto_deleta(null);
    }

    const executa_delete = async () => {
        if(!produto_deletar) return;

        try{
            const response = await fetch(`${API_URL}/remedios/${produto_deletar.id}`, {
                method: 'DELETE',
            });

            if(!response.ok){
                throw new Error('Falha ao excluir produto.');
            }

            toast.success('Produto excluido com sucesso!');

            set_remedios(remedios_antigos => remedios_antigos.filter(r => r.id !== produto_deletar.id)
            );
        }catch(error){
            console.log('Erro ao excluir produto', error);
            toast.error(error.message || 'Falha ao excluir produto.');
        }finally{
           cancela_delete();
        }
    };

    if (carrega){
        return <p style={{textAlign: 'center'}}>Carregando Produtos...</p>;
    }

    return(
        <>
        
        <div className="admin-header">
            <h2 id="pedidos_titulo" style={{display: 'block'}}>Gerenciamento de Produtos</h2>
            <button className="admin-add-btn">Adicionar Novo Produto</button>
        </div>

        <section id="lista_pedidos" style={{display: 'grid'}}>

        {remedios.map((remedios) =>(
            <div key={remedios.id} className="remedio_card">

                <img src={remedios.imagem_url || remedios.avatar} alt={remedios.name}/>
                <h3>{remedios.name}</h3>
                <p className="preco">R$ {remedios.preco}</p>
                <p><strong>Estoque: {remedios.quantidade_estoque}</strong></p>
                <div className="admin_botoes">
                    <button className="admin-edt-btn">Editar</button>
                    <button className="admin-delete-btn" onClick = {() => deletando(remedios)}>Excluir</button>
                </div>

            </div>
        ))}

        </section>

        {confirmar &&(
            <div id="modal_pedidos_overlay">
                
                <div id="modal_confirmar_delete">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir o produto: <strong>{produto_deletar?.name}?</strong>
                    <br/>
                    Esta ação não pode ser desfeita.
                    </p>

                    <div className="btn-confirma">

                        <button id="btn-sim" onClick={executa_delete}>Sim, excluir</button>
                        <button id="btn-nao" onClick={cancela_delete}>Não</button>

                    </div>
                </div>

            </div>
        )}
        
        </>
    )

}

export default AdminProdutos;