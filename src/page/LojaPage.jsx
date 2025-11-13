import { useState, useEffect } from "react"
import '../App.css';
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function LojaPage(){
  const [remedios, set_remedios] = useState([]);
  const [abrir_modal, modal_aberto] = useState(false);
  const [remedio_selecionado, remedio_definido] = useState(null);

  const [quantidade_pedido, set_quantidade] = useState(1);
  const [buscar, set_busca] = useState('');

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
  set_quantidade(1);
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

  const quantidade_final = Number(quantidade_pedido);

  if(quantidade_final <= 0) {
    toast.warn('A quantidade deve ser pelo menos 1');
    return;
  }

  if(quantidade_final > remedio_selecionado.quantidade_estoque){
    toast.error(`Desculpe, temos apenas ${remedio_selecionado.quantidade_estoque} em estoque`);
    return;
  }

  const preco_sujo = String(remedio_selecionado.preco);

  const preco_limpo = preco_sujo.replace(/[^0-9,]/g, '').replace(',','.');

  const preco_unitario = Number(preco_limpo);
  const calculo_total = preco_unitario * quantidade_final;
  const dados_pedidos = {
    remedio_nome: remedio_selecionado.name,
    remedio_preco: calculo_total.toFixed(2),
    nome_cliente: event.target.nome_cliente.value,
    email_cliente: event.target.email_cliente.value,
    quantidade_pedida: quantidade_final
   };

   const remedio_id = remedio_selecionado.id;
   const estoque_atual = Number(remedio_selecionado.quantidade_estoque);
   const novo_estoque = estoque_atual - quantidade_final;

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
   r._id === remedio_id ? {...r, quantidade_estoque: novo_estoque} : r
   ));
   }catch (error){
   console.error('Erro no post do pedido', error);
   toast.error('Falha ao realizar pedido. Tente novamente');
   }
   };

   const produto_filtrado = remedios.filter(remedios =>
    remedios.name.toLowerCase().includes(buscar.toLocaleLowerCase())
   );


   return(
   <>

    <div className="buscar-container">
      <input type="text" className="barra-busca" placeholder="Buscar remedios" value={buscar} onChange={(e) => set_busca(e.target.value)}/>

    </div>

    <main id='catalogo_remedios'>
      {produto_filtrado.map((remedio) => (
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
      <h3>Confirma Pedido:</h3>
      <p>Você esta pedindo: <strong id="form_remedio_nome">{remedio_selecionado.name}</strong></p>

      <div className="form_quantidade">
        <div>
          <label htmlFor="quantidade_pedido">Quantidade:</label>
          <input type="number" id="quantidade_pedido" name="quantidade_pedido" min='1' max={remedio_selecionado.quantidade_estoque}
          value={quantidade_pedido} onChange={(e) => set_quantidade(e.target.value)} required/>
        </div>
        <p>Disponivel: {remedio_selecionado.quantidade_estoque}</p>
      </div>

      <div>
        <label htmlFor="nome_cliente">Seu Nome:</label>
        <input type="text" id="nome_cliente" name="nome_cliente" required />
      </div>
      <div>
        <label htmlFor="email_cliente">Seu Email:</label>
        <input type="email" id="email_cliente" name="email_cliente" required />
      </div>
      <button type="submit">Confirmar</button>
      <button type="button" id="cancela_pedido" onClick={fechar_form}>Cancelar Pedido</button>
  </form>
  </div>
  )}
   </>
   );
}

export default LojaPage;