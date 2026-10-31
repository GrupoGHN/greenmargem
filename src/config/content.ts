// Constantes da página. Troque aqui.
export const WHATSAPP = "5511963680529";
export const INSTAGRAM = "https://www.instagram.com/greenmargem/";
export const GUANXI_FORM = "https://forms.gle/kJCmwUDveYPQdnUU9";

export const OBJ = {
  vender: "Vender mais com margem no marketplace",
  importar: "Importar da China",
  canton: "Planejar a Canton Fair 2027",
  guanxi: "Entrar no Clube Guanxi",
} as const;

export const MARKETPLACES = ["Mercado Livre", "Shopee", "TikTok Shop", "Shein", "Temu"];

// capa real de cada carrossel; post ainda não publicado aponta pro perfil (trocar pelo link do post quando sair)
export const CONTEUDOS: { titulo: string; capa: string; url: string }[] = [
  { titulo: "5 passos para importar pela primeira vez", capa: "conteudo/cinco-passos.webp", url: INSTAGRAM },
  { titulo: "O que perguntar antes de pagar o fornecedor chinês", capa: "conteudo/perguntas-fornecedor.webp", url: INSTAGRAM },
  { titulo: "Quando o chinês diz sim, mas é não", capa: "conteudo/sim-era-nao.webp", url: "https://www.instagram.com/greenmargem/p/DfIgVz8Clv0/" },
  { titulo: "7 custos que comem a sua margem", capa: "conteudo/custos-margem.webp", url: INSTAGRAM },
  { titulo: "Guia da Canton Fair: antes, durante e depois", capa: "conteudo/canton-fair.webp", url: INSTAGRAM },
  { titulo: "STF: imposto em cima do benefício de ICMS", capa: "conteudo/stf-icms.webp", url: "https://www.instagram.com/greenmargem/p/DfIBUaHCOq3/" },
];

// fotos reais do galpão (vídeos da GHN de abr e ago/2026, com o LUT da DJI); sem placa, endereço, nota ou etiqueta de cliente
export const OPERACAO: { foto: string; legenda: string }[] = [
  { foto: "operacao/chegada.webp", legenda: "A mercadoria chegando" },
  { foto: "operacao/estoque.webp", legenda: "O estoque" },
  { foto: "operacao/separacao.webp", legenda: "A separação" },
  { foto: "operacao/prateleiras.webp", legenda: "As prateleiras das lojas" },
];

export const FAQ: [string, string][] = [
  ["Vocês garantem resultado?", "Não. Resultado a gente não promete. Processo a gente mostra."],
  ["Vocês vendem curso?", "Não. A gente trabalha dentro da sua operação."],
  ["Atendem quem é do Simples Nacional?", "Sim. A maioria dos sellers começa no Simples, e a conta muda conforme o faturamento cresce."],
  ["Preciso ter empresa para importar?", "Sim. A importação sai no CNPJ, habilitado no Radar da Receita Federal. Quem está começando costuma entrar na modalidade limitada. A gente orienta o caminho."],
  ["Quanto preciso para a primeira importação?", "Depende do produto e do frete. A gente faz a conta completa antes de você pagar qualquer fornecedor."],
  ["Quanto custa?", "Depende do serviço e do tamanho da operação. O valor sai depois do diagnóstico, que é gratuito."],
  ["Em quais marketplaces vocês atuam?", "Mercado Livre, Shopee, TikTok Shop, Shein e Temu."],
];

export const OLHAMOS = [
  "Margem real por produto", "Precificação por marketplace", "ADS com lucro", "Estrutura tributária",
  "Custo de importação", "Fornecedor e amostra", "Estoque e dinheiro parado", "Processo e expedição",
];
