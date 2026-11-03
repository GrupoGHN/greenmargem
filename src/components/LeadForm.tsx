import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Factory, Handshake, Instagram, MessageCircle, TrendingUp, Users } from "lucide-react";
import { CANTON_ETAPAS, CANTON_FATOS, GRUPO_WHATSAPP, GUANXI_FORM, INSTAGRAM } from "@/config/content";
import {
  CANAIS, CATEGORIAS, COMPRA, FATURAMENTO, HORARIO, MARGEM, NAO_VENDE, OBJETIVOS, RADAR, REGIME, SEM_EMPRESA, VIAGEM,
  achados, buildMessage, emailOk, emptyAnswers, enviarDiagnostico, maskPhone, corteDe, pergunta, perguntaCorte, phoneOk,
  precisaCorte, saida, semEmpresa, valorCorte, vende, whatsappUrl, type Answers, type IrPara, type Objetivo,
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

// várias respostas: botões que ligam e desligam, em linha, rápidos de tocar no celular
function Multi({ options, value, onToggle, label }: { options: string[]; value: string[]; onToggle: (v: string) => void; label?: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} onClick={() => onToggle(o)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>
            {on && <Check size={14} strokeWidth={3} />}{o}
          </button>
        );
      })}
    </div>
  );
}

const Rotulo = ({ children, opcional, ajuda }: { children: string; opcional?: boolean; ajuda?: string }) => (
  <span className="mb-2 block">
    <span className="block text-sm font-semibold">{children}{opcional && <span className="font-normal text-muted-foreground"> (opcional)</span>}</span>
    {ajuda && <span className="mt-0.5 block text-xs text-muted-foreground">{ajuda}</span>}
  </span>
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
  const ok = (mostra: (a: Answers) => boolean, v: string) => !mostra(a) || !!v;
  const valid = [
    !!a.objetivo,
    !!a.faturamento && (a.empresa.trim().length > 1 || semEmpresa(a)) && a.canais.length > 0 && (!vende(a) || !!a.compra),
    ok(pergunta.categoria, a.categoria) && ok(pergunta.viagem, a.viagem) && ok(pergunta.radar, a.radar)
      && ok(pergunta.margem, a.margem) && ok(pergunta.regime, a.regime) && (!corte || !!a.corte),
    a.nome.trim().length > 2 && phoneOk(a.whatsapp) && emailOk(a.email) && a.consentimento,
  ][i];

  // "Ainda não vendo" não convive com canal marcado
  const toggleCanal = (c: string) => setA((p) => {
    const tem = p.canais.includes(c);
    const canais = c === NAO_VENDE ? (tem ? [] : [NAO_VENDE])
      : CANAIS.filter((x) => (x === c ? !tem : p.canais.includes(x))); // na ordem da lista, para a ficha sair sempre igual
    return { ...p, canais, compra: canais.some((x) => x !== NAO_VENDE) ? p.compra : "" };
  });

  const enviar = async () => {
    setEnviando(true);
    const ok = await enviarDiagnostico(a);
    setEnviando(false);
    setEnviado(ok);
    medirLead(a.objetivo);
    requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const ULTIMO = 3;
  const next = () => {
    if (!valid || enviando) return;
    if (i === ULTIMO) void enviar();
    else { setI(i + 1); requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
  };

  if (enviado !== null) return <div ref={topo} className="scroll-mt-24"><Resultado a={a} enviado={enviado} revisar={() => { setEnviado(null); setI(ULTIMO); }} /></div>;

  const caso = { imersao: "Sobre a viagem", importar: "Sobre a importação", vender: "Sobre a sua margem" };
  const titulos = ["O que você quer agora?", "Sobre a sua empresa", a.objetivo ? caso[a.objetivo] : "O seu caso", "Seus dados para contato"];
  return (
    <div ref={topo} className="scroll-mt-24">
      <form className="card-gm p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((n) => <div key={n} className={`h-1.5 rounded-full ${n <= i ? "bg-primary" : "bg-background"}`} />)}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Passo {i + 1} de {ULTIMO + 1}</p>
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
              <Rotulo ajuda="Pode marcar mais de um.">Onde você vende hoje?</Rotulo>
              <Multi label="Canais de venda" options={[...CANAIS, NAO_VENDE]} value={a.canais} onToggle={toggleCanal} />
            </div>
            {vende(a) && (
              <div>
                <Rotulo>De onde vem o que você vende?</Rotulo>
                <Single label="Origem do produto" options={COMPRA} value={a.compra} onChange={(v) => set("compra", v)} />
              </div>
            )}
          </div>
        )}

        {i === 2 && (
          <div className="grid gap-5">
            {pergunta.categoria(a) && (
              <div>
                <Rotulo ajuda={a.objetivo === "imersao" ? "A feira tem 3 fases, uma para cada tipo de produto." : undefined}>
                  {a.objetivo === "imersao" ? "O que você quer comprar na feira?" : "Que tipo de produto você quer trazer?"}
                </Rotulo>
                <Single label="Tipo de produto" options={CATEGORIAS.map((c) => c.rotulo)} value={a.categoria} onChange={(v) => set("categoria", v)} />
              </div>
            )}
            {pergunta.viagem(a) && (
              <div>
                <Rotulo>Quem iria na viagem?</Rotulo>
                <Single label="Quem iria" options={VIAGEM} value={a.viagem} onChange={(v) => set("viagem", v)} />
              </div>
            )}
            {pergunta.radar(a) && (
              <div>
                <Rotulo ajuda="É a habilitação que permite a empresa importar.">A sua empresa já tem o Radar da Receita Federal?</Rotulo>
                <Single label="Radar" options={RADAR} value={a.radar} onChange={(v) => set("radar", v)} />
              </div>
            )}
            {pergunta.margem(a) && (
              <div>
                <Rotulo ajuda="Depois de comissão, frete, imposto, anúncio e devolução.">Você sabe quanto sobra em cada pedido?</Rotulo>
                <Single label="Margem por pedido" options={MARGEM} value={a.margem} onChange={(v) => set("margem", v)} />
              </div>
            )}
            {pergunta.regime(a) && (
              <div>
                <Rotulo>Qual o regime de imposto da empresa?</Rotulo>
                <Multi label="Regime" options={REGIME} value={a.regime ? [a.regime] : []} onToggle={(v) => set("regime", a.regime === v ? "" : v)} />
              </div>
            )}
            {corte && (
              <div>
                <Rotulo>{perguntaCorte(a)}</Rotulo>
                <Single label="Investimento" options={[`Sim, temos ${valorCorte(corteDe(a))} ou mais`, `Não, temos menos que ${valorCorte(corteDe(a))}`]}
                  value={a.corte === "sim" ? `Sim, temos ${valorCorte(corteDe(a))} ou mais` : a.corte === "nao" ? `Não, temos menos que ${valorCorte(corteDe(a))}` : ""}
                  onChange={(v) => set("corte", v.startsWith("Sim") ? "sim" : "nao")} />
              </div>
            )}
            <label className="block">
              <Rotulo opcional>{a.objetivo === "vender" ? "O que mais incomoda na sua margem hoje?" : "Qual produto você quer trazer?"}</Rotulo>
              <input className="field" maxLength={200} value={a.quer} onChange={(e) => set("quer", e.target.value)}
                placeholder={a.objetivo === "vender" ? "Ex.: vendo muito e sobra pouco" : "Ex.: garrafa térmica, organizador de cozinha"} />
            </label>
          </div>
        )}

        {i === 3 && (
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
            {a.objetivo === "imersao" && <div>
              <Rotulo opcional>Melhor horário para o time chamar você</Rotulo>
              <Multi label="Melhor horário" options={HORARIO} value={a.horario ? [a.horario] : []} onToggle={(v) => set("horario", a.horario === v ? "" : v)} />
            </div>}
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
            {i < ULTIMO ? "Continuar" : enviando ? "Enviando..." : "Enviar"}<ArrowRight size={18} />
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

  // 03/11 (Greg): só a imersão com o valor de corte fala com o time; todo o resto vai para o grupo da Green Margem
  const individual = s === "imersao";

  const titulo: Record<typeof s, string> = {
    imersao: "Sua empresa foi classificada para a imersão",
    importar: "Seu diagnóstico está pronto",
    vender: "Seu diagnóstico está pronto",
    "imersao-sem-caixa": "A viagem ainda não é o primeiro passo",
    "importar-sem-caixa": "Primeiro a conta, depois o pedido",
  };
  const texto: Record<typeof s, string> = {
    imersao: "Pelo que você respondeu, o seu perfil é para a viagem à Canton Fair 2027 com a gente. Quem fala com você é o time, pelo WhatsApp.",
    importar: `Pelo que você respondeu, dá para planejar a sua importação. Fornecedor, custo e Canton Fair, a gente conversa ${GRUPO_WHATSAPP ? "no grupo da Green Margem, com todo mundo junto" : "no Instagram da Green Margem"}.`,
    vender: `A turma de marketplace da Green Margem começa em 2027. Até lá, conteúdo, avisos e a abertura da turma saem primeiro ${GRUPO_WHATSAPP ? "no grupo" : "no Instagram"}.`,
    "imersao-sem-caixa": `A imersão começa em ${valorCorte(corteDe(a))}, fora a passagem, e ainda pede caixa para o primeiro pedido. Antes da viagem, o mais seguro é começar pela conta e por um pedido menor.`,
    "importar-sem-caixa": `Com menos de ${valorCorte(corteDe(a))}, o risco é o caixa acabar antes do segundo pedido. Comece pela conta completa: produto, frete, impostos e câmbio.`,
  };

  const passos: [string, string?][] = [[enviado ? "Solicitação enviada" : "Diagnóstico respondido"]];
  if (!enviado) passos.push(["Enviar o resumo no WhatsApp", "Agora"]);
  passos.push(["Conversa com o time pelo WhatsApp"], ["Condições e planejamento da viagem"]);
  const vistos = achados(a);
  const quadro = vistos.length > 0 && (
    <div className="card-gm p-6 sm:p-8">
      <p className="eyebrow">Pelas suas respostas</p>
      <h4 className="heading mt-2 text-2xl">O que já dá para ver</h4>
      <ul className="mt-4 grid gap-4">
        {vistos.map(([t, d]) => (
          <li key={t} className="border-l-2 border-primary pl-4">
            <p className="font-semibold">{t}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  // sem o envio automático (URL vazia ou erro de rede), o WhatsApp é o passo que falta e vai logo abaixo do título
  const adiantar = (
    <div className={`card-gm ${enviado ? "p-6 sm:p-8" : "mt-6 border-primary bg-background p-5 sm:p-6"}`}>
      <h4 className="heading text-2xl">{enviado ? "Quer adiantar?" : "Falta um passo"}</h4>
      <p className="mt-2 text-muted-foreground">
        {enviado
          ? "Mande o seu resumo no WhatsApp. É você quem envia, e o time responde por lá."
          : "Para o time receber o seu diagnóstico, envie o resumo no WhatsApp. A mensagem já vai pronta, e você revisa antes de mandar."}
      </p>
      <a href={wa} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full py-4 text-base">
        <MessageCircle size={20} />{enviado ? "Adiantar meu atendimento" : "Enviar meu diagnóstico no WhatsApp"}
      </a>
      {GRUPO_WHATSAPP && <a href={GRUPO_WHATSAPP} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full"><Users size={18} />Entrar também no grupo da Green Margem</a>}
      {a.origem === "guanxi" && <a href={GUANXI_FORM} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">Preencher a ficha do Clube Guanxi</a>}
    </div>
  );

  // quem não é da imersão: o passo seguinte é o grupo (sem link do grupo, cai no Instagram)
  const grupo = (
    <div className="card-gm mt-6 border-primary bg-background p-5 sm:p-6">
      <h4 className="heading text-2xl">{GRUPO_WHATSAPP ? "Entre no grupo da Green Margem" : "Acompanhe a Green Margem"}</h4>
      <p className="mt-2 text-muted-foreground">
        {GRUPO_WHATSAPP
          ? "É lá que a gente fala com todo mundo: conteúdo, avisos da Canton Fair e a abertura da turma de 2027."
          : "No Instagram sai o conteúdo, os avisos da Canton Fair e a abertura da turma de 2027."}
      </p>
      {GRUPO_WHATSAPP
        ? <a href={GRUPO_WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full py-4 text-base"><Users size={20} />Entrar no grupo</a>
        : <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full py-4 text-base"><Instagram size={20} />Seguir a @greenmargem</a>}
      {GRUPO_WHATSAPP && semCaixa && <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full"><Instagram size={18} />Ver o conteúdo grátis</a>}
      {a.origem === "guanxi" && <a href={GUANXI_FORM} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">Preencher a ficha do Clube Guanxi</a>}
    </div>
  );

  return (
    <div className="grid gap-4">
      <div className="card-gm p-6 sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={26} strokeWidth={3} /></span>
        <p className="eyebrow mt-5">{individual && enviado ? "Diagnóstico enviado" : "Diagnóstico pronto"}</p>
        <h3 className="heading mt-2 text-3xl sm:text-4xl">{titulo[s]}</h3>
        <p className="mt-3 text-muted-foreground">{texto[s]}</p>
        {individual ? !enviado && adiantar : grupo}

        {individual && (
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
            <p className="mt-5 text-sm text-proof">Quem fala com você é o time que opera 16 lojas próprias e compra direto de fábrica na China.</p>
          </>
        )}
      </div>

      {quadro}

      {/* adiantar: é o lead quem manda a mensagem; nada automático da Green Margem */}
      {individual && enviado && adiantar}

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
