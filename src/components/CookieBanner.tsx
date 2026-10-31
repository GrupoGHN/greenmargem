import { useEffect, useState } from "react";
import { GA4_ID, META_PIXEL_ID } from "@/config/content";

// aviso de cookies (LGPD): só aparece se o pixel da Meta ou o Google Analytics tiverem ID em content.ts.
// Sem ID, não carrega nada e não mostra nada. Com ID, só carrega depois do "Aceitar".
const ativo = !!(META_PIXEL_ID || GA4_ID);
const CHAVE = "gm-consentimento";
type W = Window & { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
const w = () => window as W;

function ler() { try { return localStorage.getItem(CHAVE); } catch { return null; } }
function gravar(v: string) { try { localStorage.setItem(CHAVE, v); } catch { /* sem armazenamento: vale só nesta visita */ } }

let carregado = false;
function carregar() {
  if (carregado) return;
  carregado = true;
  if (META_PIXEL_ID && !w().fbq) {
    const fila: unknown[][] = [];
    const fbq = Object.assign((...a: unknown[]) => { const f = fbq as unknown as { callMethod?: (...a: unknown[]) => void }; if (f.callMethod) f.callMethod(...a); else fila.push(a); },
      { queue: fila, loaded: true, version: "2.0" });
    (fbq as unknown as { push: unknown }).push = fbq;
    w().fbq = fbq;
    const s = document.createElement("script"); s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(s);
    fbq("init", META_PIXEL_ID); fbq("track", "PageView");
  }
  if (GA4_ID && !w().gtag) {
    const s = document.createElement("script"); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`; document.head.appendChild(s);
    w().dataLayer = w().dataLayer || [];
    // o gtag espera o objeto "arguments", não um array
    w().gtag = function () { (w().dataLayer as unknown[]).push(arguments); };
    w().gtag!("js", new Date()); w().gtag!("config", GA4_ID);
  }
}

// evento de lead depois do diagnóstico enviado; não faz nada sem consentimento
export function medirLead(objetivo: string) {
  if (!carregado) return;
  w().fbq?.("track", "Lead", { content_name: objetivo });
  w().gtag?.("event", "generate_lead", { objetivo });
}

export function CookieBanner() {
  const [escolha, setEscolha] = useState<string | null>(() => (ativo ? ler() : "sem-medicao"));
  useEffect(() => { if (ativo && escolha === "sim") carregar(); }, [escolha]);
  if (!ativo || escolha) return null;

  const decidir = (v: "sim" | "nao") => { gravar(v); setEscolha(v); };
  return (
    <div role="dialog" aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-24 z-50 rounded-xl border bg-card p-4 text-sm shadow-2xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md">
      <p className="text-muted-foreground">
        A gente usa cookies de medição (Meta e Google) para saber quantas pessoas chegam pelo Instagram. Só liga se você aceitar.{" "}
        <a href={`${import.meta.env.BASE_URL}privacidade/`} className="text-primary underline underline-offset-4">Política de privacidade</a>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => decidir("sim")} className="btn-primary flex-1 px-4 py-2 text-sm">Aceitar</button>
        <button onClick={() => decidir("nao")} className="btn-outline flex-1 px-4 py-2 text-sm">Recusar</button>
      </div>
    </div>
  );
}
