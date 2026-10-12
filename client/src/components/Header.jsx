import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import Logo from './Logo.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useApi } from '../lib/api.js';
import { openStatus } from '../lib/hours.js';
import { SPORTS } from '../lib/format.js';
import {
  BagIcon,
  ChevronIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  StoreIcon,
  TruckIcon,
  WhatsAppIcon,
  ArrowIcon,
} from './Icons.jsx';

const NAV = [
  { label: 'Nouveautés', to: '/boutique?sort=new', match: (p) => p.get('sort') === 'new' },
  { label: 'Chaussures', to: '/boutique?category=chaussures', match: (p) => p.get('category') === 'chaussures' },
  { label: 'Vêtements', to: '/boutique?category=vetements', match: (p) => p.get('category') === 'vetements' },
  { label: 'Équipements', to: '/boutique?category=equipements', match: (p) => p.get('category') === 'equipements' },
];

const SPORT_LINKS = Object.entries(SPORTS).filter(([k]) => k !== 'multisport');

function TopBar({ store }) {
  const status = openStatus(store);
  return (
    <div className="on-dark bg-ink text-[13px] text-white">
      <div className="wrap flex h-9 items-center justify-between gap-6">
        <ul className="no-scrollbar flex min-w-0 items-center gap-6 overflow-x-auto whitespace-nowrap">
          <li className="flex items-center gap-2">
            <TruckIcon className="size-4 text-volt" /> Livraison à Douala
          </li>
          <li className="hidden items-center gap-2 sm:flex">
            <WhatsAppIcon className="size-4 text-volt" /> Commande WhatsApp
          </li>
          <li className="hidden items-center gap-2 md:flex">
            <StoreIcon className="size-4 text-volt" /> Retrait en magasin
          </li>
        </ul>
        {status && (
          <Link to="/magasin" className="flex shrink-0 items-center gap-2 text-white/85 hover:text-white">
            <span className={`size-2 rounded-full ${status.open ? 'bg-volt' : 'bg-white/40'}`} aria-hidden="true" />
            <span>
              <span className="hidden lg:inline">Bonapriso : </span>
              {status.label}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

function PromoRibbon() {
  const { data } = useApi('/promotions');
  const promo = data?.[0];
  if (!promo) return null;
  const until = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(`${promo.end}T12:00:00`));
  return (
    <div className="bg-volt text-sm text-ink">
      <div className="wrap flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <strong className="font-extrabold">{promo.title}.</strong>
        <span>
          {promo.text} Jusqu'au {until}.
        </span>
        <Link to={promo.link} className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
          {promo.cta}
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function SearchForm({ onDone, autoFocus = false, className = '' }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        navigate(term ? `/boutique?q=${encodeURIComponent(term)}` : '/boutique');
        onDone?.();
      }}
    >
      <label htmlFor={autoFocus ? 'search-mobile' : 'search'} className="sr-only">
        Rechercher un produit
      </label>
      <input
        id={autoFocus ? 'search-mobile' : 'search'}
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un produit, une marque…"
        className="h-11 w-full rounded-full border-0 bg-floor pr-11 pl-5 text-sm placeholder:text-steel focus:bg-white focus:ring-2 focus:ring-ink focus:outline-none"
      />
      <button type="submit" className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-black/5" aria-label="Lancer la recherche">
        <SearchIcon className="size-[18px]" />
      </button>
    </form>
  );
}

function SportsMenu({ active }) {
  return (
    <li className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={`flex h-[72px] items-center gap-1 text-[15px] font-semibold hover:text-steel ${active ? 'shadow-[inset_0_-3px_0_#000]' : ''}`}
      >
        Sports <ChevronIcon className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
      </button>
      <div className="invisible absolute top-full left-1/2 z-40 w-64 -translate-x-1/2 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="rounded-lg border border-line bg-white p-2 shadow-xl">
          {SPORT_LINKS.map(([key, label]) => (
            <li key={key}>
              <Link to={`/boutique?sport=${key}`} className="block rounded-md px-3 py-2.5 text-[15px] font-medium hover:bg-floor">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Header() {
  const { data: store } = useApi('/store');
  const { cartCount, favorites } = useShop();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const params = new URLSearchParams(location.search);
  const onShop = location.pathname === '/boutique';

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <TopBar store={store} />
      <PromoRibbon />
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="wrap flex h-[72px] items-center gap-4 lg:gap-8">
          <button type="button" className="-ml-2 grid size-10 place-items-center lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <MenuIcon className="size-6" />
          </button>

          <Link to="/" className="shrink-0" aria-label="Be Sport, accueil">
            <Logo className="h-11" />
          </Link>

          <nav aria-label="Rayons" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {NAV.map((item) => {
                const active = onShop && item.match(params);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`flex h-[72px] items-center text-[15px] font-semibold hover:text-steel ${active ? 'shadow-[inset_0_-3px_0_#000]' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <SportsMenu active={onShop && params.has('sport')} />
              <li>
                <Link
                  to="/boutique?promo=1"
                  className={`flex h-[72px] items-center text-[15px] font-bold text-tag hover:opacity-80 ${onShop && params.get('promo') ? 'shadow-[inset_0_-3px_0_var(--color-tag)]' : ''}`}
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link
                  to="/magasin"
                  className={`flex h-[72px] items-center whitespace-nowrap text-[15px] font-semibold hover:text-steel ${location.pathname === '/magasin' ? 'shadow-[inset_0_-3px_0_#000]' : ''}`}
                >
                  Le magasin
                </Link>
              </li>
            </ul>
          </nav>

          <SearchForm key={location.search} className="ml-auto hidden w-full max-w-64 md:block xl:max-w-72" />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link to="/favoris" className="relative grid size-11 place-items-center rounded-full hover:bg-floor" aria-label={`Mes favoris (${favorites.length})`}>
              <HeartIcon className="size-[22px]" />
              {favorites.length > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-tag" aria-hidden="true" />}
            </Link>
            <Link to="/panier" className="relative grid size-11 place-items-center rounded-full hover:bg-floor" aria-label={`Panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`}>
              <BagIcon className="size-[22px]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[11px] font-extrabold text-ink ring-2 ring-white" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} inert={!open}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-white transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Menu"
        >
          <div className="flex h-[72px] items-center justify-between border-b border-line px-4">
            <Logo className="h-10" />
            <button type="button" className="grid size-10 place-items-center" onClick={() => setOpen(false)} aria-label="Fermer le menu">
              <CloseIcon className="size-6" />
            </button>
          </div>
          <div className="overflow-y-auto px-4 py-5">
            {open && <SearchForm autoFocus={false} className="mb-6" />}
            <ul className="divide-y divide-line border-y border-line">
              {[...NAV, { label: 'Promotions', to: '/boutique?promo=1' }, { label: 'Le magasin', to: '/magasin' }].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={`flex items-center justify-between py-3.5 text-lg font-semibold ${item.label === 'Promotions' ? 'text-tag' : ''}`}>
                    {item.label} <ArrowIcon className="size-5 text-steel" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-7 mb-3 text-sm font-semibold text-steel">Acheter par sport</p>
            <ul className="flex flex-wrap gap-2">
              {SPORT_LINKS.map(([key, label]) => (
                <li key={key}>
                  <Link to={`/boutique?sport=${key}`} className="block rounded-full border border-line px-4 py-2 text-sm font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
