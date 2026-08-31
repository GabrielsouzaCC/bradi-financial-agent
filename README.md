<div align="center">

<img src="assets/preview-inicial.png" alt="Bradi – Assistente Financeiro" width="100%" />

# Bradi — Assistente Financeiro com IA Generativa

**Agente conversacional financeiro construído 

Desenvolvido para o desafio **DIO × Bradesco** — Trilha GenAI & Data

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Claude](https://img.shields.io/badge/Claude-Sonnet%204.6-CC7700?style=flat)](https://anthropic.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

##  O que é este projeto — e por que ele importa

Este projeto **não é um chatbot genérico**. É um agente financeiro que conhece o cliente de verdade: analisa seu histórico de transações, entende sua carteira de investimentos, acompanha suas metas e recomenda produtos alinhados ao seu perfil de risco.

O problema que ele resolve é real: bancos digitais entregam dados, mas não entregam compreensão. O cliente abre o app, vê o saldo, e fecha sem saber o que fazer. O Bradi preenche essa lacuna — ele transforma números em orientação.

> Este projeto aplica na prática os três pilares mais valorizados em dados e fintechs: **análise de dados contextualizada**, **engenharia de prompts com segurança** e **desenvolvimento de produto orientado ao usuário**.

---

##  Preview

### Tela inicial com painel de contexto financeiro
<img width="1346" height="746" alt="image" src="https://github.com/user-attachments/assets/f4e74438-57ff-4603-ab6b-b932f9334dd1" />


### Simulação financeira com tabela formatada
<img width="1350" height="747" alt="image" src="https://github.com/user-attachments/assets/8c8243c4-7664-40f9-abfc-acbd1b883c58" />


### Recomendação personalizada por perfil
<img width="1350" height="754" alt="image" src="https://github.com/user-attachments/assets/2e891946-d56f-4734-b34f-ce32205a27ca" />


---

##  Funcionalidades

| Funcionalidade | Descrição |
|---|---|
|  Análise de gastos | Identifica padrões em 3 meses de transações e sugere otimizações |
|  Recomendação de produtos | Sugere CDB, LCI, Tesouro e Fundos alinhados ao perfil do cliente |
|  Simulações financeiras | Cálculo de juros compostos com desconto de IR regressivo |
|  FAQs inteligentes | Explica CDI, Selic, FGC, come-cotas e IR em linguagem acessível |
|  Progresso de metas | Acompanha Reserva de Emergência e Entrada do Imóvel em tempo real |
|  Anti-alucinação | Responde apenas com base nos dados reais — nunca inventa valores |
|  Layout responsivo | Sidebar com carteira, metas e gastos mensais sempre visíveis |

---

##  Arquitetura e Decisões Técnicas

```
┌────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)               │
│                                                        │
│  ┌──────────────┐     ┌──────────────────────────────┐ │
│  │  Sidebar     │     │  Chat Interface              │ │
│  │  · Carteira  │     │  · Histórico de mensagens    │ │
│  │  · Metas     │     │  · Markdown renderer         │ │
│  │  · Gastos    │     │  · Sugestões de perguntas    │ │
│  └──────────────┘     └──────────────────────────────┘ │
│                              │                         │
│  ┌───────────────────────────▼────────────────────────┐ │
│  │            Base de Conhecimento (contexto.js)      │ │
│  │   perfil · carteira · transações · produtos        │ │
│  └───────────────────────────┬────────────────────────┘ │
└──────────────────────────────┼─────────────────────────┘
                               │ injetado no system prompt
                               ▼
              ┌────────────────────────────┐
              │     ANTHROPIC API          │
              │   claude-sonnet-4-6        │
              │   Closed-context RAG       │
              └────────────────────────────┘
```

**Por que Closed-Context RAG?**
Em vez de deixar o modelo responder livremente, todos os dados do cliente são injetados no system prompt a cada chamada. O modelo só pode responder com base no que está no contexto — isso elimina o risco de alucinação, que em um contexto financeiro pode causar prejuízo real ao cliente.

---

##  Estrutura do Projeto

```
lab-agente-financeiro/
│
├── 📁 data/                          # Base de conhecimento mockada
│   ├── perfil_investidor.json        # Perfil, carteira e metas do cliente
│   ├── transacoes.csv                # Histórico de 3 meses (45 transações)
│   ├── produtos_financeiros.json     # Catálogo com 6 produtos Bradesco
│   └── historico_atendimento.csv     # 8 atendimentos anteriores
│
├── 📁 docs/                          # Documentação técnica completa
│   ├── 01-documentacao-agente.md     # Caso de uso, persona e arquitetura
│   ├── 02-base-conhecimento.md       # Estratégia de dados e injeção de contexto
│   ├── 03-prompts.md                 # System prompt, exemplos e edge cases
│   ├── 04-metricas.md                # Framework de avaliação e banco de testes
│   └── 05-pitch.md                   # Roteiro do pitch de 3 minutos
│
├── 📁 src/
│   ├── data/contexto.js              # Dados injetados no system prompt
│   ├── App.jsx                       # Componente principal + markdown renderer
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Design system
│
├── .env.example                      # Template de configuração
├── index.html
├── package.json
└── vite.config.js
```

---

##  Como Rodar

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- Chave de API da Anthropic → [console.anthropic.com](https://console.anthropic.com)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lab-agente-financeiro
cd lab-agente-financeiro

# Instale as dependências
npm install

# Configure a chave de API
cp .env.example .env
# Abra o .env e adicione: VITE_ANTHROPIC_API_KEY=sk-ant-...

# Rode localmente
npm run dev
# Acesse: http://localhost:5173
```

---

##  Documentação

| Documento | O que cobre |
|---|---|
| [01 · Agente](docs/01-documentacao-agente.md) | Caso de uso, persona, arquitetura e estratégia de segurança |
| [02 · Dados](docs/02-base-conhecimento.md) | Como os dados são estruturados e injetados no contexto |
| [03 · Prompts](docs/03-prompts.md) | System prompt completo, exemplos reais e edge cases |
| [04 · Métricas](docs/04-metricas.md) | Framework de avaliação com banco de 14 perguntas-teste |

---

##  Segurança e Confiabilidade

No setor financeiro, uma resposta errada não é apenas ruim — pode causar prejuízo real. O Bradi foi projetado com três camadas de proteção:

1. **Contexto fechado** — o modelo só acessa os dados fornecidos no system prompt
2. **Instruções explícitas** — o prompt proíbe inventar taxas, saldos ou rentabilidades
3. **Escopo de domínio** — perguntas fora do contexto financeiro são redirecionadas

---

##  Visão de Produção

Em um ambiente real, este agente seria alimentado por:

- **Open Finance API** — dados reais de carteira e transações do cliente
- **CRM bancário** — histórico de atendimentos e preferências
- **Catálogo de produtos via API** — taxas e condições em tempo real
- **Suitability API** — perfil de risco atualizado periodicamente

A arquitetura de injeção de contexto permanece a mesma — apenas a fonte dos dados muda de arquivos estáticos para APIs autenticadas.

---

##  Sobre o Autor

**Gabriel** — Estudante de Ciência da Computação (2º semestre) na FIAP, com foco em Análise de Dados e IA.

Atuo na gestão financeira e de RH de uma empresa de engenharia, onde aplico Python para automação de processos e Power BI para dashboards estratégicos. Este projeto combina meu interesse em dados, IA generativa e produtos financeiros.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-de-oliveira-souza-b89073379)


---

<div align="center">
  <sub>Desenvolvido para o desafio DIO × Bradesco — Trilha GenAI & Data · 2026</sub>
</div>
