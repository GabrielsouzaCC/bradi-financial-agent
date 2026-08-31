import { useState, useRef, useEffect } from 'react'
import { PERFIL_CLIENTE, TRANSACOES_RESUMO, PRODUTOS_DISPONIVEIS, HISTORICO_ATENDIMENTO } from './data/contexto'

// ─── Markdown renderer simples ──────────────────────────────────────────────
function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} style={{ background: '#f0f2f5', borderRadius: 4, padding: '1px 5px', fontSize: '0.88em', fontFamily: 'monospace' }}>{part.slice(1, -1)}</code>
    return part
  })
}

function renderMarkdown(text) {
  const lines = text.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // Tabela
    if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s\-|]+\|$/)) {
      const headers = line.split('|').filter(c => c.trim()).map(c => c.trim())
      i += 2
      const rows = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').filter(c => c.trim()).map(c => c.trim()))
        i++
      }
      out.push(
        <div key={'t' + i} style={{ overflowX: 'auto', margin: '8px 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12.5 }}>
            <thead>
              <tr>{headers.map((h, j) => <th key={j} style={{ padding: '6px 10px', background: '#f5f6f8', borderBottom: '2px solid #e2e5ea', textAlign: 'left', fontWeight: 600, color: '#1a1d23', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid #e2e5ea' }}>
                  {row.map((cell, ci) => <td key={ci} style={{ padding: '5px 10px', color: '#1a1d23' }}>{inlineFormat(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // Separador
    if (line.trim() === '---') { out.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid #e2e5ea', margin: '8px 0' }} />); i++; continue }
    // Vazio
    if (line.trim() === '') { out.push(<div key={i} style={{ height: 5 }} />); i++; continue }
    // Parágrafo
    out.push(<p key={i} style={{ margin: 0, lineHeight: 1.65 }}>{inlineFormat(line)}</p>)
    i++
  }
  return out
}

// ─── System Prompt ─────────────────────────────────────────────────────────
function buildSystemPrompt() {
  return `Você é o Bradi, assistente financeiro inteligente do Bradesco. Seu objetivo é oferecer uma experiência consultiva, personalizada e segura para o cliente.

## Identidade e Tom de Voz
- Profissional, empático e direto — sem jargões desnecessários
- Use linguagem clara, como um gerente de banco de confiança conversaria
- Seja proativo: antecipe necessidades e sugira próximos passos
- Nunca invente dados, taxas ou projeções que não estejam no contexto abaixo
- Se não souber algo, diga que vai verificar e oriente o cliente a falar com um especialista

## Regras de Segurança (Anti-Alucinação)
- APENAS responda com base nos dados do cliente e produtos fornecidos abaixo
- NUNCA mencione taxas, saldos ou valores que não estejam no contexto
- Se o cliente perguntar algo fora do escopo financeiro, redirecione educadamente
- Não faça promessas de rentabilidade futura — use sempre o histórico como referência
- Sempre recomende consulta com especialista para decisões de alto valor

## Dados do Cliente
${JSON.stringify(PERFIL_CLIENTE, null, 2)}

## Resumo de Gastos (últimos 3 meses)
${JSON.stringify(TRANSACOES_RESUMO, null, 2)}

## Produtos Disponíveis
${JSON.stringify(PRODUTOS_DISPONIVEIS, null, 2)}

## Histórico de Atendimentos Anteriores
${JSON.stringify(HISTORICO_ATENDIMENTO, null, 2)}

## Capacidades do Agente
1. Análise de gastos: Identifique padrões e sugira otimizações com base nas transações
2. Recomendação de produtos: Sugira produtos adequados ao perfil Moderado do cliente
3. Simulações simples: Calcule projeções de crescimento de investimento (use juros compostos)
4. FAQs financeiros: Explique conceitos como CDI, Selic, FGC, IR regressivo, come-cotas
5. Progresso de metas: Informe o andamento das metas do cliente com base nos dados
6. Alertas proativos: Destaque oportunidades ou riscos na carteira do cliente

## Formato de Resposta
- Respostas concisas (máximo 4 parágrafos) — o cliente está no app
- Use marcadores apenas quando listar 3+ itens
- Para cálculos, mostre a fórmula simplificada e o resultado
- Sempre finalize com uma pergunta ou próximo passo sugerido`
}

// ─── API ────────────────────────────────────────────────────────────────────
async function sendMessage(messages) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Chave de API não encontrada. Configure o .env')
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: buildSystemPrompt(),
      messages,
    }),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Erro na API')
  }
  const data = await response.json()
  return data.content[0].text
}

// ─── Sugestões ──────────────────────────────────────────────────────────────
const SUGESTOES = [
  'Como estão meus gastos?',
  'Qual produto me recomenda?',
  'Quanto falta para minha reserva?',
  'O que é CDI?',
  'Simule R$500/mês por 5 anos',
  'Minha carteira está diversificada?',
]

// ─── Cores dos produtos ─────────────────────────────────────────────────────
const CORES_CARTEIRA = ['#cc1429', '#e8566a', '#f5a0ab']

// ─── Gastos por categoria (média mensal) ────────────────────────────────────
const GASTOS = [
  { label: 'Moradia', valor: 2135, cor: '#cc1429' },
  { label: 'Saúde', valor: 350, cor: '#e8566a' },
  { label: 'Alimentação', valor: 410, cor: '#f5a0ab' },
  { label: 'Transporte', valor: 180, cor: '#fbd0d5' },
  { label: 'Lazer', valor: 67, cor: '#e2e5ea' },
]
const TOTAL_GASTOS = GASTOS.reduce((s, g) => s + g.valor, 0)

// ─── Componentes da Sidebar ─────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside style={{
      width: 280,
      flexShrink: 0,
      background: '#fff',
      borderRight: '1px solid #e2e5ea',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {/* Perfil */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e2e5ea' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#cc1429',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff',
            flexShrink: 0,
          }}>
            {PERFIL_CLIENTE.nome.split(' ').slice(0,2).map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1d23', lineHeight: 1.2 }}>
              {PERFIL_CLIENTE.nome.split(' ').slice(0,2).join(' ')}
            </div>
            <div style={{ fontSize: 12, color: '#8a93a2', marginTop: 2 }}>
              {PERFIL_CLIENTE.profissao}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Renda mensal', valor: `R$ ${PERFIL_CLIENTE.renda_mensal.toLocaleString('pt-BR')}` },
            { label: 'Perfil', valor: PERFIL_CLIENTE.perfil_investidor },
          ].map((item, i) => (
            <div key={i} style={{
              background: '#f5f6f8', borderRadius: 8, padding: '8px 10px',
            }}>
              <div style={{ fontSize: 10, color: '#8a93a2', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1d23' }}>{item.valor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Carteira */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1d23' }}>Carteira</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#cc1429' }}>
            R$ {PERFIL_CLIENTE.total_investido.toLocaleString('pt-BR')}
          </span>
        </div>
        {/* Barra de alocação */}
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 8, marginBottom: 12 }}>
          {PERFIL_CLIENTE.carteira.map((item, i) => (
            <div key={i} style={{
              width: `${item.percentual}%`,
              background: CORES_CARTEIRA[i],
            }} />
          ))}
        </div>
        {/* Legenda */}
        {PERFIL_CLIENTE.carteira.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: CORES_CARTEIRA[i], flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#5c6270' }}>{item.produto.replace('Bradesco', '').replace('Fundo ', '').trim()}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1d23' }}>
                R$ {item.valor.toLocaleString('pt-BR')}
              </span>
              <span style={{ fontSize: 10, color: '#8a93a2', marginLeft: 4 }}>
                {item.percentual}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Metas */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1d23', marginBottom: 12 }}>Metas</div>
        {PERFIL_CLIENTE.metas.map((meta, i) => {
          const pct = Math.round((meta.atual / meta.meta) * 100)
          return (
            <div key={i} style={{ marginBottom: i < PERFIL_CLIENTE.metas.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#5c6270' }}>{meta.nome}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#cc1429' }}>{pct}%</span>
              </div>
              <div style={{ background: '#f0f2f5', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: 'linear-gradient(90deg, #cc1429, #e8566a)',
                  borderRadius: 4,
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#8a93a2' }}>
                  R$ {meta.atual.toLocaleString('pt-BR')}
                </span>
                <span style={{ fontSize: 10, color: '#8a93a2' }}>
                  R$ {meta.meta.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gastos por categoria */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1d23', marginBottom: 12 }}>Gastos mensais</div>
        {GASTOS.map((g, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: '#5c6270' }}>{g.label}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#1a1d23' }}>
                R$ {g.valor.toLocaleString('pt-BR')}
              </span>
            </div>
            <div style={{ background: '#f0f2f5', borderRadius: 4, height: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${(g.valor / TOTAL_GASTOS) * 100}%`,
                height: '100%',
                background: g.cor,
                borderRadius: 4,
              }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

// ─── Mensagem ───────────────────────────────────────────────────────────────
function Mensagem({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      gap: '10px',
      alignItems: 'flex-end',
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#cc1429',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
          flexShrink: 0,
        }}>B</div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '11px 15px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        background: isUser ? '#cc1429' : '#ffffff',
        color: isUser ? '#fff' : '#1a1d23',
        fontSize: 13.5,
        lineHeight: 1.65,
        border: isUser ? 'none' : '1px solid #e2e5ea',
        boxShadow: isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        {isUser ? msg.content : renderMarkdown(msg.content)}
      </div>
    </div>
  )
}

// ─── Typing ─────────────────────────────────────────────────────────────────
function Digitando() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: '#cc1429',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
      }}>B</div>
      <div style={{
        padding: '11px 15px', background: '#fff',
        borderRadius: '4px 16px 16px 16px',
        border: '1px solid #e2e5ea',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: '#c0c5ce',
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${delay}s`,
          }} />
        ))}
        <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  )
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Olá, Carlos! 👋 Sou o Bradi, seu assistente financeiro Bradesco.\n\nVejo que você tem R$ 42.500 investidos e está no caminho certo para a entrada do seu imóvel. Posso te ajudar com análise de gastos, sugestões de produtos, simulações ou tirar dúvidas financeiras.\n\nComo posso te ajudar hoje?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(texto) {
    const conteudo = (texto || input).trim()
    if (!conteudo || loading) return
    const novasMensagens = [...messages, { role: 'user', content: conteudo }]
    setMessages(novasMensagens)
    setInput('')
    setLoading(true)
    setErro(null)
    try {
      const resposta = await sendMessage(novasMensagens.map(m => ({ role: m.role, content: m.content })))
      setMessages(prev => [...prev, { role: 'assistant', content: resposta }])
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        height: 56, padding: '0 24px',
        background: '#cc1429',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(204,20,41,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700,
            fontSize: 18, color: '#fff', letterSpacing: '-0.3px',
          }}>
            Bradesco
          </div>
          <div style={{
            width: 1, height: 16, background: 'rgba(255,255,255,0.35)', margin: '0 2px',
          }} />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
            Assistente Financeiro
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7fffb8' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Bradi online</span>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar />

        {/* Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chips de sugestão */}
          {messages.length <= 1 && (
            <div style={{
              padding: '14px 20px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              background: '#fff', borderBottom: '1px solid #e2e5ea',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: '#8a93a2', width: '100%', marginBottom: 2 }}>
                Sugestões para começar
              </span>
              {SUGESTOES.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: '#fff', border: '1px solid #e2e5ea',
                  color: '#5c6270', fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#cc1429'; e.target.style.color = '#cc1429' }}
                onMouseLeave={e => { e.target.style.borderColor = '#e2e5ea'; e.target.style.color = '#5c6270' }}
                >{s}</button>
              ))}
            </div>
          )}

          {/* Mensagens */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px' }}>
            {messages.map((msg, i) => <Mensagem key={i} msg={msg} />)}
            {loading && <Digitando />}
            {erro && (
              <div style={{
                margin: '8px 0', padding: '10px 14px', borderRadius: 8,
                background: '#fff0f2', border: '1px solid #f5c0c7',
                fontSize: 13, color: '#cc1429',
              }}>⚠️ {erro}</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #e2e5ea',
            background: '#fff', display: 'flex', gap: 10, alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte ao Bradi..."
              rows={1}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                background: '#f5f6f8', border: '1.5px solid #e2e5ea',
                color: '#1a1d23', fontSize: 13.5, outline: 'none',
                transition: 'border-color 0.15s', maxHeight: 100, overflowY: 'auto',
              }}
              onFocus={e => e.target.style.borderColor = '#cc1429'}
              onBlur={e => e.target.style.borderColor = '#e2e5ea'}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: input.trim() && !loading ? '#cc1429' : '#f0f2f5',
                color: input.trim() && !loading ? '#fff' : '#c0c5ce',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.15s', cursor: input.trim() ? 'pointer' : 'default',
                border: 'none',
              }}
            >↑</button>
          </div>
        </div>
      </div>
    </div>
  )
}
