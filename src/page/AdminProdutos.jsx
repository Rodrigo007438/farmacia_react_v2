import { useState, useEffect } from "react";

import '../App.css';

import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const novo_form = {
    name:'',
    preco: '',
    quantidade_estoque:'',
    imagem_url:''
};


function AdminProdutos(){

    const [remedios, set_remedios] = useState([]);
    const [carrega, set_carrega] = useState(true);


    //Para excluir
    const [confirmar, set_confirmar] = useState(false);
    const [produto_deletar, set_produto_deleta] = useState(null);

    //Para editar
    const [modal_aberto, set_modal_aberto] = useState(false);
    const [produto_editando, set_produto_editando] = useState(null);
    const [form_data, set_form_data] = useState({
        name: '',
        preco: '',
        quantidade_estoque: ''
    });

    //Para Adicionar Novo
    const [modal_add_aberto, set_add_aberto] = useState(false);
    const [form_data_novo, set_data_novo] = useState(novo_form)

    //barra de busca
    const [busca, setBusca] = useState('');

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
            const response = await fetch(`${API_URL}/remedios/${produto_deletar._id}`, {
                method: 'DELETE',
            });

            if(!response.ok){
                throw new Error('Falha ao excluir produto.');
            }

            toast.success('Produto excluido com sucesso!');

            set_remedios(remedios_antigos => remedios_antigos.filter(r => r._id !== produto_deletar._id)
            );
        }catch(error){
            console.log('Erro ao excluir produto', error);
            toast.error(error.message || 'Falha ao excluir produto.');
        }finally{
           cancela_delete();
        }
    };

    const abre_modal_edicao = (produto) => {
    set_produto_editando(produto);
    set_form_data({
        name: produto.name,
        preco: String(produto.preco).replace(',', '.'), 
        quantidade_estoque: produto.quantidade_estoque,
        promocao: produto.promocao || false
    });

    set_modal_aberto(true);

    }   

    
    const fechar_modal_edt = () => {
        set_modal_aberto(false);
        set_produto_editando(null);
        set_form_data({name:'', preco:'', quantidade_estoque:''});
    }

    const trocando_form = (e) => {
        const {name, value, type, checked} = e.target;

        const valor_final = type === 'checkbox' ? checked : value;

        set_form_data(dados_anteriores => ({
            ...dados_anteriores,
            [name]:valor_final
        }));
    };

    const enviando_edit = async (e) => {
        e.preventDefault();
        if(!produto_editando) return;
        
        const enviando_dados = {
            name:form_data.name,
            preco: Number(String(form_data.preco).replace(',','.')),
            quantidade_estoque: Number(form_data.quantidade_estoque),
            promocao: form_data.promocao
        };

        try{
            const response = await fetch(`${API_URL}/remedios/${produto_editando._id}`,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(enviando_dados)
            });

            if(!response.ok) throw new Error('Falha ao atualizar produto');
            const produto_atualizado = await response.json();

            //atualizando lista de remedios na tela

            set_remedios(remedios_antigos =>
                remedios_antigos.map(r =>
                    r._id === produto_editando._id ? produto_atualizado : r
                )           
             );

             toast.success('Produto Atulizado com Sucesso!');
             fechar_modal_edt();
        }catch(error){
            console.log('Erro ao digitar produto', error);
            toast.error(error.message || 'Falha ao editar produto');
        }
    }

    const abrir_modal_add = () =>{
        set_data_novo(novo_form);
        set_add_aberto(true);
    };

    const fechar_modal_add = () =>{
        set_add_aberto(false);
    };

    const trocando_form_novo = (e) => {
        const {name, value} = e.target;
        set_data_novo(dados_anteriores =>({
            ...dados_anteriores,
            [name]: value
        }));
    };

    const adicionando = async (e) => {
        e.preventDefault();

        const enviando_dados = {
            name: form_data_novo.name,
            preco: Number(String(form_data_novo.preco).replace(',', '.')),
            quantidade_estoque: Number(form_data_novo.quantidade_estoque),
            imagem_url: form_data_novo.imagem_url || null
        };

        try{
            const response = await fetch(`${API_URL}/remedios`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(enviando_dados)
            });
            if(!response.ok) throw new Error('Falha ao criar produto');
            const novo_produto = await response.json();

            set_remedios(remedios_antigos => [...remedios_antigos, novo_produto]);

            toast.success('Produto adicionado com sucesso');
            fechar_modal_add();
        }catch(error){
            console.error('Erro ao adicionar produto:', error);
            toast.error(error.message || 'Falha ao adicionar produto');
        }
    };


    if (carrega){
        return <p style={{textAlign: 'center'}}>Carregando Produtos...</p>;
    }

    const produto_filtrado = remedios.filter(remedio => 
        remedio.name.toLowerCase().includes(busca.toLowerCase())
    );

    return(
        <>

        <div className="busca-container">
            <input type="text" className="barra-busca" placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        
        <div className="admin-header">
            <h2 id="pedidos_titulo" style={{display: 'block', textAlign: 'center'}}>Gerenciamento de Produtos</h2>
            <button className="admin-add-btn" id="adc_produto" onClick={abrir_modal_add}>Adicionar Novo Produto</button>
        </div>

        <section id="lista_pedidos" style={{display: 'grid'}}>

        {produto_filtrado.map((remedio) =>(
            <div key={remedio._id} className="remedio_card">

                <img src={remedio.imagem_url || remedio.avatar} alt={remedio.name}/>
                <h3>{remedio.name}</h3>
                <p className="preco">R$ {remedio.preco}</p>
                <p><strong>Estoque: {remedio.quantidade_estoque}</strong></p>
                <div className="admin_botoes">
                    <button className="admin-edt-btn" onClick={() => abre_modal_edicao(remedio)}>Editar</button>
                    <button className="admin-delete-btn" onClick = {() => deletando(remedio)}>Excluir</button>
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

        {/* modal edição */}

        {modal_aberto &&(

            <div id="modal_pedidos_overlay">

                <form id="form_pedidos" onSubmit={enviando_edit}>

                    <h3>Editando: {produto_editando.name}</h3>

                    <div>

                        <label htmlFor="name">Nome do Produto:</label>
                        <input type="text" id="name" name="name" value={form_data.name} onChange={trocando_form} required />

                    </div>

                    <div>

                        <label htmlFor="preco">Preço: R$ </label>
                        <input type="text" id="preco" name="preco" value={form_data.preco} onChange={trocando_form} required />

                    </div>

                    <div>

                        <label htmlFor="quantidade_estoque">Estoque: </label>
                        <input type="number" id="quantidade_estoque" name="quantidade_estoque" value={form_data.quantidade_estoque} onChange={trocando_form} required />
                        
                    </div>
                    <div className="form_checkbox">
                        <label htmlFor="promocao">Em promoção?</label>
                        <input type="checkbox" ip='promocao' name="promocao" checked={form_data.promocao} onChange={trocando_form} />

                    </div>

                    <button type="submit">Salvar Alterações</button>
                    <button type="button" id="cancela_pedido" onClick={fechar_modal_edt}>Cancelar</button>

                </form>

            </div>

        )}

        {modal_add_aberto && (
            <div id="modal_pedidos_overlay">
                <form id="form_pedidos" onSubmit={adicionando}>
                    <h3>Adicionar Novo Produto</h3>
                    
                    <div>
                        <label htmlFor="name">Nome do Produto:</label>
                        <input type="text" id="name" name="name" value={form_data_novo.name} onChange={trocando_form_novo} required />
                    </div>
                    <div>
                        <label htmlFor="preco">Preço (R$):</label>
                        <input type="text" id="preco" name="preco" value={form_data_novo.preco} onChange={trocando_form_novo} required />
                    </div>
                    <div>
                        <label htmlFor="quantidade_estoque">Estoque:</label>
                        <input type="number" id="quantidade_estoque" name="quantidade_estoque" value={form_data_novo.quantidade_estoque} onChange={trocando_form_novo} required />
                    </div>
                    <div>
                        <label htmlFor="imagem_url">URL da Imagem (Opcional):</label>
                        <input type="text" id="imagem_url" name="imagem_url" value={form_data_novo.imagem_url} onChange={trocando_form_novo} />
                    </div>

                    <button type="submit">Adicionar Produto</button>
                    <button type="button" id="cancela_pedido" onClick={fechar_modal_add}>Cancelar</button>
                </form>
            </div>
        )}
        
        </>
    )

}

export default AdminProdutos;