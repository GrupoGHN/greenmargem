import { OBJ, WHATSAPP } from "@/config/content";

export type Answers = {
  objetivo: string;
  empresa: string;
  canais: string[];
  faturamento: string;
  investimento: string;
  produto: string;
  quando: string;
  nome: string;
  loja: string;
  whatsapp: string;
  detalhes: string;
};

export const emptyAnswers = (): Answers => ({
  objetivo: "", empresa: "", canais: [], faturamento: "", investimento: "", produto: "",
  quando: "", nome: "", loja: "", whatsapp: "", detalhes: "",
});

export const needsInvestment = (a: Answers) => a.objetivo === OBJ.importar || a.objetivo === OBJ.canton;

export const stepsFor = (a: Answers) =>
  ["p1", "p2", "p3", "p4", ...(needsInvestment(a) ? ["p5"] : []), "p6", "p7"];

export const isNotNow = (a: Answers) =>
  (a.empresa === "Ainda não tenho empresa" && a.faturamento === "Ainda não faturo") ||
  a.quando === "Só estou pesquisando";

export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function buildMessage(a: Answers) {
  const lines = ["Olá! Vim pela página da Green Margem.", `Objetivo: ${a.objetivo}`, `Empresa: ${a.empresa}`,
    `Onde vendo: ${a.canais.join(", ")}`, `Faturamento: ${a.faturamento}`];
  if (needsInvestment(a)) {
    if (a.investimento) lines.push(`Investimento: ${a.investimento}`);
    if (a.produto.trim()) lines.push(`Produto: ${a.produto.trim()}`);
  }
  lines.push(`Quando: ${a.quando}`, `Nome: ${a.nome.trim()}`);
  if (a.loja.trim()) lines.push(`Empresa/loja: ${a.loja.trim()}`);
  if (a.detalhes.trim()) lines.push(`Mais detalhes: ${a.detalhes.trim()}`);
  return lines.join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export function goToForm(objetivo?: string) {
  if (objetivo) window.dispatchEvent(new CustomEvent("gm:objetivo", { detail: objetivo }));
  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
}
