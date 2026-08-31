"""
Sofia — Agente Financeiro Inteligente do Bradesco
Versão: Streamlit (alternativa ao React)

Para rodar:
    pip install streamlit anthropic
    streamlit run app.py
"""

import json
import streamlit as st
from anthropic import Anthropic

# ── Dados mockados ─────────────────────────────────────────────
SYSTEM_PROMPT = """Você é Sofia, consultora financeira digital do Bradesco.
Seu tom é consultivo, direto e empático.

PERFIL DO CLIENTE:
- Nome: Lucas Ferreira, 32 anos, São Paulo/SP
- Perfil investidor: Moderado
- Renda mensal líquida: R$ 7.500,00
- Saldo conta corrente: R$ 3.247,89
- Saldo investimentos: R$ 28.500,00 em CDB Pós-fixado (CDI+0,5% aa)
- Cartão Platinum: limite R$ 8.000 | fatura R$ 1.245,30
- Objetivo: Aposentadoria e reserva de emergência

MOVIMENTAÇÃO AGOSTO/2026:
Receitas: Salário R$7.500 | Rendimento CDB R$285,42
Gastos: Aluguel R$2.200 | Supermercado R$342,50 | Restaurantes R$333,10
       Gasolina R$230 | Academia R$99,90 | Farmácia R$78,30 | Netflix R$55,90

PRODUTOS DISPONÍVEIS:
- CDB Pré-fixado: 12,5% aa | mín. R$1.000 | IR regressivo
- Tesouro Selic: 14,75% aa | liquidez diária
- LCI/LCA: 11% aa | isento IR | carência 90 dias
- Previdência PGBL: ~8% aa | dedução IR
- Fundo Multimercado: 13,2% aa | risco moderado
- Empréstimo Pessoal: 1,99% ao mês

REGRAS:
1. Responda SOMENTE com dados acima. Se não souber, sugira o canal 0800.
2. NUNCA invente taxas ou produtos fora da lista.
3. Faça cálculos financeiros quando solicitado.
4. Seja conciso (2-3 parágrafos).
"""

# ── Interface Streamlit ────────────────────────────────────────
st.set_page_config(page_title="Sofia · Bradesco IA", page_icon="🏦")

st.title("🏦 Sofia — Consultora Financeira IA")
st.caption("Bradesco · Agente Financeiro Inteligente")

client = Anthropic()

if "messages" not in st.session_state:
    st.session_state.messages = []
    st.session_state.messages.append({
        "role": "assistant",
        "content": "Olá, Lucas! Sou a Sofia, sua consultora financeira digital do Bradesco. Como posso te ajudar hoje?"
    })

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

if prompt := st.chat_input("Pergunte sobre seus investimentos..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Sofia está pensando..."):
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                system=SYSTEM_PROMPT,
                messages=st.session_state.messages,
            )
            reply = response.content[0].text
            st.write(reply)
            st.session_state.messages.append({"role": "assistant", "content": reply})
