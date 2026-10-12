import { useState } from 'react';
import { Link, useParams } from 'react-router';
import ProductCard, { Badge, Price } from '../components/ProductCard.jsx';
import { SectionHead } from '../components/Blocks.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useApi } from '../lib/api.js';
import { CATEGORIES, SPORTS, fcfa, whatsappLink } from '../lib/format.js';
import { BagIcon, CheckIcon, HeartIcon, MinusIcon, PlusIcon, StoreIcon, TruckIcon, WhatsAppIcon } from '../components/Icons.jsx';
import NotFound from './NotFound.jsx';

function ProductView({ product, related, store }) {
  const { addToCart, isFavorite, toggleFavorite } = useShop();
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const needsSize = product.sizes.length > 0;
  const fav = isFavorite(product.slug);

  const add = () => {
    if (needsSize && !size) {
      setSizeError(true);
      document.getElementById('size-picker')?.focus();
      return;
    }
    addToCart(product, size, qty);
  };

  const waText = `Bonjour Be Sport, je suis intéressé(e) par : ${product.brand} ${product.name}${size ? ` en taille ${size}` : ''} (${fcfa(product.price)}). Est-il disponible ?`;

  return (
    <>
      <div className="wrap pt-8">
        <nav aria-label="Fil d'Ariane" className="text-sm text-steel">
          <Link to="/" className="hover:text-ink">
            Accueil
          </Link>{' '}
          /{' '}
          <Link to={`/boutique?category=${product.category}`} className="hover:text-ink">
            {CATEGORIES[product.category]}
          </Link>{' '}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="relative self-start overflow-hidden rounded-xl bg-floor lg:sticky lg:top-24">
            <img src={product.image} alt={`${product.brand} ${product.name}, photographié dans notre magasin`} className="aspect-square w-full object-cover" />
            <div className="absolute top-4 left-4">
              <Badge product={product} />
            </div>
            <p className="absolute right-3 bottom-3 rounded bg-black/60 px-2 py-1 text-xs text-white">Photo prise au magasin</p>
          </div>

          <div>
            <p className="font-semibold text-steel">{product.brand}</p>
            <h1 className="title mt-1 text-[clamp(1.75rem,3.5vw,2.6rem)]">{product.name}</h1>
            <Price product={product} className="mt-3 text-xl" />
            <p className="mt-1 text-sm text-steel">
              {SPORTS[product.sport]} · {CATEGORIES[product.category]}
            </p>

            {needsSize && (
              <fieldset className="mt-8">
                <legend className="mb-3 flex w-full justify-between text-sm font-bold">
                  Taille
                  {size && <span className="font-normal text-steel">Sélectionnée : {size}</span>}
                </legend>
                <div id="size-picker" tabIndex={-1} className="flex flex-wrap gap-2 focus:outline-none" role="radiogroup" aria-describedby={sizeError ? 'size-error' : undefined}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      className={`min-w-14 rounded-md border-[1.5px] px-3 py-2.5 text-[15px] font-semibold ${size === s ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p id="size-error" className="mt-2 text-sm font-semibold text-tag" role="alert">
                    Choisissez une taille pour ajouter cet article au panier.
                  </p>
                )}
                <p className="mt-2 text-sm text-steel">Un doute sur la taille ? Venez essayer en magasin ou demandez-nous sur WhatsApp.</p>
              </fieldset>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex h-12 items-center rounded-md border-[1.5px] border-line">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center" aria-label="Diminuer la quantité">
                  <MinusIcon className="size-4" />
                </button>
                <span className="w-8 text-center font-bold tabular-nums" aria-live="polite">
                  <span className="sr-only">Quantité : </span>
                  {qty}
                </span>
                <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-full w-11 place-items-center" aria-label="Augmenter la quantité">
                  <PlusIcon className="size-4" />
                </button>
              </div>
              <button type="button" onClick={add} className="btn btn-ink h-12 flex-1 text-[15px]">
                <BagIcon className="size-5" />
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(product.slug)}
                aria-pressed={fav}
                aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className="grid size-12 place-items-center rounded-md border-[1.5px] border-line hover:border-ink"
              >
                <HeartIcon className={`size-5 ${fav ? 'fill-tag text-tag' : ''}`} />
              </button>
            </div>

            {store && (
              <a href={whatsappLink(store.whatsapp.number, waText)} target="_blank" rel="noreferrer" className="btn btn-wa mt-3 h-12 w-full text-[15px]">
                <WhatsAppIcon />
                Commander sur WhatsApp
              </a>
            )}

            <ul className="mt-8 grid gap-3 rounded-lg bg-floor p-5 text-[15px] sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <StoreIcon className="size-5 shrink-0" /> Retrait gratuit au magasin de Bonapriso
              </li>
              <li className="flex items-center gap-3">
                <TruckIcon className="size-5 shrink-0" /> Livraison partout à Douala
              </li>
            </ul>

            <div className="mt-8 border-t border-line pt-7">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-3 max-w-prose leading-relaxed text-[#2b2b2b]">{product.description}</p>
              <ul className="mt-5 space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-[15px]">
                    <CheckIcon className="size-4 shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap pt-20 pb-20" aria-labelledby="related-title">
          <SectionHead id="related-title" title="Vous aimerez aussi" link={`/boutique?sport=${product.sport}`} linkLabel={`Tout le rayon ${SPORTS[product.sport].toLowerCase()}`} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { data, loading, error } = useApi(`/products/${slug}`);
  const { data: store } = useApi('/store');

  if (loading) {
    return (
      <div className="wrap grid animate-pulse gap-10 pt-14 pb-24 lg:grid-cols-2" aria-busy="true">
        <div className="aspect-square rounded-xl bg-floor" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-floor" />
          <div className="h-10 w-3/4 rounded bg-floor" />
          <div className="h-6 w-32 rounded bg-floor" />
        </div>
      </div>
    );
  }
  if (error?.status === 404) return <NotFound message={error.message} />;
  if (error) return <p className="wrap py-24 text-steel">{error.message}</p>;

  // key resets size/quantity when moving between products
  return <ProductView key={slug} product={data.product} related={data.related} store={store} />;
}
