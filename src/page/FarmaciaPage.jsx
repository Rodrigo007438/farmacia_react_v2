//Importar Hooks
import { useState, useEffect } from 'react';

//Importar Navigate

import { useNavigate } from 'react-router-dom';

//Importa CSS
import '../App.css';

import { toast } from 'react-toastify';

const API_URL = 'https://69010550ff8d792314bc5118.mockapi.io/farmacia_api';



function Farmacia_page() {

  const navigate = useNavigate();
  // --- 1. ESTADO ---
  const [remedios, set_remedios] = useState([]);
  const [pedidos, set_pedidos] = useState([]); 
  const [abrir_modal, modal_aberto] = useState(false);
  const [remedio_selecionado, remedio_definido] = useState(null);

  const [confirmar, set_confirmar] = useState(false);
  const [deleta, set_deleta] = useState(null);

  //Guardar Perfil
   const [perfil, set_perfil] = useState(null);

   //Guardar email
   const [email_logado, set_email_logado] = useState(null);

  
  // --- 2. EFEITO (BUSCAR DADOS INICIAIS) ---
  useEffect(() => {

    //ler o perfil do usuário

    const perfil_salvo = localStorage.getItem('perfil_usuario');
    set_perfil(perfil_salvo);

    //ler o email do usuário
    const email_salvo = localStorage.getItem('email_usuario');
    set_email_logado(email_salvo);
    
    // (Função para buscar remédios)
    async function buscar_remedios() {
      console.log('Buscando remedios com React...');
      try {
        const response = await fetch(`${API_URL}/remedios`);
        const data = await response.json();
        console.log('Remedios encontrados', data);
        set_remedios(data);
      } catch (error) {
        console.error('Erro ao buscar remedios:', error);
      }
    }
    
    // (Função para buscar pedidos)
    async function buscar_pedidos() {
      console.log('Buscando pedidos com React...');
      try {
        const response = await fetch(`${API_URL}/pedidos`);
        const data = await response.json();
        console.log('Pedidos Encontrados:', data);
        set_pedidos(data); // (Corrigido para usar set_pedidos)
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    }

    buscar_remedios();

    //só busca pedidos se for gerente
    if(perfil_salvo === 'gerente' || perfil_salvo === 'cliente'){
      buscar_pedidos();
    }

    
  }, []); //[] diz para a função rodar só uma vez

  
  //ABRIR/FECHAR MODAL

  //Abrir modal
  const abrir_form = (remedio) => {
    if (remedio.quantidade_estoque <= 0) {
      toast.warn('Desculpe, este item está fora de estoque');
      return;
    }
    console.log('Selecionado:', remedio);
    remedio_definido(remedio); //guarda o remedio
    modal_aberto(true);
  }

  //Fechar modal
  const fechar_form = () => {
    modal_aberto(false); //fecha o modal
    remedio_definido(null); //limpa o remedio
  };

  //ATUALIZAR ESTOQUE
  
  
  async function atualizar_estoque_api(id, nova_quantidade) {
    console.log(`Atualizando estoque do remedio ${id} para ${nova_quantidade}`);
    try {
      await fetch(`${API_URL}/remedios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade_estoque: nova_quantidade })
      });
    } catch (error) {
      console.error('Erro ao atualizar o estoque:', error);
      toast.error('Erro: O pedido foi criado, mas falhámos ao atualizar o estoque.');
    }
  }


  
  //SUBMIT FORM (CREATE & UPDATE)
  
  const criar_pedido = async (event) => {
    event.preventDefault(); 
    console.log('Enviando pedido...');

    // Pega os dados
    const dados_pedidos = {
      remedio_nome: remedio_selecionado.name,
      remedio_preco: remedio_selecionado.preco,
      nome_cliente: event.target.nome_cliente.value,
      email_cliente: event.target.email_cliente.value
    };
    
    const remedio_id = remedio_selecionado.id;
    const estoque_atual = Number(remedio_selecionado.quantidade_estoque);
    const novo_estoque = estoque_atual - 1;

    try {
      // 1. CRIA O PEDIDO 
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados_pedidos)
      });
      if (!response.ok) throw new Error('Erro ao criar pedido');
      
      const pedido_criado = await response.json(); 
      console.log('Pedido criado', pedido_criado);

      // 2. ATUALIZA O ESTOQUE 
      await atualizar_estoque_api(remedio_id, novo_estoque);

      // 3. ATUALIZA A TELA 
      toast.success('PEDIDO REALIZADO COM SUCESSO!');
      fechar_form();
      
      // Adiciona o novo pedido à lista de pedidos
      set_pedidos(pedidos_antigos => [...pedidos_antigos, pedido_criado]);

      // Atualiza o estoque do remédio na lista de remédios 
      set_remedios(remedios_antigos => remedios_antigos.map(r => 
        r.id === remedio_id ? { ...r, quantidade_estoque: novo_estoque } : r
      ));
      
    } catch (error) {
      console.error('Erro no POST do pedido:', error);
      toast.error('Falha ao realizar pedido. Tente novamente');
    }
  };
  
  //DELETAR
  const deletar_pedido = (pedido) => {
    
    console.log(`Solicitando cancelamento do pedido ${pedido.id}...`);
    //Guarda pedido a ser deletado
    set_deleta(pedido);
    //Confirmação
    set_confirmar(true);
    
  };

  const executa_delete = async() => {
    console.log(`Confirmado: Pedido a ser deletado ${deleta.id}`);
    
    const remedio_correspondente = remedios.find(
      (r) => r.name === deleta.remedio_nome
    );
  

  if (!remedio_correspondente){
    toast.error('Erro: Não foi possível encontrar o remedio desse pedido estornar o estoque');
    cancela();
    return; 
  }

    // 2. Calcula o estorno
    const remedio_id = remedio_correspondente.id;
    const estoque_atual = Number(remedio_correspondente.quantidade_estoque);
    const novo_estoque = estoque_atual + 1;

    try {
      // ATUALIZA O ESTOQUE PRIMEIRO 
      await atualizar_estoque_api(remedio_id, novo_estoque);

      //DELETA O PEDIDO
      await fetch(`${API_URL}/pedidos/${deleta.id}`, { method: 'DELETE' });

      //ATUALIZA A TELA
      toast.success('Pedido cancelado e estornado com sucesso!');

      // Remove o pedido da lista de pedidos
      set_pedidos(pedidos_antigos => pedidos_antigos.filter(p => p.id !== deleta.id));

      // Atualiza o estoque do remédio
      set_remedios(remedios_antigos => remedios_antigos.map(r => 
        r.id === remedio_id ? { ...r, quantidade_estoque: novo_estoque } : r
      ));

    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      toast.error('Falha ao cancelar o pedido. Tente novamente.');
    } finally{
      cancela();
    }
  };

  const cancela = () =>{
    set_confirmar(false);
    set_deleta(null);
  }

  const pedidos_filtrados = perfil === 'gerente'
    ? pedidos 
    : pedidos.filter(p => p.email_cliente === email_logado); 

  //RETURN
  return (
    <>
      

      <main id='catalogo_remedios'>
        {remedios.map((remedio) => (
          <div key={remedio.id} className='remedio_card'>
            <img src={remedio.imagem_url || remedio.avatar} alt={remedio.name} />
            <h3>{remedio.name}</h3>
            <p className='preco'>{remedio.preco}</p>
            <p><strong>Estoque: {remedio.quantidade_estoque}</strong></p>
            <button onClick={() => abrir_form(remedio)}>Fazer Pedido</button>
          </div>
        ))}
      </main>

      {/*Mapeando pedidos */}
      {perfil &&(
        <>
      
      <hr id='pedidos_hr' />
      <h2 id='pedidos_titulo'>{perfil === 'gerente' ? 'Painel de Pedidos' : 'Meus Pedidos'}</h2>
      <section id='lista_pedidos'>
        {pedidos_filtrados.length === 0 ?(
          <p>Nenhum pedido encontrado.</p>
        ) :(
          pedidos_filtrados.map ((pedidos)=>(
            <div key={pedidos.id} className='pedido_card'>
              <h4>Pedidos de: {pedidos.nome_cliente}</h4>
              <p>Email: {pedidos.email_cliente}</p>
              <hr/>
              <p><strong>Remedio: </strong>{pedidos.remedio_nome}</p>
              <p><strong>Preço: </strong>{pedidos.remedio_preco}</p>

              {perfil === 'gerente' && (
                <button onClick={() => deletar_pedido(pedidos)}> Cancelar Pedido </button>
              )}
            </div>
          ))
        )}
        </section>
        </>
      )}  
      
      {/*Renderização do modal*/}
      {abrir_modal && (
        <div id='modal_pedidos_overlay'>
          <form id='form_pedidos' onSubmit={criar_pedido}>
            <h3>Confirmar Pedido</h3>
            <p>Você esta pedindo: <strong id='form_remedio_nome'>{remedio_selecionado.name}</strong> </p>

            <div>
              <label htmlFor='nome_cliente'>Seu Nome:</label>
              <input type='text' id='nome_cliente' name='nome_cliente' required />
            </div>

            <div>
              <label htmlFor='email_cliente'>Seu email:</label>
              <input type="email" id='email_cliente' name='email_cliente' required />
            </div>

            <button type='submit'>Confirmar pedido</button>
            <button type='button' id='cancela_pedido' onClick={fechar_form}>
              Cancelar pedido
            </button>
             </form>
        </div>
      )}

          {confirmar &&(
            <div id='modal_pedidos_overlay'>
              <div id='modal_confirma_delete'>
                <h3>Confirma Cancelamento</h3>
                <p>Tem certeza que deseja cancelar este pedido?O item voltará ao estoque</p>
                <div className='botoes_confirma'>
                  <button id='botao_sim' onClick={executa_delete}>Sim</button>
                  <button id='botao_nao' onClick={cancela}>Não</button>
                </div>
              </div>
            </div>
          )}
            
         
    </>
  );
}


export default Farmacia_page;