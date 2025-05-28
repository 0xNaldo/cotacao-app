import { useState, useEffect } from 'react';

function CotacoesApp() {
  const [cotacoes, setCotacoes] = useState([]);
  const [novaCotacao, setNovaCotacao] = useState({ titulo: '', vendedor: '', itens: [] });
  const [modoCriar, setModoCriar] = useState(false);

  useEffect(() => {
    const salvas = localStorage.getItem('cotacoes');
    if (salvas) setCotacoes(JSON.parse(salvas));
  }, []);

  useEffect(() => {
    localStorage.setItem('cotacoes', JSON.stringify(cotacoes));
  }, [cotacoes]);

  const adicionarItem = () => {
    setNovaCotacao({
      ...novaCotacao,
      itens: [...novaCotacao.itens, { produto: '', qtd: 0, sobra: 0, custo: 0, margem: 0 }]
    });
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...novaCotacao.itens];
    novosItens[index][campo] = valor;
    setNovaCotacao({ ...novaCotacao, itens: novosItens });
  };

  const salvarCotacao = () => {
    const nova = { ...novaCotacao, status: 'Aguardando', data: new Date().toISOString() };
    setCotacoes([...cotacoes, nova]);
    setNovaCotacao({ titulo: '', vendedor: '', itens: [] });
    setModoCriar(false);
  };

  const calcularTotal = (item) => {
    const qtdComSobra = parseFloat(item.qtd) + parseFloat(item.sobra);
    const custoTotal = qtdComSobra * parseFloat(item.custo);
    const margemValor = custoTotal * (parseFloat(item.margem) / 100);
    const precoFinal = (custoTotal + margemValor) * 1.11;
    const precoUnitario = precoFinal / parseFloat(item.qtd || 1);
    return { custoTotal, precoFinal, precoUnitario };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fila de Cotações</h1>
      <button onClick={() => setModoCriar(true)}>Nova Cotação</button>

      {!modoCriar && cotacoes.map((c, i) => (
        <div key={i} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <strong>{c.titulo}</strong>
          <div>Vendedor: {c.vendedor} | Status: {c.status}</div>
          <div>
            {c.itens.map((item, j) => {
              const calc = calcularTotal(item);
              return (
                <div key={j}>
                  {item.produto} — R$ {calc.precoUnitario.toFixed(2)} un.
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {modoCriar && (
        <div style={{ marginTop: '20px' }}>
          <input placeholder="Título da Cotação" value={novaCotacao.titulo} onChange={(e) => setNovaCotacao({ ...novaCotacao, titulo: e.target.value })} />
          <input placeholder="Nome do Vendedor" value={novaCotacao.vendedor} onChange={(e) => setNovaCotacao({ ...novaCotacao, vendedor: e.target.value })} />
          {novaCotacao.itens.map((item, index) => (
            <div key={index}>
              <input placeholder="Produto" value={item.produto} onChange={(e) => atualizarItem(index, 'produto', e.target.value)} />
              <input placeholder="Qtd" type="number" value={item.qtd} onChange={(e) => atualizarItem(index, 'qtd', e.target.value)} />
              <input placeholder="Sobra" type="number" value={item.sobra} onChange={(e) => atualizarItem(index, 'sobra', e.target.value)} />
              <input placeholder="Custo Unitário" type="number" value={item.custo} onChange={(e) => atualizarItem(index, 'custo', e.target.value)} />
              <input placeholder="Margem %" type="number" value={item.margem} onChange={(e) => atualizarItem(index, 'margem', e.target.value)} />
            </div>
          ))}
          <button onClick={adicionarItem}>Adicionar Item</button>
          <button onClick={salvarCotacao}>Salvar Cotação</button>
        </div>
      )}
    </div>
  );
}

export default CotacoesApp;