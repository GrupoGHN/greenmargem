import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Instagram, MessageCircle } from "lucide-react";
import { GUANXI_FORM, INSTAGRAM, OBJ } from "@/config/content";
import { buildMessage, emptyAnswers, isNotNow, maskPhone, stepsFor, whatsappUrl, type Answers } from "@/lib/lead";

const P2 = ["Ainda não tenho empresa", "Revendo produto de outros", "Tenho marca própria", "Fabrico", "Já importo"];
const P3 = ["Mercado Livre", "Shopee", "TikTok Shop", "Shein", "Temu", "Amazon", "Loja física", "Site próprio", "Ainda não vendo"];
const P4 = ["Ainda não faturo", "Até R$ 30 mil", "R$ 30 mil a R$ 100 mil", "R$ 100 mil a R$ 300 mil", "R$ 300 mil a R$ 1 milhão", "Acima de R$ 1 milhão"];
const P5 = ["Até R$ 20 mil", "R$ 20 mil a R$ 50 mil", "R$ 50 mil a R$ 100 mil", "Acima de R$ 100 mil", "Ainda não sei"];
const P6 = ["Agora", "Em até 30 dias", "Em até 3 meses", "Só estou pesquisando"];

function Single({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" className="grid gap-2">
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

export function LeadForm() {
  const [a, setA] = useState<Answers>(emptyAnswers);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const h = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      setA((p) => ({ ...p, objetivo: v }));
      setDone(false);
      setI(0);
    };
    window.addEventListener("gm:objetivo", h);
    return () => window.removeEventListener("gm:objetivo", h);
  }, []);

  const steps = stepsFor(a);
  const step = steps[i];
  const phoneOk = a.whatsapp.replace(/\D/g, "").length >= 10;
  const valid =
    (step === "p1" && !!a.objetivo) || (step === "p2" && !!a.empresa) || (step === "p3" && a.canais.length > 0) ||
    (step === "p4" && !!a.faturamento) || (step === "p5" && !!a.investimento) || (step === "p6" && !!a.quando) ||
    (step === "p7" && a.nome.trim().length > 1 && phoneOk);

  const next = () => { if (!valid) return; if (i === steps.length - 1) setDone(true); else setI(i + 1); };
  const wa = whatsappUrl(buildMessage(a));

  const titles: Record<string, [string, string?]> = {
    p1: ["O que você quer agora?", "Operamos 16 lojas próprias em 5 marketplaces."],
    p2: ["Como é a sua empresa hoje?", "Compramos direto de fábrica na China."],
    p3: ["Onde você vende?", "A conta da margem muda em cada marketplace."],
    p4: ["Quanto você fatura por mês?", "Suas respostas ficam só entre você e a Green Margem."],
    p5: ["Quanto pretende investir no primeiro pedido?", "Antes de pagar fornecedor, a gente faz a conta completa."],
    p6: ["Quando quer começar?"],
    p7: ["Seus dados para contato"],
  };

  if (done) {
    const notNow = isNotNow(a);
    return (
      <div className="card-gm p-6 sm:p-8">
        {notNow ? (
          <>
            <h3 className="heading text-3xl sm:text-4xl">Não é um não. É o momento.</h3>
            <p className="mt-4 text-muted-foreground">Pelo que você respondeu, o melhor agora é aprender o caminho antes de investir. Começa pelo conteúdo gratuito no @greenmargem. Quando estiver pronto, a gente conversa.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-primary"><Instagram size={18} />Ver o conteúdo no Instagram</a>
              <a href={wa} target="_blank" rel="noreferrer" className="btn-outline">Quero falar mesmo assim</a>
            </div>
          </>
        ) : (
          <>
            <h3 className="heading text-3xl sm:text-4xl">O que acontece agora</h3>
            <ol className="mt-5 grid gap-3">
              {["Você manda a mensagem pronta no WhatsApp.", "A gente responde e marca o diagnóstico de 20 minutos.", "Você sai com o plano do que fazer primeiro."].map((t, n) => (
                <li key={t} className="flex gap-3"><span className="heading text-2xl text-primary">{n + 1}.</span><span className="pt-0.5">{t}</span></li>
              ))}
            </ol>
            <a href={wa} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full py-4 text-lg"><MessageCircle size={20} />Enviar no WhatsApp</a>
            {a.objetivo === OBJ.guanxi && (
              <a href={GUANXI_FORM} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">Preencher a ficha do Clube Guanxi</a>
            )}
          </>
        )}
        <p className="mt-4 text-xs text-muted-foreground">Você revisa a mensagem no WhatsApp antes de enviar.</p>
        <button type="button" onClick={() => setDone(false)} className="mt-4 text-sm text-muted-foreground underline underline-offset-4">Revisar respostas</button>
      </div>
    );
  }

  const [title, proof] = titles[step ?? "p1"];
  return (
    <form className="card-gm p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); next(); }}>
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Pergunta {i + 1} de {steps.length}</span></div>
        <div className="h-1.5 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="heading mb-5 text-2xl sm:text-3xl">{title}</h3>

      {step === "p1" && <Single options={Object.values(OBJ)} value={a.objetivo} onChange={(v) => set("objetivo", v)} />}
      {step === "p2" && <Single options={P2} value={a.empresa} onChange={(v) => set("empresa", v)} />}
      {step === "p3" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {P3.map((o) => {
            const on = a.canais.includes(o);
            return (
              <button key={o} type="button" aria-pressed={on} className="option" onClick={() => set("canais", on ? a.canais.filter((c) => c !== o) : [...a.canais, o])}>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                {o}
              </button>
            );
          })}
        </div>
      )}
      {step === "p4" && <Single options={P4} value={a.faturamento} onChange={(v) => set("faturamento", v)} />}
      {step === "p5" && (
        <>
          <Single options={P5} value={a.investimento} onChange={(v) => set("investimento", v)} />
          <label className="mt-4 block text-sm">Que produto você quer trazer? <span className="text-muted-foreground">(opcional)</span>
            <input className="field mt-2" value={a.produto} onChange={(e) => set("produto", e.target.value)} />
          </label>
        </>
      )}
      {step === "p6" && <Single options={P6} value={a.quando} onChange={(v) => set("quando", v)} />}
      {step === "p7" && (
        <div className="grid gap-4">
          <label className="text-sm">Nome *<input required autoComplete="name" className="field mt-2" value={a.nome} onChange={(e) => set("nome", e.target.value)} /></label>
          <label className="text-sm">Empresa ou loja <span className="text-muted-foreground">(opcional)</span><input className="field mt-2" value={a.loja} onChange={(e) => set("loja", e.target.value)} /></label>
          <label className="text-sm">WhatsApp com DDD *<input required type="tel" inputMode="numeric" autoComplete="tel" placeholder="(11) 91234-5678" className="field mt-2" value={a.whatsapp} onChange={(e) => set("whatsapp", maskPhone(e.target.value))} /></label>
          <label className="text-sm">Quer contar mais alguma coisa? <span className="text-muted-foreground">(opcional)</span><textarea rows={3} className="field mt-2" value={a.detalhes} onChange={(e) => set("detalhes", e.target.value)} /></label>
        </div>
      )}

      {proof && <p className="mt-4 text-sm text-proof">{proof}</p>}

      <div className="mt-6 flex gap-3">
        {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="btn-outline"><ArrowLeft size={18} />Voltar</button>}
        <button type="submit" disabled={!valid} className="btn-primary flex-1">{i === steps.length - 1 ? "Ver próximo passo" : "Continuar"}<ArrowRight size={18} /></button>
      </div>
    </form>
  );
}
