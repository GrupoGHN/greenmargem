// Constantes da página. Troque aqui.
export const WHATSAPP = "5511963680529";
export const INSTAGRAM = "https://www.instagram.com/greenmargem/";
export const GUANXI_FORM = "https://forms.gle/kJCmwUDveYPQdnUU9";

// diagnóstico (31/10): as respostas vão por POST pro Apps Script (apps-script/diagnostico.gs), que grava na planilha e manda e-mail ao time.
// Enquanto a URL estiver vazia, o lead manda o resumo pelo WhatsApp.
// 03/11: app da Web "Diagnóstico GM", preso à planilha "Green Margem · Respostas dos formulários", aba "Diagnóstico site"
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzv3LPxqtItSspLDXSAm-ODxuzL_Z-TYedXpPYlo5iP1bBsrZ8rSIAG4A7IpMrd0W9N/exec";
// pergunta de corte: a imersão da GM custa a partir de R$ 50 mil, fora a passagem (Greg, 31/10);
// a primeira importação segue a referência da China Link
export const CORTE_IMERSAO = 50_000;
export const CORTE_IMPORTAR = 100_000;

// medição: só liga (com aviso de cookies) quando um destes IDs for preenchido
export const META_PIXEL_ID = "";
export const GA4_ID = "";

export const EMPRESA = { razao: "GREEN MARGEM ASSESSORIA E TREINAMENTO LTDA", cnpj: "69.373.825/0001-58" };

// 03/11 (Greg): o time não tem gente para chamar cada lead nem faz diagnóstico por ligação.
// Quem preenche vai para o grupo da Green Margem no WhatsApp; só a imersão com o valor de corte recebe contato individual.
export const GRUPO_WHATSAPP = "https://chat.whatsapp.com/JEX5gskrv9IGANv3EkPRq4";

export const CANTON_FASES: [string, string][] = [
  ["Fase 1 · abril", "Eletrônicos, eletrodomésticos, iluminação, máquinas, ferramentas, veículos e peças."],
  ["Fase 2 · abril", "Utilidades domésticas, cozinha, decoração, presentes, móveis e materiais de construção."],
  ["Fase 3 · início de maio", "Moda, tecidos, calçados, bolsas, brinquedos, bebê, escritório, saúde e alimentos."],
];

export const CANTON_ETAPAS: [string, string[]][] = [
  ["Antes", ["Produto escolhido pela conta", "A fase certa da feira", "Custo total simulado (produto, frete, impostos e câmbio)", "Lista de fornecedores para visitar", "Orientação de visto e carta-convite", "Agenda dos dias"]],
  ["Durante", ["A gente vai estar na feira em 2027", "O que perguntar a cada fábrica", "Como comparar preço, pedido mínimo e prazo", "O que pedir de amostra"]],
  ["Depois", ["Amostra, contrato e proforma", "Pagamento seguro por câmbio", "Frete, despachante e alfândega", "Primeiro pedido acompanhado até o seu estoque"]],
];

// números da feira conferidos em cantonfair.org.cn em 31/10/2026 (140ª edição); só entra aqui o que foi conferido
export const CANTON_FATOS = ["Em Guangzhou, duas edições por ano", "13 categorias e 54 seções de exposição", "3 fases, uma para cada tipo de produto"];

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
  ["Quanto custa?", "Depende do serviço e do tamanho da operação. O diagnóstico do site é gratuito."],
  ["Em quais marketplaces vocês atuam?", "Mercado Livre, Shopee, TikTok Shop, Shein e Temu."],
];

export const OLHAMOS = [
  "Margem real por produto", "Precificação por marketplace", "ADS com lucro", "Estrutura tributária",
  "Custo de importação", "Fornecedor e amostra", "Estoque e dinheiro parado", "Processo e expedição",
];
