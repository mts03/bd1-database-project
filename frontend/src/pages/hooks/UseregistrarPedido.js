import { useState, useEffect } from "react";

export default function useRegistrarPedido() {
  const [orderType, setOrderType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [mesaNumber, setMesaNumber] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [cardapio, setCardapio] = useState([]);

  // Puxar cardápio do backend
  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/cardapio");
        const data = await response.json();
        setCardapio(data);
      } catch (error) {
        console.error("Erro ao buscar cardápio:", error);
      }
    };

    fetchCardapio();
  }, []);

  const handleRegisterPedido = async () => {
    // Validações
    if (orderItems.length === 0) {
      alert("Adicione pelo menos um item!");
      return;
    }

    if (!orderType) {
      alert("Selecione o tipo do pedido (Mesa ou Delivery)!");
      return;
    }

    if (orderType === "mesa" && !mesaNumber) {
      alert("Informe o número da mesa!");
      return;
    }

    if (orderType === "delivery" && !deliveryId) {
      alert("Informe o endereço de entrega!");
      return;
    }

    // Preparar dados do pedido
    const data = {
      id_cliente: 1, // ID fixo ou obter do login
      id_restaurante: 1, // ID fixo ou obter do contexto
      id_funcionario: employeeId ? Number(employeeId) : null,
      taxa_entrega: orderType === "delivery" ? 5 : 0,
      tipo: orderType,
      n_mesa: orderType === "mesa" ? Number(mesaNumber) : null,
      endereco_entrega: orderType === "delivery" ? deliveryId : null,
      itens: orderItems.map((item) => ({
        id_item: item.id_item,
        quantidade: item.quantity,
      })),
      cupom: couponCode || null
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(
          `✅ Pedido registrado com sucesso!\n\n` +
          `ID do Pedido: ${result.pedido_id}\n` +
          `Valor Total: R$ ${result.valor_total.toFixed(2)}\n\n` +
          `Os ingredientes foram deduzidos do estoque automaticamente.`
        );
        
        // Limpar todos os campos após sucesso
        setOrderItems([]);
        setOrderType("");
        setEmployeeId("");
        setCouponCode("");
        setMesaNumber("");
        setDeliveryId("");
        setSelectedItem("");
        setQuantity(1);
      } else {
        alert("❌ Erro ao registrar pedido:\n" + result.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("❌ Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    }
  };

  return {
    orderType, setOrderType,
    selectedItem, setSelectedItem,
    quantity, setQuantity,
    orderItems, setOrderItems,
    couponCode, setCouponCode,
    employeeId, setEmployeeId,
    mesaNumber, setMesaNumber,
    deliveryId, setDeliveryId,
    handleRegisterPedido,
    cardapio,
  };
}