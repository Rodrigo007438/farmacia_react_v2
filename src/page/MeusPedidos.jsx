import { useState, useEffect } from 'react';
import '../App.css';
import { toast } from 'react-toastify';

// A URL da API (necessária)
const API_URL = import.meta.env.VITE_API_URL;

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailLogado, setEmailLogado] = useState('');

  useEffect(() => {
    // 1. Pega o email do usuário logado
    const email = localStorage.getItem('email_usuario');
    if (email) {
      setEmailLogado(email);
    }

    async function buscarPedidos() {
      setLoading(true);
      try {
        // 2. Busca TODOS os pedidos na API
        const response = await fetch(`${API_URL}/pedidos`);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast.error('Não foi possível carregar seus pedidos.');
      }
      setLoading(false);
    }

    buscarPedidos();
  }, []);

  // 3. Filtra a lista de pedidos para mostrar apenas os do email logado
  const pedidosFiltrados = pedidos.filter(
    (pedido) => pedido.email_cliente === emailLogado
  );

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Carregando seus pedidos...</p>;
  }

  return (
    <>
      <h2 id='pedidos_titulo' style={{ display: 'block', textAlign: 'center' }}>Meus Pedidos</h2>
      
      <section id='lista_pedidos' style={{ display: 'grid' }}>
          {pedidosFiltrados.length === 0 ? (
            <p style={{textAlign:'center'}}>Você não fez nenhum pedido.</p>
          ):(
            pedidosFiltrados.map((pedido) => (
              <div key={pedido.id} className='pedido_card'>
                <h4>Pedido de: {pedido.nome_cliente}</h4>
                <p>Email: {pedido.email_cliente}</p>
                <hr />
                <p><strong>Remedio: </strong>{pedido.quantidade_pedida || 1} x {pedido.remedio_nome}</p>
                <p><strong>Preço Total: </strong>R$ {pedido.remedio_preco}</p>
                {/* Esta página (do cliente) não tem o botão de cancelar */}
              </div>
            ))
          )}
      </section>
    </>
  );
}

export default MeusPedidos;