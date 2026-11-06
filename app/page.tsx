"use client";

import { useEffect, useMemo, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, firebaseReady } from "@/lib/firebase";
import { ArrowUpRight, BadgeCheck, ChevronDown, Heart, LogOut, Search, ShieldCheck, ShoppingBag, Sparkles, X } from "lucide-react";

type Product = {
  title: string; price: string; extracted_price?: number; source?: string;
  link?: string; thumbnail?: string; delivery?: string; rating?: number; reviews?: number;
};

const popular = ["AirPods", "Nike sneakers", "LEGO", "iPhone", "Gaming headset"];
const money = (p?: number) => typeof p === "number"
  ? new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 }).format(p)
  : "";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<"price" | "relevance">("price");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); }), []);
  const sorted = useMemo(() => {
    const copy = [...items];
    if (sort === "price") copy.sort((a,b) => (a.extracted_price ?? Infinity) - (b.extracted_price ?? Infinity));
    return copy;
  }, [items, sort]);

  async function login() {
    if (!firebaseReady) { setError("Google-login er ikke sat op endnu. Følg opsætningen i README.md."); return; }
    setError("");
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch { setError("Login blev ikke gennemført. Prøv igen."); }
  }
  async function search(term = query) {
    const clean = term.trim();
    if (!clean) return;
    setQuery(clean); setSearched(clean); setLoading(true); setError(""); setItems([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Søgningen kunne ikke gennemføres.");
      setItems(data.products || []);
      if (!data.products?.length) setError("Vi fandt ingen produkter. Prøv et andet søgeord.");
    } catch (e) { setError(e instanceof Error ? e.message : "Noget gik galt."); }
    finally { setLoading(false); }
  }
  function toggleFavorite(key: string) {
    setFavorites(old => old.includes(key) ? old.filter(x => x !== key) : [...old, key]);
  }

  if (authLoading) return <main className="loading-screen"><div className="brand-mark">o</div><p>Olly starter...</p></main>;

  if (!user) return (
    <main className="login-page">
      <div className="login-glow glow-one" /><div className="login-glow glow-two" />
      <section className="login-card">
        <div className="brand"><span className="brand-mark">o</span><span>olly<span className="brand-dot">.</span></span></div>
        <div className="hero-orb"><ShoppingBag size={42} strokeWidth={1.7}/><span className="orb-spark">✦</span></div>
        <p className="eyebrow"><Sparkles size={14}/> SMART SHOPPING</p>
        <h1>Find det.<br/><span>Billigere.</span></h1>
        <p className="login-copy">Søg efter dine yndlingsprodukter og sammenlign priser fra webshops – samlet ét sted.</p>
        <button className="google-button" onClick={login}><GoogleIcon/> Fortsæt med Google</button>
        {error && <p className="error-text">{error}</p>}
        <p className="privacy"><ShieldCheck size={14}/> Sikker login med Google</p>
      </section>
      <footer className="login-footer">olly. <span>·</span> Shop smarter</footer>
    </main>
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">o</span><span>olly<span className="brand-dot">.</span></span></a>
        <div className="account"><img src={user.photoURL || ""} alt="" referrerPolicy="no-referrer"/><span>{user.displayName?.split(" ")[0] || "Min konto"}</span><button aria-label="Log ud" onClick={() => signOut(auth)}><LogOut size={17}/></button></div>
      </header>
      <section className="search-hero">
        <div className="hero-content">
          <div className="eyebrow"><Sparkles size={14}/> DEN SMARTE MÅDE AT SHOPPE PÅ</div>
          <h1>Find det.<br/><span>Billigere.</span></h1>
          <p>Søg blandt produkter og sammenlign priser fra forskellige butikker.</p>
          <form className="search-box" onSubmit={e => {e.preventDefault(); search();}}>
            <Search size={21}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Hvad leder du efter?" aria-label="Søg efter produkter"/>
            {query && <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Ryd søgning"><X size={17}/></button>}
            <button className="search-submit" type="submit">Søg <ArrowUpRight size={17}/></button>
          </form>
          <div className="popular"><span>Populært:</span>{popular.map(p => <button key={p} onClick={() => search(p)}>{p}</button>)}</div>
        </div>
        <div className="hero-decoration"><div className="sun-disc"/><div className="floating-tag tag-one">BEDSTE PRIS <BadgeCheck size={14}/></div><div className="floating-tag tag-two">Sammenlign nemt ✦</div><div className="hero-bag"><ShoppingBag size={78} strokeWidth={1.2}/></div></div>
      </section>

      <section className="results-section">
        <div className="results-heading"><div><p className="section-kicker">{searched ? "DINE SØGERESULTATER" : "KOM GODT I GANG"}</p><h2>{searched ? <>Resultater for <span>“{searched}”</span></> : "Hvad skal vi finde?"}</h2></div>
          {items.length > 0 && <label className="sort-select">Sortér efter <select value={sort} onChange={e => setSort(e.target.value as "price"|"relevance")}><option value="price">Laveste pris</option><option value="relevance">Relevans</option></select><ChevronDown size={14}/></label>}
        </div>
        {loading && <div className="state-box"><div className="spinner"/><b>Olly leder efter de bedste priser...</b><span>Det kan tage et øjeblik.</span></div>}
        {!loading && error && <div className="state-box error-state"><b>{error}</b><span>Prøv gerne et andet søgeord.</span></div>}
        {!loading && !searched && <div className="empty-grid">{["Elektronik","Mode & sneakers","Gaming","Hjem & fritid"].map((x,i)=><button key={x} className="category-tile" onClick={() => search(["headphones","sneakers","gaming keyboard","air fryer"][i])}><span>{["🎧","👟","🎮","🏠"][i]}</span><b>{x}</b><ArrowUpRight size={17}/></button>)}</div>}
        {!loading && sorted.length > 0 && <div className="product-grid">{sorted.map((p,i) => {
          const key = `${p.title}-${p.source}-${p.price}`;
          return <article className="product-card" key={key}>
            <button className={`favorite ${favorites.includes(key) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(key)} aria-label="Gem favorit"><Heart size={18} fill={favorites.includes(key) ? "currentColor" : "none"}/></button>
            <div className="product-image">{p.thumbnail ? <img src={p.thumbnail} alt={p.title} loading="lazy"/> : <ShoppingBag size={42}/>} {i===0 && sort==="price" && <span className="best-badge">Laveste pris</span>}</div>
            <div className="product-info"><p className="store-name">{p.source || "Webshop"}</p><h3>{p.title}</h3><div className="price-line"><strong>{p.extracted_price != null ? money(p.extracted_price) : p.price}</strong>{p.delivery && <small>{p.delivery}</small>}</div>
              {p.rating && <div className="rating">★ {p.rating.toFixed(1)} {p.reviews ? `(${p.reviews.toLocaleString("da-DK")})` : ""}</div>}
              {p.link && <a className="shop-link" href={p.link} target="_blank" rel="noopener noreferrer">Se tilbud <ArrowUpRight size={16}/></a>}
            </div>
          </article>;
        })}</div>}
        <p className="disclaimer">Priser og lagerstatus kan ændre sig. Tjek altid den endelige pris hos butikken, før du køber.</p>
      </section>
      <footer className="app-footer"><span className="brand-small">olly.</span><span>Find det. Billigere.</span><span>© {new Date().getFullYear()} Olly</span></footer>
    </main>
  );
}

function GoogleIcon() { return <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#4A90E2" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z"/><path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.2 11.4-8.2Z"/></svg>}
