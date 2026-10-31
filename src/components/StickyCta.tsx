import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { goToForm } from "@/lib/lead";

// botão fixo do diagnóstico (no celular, barra no rodapé; no desktop, botão no canto). Aparece depois do topo e some quando o diagnóstico está na tela.
export function StickyCta() {
  const [noForm, setNoForm] = useState(false);
  const [noTopo, setNoTopo] = useState(true); // no topo os botões do próprio hero já aparecem
  useEffect(() => {
    const rolar = () => setNoTopo(window.scrollY < 520);
    rolar();
    addEventListener("scroll", rolar, { passive: true });
    const alvo = document.getElementById("formulario");
    const io = alvo && "IntersectionObserver" in window ? new IntersectionObserver(([e]) => setNoForm(e.isIntersecting), { threshold: 0.05 }) : null;
    if (alvo && io) io.observe(alvo);
    return () => { removeEventListener("scroll", rolar); io?.disconnect(); };
  }, []);
  const oculto = noForm || noTopo;

  return (
    <div
      aria-hidden={oculto}
      className={`fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur transition-transform duration-300 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none ${oculto ? "pointer-events-none translate-y-[150%]" : ""}`}
    >
      <button onClick={() => goToForm()} tabIndex={oculto ? -1 : 0} className="btn-primary w-full py-3.5 text-base shadow-lg sm:w-auto">
        Fazer o diagnóstico gratuito<ArrowRight size={18} />
      </button>
    </div>
  );
}
