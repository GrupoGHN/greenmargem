import { ArrowRight, Check, ChevronDown, ExternalLink, Instagram, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { CANTON_ETAPAS as timeline, CANTON_FASES as fases, CONTEUDOS, EMPRESA, FAQ, GUANXI_FORM, INSTAGRAM, MARKETPLACES, OLHAMOS, OPERACAO } from "@/config/content";
import { goToForm, type Objetivo } from "@/lib/lead";
import { LeadForm } from "@/components/LeadForm";
import { CookieBanner } from "@/components/CookieBanner";
import { StickyCta } from "@/components/StickyCta";

const asset = (f: string) => import.meta.env.BASE_URL + f;
const logo = asset("logo-wide.png");

// links curtos (greenmargem.com.br/diagnostico etc.) caem aqui como #atalho e abrem o diagnóstico já no objetivo certo;
// o /canton continua rolando até a seção da feira, com a imersão já marcada no diagnóstico
const ATALHOS: Record<string, Objetivo> = { diagnostico: "vender", importar: "importar", guanxi: "importar", canton: "imersao" };

// light: seção clara no meio das escuras (ritmo de revista, 03/11)
function Section({ id, alt, light, children }: { id?: string; alt?: boolean; light?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`px-5 py-14 sm:py-28 ${light ? "sec-light" : alt ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

// abas: no celular mostram um grupo por vez em vez da lista inteira
function Tabs({ labels, value, onChange, className = "" }: { labels: string[]; value: number; onChange: (i: number) => void; className?: string }) {
  return (
    <div role="tablist" className={`flex gap-1 rounded-xl border bg-card p-1 ${className}`}>
      {labels.map((l, i) => (
        <button key={l} role="tab" aria-selected={i === value} onClick={() => onChange(i)} className="tab">{l}</button>
      ))}
    </div>
  );
}

function Head({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl sm:mb-10">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="heading text-4xl sm:text-6xl">{children}</h2>
    </div>
  );
}

const services: { group: string; items: { name: string; badge?: string; who: string; desc: string; cta: string; action: () => void; external?: boolean }[] }[] = [
  {
    group: "Vender com margem",
    items: [
      { name: "Diagnóstico de margem", badge: "Gratuito · 2 min", who: "Pra quem já vende.", desc: "Você responde 4 passos e já vê onde a sua margem costuma vazar.", cta: "Quero o diagnóstico", action: () => goToForm("vender") },
      { name: "Assessoria de marketplace", who: "Pra quem quer crescer com a margem sob controle.", desc: "Plano do que ajustar primeiro e acompanhamento: precificação, ADS com lucro, anúncios e operação. Você executa com a gente do lado.", cta: "Quero a assessoria", action: () => goToForm("vender") },
      { name: "Gestão de contas", who: "Pra quem quer tirar a operação das costas.", desc: "Nossa equipe de gestores cuida das suas contas no dia a dia: anúncios, campanhas, preço e catálogo.", cta: "Quero a gestão", action: () => goToForm("vender") },
    ],
  },
  {
    group: "Comprar da China",
    items: [
      { name: "Primeira importação acompanhada", who: "Pra quem nunca importou ou importou mal.", desc: "Do produto escolhido pela conta até a mercadoria no seu estoque: custo total antes de pagar, fornecedor testado, amostra, pagamento por câmbio, frete e despachante.", cta: "Quero importar", action: () => goToForm("importar") },
      { name: "Planejamento Canton Fair 2027", who: "Pra quem vai à feira e quer voltar com fornecedor, não só com cartão de visita.", desc: "Antes, durante e depois da maior feira de importação do mundo.", cta: "Quero ir à Canton Fair 2027", action: () => goToForm("imersao") },
      { name: "Clube Guanxi", who: "Pra quem fatura acima de R$ 100 mil por mês.", desc: "Grupo fechado de importadores e sellers, com anuidade e conexão direta com a China.", cta: "Pedir convite", action: () => window.open(GUANXI_FORM, "_blank", "noopener"), external: true },
    ],
  },
];

// time (30/10): cada um pelo lado da conta que cuida, sem "especialista" e sem "sócio"
const people = [
  { photo: asset("nikolas.jpg"), name: "Nikolas Brendon", role: "A venda", desc: "Anúncio, ADS, preço e escala em 5 marketplaces, todo dia." },
  { photo: asset("greg.jpg"), name: "Greg Vinevan", role: "A conta", desc: "CFO do Grupo GHN. Faz a conta da importação antes do dinheiro sair: custo, câmbio, imposto e margem real." },
  { photo: asset("hao.jpg"), name: "Haoyun Liu", role: "A compra", desc: "Chinesa, negocia com a fábrica na língua dela. Acha o produto e o fornecedor e testa antes de comprar." },
];

export function App() {
  const [aba, setAba] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [fase, setFase] = useState(0);
  useEffect(() => {
    const atalho = location.hash.slice(1);
    if (!(atalho in ATALHOS)) return;
    let vivo = true;
    // rola só depois das fontes e das fotos: antes disso a página ainda cresce e o alvo escorrega
    const ir = () => {
      if (!vivo) return;
      window.dispatchEvent(new CustomEvent("gm:objetivo", { detail: { objetivo: ATALHOS[atalho], origem: atalho } }));
      document.getElementById(atalho === "canton" ? "canton" : "formulario")?.scrollIntoView({ behavior: "instant" });
    };
    const carregou = new Promise((ok) => (document.readyState === "complete" ? ok(null) : addEventListener("load", () => ok(null), { once: true })));
    Promise.all([document.fonts?.ready, carregou]).then(() => { ir(); setTimeout(ir, 600); });
    return () => { vivo = false; };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/85 backdrop-blur">
        <p className="border-b bg-surface px-3 py-1.5 text-center text-[0.66rem] font-medium uppercase tracking-[0.06em] text-muted-foreground sm:text-[0.7rem] sm:tracking-[0.2em]">Para empresas que vendem ou querem comprar direto da China</p>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#topo" aria-label="Green Margem, início"><img src={logo} alt="Green Margem" className="h-9 w-auto" /></a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            {[["Serviços", "#servicos"], ["Canton Fair 2027", "#canton"], ["Como funciona", "#como-funciona"], ["Dúvidas", "#duvidas"]].map(([l, h]) => (
              <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </nav>
          <button onClick={() => goToForm()} className="btn-primary px-4 py-2.5 text-sm">Fazer o diagnóstico</button>
        </div>
      </header>

      <main>
        {/* Hero */}
        {/* 03/11: a operação grande e nítida (o Greg achou os fardos no canto pequenos demais).
            Celular: foto em cima, texto embaixo. Desktop: foto ocupa a direita da tela, texto à esquerda */}
        <section id="topo" className="relative overflow-hidden">
          <div className="relative mt-[6.75rem] h-[44svh] sm:absolute sm:inset-y-0 sm:right-0 sm:mt-0 sm:h-auto sm:w-[66%]">
            <img src={asset("operacao/hero-operacao.webp")} alt="Fardos chegando entre as estantes do galpão da operação" fetchPriority="high" className="img-grade h-full w-full object-cover object-[55%_30%] sm:object-[60%_40%]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent sm:bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_80%,transparent)_32%,transparent_68%)]" aria-hidden />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-background to-transparent sm:block" aria-hidden />
          </div>
          <div className="relative -mt-14 px-5 pb-10 sm:mt-0 sm:flex sm:min-h-[100svh] sm:items-center sm:pt-36 sm:pb-16">
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-6">Assessoria de marketplace e importação</p>
            <h1 className="heading max-w-3xl text-5xl sm:text-7xl lg:text-[5.5rem]">
              Margem se faz em dois lugares: <span className="destaque">na venda</span> e <span className="destaque">na compra</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A gente opera 16 lojas próprias em 5 marketplaces e compra direto de fábrica na China. É isso que a gente leva pra sua operação: vender com margem e comprar melhor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => goToForm()} className="btn-primary text-base">Fazer o diagnóstico gratuito<ArrowRight size={18} /></button>
              <button onClick={() => goToForm("imersao")} className="btn-outline text-base">Quero ir à Canton Fair 2027</button>
            </div>
            {/* números em linha, sem caixa (03/11) */}
            <div className="mt-10 grid grid-cols-2 gap-y-5 border-t pt-6 sm:mt-14 sm:grid-cols-4">
              {["16 lojas próprias", "5 marketplaces", "Compra direta de fábrica na China", "Na Canton Fair 2027"].map((t) => (
                <div key={t} className="border-l pl-4 pr-3">
                  <span className="heading text-lg leading-tight sm:text-2xl">{t}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm tracking-wide text-muted-foreground">{MARKETPLACES.join(" · ")}</p>
          </div>
          </div>
        </section>

        {/* Prova: a operação própria. A Green Margem ainda não tem cliente, então nada aqui fala de cliente ou de resultado de cliente */}
        <Section alt>
          <Head eyebrow="A operação de verdade">Primeiro na nossa operação</Head>
          <p className="-mt-4 mb-8 max-w-2xl text-lg text-muted-foreground">Não é teoria. São 16 lojas próprias em 5 marketplaces, com estoque, separação e expedição, e compra direta de fábrica na China.</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {OPERACAO.map((o) => (
              <figure key={o.foto} className="relative overflow-hidden rounded-md">
                <img src={asset(o.foto)} alt={o.legenda} loading="lazy" className="img-grade aspect-[4/5] w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-3 pb-3 pt-10 text-sm font-semibold">{o.legenda}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* Problema */}
        <Section light>
          <Head eyebrow="Por que a margem some">A maioria olha só um lado da conta</Head>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {[["Quem só cuida do anúncio", "Vende mais e lucra igual. Comissão, frete, ADS e imposto comem a diferença."], ["Quem só cuida da compra", "Traz o produto barato e erra no preço, no estoque e no marketplace."]].map(([t, d]) => (
              <div key={t} className="border-t-2 border-foreground pt-5">
                <h3 className="heading text-2xl sm:text-3xl">{t}</h3>
                <p className="mt-3 text-lg text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="heading mt-12 border-l-4 border-primary pl-5 text-3xl sm:text-4xl">A Green Margem cuida dos <span className="destaque">dois lados</span> da mesma conta.</p>
        </Section>

        {/* Serviços */}
        <Section id="servicos" alt>
          <Head eyebrow="Serviços">Escolha por onde começar</Head>
          <Tabs labels={services.map((g) => g.group)} value={aba} onChange={setAba} className="mb-6 max-w-xl" />
          <div role="tabpanel" className="grid gap-4 md:grid-cols-3">
            {services[aba].items.map((s) => (
              <article key={s.name} className="card-gm flex flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="heading text-2xl">{s.name}</h3>
                  {s.badge && <span className="rounded-full border border-primary/50 px-2.5 py-0.5 text-xs font-semibold text-primary">{s.badge}</span>}
                </div>
                <p className="mt-2 text-sm font-medium text-foreground/80">{s.who}</p>
                <p className="mt-3 flex-1 text-muted-foreground">{s.desc}</p>
                <button onClick={s.action} className="mt-5 inline-flex items-center gap-2 self-start font-semibold text-primary hover:underline underline-offset-4">
                  {s.cta}{s.external ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                </button>
              </article>
            ))}
          </div>
        </Section>

        {/* Canton */}
        <Section id="canton">
          <Head eyebrow="Canton Fair 2027">A maior feira de importação do mundo. <span className="text-primary">Com a conta feita antes de embarcar.</span></Head>
          <p className="-mt-4 max-w-3xl text-lg text-muted-foreground">A Canton Fair acontece duas vezes por ano em Guangzhou, na China. A edição de primavera de 2027 vai de abril a maio, em 3 fases, cada uma com um tipo de produto. Ir na fase errada é perder a viagem.</p>
          <Tabs labels={fases.map(([t]) => t.split(" · ")[0])} value={fase} onChange={setFase} className="mt-8 mb-4 md:hidden" />
          <div className="grid gap-4 md:mt-10 md:grid-cols-3">
            {fases.map(([t, d], n) => (
              <div key={t} className={`card-gm p-6 ${n === fase ? "" : "hidden md:block"}`}><h3 className="heading destaque text-2xl">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">As datas oficiais de 2027 saem no site da feira. A gente confirma com você antes de comprar a passagem.</p>

          <h3 className="heading mt-12 mb-6 text-3xl sm:mt-16 sm:text-4xl">Como a gente prepara você</h3>
          <Tabs labels={timeline.map(([t]) => t)} value={etapa} onChange={setEtapa} className="mb-4 md:hidden" />
          <div className="grid gap-4 md:grid-cols-3">
            {timeline.map(([t, items], n) => (
              <div key={t} className={`card-gm p-6 ${n === etapa ? "" : "hidden md:block"}`}>
                <div className="flex items-baseline gap-3 border-b pb-4"><span className="heading destaque text-4xl">0{n + 1}</span><span className="heading text-3xl">{t}</span></div>
                <ul className="mt-4 grid gap-2.5">
                  {items.map((i) => <li key={i} className="flex gap-2.5 text-muted-foreground"><Check size={18} className="mt-0.5 shrink-0 text-primary" />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={() => goToForm("imersao")} className="btn-primary mt-10 text-base">Quero ir à Canton Fair 2027<ArrowRight size={18} /></button>
        </Section>

        {/* Como funciona */}
        <Section id="como-funciona" light>
          <Head eyebrow="Como funciona">3 passos, sem enrolação</Head>
          <ol className="grid gap-6 md:grid-cols-3 md:gap-10">
            {[["Você faz o diagnóstico", "São 4 passos. Leva uns 2 minutos."], ["Você vê na hora o que as respostas mostram", "Fase da feira, Radar, margem por pedido."], ["Você entra no grupo da Green Margem", "É lá que a gente fala com todo mundo. Quem vai à Canton Fair fala com o time."]].map(([t, d], n) => (
              <li key={t} className="flex items-start gap-4 border-t-2 border-foreground pt-5 md:block">
                <span className="heading destaque text-5xl md:text-6xl">{n + 1}</span>
                <div>
                  <h3 className="heading text-2xl md:mt-3">{t}</h3>
                  <p className="mt-2 text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="heading mt-10 mb-5 text-2xl sm:mt-14">O que a gente olha na sua operação</h3>
          <ul className="flex flex-wrap gap-2">
            {OLHAMOS.map((t) => <li key={t} className="rounded-full border px-4 py-2 text-sm">{t}</li>)}
          </ul>
        </Section>

        {/* Time */}
        <Section>
          <Head eyebrow="Time">Quem vai olhar a sua operação</Head>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {people.map((p) => (
              <article key={p.name} className="card-gm flex overflow-hidden sm:block">
                <div className="w-32 shrink-0 bg-background sm:aspect-[4/5] sm:w-auto">
                  <img src={p.photo} alt={p.name} loading="lazy" className="img-grade h-full w-full object-cover object-[50%_20%]" />
                </div>
                <div className="p-4 sm:p-6">
                  <p className="eyebrow">{p.role}</p>
                  <h3 className="heading mt-1 text-2xl sm:mt-2 sm:text-3xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Pra quem é */}
        <Section light>
          <Head eyebrow="Pra quem é">É pra você?</Head>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-gm p-6 sm:p-8">
              <h3 className="heading destaque text-3xl">É pra você se:</h3>
              <ul className="mt-5 grid gap-3">
                {["Já vende em marketplace e quer crescer sem perder margem.", "Fatura bem, mas não sabe quanto sobra por produto.", "Quer ter o próprio produto e parar de comprar de quem compra da China.", "Vai à Canton Fair e quer voltar com fornecedor fechado."].map((t) => (
                  <li key={t} className="flex gap-3"><Check size={20} className="mt-0.5 shrink-0 text-primary" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="card-gm p-6 sm:p-8">
              <h3 className="heading text-3xl">Não é pra você se:</h3>
              <ul className="mt-5 grid gap-3">
                {["Procura fórmula de 7 dígitos ou resultado garantido.", "Quer curso gravado. A gente não vende curso."].map((t) => (
                  <li key={t} className="flex gap-3 text-muted-foreground"><X size={20} className="mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Conteúdo */}
        <Section>
          <Head eyebrow="Conteúdo grátis">Aprenda antes de pagar qualquer um</Head>
          <p className="-mt-4 mb-8 text-lg text-muted-foreground">Todo dia tem conteúdo novo no <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@greenmargem</a>.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CONTEUDOS.map((c, i) => (
              <a key={c.titulo} href={c.url} target="_blank" rel="noreferrer" className={`card-gm group flex-col overflow-hidden transition-colors hover:border-primary/50 ${i > 3 ? "hidden sm:flex" : "flex"}`}>
                <img src={asset(c.capa)} alt={c.titulo} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <div className="flex flex-1 flex-col justify-between gap-2 p-3">
                  <span className="text-sm font-medium leading-snug">{c.titulo}</span>
                  <span className="flex items-center gap-1.5 text-xs text-primary"><Instagram size={14} />{c.url === INSTAGRAM ? "Ver no perfil" : "Ver o post"}</span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* Dúvidas */}
        <Section id="duvidas" alt>
          <Head eyebrow="Dúvidas">Perguntas frequentes</Head>
          <div className="grid max-w-3xl gap-2">
            {FAQ.map(([q, r]) => (
              <details key={q} className="card-gm group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}<ChevronDown size={20} className="shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">{r}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* Formulário */}
        <Section id="formulario">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow mb-3">Gratuito</p>
            <h2 className="heading text-4xl sm:text-6xl">Diagnóstico da sua operação</h2>
            <p className="mt-3 mb-8 text-lg text-muted-foreground">São 4 passos, quase tudo de tocar. Leva uns 2 minutos.</p>
            <LeadForm />
          </div>
        </Section>
      </main>

      <footer className="border-t px-5 pt-16 pb-28 text-center sm:pb-16">
        <p className="heading mx-auto max-w-5xl text-4xl sm:text-7xl">
          Segue a <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@greenmargem</a> pra não ficar no <span className="text-alert">vermelho</span>
        </p>
        <p className="mt-6 text-muted-foreground">Resultado a gente não promete. Processo a gente mostra.</p>
        <img src={logo} alt="Green Margem" className="mx-auto mt-10 h-8 w-auto" />
        <p className="mt-3 text-sm text-muted-foreground">© 2026 Green Margem</p>
        <p className="mt-2 text-xs text-muted-foreground">{EMPRESA.razao} · CNPJ {EMPRESA.cnpj}</p>
        <a href={asset("privacidade/")} className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Política de privacidade</a>
      </footer>

      <StickyCta />
      <CookieBanner />
    </div>
  );
}
