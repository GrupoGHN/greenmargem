import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Factory, Handshake, Instagram, MessageCircle, TrendingUp } from "lucide-react";
import { CANTON_ETAPAS, CANTON_FATOS, GUANXI_FORM, INSTAGRAM, PRAZO_CONTATO } from "@/config/content";
import {
  FATURAMENTO, JA_IMPORTOU, OBJETIVOS, SEM_EMPRESA, buildMessage, emailOk, emptyAnswers, enviarDiagnostico, maskPhone,
  corteDe, perguntaCorte, phoneOk, precisaCorte, saida, valorCorte, whatsappUrl, type Answers, type IrPara, type Objetivo,
} from "@/lib/lead";
import { medirLead } from "@/components/CookieBanner";

const base = import.meta.env.BASE_URL;

function Single({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)} className="option">
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${value === o ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
            {value === o && <Check size={12} strokeWidth={3} />}
          </span>
          {o}
        </button>
      ))}
    </div>
  );
}

const Rotulo = ({ children, opcional }: { children: string; opcional?: boolean }) => (
  <span className="mb-2 block text-sm font-semibold">{children}{opcional && <span className="font-normal text-muted-foreground"> (opcional)</span>}</span>
);

export function LeadForm() {
  const [a, setA] = useState<Answers>(emptyAnswers);
  const [i, setI] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState<boolean | null>(null); // null = ainda no formulário
  const topo = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const h = (e: Event) => {
      const { objetivo, origem } = (e as CustomEvent<IrPara>).detail ?? {};
      if (!objetivo && !origem) return; // botão genérico: não apaga o que a pessoa já respondeu
      setA((p) => ({ ...p, ...(objetivo ? { objetivo } : {}), ...(origem ? { origem } : {}) }));
      if (objetivo) { setEnviado(null); setI(0); }
    };
    window.addEventListener("gm:objetivo", h);
    return () => window.removeEventListener("gm:objetivo", h);
  }, []);

  const corte = precisaCorte(a);
  const valid = [
    !!a.objetivo,
    !!a.faturamento && (a.empresa.trim().length > 1 || a.faturamento === SEM_EMPRESA) && !!a.jaImportou && (!corte || !!a.corte),
    a.nome.trim().length > 2 && phoneOk(a.whatsapp) && emailOk(a.email) && a.consentimento,
  ][i];

  const enviar = async () => {
    setEnviando(true);
    const ok = await enviarDiagnostico(a);
    setEnviando(false);
    setEnviado(ok);
    medirLead(a.objetivo);
    requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const next = () => { if (!valid || enviando) return; if (i === 2) void enviar(); else setI(i + 1); };

  if (enviado !== null) return <div ref={topo} className="scroll-mt-24"><Resultado a={a} enviado={enviado} revisar={() => { setEnviado(null); setI(2); }} /></div>;

  const titulos = ["O que você quer agora?", "Sobre a sua empresa", "Seus dados para contato"];
  return (
    <div ref={topo} className="scroll-mt-24">
      <form className="card-gm p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((n) => <div key={n} className={`h-1.5 rounded-full ${n <= i ? "bg-primary" : "bg-background"}`} />)}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Passo {i + 1} de 3</p>
        </div>
        <h3 className="heading mb-5 text-2xl sm:text-3xl">{titulos[i]}</h3>

        {i === 0 && (
          <>
            <Single label="Objetivo" options={Object.values(OBJETIVOS)} value={a.objetivo ? OBJETIVOS[a.objetivo] : ""}
              onChange={(v) => set("objetivo", (Object.keys(OBJETIVOS) as Objetivo[]).find((k) => OBJETIVOS[k] === v) ?? "")} />
            <p className="mt-4 text-sm text-proof">A gente opera 16 lojas próprias e compra direto de fábrica na China.</p>
          </>
        )}

        {i === 1 && (
          <div className="grid gap-5">
            <label className="block">
              <Rotulo>Qual o nome da sua empresa?</Rotulo>
              <input className="field" placeholder={a.faturamento === SEM_EMPRESA ? "Se ainda não tem, pode deixar em branco" : "Nome da empresa ou da loja"}
                autoComplete="organization" value={a.empresa} onChange={(e) => set("empresa", e.target.value)} />
            </label>
            <label className="block">
              <Rotulo>Qual o faturamento mensal da sua empresa?</Rotulo>
              <select className="field [color-scheme:dark]" value={a.faturamento} onChange={(e) => set("faturamento", e.target.value)}>
                <option value="" disabled>Selecione</option>
                {FATURAMENTO.map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
            <div>
              <Rotulo>Você já importou da China?</Rotulo>
              <Single label="Já importou" options={JA_IMPORTOU} value={a.jaImportou} onChange={(v) => set("jaImportou", v)} />
            </div>
            {corte && (
              <div>
                <Rotulo>{perguntaCorte(a)}</Rotulo>
                <Single label="Investimento" options={[`Sim, temos ${valorCorte(corteDe(a))} ou mais`, `Não, temos menos que ${valorCorte(corteDe(a))}`]}
                  value={a.corte === "sim" ? `Sim, temos ${valorCorte(corteDe(a))} ou mais` : a.corte === "nao" ? `Não, temos menos que ${valorCorte(corteDe(a))}` : ""}
                  onChange={(v) => set("corte", v.startsWith("Sim") ? "sim" : "nao")} />
              </div>
            )}
            <label className="block">
              <Rotulo opcional>O que você quer trazer ou resolver?</Rotulo>
              <input className="field" maxLength={200} placeholder="Ex.: utilidades domésticas, margem na Shopee" value={a.quer} onChange={(e) => set("quer", e.target.value)} />
            </label>
          </div>
        )}

        {i === 2 && (
          <div className="grid gap-5">
            <label className="block">
              <Rotulo>Qual o seu nome completo?</Rotulo>
              <input className="field" autoComplete="name" placeholder="Seu nome completo" value={a.nome} onChange={(e) => set("nome", e.target.value)} />
            </label>
            <label className="block">
              <Rotulo>WhatsApp com DDD</Rotulo>
              <input className="field" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 91234-5678" value={a.whatsapp} onChange={(e) => set("whatsapp", maskPhone(e.target.value))} />
              <span className="mt-1.5 block text-xs text-muted-foreground">DDD e número, sem o 55.</span>
            </label>
            <label className="block">
              <Rotulo>Qual o seu e-mail?</Rotulo>
              <input className="field" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={a.email} onChange={(e) => set("email", e.target.value)} />
            </label>
            {/* campo escondido contra robô */}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={a.hp} onChange={(e) => set("hp", e.target.value)} />
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--primary)]" checked={a.consentimento} onChange={(e) => set("consentimento", e.target.checked)} />
              <span className="text-muted-foreground">
                Autorizo a Green Margem a usar estes dados para falar comigo sobre o que eu pedi. <a href={`${base}privacidade/`} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">Política de privacidade</a>
              </span>
            </label>
          </div>
        )}

        <div className="mt-7 flex gap-3">
          {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="btn-outline"><ArrowLeft size={18} />Voltar</button>}
          <button type="submit" disabled={!valid || enviando} className="btn-primary flex-1">
            {i < 2 ? "Continuar" : enviando ? "Enviando..." : "Enviar"}<ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

// tela final (31/10): molde da página de agradecimento da China Link, com o texto e os números verdadeiros da GM
function Resultado({ a, enviado, revisar }: { a: Answers; enviado: boolean; revisar: () => void }) {
  const s = saida(a);
  const wa = whatsappUrl(buildMessage(a));
  const semCaixa = s === "imersao-sem-caixa" || s === "importar-sem-caixa";

  const titulo: Record<typeof s, string> = {
    imersao: "Sua empresa foi classificada para o atendimento da imersão",
    importar: "Sua empresa foi classificada para o atendimento da primeira importação",
    vender: "Você entrou na lista da turma de 2027",
    "imersao-sem-caixa": "A viagem ainda não é o primeiro passo",
    "importar-sem-caixa": "Primeiro a conta, depois o pedido",
  };
  const texto: Record<typeof s, string> = {
    imersao: "Pelo que você respondeu, o seu perfil é para a viagem à Canton Fair 2027 com a gente.",
    importar: "Pelo que você respondeu, dá pra planejar a sua primeira importação com a gente.",
    vender: "A turma de marketplace da Green Margem começa em 2027. Quem está na lista fica sabendo primeiro.",
    "imersao-sem-caixa": `A imersão começa em ${valorCorte(corteDe(a))}, fora a passagem, e ainda pede caixa para o primeiro pedido. Antes da viagem, o mais seguro é começar pela conta e por um pedido menor.`,
    "importar-sem-caixa": `Com menos de ${valorCorte(corteDe(a))}, o risco é o caixa acabar antes do segundo pedido. Comece pela conta completa: produto, frete, impostos e câmbio.`,
  };

  const ultimo = s === "imersao" ? "Planejamento da viagem" : "Planejamento da importação";
  const passos: [string, string?][] = [[enviado ? "Solicitação enviada" : "Diagnóstico respondido"]];
  if (!enviado) passos.push(["Enviar o resumo no WhatsApp", "Agora"]);
  if (s === "vender") passos.push(["Você fica na lista da turma de 2027"], ["A gente avisa quando a turma abrir"]);
  else passos.push(["Contato do time pelo WhatsApp", enviado ? PRAZO_CONTATO : undefined], ["Diagnóstico da sua operação"], [ultimo]);

  // sem o envio automático (URL vazia ou erro de rede), o WhatsApp é o passo que falta e vai logo abaixo do título
  const adiantar = (
    <div className={`card-gm ${enviado ? "p-6 sm:p-8" : "mt-6 border-primary bg-background p-5 sm:p-6"}`}>
      <h4 className="heading text-2xl">{enviado ? "Quer adiantar?" : "Falta um passo"}</h4>
      <p className="mt-2 text-muted-foreground">
        {enviado
          ? "Mande o seu resumo no WhatsApp. É você quem envia, e o time responde por lá."
          : "Para o time receber o seu diagnóstico, envie o resumo no WhatsApp. A mensagem já vai pronta, e você revisa antes de mandar."}
      </p>
      <a href={wa} target="_blank" rel="noreferrer" className={`${enviado && semCaixa ? "btn-outline" : "btn-primary"} mt-5 w-full py-4 text-base`}>
        <MessageCircle size={20} />{enviado ? (semCaixa ? "Quero conversar mesmo assim" : "Adiantar meu atendimento") : "Enviar meu diagnóstico no WhatsApp"}
      </a>
      {a.origem === "guanxi" && <a href={GUANXI_FORM} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">Preencher a ficha do Clube Guanxi</a>}
    </div>
  );

  return (
    <div className="grid gap-4">
      <div className="card-gm p-6 sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={26} strokeWidth={3} /></span>
        <p className="eyebrow mt-5">{enviado ? "Diagnóstico enviado" : "Diagnóstico pronto"}</p>
        <h3 className="heading mt-2 text-3xl sm:text-4xl">{titulo[s]}</h3>
        <p className="mt-3 text-muted-foreground">{texto[s]}</p>
        {!enviado && adiantar}

        {!semCaixa && (
          <>
            <h4 className="heading mt-8 text-xl">O que acontece a partir de agora</h4>
            <ol className="mt-4 grid gap-0">
              {passos.map(([t, quando], n) => {
                const feito = n === 0;
                return (
                  <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                    {n < passos.length - 1 && <span className="absolute left-[1.05rem] top-9 bottom-0 w-px bg-border" aria-hidden />}
                    <span className={`heading grid h-9 w-9 shrink-0 place-items-center rounded-full border text-base ${feito ? "border-primary bg-primary text-primary-foreground" : "bg-background"}`}>
                      {feito ? <Check size={16} strokeWidth={3} /> : `0${n + 1}`}
                    </span>
                    <div className="pt-1.5">
                      <p className="font-semibold">{t}</p>
                      {(feito || quando) && <p className="text-sm text-muted-foreground">{feito ? "Concluído" : quando!.charAt(0).toUpperCase() + quando!.slice(1)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
            {s !== "vender" && <p className="mt-5 text-sm text-proof">Quem chama você é o time que opera 16 lojas próprias e compra direto de fábrica na China.</p>}
          </>
        )}

        {semCaixa && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-primary"><Instagram size={18} />Ver o conteúdo grátis</a>
          </div>
        )}
      </div>

      {/* adiantar: é o lead quem manda a mensagem; nada automático da Green Margem */}
      {enviado && adiantar}

      {s === "imersao" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [Handshake, "Negociação direta com o fabricante", "Sem intermediário no meio da conta."],
              [TrendingUp, "Tendência antes do mercado", "Na feira você vê o que ainda não chegou às lojas daqui."],
              [Factory, "A fábrica de perto", "Muitas fábricas ficam a poucas horas da feira. A visita mostra o que o estande esconde."],
            ].map(([Icone, t, d]) => {
              const I = Icone as typeof Handshake;
              return (
                <div key={t as string} className="card-gm p-5">
                  <I size={22} className="text-primary" />
                  <p className="heading mt-3 text-xl">{t as string}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {CANTON_ETAPAS.map(([t, itens], n) => (
              <div key={t} className="card-gm p-5">
                <p className="heading text-xl"><span className="text-primary">0{n + 1}</span> {t === "Antes" ? "Pré-viagem" : t === "Durante" ? "Na feira" : "Pós-viagem"}</p>
                <ul className="mt-3 grid gap-2">
                  {itens.slice(0, 3).map((x) => <li key={x} className="flex gap-2 text-sm text-muted-foreground"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {!semCaixa && (
        <div className="card-gm p-6 sm:p-8">
          <p className="eyebrow">Canton Fair 2027</p>
          <h4 className="heading mt-2 text-2xl sm:text-3xl">A feira onde a China mostra o que fabrica</h4>
          <ul className="mt-4 grid gap-2">
            {[...CANTON_FATOS, "Primavera de 2027: abril e maio. A data oficial sai no site da feira."].map((f) => (
              <li key={f} className="flex gap-2.5 text-muted-foreground"><Check size={18} className="mt-0.5 shrink-0 text-primary" />{f}</li>
            ))}
          </ul>
          <a href="#canton" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline underline-offset-4">Ver o planejamento da Canton Fair<ArrowRight size={16} /></a>
          <p className="mt-4 text-xs text-muted-foreground">Fonte: cantonfair.org.cn, 140ª edição, consultado em 31/10/2026.</p>
        </div>
      )}

      <button type="button" onClick={revisar} className="justify-self-start text-sm text-muted-foreground underline underline-offset-4">Revisar respostas</button>
    </div>
  );
}
