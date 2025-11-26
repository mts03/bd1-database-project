import { useState } from 'react';

export default function useRelatorios() {
  // Estados para Relatório Específico
  const [dadosVendas, setDadosVendas] = useState([]);
  const [itensPopulares, setItensPopulares] = useState([]);

  // Estados para Relatório Geral (Admin)
  const [vendasPorUnidade, setVendasPorUnidade] = useState([]);
  const [itensGerais, setItensGerais] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para carregar dados de UM restaurante
  const carregarRelatoriosEspecificos = async (idRestaurante) => {
    setLoading(true);
    setError(null);
    try {
      const [resVendas, resItens] = await Promise.all([
        fetch(`http://127.0.0.1:8000/relatorio/vendas?id_restaurante=${idRestaurante}`),
        fetch(`http://127.0.0.1:8000/relatorio/itens-populares?id_restaurante=${idRestaurante}`)
      ]);

      if (!resVendas.ok || !resItens.ok) throw new Error('Erro ao buscar dados específicos');

      setDadosVendas(await resVendas.json());
      setItensPopulares(await resItens.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados GERAIS (Todas as unidades)
  const carregarRelatoriosGerais = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resUnidades, resItens] = await Promise.all([
        fetch(`http://127.0.0.1:8000/relatorio/geral/vendas-por-unidade`),
        fetch(`http://127.0.0.1:8000/relatorio/geral/itens-populares`)
      ]);

      if (!resUnidades.ok || !resItens.ok) throw new Error('Erro ao buscar dados gerais');

      setVendasPorUnidade(await resUnidades.json());
      setItensGerais(await resItens.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { 
    // Dados Específicos
    dadosVendas, 
    itensPopulares, 
    carregarRelatoriosEspecificos,
    
    // Dados Gerais
    vendasPorUnidade,
    itensGerais,
    carregarRelatoriosGerais,

    // Estado Comum
    loading, 
    error 
  };
}