import { useState, useEffect } from "react"
import '../App.css';
import { toast } from "react-toastify";

const API_URL = 'https://69010550ff8d792314bc5118.mockapi.io/farmacia_api';

function LojaPage(){
  const [remedios, set_remedios] = useState([]);
  const [abrir_modal, modal_aberto] = useState(false);
  const [remedio_selecionado, remedio_definido] = useState(null);

  useEffect(() => {
    async function buscar_remedios() {
   console.log('Buscando remedios com React...');
  try {
  const response = await fetch(`${API_URL}/remedios`);
  const data = await response.json();
  set_remedios(data);
   } catch (error) {
  console.error('Erro ao buscar remedios:', error);
  }
  }
  buscar_remedios();
  }, []);

  const abrir_form = (remedio) =>{
  if(remedio.quantidade_estoque <= 0){
  toast.warn('Desculpe esse item esta fora do estoque');
  return;
  }
  remedio_definido(remedio);
  modal_aberto(true);
    };

   const fechar_form =() =>{
  modal_aberto(false);
  remedio_definido(null);
  };

  async function atualizar_estoque(id, nova_quant) {
  try{
  await fetch(`${API_URL}/remedios/${id}`,{
  method: 'PUT',
                
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify({quantidade_estoque: nova_quant})
  });
  }catch(error){
  console.error('Erro ao atualizar o estoque', error);
  toast.error('Erro: O pedido foi criado, mas falhamos ao atualizar o estoque');
  }
  }

  const criar_pedido = async (event) =>{
  event.preventDefault();

  const dados_pedidos = {
  remedio_nome: remedio_selecionado.name,
  remedio_preco: remedio_selecionado.preco,
   nome_cliente: event.target.nome_cliente.value,
            // CORREÇÃO 3: 'event.taget' -> 'event.target'
   email_cliente: event.target.email_cliente.value 
   };

   const remedio_id = remedio_selecionado.id;
   const estoque_atual = Number(remedio_selecionado.quantidade_estoque);
   const novo_estoque = estoque_atual -1;

   try{
   const response = await fetch(`${API_URL}/pedidos`, {
   method: 'POST',
  
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(dados_pedidos)
  });
  if(!response.ok) throw new Error('Erro ao criar pedido');
   await atualizar_estoque(remedio_id, novo_estoque);
   toast.success('PEDIDO REALIZADO COM SUCESSO!');
   fechar_form();

   set_remedios(remedios_antigos => remedios_antigos.map(r =>
   r.id === remedio_id ? {...r, quantidade_estoque: novo_estoque} : r
   ));
   }catch (error){
   console.error('Erro no post do pedido', error);
   toast.error('Falha ao realizar pedido. Tente novamente');
   }
   };

   return(
   <>
   
   <main id='catalogo_remedios'>
   {remedios.map((remedio) => (
   <div key={remedio.id} className='remedio_card'>
   <img src={remedio.imagem_url || remedio.avatar} alt={remedio.name} />
   <h3>{remedio.name}</h3>
   <p className='preco'>R$ {remedio.preco}</p>
   <p><strong>Estoque: {remedio.quantidade_estoque}</strong></p>
   <button onClick={() => abrir_form(remedio)}>Fazer Pedido</button>
  </div>
   ))}
   </main>

   {abrir_modal && (
   <div id='modal_pedidos_overlay'>
  <form id='form_pedidos' onSubmit={criar_pedido}>
            {/* ... (o modal de criar pedido está incompleto, 
            mas o foco é corrigir os erros) ... */}
  </form>
  </div>
  )}
   </>
   );
} // <-- A função LojaPage fecha aqui

export default LojaPage;