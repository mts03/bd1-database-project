import React from 'react';
import useEmitirPedido from '../hooks/useEmitir';

export default function EmitirPedido() {
  const { pedidoId, setPedidoId, pedidoEmitido, emitirPedido } = useEmitirPedido();

  return (
    <section className="text-block">
      <h2 className="section-title">Emitir Comanda e Nota Fiscal</h2>

      <label className="form-label">ID do Pedido</label>
      <input
        type="number"
        className="form-input"
        value={pedidoId}
        onChange={e => setPedidoId(e.target.value)}
      />

      <button
        type="button"
        className="submit-button"
        onClick={() => emitirPedido(pedidoId)}
      >
        Emitir Comanda / Nota Fiscal
      </button>

      {pedidoEmitido && (
        <div className="pedido-emitido">
          <h3>Comanda</h3>
          <p>Pedido: {pedidoEmitido.comanda.id_pedido}</p>
          <p>Cliente: {pedidoEmitido.comanda.cliente}</p>
          <ul>
            {pedidoEmitido.comanda.itens.map((item, i) => (
              <li key={i}>{item.nome} x {item.quantidade}</li>
            ))}
          </ul>

          <h3>Nota Fiscal</h3>
          <p>Valor total: R$ {pedidoEmitido.nota_fiscal.valor_total}</p>
          <p>Data/Hora: {pedidoEmitido.nota_fiscal.data_hora}</p>
        </div>
      )}
    </section>
  );
}
