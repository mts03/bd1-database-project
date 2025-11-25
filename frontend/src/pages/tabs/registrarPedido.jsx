import React from 'react';
import useRegistrarPedido from '../hooks/UseregistrarPedido';

export default function RegistrarPedido() {
  const {
    orderType, setOrderType,
    selectedItem, setSelectedItem,
    quantity, setQuantity,
    orderItems, setOrderItems,
    couponCode, setCouponCode,
    employeeId, setEmployeeId,
    mesaNumber, setMesaNumber,
    deliveryId, setDeliveryId,
    handleRegisterPedido
  } = useRegistrarPedido();

  return (
    <section className="text-block">
      <h2 className="section-title">Registrar Pedidos</h2>
      <form className="pedido-form" onSubmit={e => e.preventDefault()}>
        {/* Item do Cardápio */}
        <label className="form-label">Item do Cardápio</label>
        <select
          className="form-input"
          value={selectedItem}
          onChange={e => setSelectedItem(e.target.value)}
        >
          <option value="">Selecione um item...</option>
          <option value="hamburguer">Hambúrguer</option>
          <option value="pizza">Pizza</option>
        </select>

        {/* Quantidade */}
        <label className="form-label">Quantidade</label>
        <input type="number" min="1" className="form-input" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />

        {/* Adicionar Item */}
        <button type="button" onClick={() => {
          if (!selectedItem) return alert("Selecione um item!");
          if (quantity < 1) return alert("Quantidade inválida!");
          setOrderItems([...orderItems, { item: selectedItem, quantity }]);
          setSelectedItem("");
          setQuantity(1);
        }}>Adicionar Item</button>

        {/* Lista de itens */}
        {orderItems.length > 0 && (
          <div>
            <h3>Itens adicionados:</h3>
            {orderItems.map((it, i) => <div key={i}>{it.item} x {it.quantity}</div>)}
          </div>
        )}

        {/* Tipo de pedido */}
        <label className="form-label">Tipo do Pedido</label>
        <select className="form-input" value={orderType} onChange={e => setOrderType(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="mesa">Mesa</option>
          <option value="delivery">Delivery</option>
        </select>

        {orderType === "mesa" && (
          <input type="number" placeholder="Número da Mesa" value={mesaNumber} onChange={e => setMesaNumber(e.target.value)} />
        )}

        {orderType === "delivery" && (
          <input type="text" placeholder="ID da Entrega" value={deliveryId} onChange={e => setDeliveryId(e.target.value)} />
        )}

        {/* Cupom */}
        <input type="text" placeholder="Cupom de Desconto" value={couponCode} onChange={e => setCouponCode(e.target.value)} />

        {/* Funcionário */}
        <input type="text" placeholder="ID Funcionário" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />

        <button type="button" onClick={handleRegisterPedido}>Registrar Pedido</button>
      </form>
    </section>
  );
}
