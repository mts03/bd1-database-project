import React, { useEffect } from 'react';
import useEmitirPedido from '../hooks/useEmitir';

export default function EmitirPedido({ active }) {
  const { pedidoId, setPedidoId, pedidoEmitido, emitirPedido } = useEmitirPedido();

  // Se não estiver ativa, não renderiza (mas mantém o estado do hook!)
  if (!active) return null;

  return (
    <section className="text-block">
      <h2 className="section-title">Emitir Comanda e Nota Fiscal</h2>

      <label className="form-label">ID do Pedido</label>
      <input
        type="number"
        className="form-input"
        value={pedidoId}
        onChange={e => setPedidoId(e.target.value)}
        placeholder="Digite o ID do pedido"
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
          <p><strong>Pedido:</strong> {pedidoEmitido.comanda.id_pedido}</p>
          <p><strong>Cliente:</strong> {pedidoEmitido.comanda.cliente}</p>

          <ul>
            {pedidoEmitido.comanda.itens.map((item, i) => (
              <li key={i}>
                {item.nome} — {item.quantidade} un.
              </li>
            ))}
          </ul>

          <h3>Nota Fiscal</h3>
          <p><strong>Valor Total:</strong> R$ {pedidoEmitido.nota_fiscal.valor_total}</p>
          <p>
            <strong>Data/Hora:</strong>{' '}
            {new Date(pedidoEmitido.nota_fiscal.data_hora).toLocaleString()}
          </p>
        </div>
      )}
    </section>
  );
}
