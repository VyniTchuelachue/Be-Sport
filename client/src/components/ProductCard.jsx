import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useShop } from '../context/ShopContext.jsx';
import { discount, fcfa } from '../lib/format.js';
import { BagIcon, CloseIcon, HeartIcon } from './Icons.jsx';

export function Badge({ product }) {
  const off = discount(product);
  if (off) return <span className="tag-round">-{off}%</span>;
  if (!product.badge) return null;
  const tone = product.badge === 'Nouveau' ? 'bg-volt text-ink' : 'bg-ink text-white';
  return <span className={`rounded-[4px] px-2 py-1 text-xs font-bold ${tone}`}>{product.badge}</span>;
}

export function Price({ product, className = '' }) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`font-extrabold ${product.compareAt ? 'text-tag' : ''}`}>{fcfa(product.price)}</span>
      {product.compareAt && (
        <s className="text-sm text-steel">
          <span className="sr-only">au lieu de </span>
          {fcfa(product.compareAt)}
        </s>
      )}
    </p>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useShop();
  const [picking, setPicking] = useState(false);
  const pickerRef = useRef(null);
  const fav = isFavorite(product.slug);
  const hasSizes = product.sizes.length > 0;

  useEffect(() => {
    if (picking) pickerRef.current?.querySelector('button')?.focus();
  }, [picking]);

  const add = (size = null) => {
    addToCart(product, size);
    setPicking(false);
  };

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-lg bg-floor">
        <Link to={`/produit/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3">
          <Badge product={product} />
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(product.slug)}
          aria-pressed={fav}
          aria-label={fav ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm hover:bg-white"
        >
          <HeartIcon className={`size-[18px] ${fav ? 'fill-tag text-tag' : ''}`} />
        </button>

        {picking && (
          <div ref={pickerRef} className="absolute inset-x-0 bottom-0 bg-white/95 p-3 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.35)] backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold" id={`sizes-${product.slug}`}>
                Choisissez votre taille
              </p>
              <button type="button" onClick={() => setPicking(false)} className="grid size-7 place-items-center rounded-full hover:bg-floor" aria-label="Fermer">
                <CloseIcon className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`sizes-${product.slug}`}>
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => add(s)} className="min-w-10 rounded-md border border-line px-2.5 py-1.5 text-sm font-semibold hover:border-ink hover:bg-ink hover:text-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[13px] font-semibold text-steel">{product.brand}</p>
        <h3 className="mt-0.5 text-[15px] leading-snug font-semibold">
          <Link to={`/produit/${product.slug}`} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Price product={product} className="mt-1.5" />
        <button
          type="button"
          onClick={() => (hasSizes ? setPicking((v) => !v) : add())}
          aria-expanded={hasSizes ? picking : undefined}
          className="btn btn-ink mt-3.5 w-full"
        >
          <BagIcon className="size-[18px]" />
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="animate-pulse" aria-hidden="true">
      <div className="aspect-square rounded-lg bg-floor" />
      <div className="mt-3 h-3 w-1/3 rounded bg-floor" />
      <div className="mt-2 h-4 w-3/4 rounded bg-floor" />
      <div className="mt-2 h-4 w-1/4 rounded bg-floor" />
      <div className="mt-3.5 h-[46px] rounded-md bg-floor" />
    </div>
  ));
}
