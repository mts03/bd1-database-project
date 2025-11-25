import { useState } from 'react';

export default function useEmitirPedido() {
  const [pedidoId, setPedidoId] = useState("");
  const [pedidoEmitido, setPedidoEmitido] = useState(null);

  const emitirPedido = async (id) => {
    if (!id) return alert("Digite o ID do pedido!");

    try {
      const response = await fetch(`http://127.0.0.1:8000/pedido/emitir/${id}`);
      const result = await response.json();
      if (response.ok) {
        setPedidoEmitido(result);
      } else {
        alert("Erro ao emitir pedido: " + result.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return { pedidoId, setPedidoId, pedidoEmitido, emitirPedido };
}
