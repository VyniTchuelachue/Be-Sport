import { Link, useSearchParams } from 'react-router';
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard.jsx';
import { useApi } from '../lib/api.js';
import { CATEGORIES, GENDERS, SPORTS, whatsappLink } from '../lib/format.js';
import { CloseIcon, FilterIcon, WhatsAppIcon } from '../components/Icons.jsx';

const SORTS = { new: 'Nouveautés', 'price-asc': 'Prix croissant', 'price-desc': 'Prix décroissant' };

function pageTitle(p) {
  if (p.get('q')) return `Résultats pour « ${p.get('q')} »`;
  if (p.get('promo')) return 'Promotions';
  if (p.get('sport')) return SPORTS[p.get('sport')] || 'Sport';
  if (p.get('category')) return CATEGORIES[p.get('category')] || 'Rayon';
  if (p.get('gender')) return GENDERS[p.get('gender')] || 'Catalogue';
  if (p.get('sort') === 'new') return 'Nouveautés';
  return 'Tout le catalogue';
}

function FilterGroup({ title, name, options, counts, params, setParam }) {
  const current = params.get(name) || '';
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="mb-3 text-sm font-bold">{title}</legend>
      <ul className="space-y-1">
        {[['', 'Tout'], ...Object.entries(options)].map(([value, label]) => {
          const count = value ? counts?.[value] : null;
          if (value && !count && current !== value) return null;
          const active = current === value;
          return (
            <li key={value || 'all'}>
              <button
                type="button"
                onClick={() => setParam(name, value)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[15px] ${active ? 'bg-ink font-semibold text-white' : 'hover:bg-floor'}`}
              >
                {label}
                {count ? <span className={`text-xs tabular-nums ${active ? 'text-white/70' : 'text-steel'}`}>{count}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const { data, loading, error } = useApi(`/products${query ? `?${query}` : ''}`);
  const { data: store } = useApi('/store');

  const setParam = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next);
  };

  const activeFilters = [
    ['q', params.get('q') && `« ${params.get('q')} »`],
    ['category', CATEGORIES[params.get('category')]],
    ['sport', SPORTS[params.get('sport')]],
    ['gender', GENDERS[params.get('gender')]],
    ['promo', params.get('promo') && 'En promotion'],
  ].filter(([, label]) => label);

  const filters = (
    <>
      <FilterGroup title="Rayon" name="category" options={CATEGORIES} counts={data?.facets.category} params={params} setParam={setParam} />
      <FilterGroup title="Sport" name="sport" options={SPORTS} counts={data?.facets.sport} params={params} setParam={setParam} />
      <FilterGroup title="Pour qui" name="gender" options={GENDERS} counts={null} params={params} setParam={setParam} />
      <div className="py-5">
        <label className="flex cursor-pointer items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            className="size-5 accent-black"
            checked={!!params.get('promo')}
            onChange={(e) => setParam('promo', e.target.checked ? '1' : '')}
          />
          Uniquement les promotions
        </label>
      </div>
    </>
  );

  return (
    <div className="wrap pt-8 pb-20">
      <nav aria-label="Fil d'Ariane" className="text-sm text-steel">
        <Link to="/" className="hover:text-ink">
          Accueil
        </Link>{' '}
        / <span className="text-ink">Boutique</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="title text-[clamp(1.9rem,4vw,2.9rem)]">{pageTitle(params)}</h1>
          <p className="mt-1.5 text-[15px] text-steel" aria-live="polite">
            {loading ? 'Chargement…' : data ? `${data.total} article${data.total > 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-steel">Trier par</span>
          <select value={params.get('sort') || 'new'} onChange={(e) => setParam('sort', e.target.value)} className="field h-10 min-h-0 w-auto py-0 pr-8 font-semibold">
            {Object.entries(SORTS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeFilters.length > 0 && (
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {activeFilters.map(([name, label]) => (
            <li key={name}>
              <button type="button" onClick={() => setParam(name, '')} className="flex items-center gap-1.5 rounded-full bg-floor py-1.5 pr-2.5 pl-3.5 text-sm font-medium hover:bg-line">
                {label}
                <CloseIcon className="size-3.5" />
                <span className="sr-only">Retirer ce filtre</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setParams({})} className="px-2 text-sm font-semibold underline underline-offset-4">
              Tout effacer
            </button>
          </li>
        </ul>
      )}

      <div className="mt-6 lg:grid lg:grid-cols-[230px_1fr] lg:gap-10">
        <aside aria-label="Filtres">
          <details className="mb-6 rounded-lg border border-line lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold">
              <FilterIcon className="size-5" /> Filtrer
            </summary>
            <div className="px-4 pb-2">{filters}</div>
          </details>
          <div className="sticky top-24 hidden lg:block">{filters}</div>
        </aside>

        <div>
          {error ? (
            <p className="rounded-lg bg-floor p-6 text-steel">{error.message}</p>
          ) : !loading && data?.items.length === 0 ? (
            <div className="rounded-xl bg-floor px-6 py-14 text-center">
              <p className="title text-2xl">Aucun article ne correspond</p>
              <p className="mx-auto mt-2 max-w-md text-steel">
                Retirez un filtre pour voir plus d'articles, ou demandez-nous directement : tout n'est pas encore en ligne.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => setParams({})} className="btn btn-ink">
                  Voir tout le catalogue
                </button>
                {store && (
                  <a
                    href={whatsappLink(store.whatsapp.number, `Bonjour Be Sport, je cherche : ${params.get('q') || ''}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-wa"
                  >
                    <WhatsAppIcon /> Demander sur WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 xl:grid-cols-3">
              {loading ? <ProductGridSkeleton count={6} /> : data.items.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
