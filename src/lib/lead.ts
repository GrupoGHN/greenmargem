import { APPS_SCRIPT_URL, CORTE_INVESTIMENTO, WHATSAPP } from "@/config/content";

// diagnóstico de 3 passos (31/10, molde do formulário da China Link): objetivo, empresa e contato
export const OBJETIVOS = {
  imersao: "Ir à China com a gente na Canton Fair 2027",
  importar: "Importar da China pela primeira vez",
  vender: "Vender com mais margem no marketplace",
} as const;
export type Objetivo = keyof typeof OBJETIVOS;

export const FATURAMENTO = [
  "Ainda não possuo empresa", "R$ 0 a 50 mil", "R$ 50 mil a 200 mil", "R$ 200 mil a 500 mil",
  "R$ 500 mil a 1 milhão", "R$ 1 milhão a 5 milhões", "R$ 5 milhões a 20 milhões", "Acima de R$ 20 milhões",
];
export const SEM_EMPRESA = FATURAMENTO[0];
export const JA_IMPORTOU = ["Nunca", "Já, comprando de quem importa", "Já, direto da fábrica"];

export type Answers = {
  objetivo: Objetivo | "";
  empresa: string;
  faturamento: string;
  jaImportou: string;
  corte: "" | "sim" | "nao";
  quer: string;
  nome: string;
  whatsapp: string;
  email: string;
  consentimento: boolean;
  origem: string;
  hp: string; // campo escondido: robô preenche, gente não
};

export const emptyAnswers = (): Answers => ({
  objetivo: "", empresa: "", faturamento: "", jaImportou: "", corte: "", quer: "",
  nome: "", whatsapp: "", email: "", consentimento: false, origem: "site", hp: "",
});

export const precisaCorte = (a: Answers) => a.objetivo === "imersao" || a.objetivo === "importar";

export function valorCorte(v = CORTE_INVESTIMENTO) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toLocaleString("pt-BR")} ${v >= 2_000_000 ? "milhões" : "milhão"}`;
  return `R$ ${(v / 1000).toLocaleString("pt-BR")} mil`;
}

export const perguntaCorte = (a: Answers) =>
  a.objetivo === "imersao"
    ? `Você ou sua empresa têm a partir de ${valorCorte()} para investir na viagem de compras à China?`
    : `Você ou sua empresa têm a partir de ${valorCorte()} para investir na primeira importação?`;

export type Saida = "imersao" | "imersao-sem-caixa" | "importar" | "importar-sem-caixa" | "vender";

export function saida(a: Answers): Saida {
  if (a.objetivo === "imersao") return a.corte === "sim" ? "imersao" : "imersao-sem-caixa";
  if (a.objetivo === "importar") return a.corte === "sim" ? "importar" : "importar-sem-caixa";
  return "vender";
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
  lines.push(`Faturamento mensal: ${a.faturamento}`, `Já importei: ${a.jaImportou}`);
  if (precisaCorte(a)) lines.push(`Tenho ${valorCorte()} ou mais para investir: ${a.corte === "sim" ? "sim" : "não"}`);
  if (a.quer.trim()) lines.push(`Quero trazer ou resolver: ${a.quer.trim()}`);
  lines.push(`Nome: ${a.nome.trim()}`, `E-mail: ${a.email.trim()}`);
  return lines.join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// manda pro Apps Script; sem URL ou com erro de rede, devolve false e a tela final pede o envio pelo WhatsApp
export async function enviarDiagnostico(a: Answers): Promise<boolean> {
  if (!APPS_SCRIPT_URL || a.hp) return false;
  const payload = {
    v: 1, enviadoEm: new Date().toISOString(), pagina: location.href, origem: a.origem,
    objetivo: a.objetivo, objetivoTexto: a.objetivo ? OBJETIVOS[a.objetivo] : "",
    empresa: a.empresa.trim(), faturamento: a.faturamento, jaImportou: a.jaImportou,
    corte: precisaCorte(a) ? a.corte : "", corteValor: CORTE_INVESTIMENTO, quer: a.quer.trim(),
    nome: a.nome.trim(), whatsapp: a.whatsapp.replace(/\D/g, ""), email: a.email.trim(), consentimento: a.consentimento,
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
