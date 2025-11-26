import React, { useState } from 'react';
import useRelatorios from '../hooks/useRelatorios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Relatorios() {
  const { 
    dadosVendas, itensPopulares, carregarRelatoriosEspecificos,
    vendasPorUnidade, itensGerais, carregarRelatoriosGerais,
    loading, error 
  } = useRelatorios();
  
  // Controle de Acesso
  const [modoAcesso, setModoAcesso] = useState(null); // 'RESTAURANTE' ou 'GERAL'
  const [inputId, setInputId] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [msgErro, setMsgErro] = useState('');

  // --- CHAVES DE ACESSO (Configure aqui) ---
  const CHAVE_RESTAURANTE = "123";  // Acesso individual
  const CHAVE_GERAL = "ADMIN";      // Acesso 'TODOS'

  const handleAcessar = (e) => {
    e.preventDefault();
    setMsgErro('');

    // Lógica de Acesso Geral
    if (inputId.toUpperCase() === 'TODOS' && inputKey === CHAVE_GERAL) {
      setModoAcesso('GERAL');
      carregarRelatoriosGerais();
      return;
    }

    // Lógica de Acesso Restaurante Específico
    if (inputId !== 'TODOS' && inputKey === CHAVE_RESTAURANTE) {
      if (!inputId || isNaN(inputId)) {
        setMsgErro('Por favor, insira um ID numérico válido.');
        return;
      }
      setModoAcesso('RESTAURANTE');
      carregarRelatoriosEspecificos(inputId);
      return;
    }

    setMsgErro('Credenciais inválidas.');
  };

  const handleSair = () => {
    setModoAcesso(null);
    setInputId('');
    setInputKey('');
    setMsgErro('');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // --- TELA DE LOGIN ---
  if (!modoAcesso) {
    return (
      <section className="text-block">
        <h2 className="section-title">Acesso aos Relatórios</h2>
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <form onSubmit={handleAcessar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ID ou "TODOS":</label>
              <input 
                type="text" 
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Ex: 1 ou TODOS"
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Chave de Acesso:</label>
              <input 
                type="password" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Digite a chave..."
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
            {msgErro && <p style={{ color: 'red', fontSize: '0.9rem', margin: 0 }}>{msgErro}</p>}
            <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Entrar
            </button>
          </form>
          <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
            <p>Dica: Use ID + Chave "123" para loja específica.</p>
            <p>Use "TODOS" + Chave "ADMIN" para visão geral.</p>
          </div>
        </div>
      </section>
    );
  }

  // --- CABEÇALHO DO DASHBOARD ---
  return (
    <section className="text-block">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title">
          {modoAcesso === 'GERAL' ? 'Visão Geral (Todas as Unidades)' : `Dashboard - Restaurante #${inputId}`}
        </h2>
        <button onClick={handleSair} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>

      {loading && <p>Carregando dados...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {/* --- CONTEÚDO VISÃO GERAL (ADMIN) --- */}
      {!loading && !error && modoAcesso === 'GERAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          
          <div className="chart-container">
            <h3>Comparativo de Pedidos por Unidade</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={vendasPorUnidade} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_pedidos" name="Qtd. Pedidos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Comparativo de Faturamento (R$)</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={vendasPorUnidade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis prefix="R$ " />
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="total_faturamento" name="Faturamento Total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Top 5 Pratos Mais Populares (Rede Inteira)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={itensGerais}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#ffc658"
                    dataKey="total_vendido"
                  >
                    {itensGerais.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO ESPECÍFICO (RESTAURANTE ÚNICO) --- */}
      {!loading && !error && modoAcesso === 'RESTAURANTE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          
          <div className="chart-container">
            <h3>Faturamento Diário (Últimos 7 dias)</h3>
            {dadosVendas.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={dadosVendas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="total_vendas" name="Vendas (R$)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p>Sem dados recentes.</p>}
          </div>

          <div className="chart-container">
            <h3>Top 5 Itens (Local)</h3>
            {itensPopulares.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={itensPopulares}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total_vendido"
                    >
                      {itensPopulares.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p>Sem itens vendidos.</p>}
          </div>
        </div>
      )}
    </section>
  );
}