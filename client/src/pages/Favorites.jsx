import { Link } from 'react-router';
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useApi } from '../lib/api.js';
import { ArrowIcon, HeartIcon } from '../components/Icons.jsx';

export default function Favorites() {
  const { favorites } = useShop();
  const { data, loading } = useApi('/products');
  const items = data?.items.filter((p) => favorites.includes(p.slug)) || [];

  return (
    <div className="wrap pt-8 pb-20">
      <h1 className="title text-[clamp(1.9rem,4vw,2.9rem)]">Mes favoris</h1>
      {favorites.length === 0 ? (
        <div className="mt-8 rounded-xl bg-floor px-6 py-16 text-center">
          <HeartIcon className="mx-auto size-10" />
          <p className="mt-4 text-lg font-bold">Aucun favori pour l'instant</p>
          <p className="mx-auto mt-2 max-w-md text-steel">Touchez le cœur sur un article pour le retrouver ici, sur cet appareil.</p>
          <Link to="/boutique" className="btn btn-ink mt-7">
            Parcourir le catalogue <ArrowIcon className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {loading ? <ProductGridSkeleton count={Math.min(4, favorites.length)} /> : items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
