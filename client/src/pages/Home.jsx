import { Link } from 'react-router';
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard.jsx';
import { OpenBadge, SectionHead, StoreBlock, WhatsAppBand } from '../components/Blocks.jsx';
import { useApi } from '../lib/api.js';
import { AdviceIcon, ArrowIcon, InstagramIcon, TagIcon, TruckIcon, WhatsAppIcon } from '../components/Icons.jsx';

const SPORT_TILES = [
  { key: 'running', label: 'Running', image: '/images/sports/running.webp' },
  { key: 'football', label: 'Football', image: '/images/sports/football.webp' },
  { key: 'fitness', label: 'Fitness', image: '/images/sports/fitness.webp' },
  { key: 'basketball', label: 'Basketball', image: '/images/sports/basketball.webp' },
  { key: 'raquette', label: 'Raquette', image: '/images/sports/raquette.webp' },
  { key: 'natation', label: 'Natation', image: '/images/sports/natation.webp' },
];

const AUDIENCES = [
  { title: 'Homme', text: 'Running, football, training', to: '/boutique?gender=homme', image: '/images/photos/aisle-homme.webp', pos: 'object-[50%_30%]' },
  { title: 'Femme', text: 'Fitness, running, natation', to: '/boutique?gender=femme', image: '/images/photos/ua-set.webp', pos: 'object-[50%_35%]' },
  { title: 'Enfant', text: 'Du premier ballon au premier maillot', to: '/boutique?gender=enfant', image: '/images/photos/arena-junior.webp', pos: 'object-[50%_30%]' },
  { title: 'Accessoires & équipements', text: 'Raquettes, ballons, vélos, fitness', to: '/boutique?category=equipements', image: '/images/photos/racket.webp', pos: 'object-[50%_40%]' },
];

const SERVICES = [
  { icon: TagIcon, title: 'Grandes marques', text: 'adidas, Nike, Hoka, Under Armour, arena…' },
  { icon: AdviceIcon, title: 'Conseils en magasin', text: 'Essayez et comparez avant d’acheter' },
  { icon: TruckIcon, title: 'Livraison à domicile', text: 'Partout à Douala' },
  { icon: WhatsAppIcon, title: 'Commande WhatsApp', text: 'Écrivez-nous, on vous répond' },
];

const GALLERY = [
  { src: '/images/photos/football-wall.webp', alt: 'Le mur des maillots de football, du Cameroun à Arsenal' },
  { src: '/images/photos/france.webp', alt: 'Un mannequin en tenue d’entraînement sur le carré de gazon du rayon football' },
  { src: '/images/photos/soldes.webp', alt: 'Les portants Chicago Bulls pendant les soldes' },
  { src: '/images/photos/bayern.webp', alt: 'Le maillot extérieur du Bayern Munich devant le rayon cycle' },
];

function Hero() {
  const { data: store } = useApi('/store');
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <img
        src="/images/photos/hero-store.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[65%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="wrap flex min-h-[min(70vh,660px)] flex-col justify-center py-16 sm:min-h-[min(80vh,660px)] sm:py-20">
        <p className="fade-late flex items-center gap-3 text-[15px] font-medium">
          <span className="h-[3px] w-8 bg-volt" aria-hidden="true" />
          Bonapriso, Douala
        </p>
        <h1 className="display mt-7 text-[clamp(2.2rem,9vw,6.25rem)]">
          <span className="-mt-[0.16em] block overflow-hidden pt-[0.16em] pb-[0.04em]">
            <span className="rise-line">Équipez votre</span>
          </span>
          <span className="-mt-[0.16em] block overflow-hidden pt-[0.16em] pb-[0.04em]">
            <span className="rise-line" style={{ animationDelay: '0.14s' }}>
              performance.
            </span>
          </span>
        </h1>
        <p className="fade-late mt-6 max-w-[34rem] text-[17px] leading-relaxed text-white/85 sm:text-lg">
          Running, football, fitness, basketball et plus encore : les grandes marques du sport réunies dans notre magasin de Bonapriso.
        </p>
        <div className="fade-late mt-8 flex flex-wrap gap-3">
          <Link to="/boutique?sort=new" className="btn btn-volt h-12 px-6">
            Découvrir les nouveautés
            <ArrowIcon className="size-4" />
          </Link>
          <a href="#sports" className="btn btn-line h-12 px-6 text-white">
            Acheter par sport
          </a>
        </div>
        {store && (
          <p className="fade-late mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
            <OpenBadge store={store} className="text-white" />
            <span aria-hidden="true" className="text-white/35">
              /
            </span>
            <span>{store.address.place}</span>
          </p>
        )}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section aria-label="Nos services" className="border-b border-line">
      <div className="wrap">
        {/* gap-px over a grey ground draws the dividers between cells */}
        <ul className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3.5 bg-white px-1 py-5 sm:items-center sm:px-6 sm:py-6 lg:justify-center">
              <Icon className="size-7 shrink-0" />
              <div>
                <p className="text-sm font-bold sm:text-[15px]">{title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-steel">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Sports() {
  const { data } = useApi('/products?limit=1');
  const counts = data?.facets.sport || {};
  return (
    <section id="sports" className="wrap pt-14 sm:pt-16" aria-labelledby="sports-title">
      <SectionHead id="sports-title" title="Achetez par sport" link="/boutique" linkLabel="Tout le catalogue" />
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {SPORT_TILES.map((s) => (
          <li key={s.key} className="w-[44vw] shrink-0 snap-start sm:w-auto">
            <Link to={`/boutique?sport=${s.key}`} className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-ink">
              <img src={s.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
              <span className="sign absolute top-5 left-4 text-[1.05rem] [--wire:1.25rem] sm:text-lg">{s.label}</span>
              {counts[s.key] > 0 && (
                <span className="absolute bottom-3 left-4 text-[13px] font-medium text-white">
                  {counts[s.key]} article{counts[s.key] > 1 ? 's' : ''}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Featured() {
  const { data, loading, error } = useApi('/products?featured=1&limit=8');
  return (
    <section className="wrap pt-14 sm:pt-16" aria-labelledby="featured-title">
      <SectionHead id="featured-title" title="Nouveautés & incontournables" link="/boutique?sort=new" linkLabel="Voir tous les produits" />
      {error ? (
        <p className="rounded-lg bg-floor p-6 text-steel">{error.message}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {loading ? <ProductGridSkeleton count={8} /> : data.items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </section>
  );
}

function RunningBanner() {
  return (
    <section className="mt-16 grid bg-floor sm:mt-20 lg:grid-cols-2" aria-labelledby="running-title">
      <img
        src="/images/photos/runners.webp"
        alt="Trois coureurs en chaussures de running blanches sur un trottoir"
        loading="lazy"
        className="aspect-[16/9] size-full object-cover lg:aspect-auto lg:min-h-[440px]"
      />
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <p className="flex items-center gap-3 text-sm font-semibold">
          Running <span className="h-[3px] w-6 bg-volt" aria-hidden="true" />
        </p>
        <h2 id="running-title" className="display mt-4 text-[clamp(2.4rem,5vw,4.25rem)]">
          Plus vite.
          <br />
          Plus loin.
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-steel">
          Hoka, Brooks, Saucony, New Balance : des chaussures choisies pour l'amorti, le maintien et la durée. Venez les essayer en magasin.
        </p>
        <Link to="/boutique?sport=running" className="btn btn-ink mt-8 self-start">
          Voir le running
          <ArrowIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <section className="wrap pt-16 sm:pt-20" aria-labelledby="audience-title">
      <SectionHead id="audience-title" title="Le bon équipement pour chaque objectif" />
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {AUDIENCES.map((a) => (
          <li key={a.title}>
            <Link to={a.to} className="group block h-full overflow-hidden rounded-lg bg-floor">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={a.image} alt="" loading="lazy" className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${a.pos}`} />
              </div>
              <div className="flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <h3 className="text-base leading-tight font-bold sm:text-lg">{a.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-steel sm:text-sm">{a.text}</p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white transition-colors group-hover:bg-ink group-hover:text-white">
                  <ArrowIcon className="size-4" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Community() {
  const { data: store } = useApi('/store');
  return (
    <section className="wrap pt-16 pb-20 sm:pt-20" aria-labelledby="community-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="community-title" className="title text-[clamp(1.5rem,3vw,2.1rem)]">
            #BeSportCameroun
          </h2>
          <p className="mt-1.5 text-[15px] text-steel">
            Arrivages, soldes et coulisses du magasin{store ? `, suivis par ${store.social.facebookFollowers} fans sur Facebook` : ''}.
          </p>
        </div>
        {store && (
          <a href={store.social.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
            <InstagramIcon className="size-4" />
            {store.social.instagramHandle}
          </a>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {GALLERY.map((g) => (
          <li key={g.src} className="overflow-hidden rounded-lg">
            <img src={g.src} alt={g.alt} loading="lazy" className="aspect-square size-full object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Sports />
      <Featured />
      <RunningBanner />
      <Audiences />
      <div className="pt-16 sm:pt-20">
        <WhatsAppBand />
      </div>
      <div className="pt-6 sm:pt-8">
        <StoreBlock />
      </div>
      <Community />
    </>
  );
}
