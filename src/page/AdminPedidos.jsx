import { useEffect, useState } from "react";

import '../App.css';

import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function AdminPedidos(){
    const [pedidos, set_pedidos] = useState([]);
    const [loading, set_loading] = useState(true);

    const [confirmar, set_confirmar] = useState(false);
    const [deleta, set_deleta] = useState(null); 

    const [remedios, set_remedios] = useState([]);

    useEffect(() => {
        async function buscarRemedios() {
            try{
                const response = await fetch(`${API_URL}/remedios`);
                set_remedios(await response.json());
            }catch(error){
                console.error('Erro ao buscar remedios:', error);
                toast.error('Falha ao carregar lista de estorno');
            }
            
        }


        //Buscar todos os remedios

        async function buscarPedidos() {
            set_loading(true);
            try{
                const response = await fetch(`${API_URL}/pedidos`);
                set_pedidos(await response.json());
            }catch(error){
                console.error('Erro ao buscar pedidos:', error);
                toast.error('Não foi possivel carregar os pedidos.');
            }
            set_loading(false);
        }
        buscarRemedios();
        buscarPedidos();
    }, []);

    //Deletar

    async function atualizar_estoque(id, nova_quantidade){
        try{
            await fetch(`${API_URL}/remedios/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({quantidade_estoque: nova_quantidade})
            });
        } catch(error){
            console.error('Erro ao atualizar o estoque:', error);
            toast.error('Erro: O pedido foi cancelado, mas falhamos ao atualizar o estoque');
        }
    }

    const deletar_pedido = (pedido) => {
        set_deleta(pedido);
        set_confirmar(true);
    };

    const executa_delete = async () => {
        const remedio_correspondente = remedios.find(
            (r) => r.name === deleta.remedio_nome
        );

        if(!remedio_correspondente){
            toast.error('Erro: Não foi possivel encontrar o remedio pedido para estornar o estoque');
            cancela();
            return; 
        }

        const remedio_id = remedio_correspondente._id;
        const estoque_atual = Number(remedio_correspondente.quantidade_estoque);
        const quantidade_extorno = Number(deleta.quantidade_pedida || 1);
        const novo_estoque = estoque_atual + quantidade_extorno;

        try{
            await atualizar_estoque(remedio_id, novo_estoque);
            await fetch(`${API_URL}/pedidos/${deleta.id}`, {method:'DELETE'});
            toast.success('Pedido cancelado e estornado com sucesso!');
            set_pedidos(pedidos_antigos => pedidos_antigos.filter(p =>p._id !== deleta._id));
        }catch(error){
            console.error('Erro ao deletar pedido', error);
            toast.error('Pedido cancelado e estornado com sucesso');
        }finally{
            cancela();
        }
    };

    const cancela = () => {
        set_confirmar(false);
        set_deleta(null);
    }

    if (loading){
        return <p style={{textAlign: 'center'}}>Carregando painel de pedidos... </p>;
    }

    return(
        <>
            <h2 id="pedido_titulo" style={{display: 'block', textAlign: 'center'}}>Painel de Gerenciamento de Pedidos</h2>

            <section id="lista_pedidos" style={{display: 'grid'}}>
                {pedidos.length === 0 ?(
                    <p style={{textAlign: 'center'}}>Nemhum pedido encontrado </p>
                ):(
                    pedidos.map((pedido) =>(
                        <div key={pedido._id} className="pedido_card">
                            <h4>Pedido de: {pedido.nome_cliente}</h4>
                            <p>Email: {pedido.email_cliente}</p>
                            <p>Quantidade pedida: {pedido.quantidade_pedida}</p>
                            <hr />
                            <p><strong>Remedio:</strong>{pedido.remedio_nome}</p>
                            <p><strong>Preço:</strong>{pedido.remedio_preco}</p>
                            <button onClick={() => deletar_pedido(pedido)}>Cancelar Pedido</button>
                        </div>
                ))
                )}
            </section>

            {confirmar &&(
                <div id="modal_pedidos_overlay">
                    <div id='modal_confirmar_delete'>
                    <h3>Confirmar Cancelamento</h3>
                    <p>Tem certeza que deseja cancelar este pedido? O item voltará ao estoque.</p>
                    <div className='botoes_confirmar'>
                    <button id='btn-sim' onClick={executa_delete}>Sim</button>
                    <button id='btn-nao' onClick={cancela}>Não</button>
                </div>
                </div>
                </div>
            )

            }

        </>

        
    )


}

export default AdminPedidos;