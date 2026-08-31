# 02 — Base de Conhecimento

## Estratégia de Dados

A base de conhecimento é injetada integralmente no **system prompt** a cada requisição. Essa abordagem (RAG simplificado / prompt stuffing) é adequada para o volume de dados deste protótipo e garante que o agente sempre tenha contexto completo.

---

## Arquivos de Dados

### `transacoes.csv`
Histórico de transações dos últimos 2 meses do cliente Lucas Ferreira.

| Campo | Tipo | Exemplo |
|-------|------|---------|
| data | DATE | 2026-08-15 |
| descricao | STRING | PIX - Aluguel |
| valor | FLOAT | -2200.00 |
| tipo | ENUM | crédito / débito |
| categoria | STRING | Moradia |

**Uso pelo agente:** análise de gastos, identificação de padrões, cálculo de sobra mensal.

---

### `historico_atendimento.csv`
Registros dos últimos atendimentos do cliente.

| Campo | Tipo | Exemplo |
|-------|------|---------|
| data | DATE | 2026-07-10 |
| canal | STRING | App |
| assunto | STRING | Aumento de limite cartão |
| resolucao | STRING | Aprovado — limite ampliado |
| satisfacao | INT (1-5) | 5 |

**Uso pelo agente:** personalizar o atendimento com base em interações anteriores.

---

### `perfil_investidor.json`
Dados cadastrais, perfil de risco e patrimônio do cliente.

**Campos principais:**
- `classificacao`: Conservador / Moderado / Arrojado
- `horizonte_investimento`: prazo declarado pelo cliente
- `objetivo_principal`: Aposentadoria / Reserva / etc.
- `patrimonio.investimentos[]`: lista de produtos ativos com saldo e taxa

**Uso pelo agente:** base para todas as recomendações de produto.

---

### `produtos_financeiros.json`
Catálogo completo dos produtos Bradesco disponíveis para oferta.

**Campos principais:**
- `taxa`: rendimento (pré-fixado ou indexador)
- `aplicacao_minima`: valor mínimo de entrada
- `liquidez`: prazo para resgate
- `perfil_indicado[]`: perfis de investidor compatíveis
- `garantia_fgc`: se o produto tem cobertura do FGC

**Uso pelo agente:** recomendar produtos compatíveis com o perfil e verificar taxas sem inventar dados.

---

## Limitações Conhecidas

- Dados são mockados (fictícios) para fins acadêmicos
- Saldos e transações não se atualizam em tempo real
- Em produção, a base seria alimentada por APIs do core bancário (Open Banking)
