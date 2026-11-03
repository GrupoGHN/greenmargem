import { APPS_SCRIPT_URL, CANTON_FASES, CORTE_IMERSAO, CORTE_IMPORTAR, WHATSAPP } from "@/config/content";

// diagnóstico de 4 passos (03/11): objetivo, empresa, o caso de cada objetivo e contato.
// O passo 3 traz para o formulário o que antes só se perguntava na ligação (produto, Radar, margem por pedido).
export const OBJETIVOS = {
  imersao: "Ir à Canton Fair 2027 com a gente",
  importar: "Importar direto da China",
  vender: "Vender com mais margem no marketplace",
} as const;
export type Objetivo = keyof typeof OBJETIVOS;

export const FATURAMENTO = [
  "Ainda não possuo empresa", "R$ 0 a 50 mil", "R$ 50 mil a 200 mil", "R$ 200 mil a 500 mil",
  "R$ 500 mil a 1 milhão", "R$ 1 milhão a 5 milhões", "R$ 5 milhões a 20 milhões", "Acima de R$ 20 milhões",
];
export const SEM_EMPRESA = FATURAMENTO[0];

export const CANAIS = ["Mercado Livre", "Shopee", "TikTok Shop", "Shein", "Temu", "Loja física", "Site próprio", "Atacado"];
export const NAO_VENDE = "Ainda não vendo";
const MARKETPLACES = CANAIS.slice(0, 5);
export const COMPRA = ["Compro de fornecedor no Brasil", "Compro de quem importa da China", "Importo direto da fábrica", "Fabrico o meu produto"];

// fase = índice em CANTON_FASES (conferidas em cantonfair.org.cn, 31/10); -1 quando o produto não diz a fase
export const CATEGORIAS: { rotulo: string; fase: number }[] = [
  { rotulo: "Eletrônicos, eletrodomésticos, iluminação e ferramentas", fase: 0 },
  { rotulo: "Casa, cozinha, decoração, presentes e móveis", fase: 1 },
  { rotulo: "Moda, calçados, bolsas, brinquedos, bebê e saúde", fase: 2 },
  { rotulo: "Outro tipo de produto", fase: -1 },
  { rotulo: "Ainda não sei", fase: -1 },
];
export const VIAGEM = ["Só eu", "Eu e mais uma pessoa", "Três pessoas ou mais"];
export const RADAR = ["Sim, já tem", "Ainda não", "Não sei o que é"];
export const MARGEM = ["Sei, produto por produto", "Sei por cima", "Não sei"];
export const REGIME = ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Não sei"];
export const HORARIO = ["Manhã", "Tarde", "Noite"];

export type Answers = {
  objetivo: Objetivo | "";
  empresa: string;
  faturamento: string;
  canais: string[];
  compra: string;
  categoria: string;
  viagem: string;
  radar: string;
  margem: string;
  regime: string;
  corte: "" | "sim" | "nao";
  quer: string;
  nome: string;
  whatsapp: string;
  email: string;
  horario: string;
  consentimento: boolean;
  origem: string;
  hp: string; // campo escondido: robô preenche, gente não
};

export const emptyAnswers = (): Answers => ({
  objetivo: "", empresa: "", faturamento: "", canais: [], compra: "", categoria: "", viagem: "", radar: "", margem: "", regime: "",
  corte: "", quer: "", nome: "", whatsapp: "", email: "", horario: "", consentimento: false, origem: "site", hp: "",
});

export const semEmpresa = (a: Answers) => a.faturamento === SEM_EMPRESA;
export const vende = (a: Answers) => a.canais.some((c) => c !== NAO_VENDE);

// quais perguntas do passo 3 aparecem; o formulário e a validação leem daqui
export const pergunta = {
  categoria: (a: Answers) => a.objetivo === "imersao" || a.objetivo === "importar",
  viagem: (a: Answers) => a.objetivo === "imersao",
  radar: (a: Answers) => a.objetivo === "importar" && !semEmpresa(a),
  margem: (a: Answers) => a.objetivo === "vender" && vende(a),
  regime: (a: Answers) => a.objetivo === "vender" && !semEmpresa(a),
};

export const faseDe = (a: Answers) => CATEGORIAS.find((c) => c.rotulo === a.categoria)?.fase ?? -1;

// "Fase 2 · abril" vira "Fase 2, em abril"; "Fase 3 · início de maio" vira "Fase 3, no início de maio"
export function faseTexto(f: number) {
  const [nome, quando] = CANTON_FASES[f][0].split(" · ");
  return `${nome}, ${quando.startsWith("início") ? "no" : "em"} ${quando}`;
}

export const precisaCorte = (a: Answers) => a.objetivo === "imersao" || a.objetivo === "importar";

export const corteDe = (a: Answers) => (a.objetivo === "imersao" ? CORTE_IMERSAO : CORTE_IMPORTAR);

export function valorCorte(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toLocaleString("pt-BR")} ${v >= 2_000_000 ? "milhões" : "milhão"}`;
  return `R$ ${(v / 1000).toLocaleString("pt-BR")} mil`;
}

export const perguntaCorte = (a: Answers) =>
  a.objetivo === "imersao"
    ? `Você ou sua empresa têm a partir de ${valorCorte(corteDe(a))} para investir na imersão na China, fora a passagem?`
    : `Você ou sua empresa têm a partir de ${valorCorte(corteDe(a))} para investir na primeira importação?`;

export type Saida = "imersao" | "imersao-sem-caixa" | "importar" | "importar-sem-caixa" | "vender";

export function saida(a: Answers): Saida {
  if (a.objetivo === "imersao") return a.corte === "sim" ? "imersao" : "imersao-sem-caixa";
  if (a.objetivo === "importar") return a.corte === "sim" ? "importar" : "importar-sem-caixa";
  return "vender";
}

// o que as respostas já mostram, na tela final; só regra, a partir do que a pessoa marcou
export function achados(a: Answers): [string, string][] {
  const out: [string, string][] = [];
  const f = faseDe(a);
  if (a.objetivo === "imersao" && f >= 0)
    out.push([`A sua fase da feira: ${faseTexto(f)}`, "Cada fase tem um tipo de produto. Ir na fase errada é perder a viagem."]);
  if (a.objetivo === "imersao" && f < 0 && a.categoria)
    out.push(["A fase da feira sai do produto", "São 3 fases, uma para cada tipo de produto. É a primeira coisa que a gente define com você."]);
  if (precisaCorte(a) && semEmpresa(a))
    out.push(["Para importar, precisa de empresa", "A importação sai no CNPJ, habilitado no Radar da Receita Federal."]);
  if (a.objetivo === "importar" && !semEmpresa(a) && a.radar && a.radar !== RADAR[0])
    out.push(["O Radar vem antes do pedido", "A importação sai no CNPJ habilitado no Radar da Receita Federal. É o primeiro passo, antes de pagar qualquer fornecedor."]);
  if (a.compra === COMPRA[1])
    out.push(["Você compra de quem importa", "Cada intermediário no caminho fica com uma parte da margem."]);
  if (pergunta.margem(a) && a.margem && a.margem !== MARGEM[0])
    out.push(["A margem se mede por pedido", "Comissão, frete, imposto, anúncio, devolução e embalagem saem de cada venda. A conta certa sai do extrato da plataforma."]);
  const mk = a.canais.filter((c) => MARKETPLACES.includes(c)).length;
  if (a.objetivo === "vender" && mk >= 2)
    out.push([`Você vende em ${mk} marketplaces`, "Cada um tem a sua comissão e o seu frete. O mesmo produto tem uma margem diferente em cada um."]);
  if (pergunta.regime(a) && a.regime === "Não sei")
    out.push(["O regime muda o imposto de cada pedido", "Imposto é um dos maiores custos da venda, e a alíquota depende do regime da empresa."]);
  return out;
}

export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const phoneOk = (v: string) => /^\d{10,11}$/.test(v.replace(/\D/g, ""));
export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function buildMessage(a: Answers) {
  const lines = ["Olá! Fiz o diagnóstico no site da Green Margem.", `Quero: ${a.objetivo ? OBJETIVOS[a.objetivo] : ""}`];
  if (a.empresa.trim()) lines.push(`Empresa: ${a.empresa.trim()}`);
  lines.push(`Faturamento mensal: ${a.faturamento}`, `Vendo em: ${a.canais.join(", ")}`);
  if (a.compra) lines.push(`De onde vem o produto: ${a.compra.charAt(0).toLowerCase() + a.compra.slice(1)}`);
  if (pergunta.categoria(a)) lines.push(`Tipo de produto: ${a.categoria}`);
  if (pergunta.viagem(a)) lines.push(`Na viagem: ${a.viagem}`);
  if (pergunta.radar(a)) lines.push(`Radar da Receita: ${a.radar}`);
  if (pergunta.margem(a)) lines.push(`Sei a margem por pedido: ${a.margem}`);
  if (pergunta.regime(a)) lines.push(`Regime: ${a.regime}`);
  if (precisaCorte(a)) lines.push(`Tenho ${valorCorte(corteDe(a))} ou mais para investir: ${a.corte === "sim" ? "sim" : "não"}`);
  if (a.quer.trim()) lines.push(`${a.objetivo === "vender" ? "O que mais incomoda" : "Produto que quero trazer"}: ${a.quer.trim()}`);
  lines.push(`Nome: ${a.nome.trim()}`, `E-mail: ${a.email.trim()}`);
  if (a.horario) lines.push(`Melhor horário: ${a.horario.toLowerCase()}`);
  return lines.join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// manda pro Apps Script; sem URL ou com erro de rede, devolve false e a tela final pede o envio pelo WhatsApp
export async function enviarDiagnostico(a: Answers): Promise<boolean> {
  if (!APPS_SCRIPT_URL || a.hp) return false;
  const f = faseDe(a);
  const payload = {
    v: 2, enviadoEm: new Date().toISOString(), pagina: location.href, origem: a.origem,
    objetivo: a.objetivo, objetivoTexto: a.objetivo ? OBJETIVOS[a.objetivo] : "",
    empresa: a.empresa.trim(), faturamento: a.faturamento, canais: a.canais.join(", "), compra: a.compra,
    categoria: pergunta.categoria(a) ? a.categoria : "", fase: pergunta.categoria(a) && f >= 0 ? CANTON_FASES[f][0] : "",
    viagem: pergunta.viagem(a) ? a.viagem : "", radar: pergunta.radar(a) ? a.radar : "",
    margem: pergunta.margem(a) ? a.margem : "", regime: pergunta.regime(a) ? a.regime : "",
    corte: precisaCorte(a) ? a.corte : "", corteValor: precisaCorte(a) ? corteDe(a) : 0, quer: a.quer.trim(),
    nome: a.nome.trim(), whatsapp: a.whatsapp.replace(/\D/g, ""), email: a.email.trim(), horario: a.horario, consentimento: a.consentimento,
  };
  try {
    // no-cors: o Apps Script não devolve CORS; a resposta fica opaca, mas o POST chega
    await fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    return true;
  } catch {
    return false;
  }
}

export type IrPara = { objetivo?: Objetivo; origem?: string };

export function goToForm(objetivo?: Objetivo, origem?: string) {
  window.dispatchEvent(new CustomEvent<IrPara>("gm:objetivo", { detail: { objetivo, origem } }));
  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
}
