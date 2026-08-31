// Base de conhecimento do agente — dados mockados do cliente e produtos
// Esses dados são injetados no system prompt para contextualizar o agente

export const PERFIL_CLIENTE = {
  nome: "Carlos Eduardo Santos",
  idade: 32,
  profissao: "Analista de Sistemas",
  renda_mensal: 8500,
  perfil_investidor: "Moderado",
  objetivos: ["Reserva de Emergência", "Compra de Imóvel em 5 anos", "Aposentadoria"],
  carteira: [
    { produto: "Poupança", valor: 8000, percentual: 18.8 },
    { produto: "CDB Bradesco 100% CDI", valor: 22500, percentual: 52.9 },
    { produto: "Fundo Renda Fixa", valor: 12000, percentual: 28.3 },
  ],
  total_investido: 42500,
  metas: [
    { nome: "Reserva de Emergência", meta: 25500, atual: 8000, prazo: "18 meses" },
    { nome: "Entrada Imóvel", meta: 80000, atual: 34500, prazo: "60 meses" },
  ],
}

export const TRANSACOES_RESUMO = {
  periodo: "junho a agosto 2026",
  gastos_mensais_media: {
    alimentacao: 410,
    moradia: 2135, // aluguel + luz + água + internet
    transporte: 180,
    saude: 350,    // plano + academia + farmácia
    lazer: 67,
    compras: 145,
    investimentos: 500,
  },
  total_gasto_medio_mes: 3787,
  sobra_media_mensal: 4713,
  maior_gasto_categoria: "Moradia (R$ 2.135/mês)",
}

export const PRODUTOS_DISPONIVEIS = [
  {
    nome: "CDB Bradesco",
    categoria: "Renda Fixa",
    rentabilidade: "100% a 115% do CDI",
    liquidez: "diária ou no vencimento",
    minimo: 500,
    garantia_fgc: true,
    risco: "baixo",
    perfil: ["Conservador", "Moderado"],
    tributacao: "IR regressivo (22,5% até 15%)",
  },
  {
    nome: "Tesouro Selic",
    categoria: "Renda Fixa",
    rentabilidade: "100% da Selic",
    liquidez: "diária (D+1)",
    minimo: 30,
    garantia_fgc: false,
    risco: "muito baixo",
    perfil: ["Conservador", "Moderado"],
    tributacao: "IR regressivo (22,5% até 15%)",
  },
  {
    nome: "LCI Bradesco",
    categoria: "Renda Fixa",
    rentabilidade: "88% a 92% do CDI (isenta de IR)",
    liquidez: "no vencimento",
    minimo: 1000,
    garantia_fgc: true,
    risco: "baixo",
    perfil: ["Conservador", "Moderado"],
    tributacao: "Isento de IR para PF",
  },
  {
    nome: "Fundo Multimercado Bradesco",
    categoria: "Fundos",
    rentabilidade: "CDI + 1,5% a 2,5% ao ano (histórico)",
    liquidez: "D+3/D+5",
    minimo: 1000,
    garantia_fgc: false,
    risco: "médio",
    perfil: ["Moderado", "Arrojado"],
    tributacao: "Come-cotas + IR regressivo",
  },
  {
    nome: "Fundo de Ações Bradesco",
    categoria: "Renda Variável",
    rentabilidade: "Variável — histórico 12% a 18% ao ano em 5 anos",
    liquidez: "D+3/D+5",
    minimo: 500,
    garantia_fgc: false,
    risco: "alto",
    perfil: ["Moderado", "Arrojado"],
    tributacao: "IR 15% sobre ganhos",
  },
  {
    nome: "Previdência PGBL Bradesco",
    categoria: "Previdência",
    rentabilidade: "Variável conforme perfil",
    liquidez: "Carência de 12 a 60 meses",
    minimo: 100,
    garantia_fgc: false,
    risco: "variável",
    perfil: ["Conservador", "Moderado", "Arrojado"],
    tributacao: "IR diferido — deduz até 12% da renda bruta",
  },
]

export const HISTORICO_ATENDIMENTO = [
  { data: "Jul/2026", assunto: "Dúvida sobre CDB", resolucao: "Resolvido" },
  { data: "Abr/2026", assunto: "Planejamento para compra de imóvel", resolucao: "Plano criado — aporte de R$500/mês em CDB" },
  { data: "Fev/2026", assunto: "Diferença Tesouro Selic vs IPCA+", resolucao: "Resolvido" },
  { data: "Jan/2026", assunto: "Portabilidade de salário", resolucao: "Portabilidade realizada" },
  { data: "Nov/2025", assunto: "Atualização de perfil investidor", resolucao: "Perfil Moderado confirmado" },
]
