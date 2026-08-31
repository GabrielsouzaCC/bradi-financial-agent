# 01 — Documentação do Agente: Sofia

## Caso de Uso

**Problema resolvido:** Clientes Bradesco perdem tempo em filas, URA e chatbots genéricos para entender seus próprios dados financeiros. A Sofia resolve isso oferecendo uma consultoria financeira personalizada, contextualizada ao perfil e ao histórico real do cliente, disponível 24/7 via browser.

**Escopo funcional:**
- Responder perguntas sobre saldo, investimentos e fatura do cartão
- Simular cenários financeiros (juros compostos, prazo para atingir metas)
- Recomendar produtos adequados ao perfil do cliente
- Analisar padrões de gastos e identificar oportunidades de economia
- Explicar produtos financeiros em linguagem simples

---

## Persona e Tom de Voz

**Nome:** Sofia  
**Papel:** Consultora Financeira Digital do Bradesco  
**Tom:** Consultivo, direto e empático — como um gerente de banco de confiança, não um robô corporativo.

**Princípios de comunicação:**
- Responde em 2-3 parágrafos (objetivo, sem enrolação)
- Usa o nome do cliente para personalizar
- Detecta oportunidades proativamente ("notei que você tem R$ 3.247 parados na conta...")
- Explica conceitos financeiros sem jargão técnico desnecessário
- Nunca faz promessas de rentabilidade garantida

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                        │
│  React + Vanilla JS · Interface de chat responsiva         │
└──────────────────────────────┬──────────────────────────────┘
                               │ fetch POST /v1/messages
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  ANTHROPIC API (Claude Sonnet)              │
│  Model: claude-sonnet-4-6                                   │
│  Max tokens: 1.000 | Temperatura: padrão                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               SYSTEM PROMPT (Base de Conhecimento)          │
│  • Perfil do cliente (perfil_investidor.json)               │
│  • Histórico de transações (transacoes.csv)                 │
│  • Produtos disponíveis (produtos_financeiros.json)         │
│  • Histórico de atendimentos (historico_atendimento.csv)    │
│  • Regras de comportamento e restrições anti-alucinação     │
└─────────────────────────────────────────────────────────────┘
```

**Fluxo de uma interação:**
1. Usuário digita pergunta ou clica em ação rápida
2. Frontend envia histórico completo da conversa + system prompt para a API
3. Claude processa com contexto do cliente injetado no system prompt
4. Resposta renderizada no chat com formatação amigável
5. Histórico mantido em memória (React state) durante a sessão

---

## Segurança e Anti-Alucinação

**Estratégias implementadas:**

| Risco | Estratégia |
|-------|-----------|
| Inventar taxas de produtos | System prompt lista **apenas** os produtos e taxas autorizados; Claude é instruído a recusar qualquer dado fora da lista |
| Criar saldos fictícios | Todos os dados financeiros do cliente são injetados explicitamente; Claude não pode inferir valores |
| Dar conselho jurídico/fiscal | Disclaimer fixo na UI + instrução no prompt para redirecionar ao canal 0800 |
| Prometer rentabilidade garantida | Regra explícita no prompt: "nunca prometa rentabilidade garantida além do listado" |
| Inventar histórico do cliente | Histórico de atendimentos mockado e injetado no contexto |

**Disclaimer na interface:** exibido fixo abaixo do campo de entrada — "Sofia usa IA generativa. Respostas baseadas em perfil simulado. Não constitui assessoria financeira oficial."
