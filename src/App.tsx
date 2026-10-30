import { ArrowRight, Check, ChevronDown, ExternalLink, Instagram, MessageCircle, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { CONTEUDOS, FAQ, GUANXI_FORM, INSTAGRAM, MARKETPLACES, OBJ, OLHAMOS } from "@/config/content";
import { goToForm } from "@/lib/lead";
import { LeadForm } from "@/components/LeadForm";

const asset = (f: string) => import.meta.env.BASE_URL + f;
const logo = asset("logo-wide.png");

// links curtos (greenmargem.com.br/diagnostico etc.) caem aqui como #atalho e abrem o formulário já no objetivo certo
const ATALHOS: Record<string, string> = { diagnostico: OBJ.vender, importar: OBJ.importar, guanxi: OBJ.guanxi };

function Section({ id, alt, children }: { id?: string; alt?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`px-5 py-16 sm:py-24 ${alt ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Head({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="heading text-4xl sm:text-6xl">{children}</h2>
    </div>
  );
}

const services: { group: string; items: { name: string; badge?: string; who: string; desc: string; cta: string; action: () => void; external?: boolean }[] }[] = [
  {
    group: "Vender com margem",
    items: [
      { name: "Diagnóstico de margem", badge: "Gratuito · 20 min", who: "Pra quem já vende.", desc: "Você mostra a operação e a gente aponta onde a sua margem está vazando hoje.", cta: "Quero o diagnóstico", action: () => goToForm(OBJ.vender) },
      { name: "Assessoria de marketplace", who: "Pra quem quer crescer com a margem sob controle.", desc: "Plano do que ajustar primeiro e acompanhamento: precificação, ADS com lucro, anúncios e operação. Você executa com a gente do lado.", cta: "Quero a assessoria", action: () => goToForm(OBJ.vender) },
      { name: "Gestão de contas", who: "Pra quem quer tirar a operação das costas.", desc: "Nossa equipe de gestores cuida das suas contas no dia a dia: anúncios, campanhas, preço e catálogo.", cta: "Quero a gestão", action: () => goToForm(OBJ.vender) },
    ],
  },
  {
    group: "Comprar direto da China",
    items: [
      { name: "Primeira importação acompanhada", who: "Pra quem nunca importou ou importou mal.", desc: "Do produto escolhido pela conta até a mercadoria no seu estoque: custo total antes de pagar, fornecedor testado, amostra, pagamento por câmbio, frete e despachante.", cta: "Quero importar", action: () => goToForm(OBJ.importar) },
      { name: "Planejamento Canton Fair 2027", who: "Pra quem vai à feira e quer voltar com fornecedor, não só com cartão de visita.", desc: "Antes, durante e depois da maior feira de importação do mundo.", cta: "Ver a Canton Fair", action: () => document.getElementById("canton")?.scrollIntoView({ behavior: "smooth" }) },
      { name: "Clube Guanxi", who: "Pra quem fatura acima de R$ 100 mil por mês.", desc: "Grupo fechado de importadores e sellers, com anuidade e conexão direta com a China.", cta: "Pedir convite", action: () => window.open(GUANXI_FORM, "_blank", "noopener"), external: true },
    ],
  },
];

const timeline: [string, string[]][] = [
  ["Antes", ["Produto escolhido pela conta", "A fase certa da feira", "Custo total simulado (produto, frete, impostos e câmbio)", "Lista de fornecedores para visitar", "Orientação de visto e carta-convite", "Agenda dos dias"]],
  ["Durante", ["A gente vai estar na feira em 2027", "O que perguntar a cada fábrica", "Como comparar preço, pedido mínimo e prazo", "O que pedir de amostra"]],
  ["Depois", ["Amostra, contrato e proforma", "Pagamento seguro por câmbio", "Frete, despachante e alfândega", "Primeiro pedido acompanhado até o seu estoque"]],
];

// time (30/10): cada um pelo lado da conta que cuida, sem "especialista" e sem "sócio"
const people = [
  { photo: asset("nikolas.jpg"), name: "Nikolas Brendon", role: "A venda", desc: "Anúncio, ADS, preço e escala em 5 marketplaces, todo dia." },
  { photo: asset("greg.jpg"), name: "Greg Vinevan", role: "A conta", desc: "CFO do Grupo GHN. Faz a conta da importação antes do dinheiro sair: custo, câmbio, imposto e margem real." },
  { photo: asset("hao.jpg"), name: "Haoyun Liu", role: "A compra", desc: "Chinesa, negocia com a fábrica na língua dela. Acha o produto e o fornecedor e testa antes de comprar." },
];

export function App() {
  useEffect(() => {
    const atalho = location.hash.slice(1);
    if (!(atalho in ATALHOS) && atalho !== "canton") return;
    let vivo = true;
    // rola só depois das fontes e das fotos: antes disso a página ainda cresce e o alvo escorrega
    const ir = () => {
      if (!vivo) return;
      if (atalho in ATALHOS) window.dispatchEvent(new CustomEvent("gm:objetivo", { detail: ATALHOS[atalho] }));
      document.getElementById(atalho === "canton" ? "canton" : "formulario")?.scrollIntoView({ behavior: "instant" });
    };
    const carregou = new Promise((ok) => (document.readyState === "complete" ? ok(null) : addEventListener("load", () => ok(null), { once: true })));
    Promise.all([document.fonts?.ready, carregou]).then(() => { ir(); setTimeout(ir, 600); });
    return () => { vivo = false; };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#topo" aria-label="Green Margem, início"><img src={logo} alt="Green Margem" className="h-9 w-auto" /></a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            {[["Serviços", "#servicos"], ["Canton Fair 2027", "#canton"], ["Como funciona", "#como-funciona"], ["Dúvidas", "#duvidas"]].map(([l, h]) => (
              <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </nav>
          <button onClick={() => goToForm()} className="btn-primary px-4 py-2.5 text-sm">Falar com a gente</button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="topo" className="relative overflow-hidden px-5 pb-16 pt-28 sm:pb-24 sm:pt-40">
          <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-6xl">
            <p className="eyebrow mb-5">Assessoria de marketplace e importação</p>
            <h1 className="heading max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
              Margem se faz em dois lugares: <span className="text-primary">na venda</span> e <span className="text-primary">na compra</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A gente opera 16 lojas próprias em 5 marketplaces e compra direto de fábrica na China. É isso que a gente faz com a sua operação: vender com margem e comprar melhor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => goToForm(OBJ.vender)} className="btn-primary text-base">Quero o diagnóstico gratuito<ArrowRight size={18} /></button>
              <button onClick={() => goToForm(OBJ.importar)} className="btn-outline text-base">Quero importar da China</button>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
              {["16 lojas próprias", "5 marketplaces", "Compra direta de fábrica na China", "Na Canton Fair 2027"].map((t) => (
                <div key={t} className="flex items-center bg-background p-4 sm:p-5">
                  <span className="heading text-xl leading-tight sm:text-2xl">{t}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm tracking-wide text-muted-foreground">{MARKETPLACES.join(" · ")}</p>
          </div>
        </section>

        {/* Problema */}
        <Section alt>
          <Head eyebrow="Por que a margem some">A maioria olha só um lado da conta</Head>
          <div className="grid gap-4 md:grid-cols-2">
            {[["Quem só cuida do anúncio", "Vende mais e lucra igual. Comissão, frete, ADS e imposto comem a diferença."], ["Quem só cuida da compra", "Traz o produto barato e erra no preço, no estoque e no marketplace."]].map(([t, d]) => (
              <div key={t} className="card-gm p-6 sm:p-8">
                <h3 className="heading text-2xl sm:text-3xl">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="heading mt-10 border-l-4 border-primary pl-5 text-3xl sm:text-4xl">A Green Margem cuida dos <span className="text-primary">dois lados</span> da mesma conta.</p>
        </Section>

        {/* Serviços */}
        <Section id="servicos">
          <Head eyebrow="Serviços">Escolha por onde começar</Head>
          <div className="grid gap-12">
            {services.map((g) => (
              <div key={g.group}>
                <h3 className="heading mb-4 text-xl text-primary">{g.group}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {g.items.map((s) => (
                    <article key={s.name} className="card-gm flex flex-col p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4 className="heading text-2xl">{s.name}</h4>
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
              </div>
            ))}
          </div>
        </Section>

        {/* Canton */}
        <Section id="canton" alt>
          <Head eyebrow="Canton Fair 2027">A maior feira de importação do mundo. <span className="text-primary">Com a conta feita antes de embarcar.</span></Head>
          <p className="-mt-4 max-w-3xl text-lg text-muted-foreground">A Canton Fair acontece duas vezes por ano em Guangzhou, na China. A edição de primavera de 2027 vai de abril a maio, em 3 fases, cada uma com um tipo de produto. Ir na fase errada é perder a viagem.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[["Fase 1 · abril", "Eletrônicos, eletrodomésticos, iluminação, máquinas, ferramentas, veículos e peças."], ["Fase 2 · abril", "Utilidades domésticas, cozinha, decoração, presentes, móveis e materiais de construção."], ["Fase 3 · início de maio", "Moda, tecidos, calçados, bolsas, brinquedos, bebê, escritório, saúde e alimentos."]].map(([t, d]) => (
              <div key={t} className="card-gm p-6"><h3 className="heading text-2xl text-primary">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">As datas oficiais de 2027 saem no site da feira. A gente confirma com você antes de comprar a passagem.</p>

          <h3 className="heading mt-16 mb-6 text-3xl sm:text-4xl">Como a gente prepara você</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {timeline.map(([t, items], n) => (
              <div key={t} className="card-gm p-6">
                <div className="flex items-baseline gap-3 border-b pb-4"><span className="heading text-4xl text-primary">0{n + 1}</span><span className="heading text-3xl">{t}</span></div>
                <ul className="mt-4 grid gap-2.5">
                  {items.map((i) => <li key={i} className="flex gap-2.5 text-muted-foreground"><Check size={18} className="mt-0.5 shrink-0 text-primary" />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={() => goToForm(OBJ.canton)} className="btn-primary mt-10 text-base">Quero planejar a Canton Fair<ArrowRight size={18} /></button>
        </Section>

        {/* Como funciona */}
        <Section id="como-funciona">
          <Head eyebrow="Como funciona">3 passos, sem enrolação</Head>
          <ol className="grid gap-4 md:grid-cols-3">
            {[["Você conta da sua operação", "Leva 2 minutos."], ["A gente chama você no WhatsApp", "E marca o diagnóstico de 20 minutos."], ["Você sai com o plano do que fazer primeiro", "Contratando a gente ou não."]].map(([t, d], n) => (
              <li key={t} className="card-gm p-6">
                <span className="heading text-6xl text-primary">{n + 1}</span>
                <h3 className="heading mt-3 text-2xl">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
          <h3 className="heading mt-14 mb-5 text-2xl">O que a gente olha na sua operação</h3>
          <ul className="flex flex-wrap gap-2">
            {OLHAMOS.map((t) => <li key={t} className="rounded-full border px-4 py-2 text-sm">{t}</li>)}
          </ul>
        </Section>

        {/* Time */}
        <Section alt>
          <Head eyebrow="Time">Quem vai olhar a sua operação</Head>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p) => (
              <article key={p.name} className="card-gm overflow-hidden">
                <div className="aspect-[4/5] bg-background">
                  <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover object-[50%_20%]" />
                </div>
                <div className="p-6">
                  <p className="eyebrow">{p.role}</p>
                  <h3 className="heading mt-2 text-3xl">{p.name}</h3>
                  <p className="mt-3 text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Pra quem é */}
        <Section>
          <Head eyebrow="Pra quem é">É pra você?</Head>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-gm p-6 sm:p-8">
              <h3 className="heading text-3xl text-primary">É pra você se:</h3>
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
        <Section alt>
          <Head eyebrow="Conteúdo grátis">Aprenda antes de pagar qualquer um</Head>
          <p className="-mt-4 mb-8 text-lg text-muted-foreground">Todo dia tem conteúdo novo no <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@greenmargem</a>.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CONTEUDOS.map((t) => (
              <a key={t} href={INSTAGRAM} target="_blank" rel="noreferrer" className="card-gm group flex flex-col justify-between gap-6 p-5 transition-colors hover:border-primary/50">
                <span className="font-medium">{t}</span>
                <span className="flex items-center gap-2 text-sm text-primary"><Instagram size={16} />Ver no Instagram</span>
              </a>
            ))}
          </div>
        </Section>

        {/* Dúvidas */}
        <Section id="duvidas">
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
        <Section id="formulario" alt>
          <div className="mx-auto max-w-2xl">
            <h2 className="heading text-4xl sm:text-6xl">Fale com a gente</h2>
            <p className="mt-3 mb-8 text-lg text-muted-foreground">Leva 2 minutos. A resposta vem no WhatsApp.</p>
            <LeadForm />
          </div>
        </Section>
      </main>

      <footer className="border-t px-5 py-16 text-center">
        <p className="heading mx-auto max-w-5xl text-4xl sm:text-7xl">
          Segue a <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-primary hover:underline">@greenmargem</a> pra não ficar no <span className="text-alert">vermelho</span>
        </p>
        <p className="mt-6 text-muted-foreground">Resultado a gente não promete. Processo a gente mostra.</p>
        <img src={logo} alt="Green Margem" className="mx-auto mt-10 h-8 w-auto" />
        <p className="mt-3 text-sm text-muted-foreground">© 2026 Green Margem</p>
      </footer>

      <button onClick={() => goToForm()} aria-label="Falar com a gente" className="btn-primary fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full p-0 shadow-lg">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
