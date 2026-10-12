import { Link } from 'react-router';
import { OpenBadge, StoreBlock, WhatsAppBand } from '../components/Blocks.jsx';
import { useApi } from '../lib/api.js';
import { openStatus } from '../lib/hours.js';
import { SPORTS } from '../lib/format.js';

const AISLES = [
  { sign: 'Homme', image: '/images/photos/aisle-homme.webp', alt: "L'allée centrale du magasin, bordée de chaussures et de maillots, sous le panneau Homme" },
  { sign: 'Sports de raquette', image: '/images/photos/racket.webp', alt: 'Le rayon tennis et tennis de table, avec une table Cornilleau' },
  { sign: 'Running', image: '/images/photos/running-shoes.webp', alt: 'Les chaussures de running Hoka, Brooks et New Balance sur leurs boîtes' },
  { sign: 'Football', image: '/images/photos/football-balls.webp', alt: 'Les maillots et le présentoir à ballons du rayon football' },
  { sign: 'Fitness', image: '/images/sports/fitness.webp', alt: "Les vélos d'entraînement ProForm du rayon fitness" },
  { sign: 'Cycle', image: '/images/sports/cycle.webp', alt: 'Les VTT et vélos enfants du rayon cycle' },
];

function HoursTable({ store }) {
  const status = openStatus(store);
  // Monday first
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <table className="w-full text-[15px]">
      <caption className="sr-only">Horaires d'ouverture</caption>
      <tbody>
        {order.map((i) => {
          const h = store.hours[i];
          const today = status?.today === i;
          return (
            <tr key={h.day} className={`border-b border-line last:border-0 ${today ? 'font-bold' : ''}`}>
              <th scope="row" className="py-2.5 text-left font-[inherit]">
                {h.day}
                {today && <span className="ml-2 rounded bg-volt px-1.5 py-0.5 text-xs">Aujourd'hui</span>}
              </th>
              <td className="py-2.5 text-right tabular-nums">
                {h.open} – {h.close}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Store() {
  const { data: store } = useApi('/store');

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
        <img src="/images/photos/storefront.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover object-[50%_45%] opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="wrap flex min-h-[460px] flex-col justify-end pt-24 pb-12">
          <p className="flex items-center gap-3 text-[15px] font-medium">
            <span className="h-[3px] w-8 bg-volt" aria-hidden="true" />
            Centre commercial Casino, Bonapriso
          </p>
          <h1 className="display mt-4 text-[clamp(2.4rem,7vw,5rem)]">Le magasin</h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/85">
            Un grand espace lumineux, avec des rayons pour chaque sport : running, football, fitness, raquette, natation, cycle, sports de combat et plus encore.
          </p>
          {store && <OpenBadge store={store} className="mt-6 text-white" />}
        </div>
      </section>

      <section className="wrap grid gap-10 py-14 lg:grid-cols-[1fr_380px] lg:gap-16" aria-label="Infos pratiques">
        <div>
          <h2 className="title text-[clamp(1.5rem,3vw,2.1rem)]">Les rayons</h2>
          <p className="mt-2 max-w-xl text-steel">Suivez les panneaux : chaque sport a son espace, et l'équipe est là pour vous conseiller.</p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AISLES.map((a) => {
              const sportKey = Object.keys(SPORTS).find((k) => SPORTS[k] === a.sign);
              const inner = (
                <>
                  <img src={a.image} alt={a.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                  <span className="sign absolute top-4 left-3 text-base [--wire:1rem]">{a.sign}</span>
                </>
              );
              return (
                <li key={a.sign} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-ink">
                  {sportKey ? (
                    <Link to={`/boutique?sport=${sportKey}`} className="block size-full">
                      {inner}
                    </Link>
                  ) : a.sign === 'Homme' ? (
                    <Link to="/boutique?gender=homme" className="block size-full">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="self-start rounded-xl bg-floor p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Horaires</h2>
          {store ? <div className="mt-3"><HoursTable store={store} /></div> : <div className="mt-3 h-64 animate-pulse rounded bg-line" />}
          <h2 className="mt-8 text-lg font-bold">Services</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>Conseils et essayage sur place</li>
            <li>Commande et réservation sur WhatsApp</li>
            <li>Livraison à domicile à Douala</li>
            <li>Retrait au magasin</li>
          </ul>
        </aside>
      </section>

      <StoreBlock />
      <div className="py-16 sm:py-20">
        <WhatsAppBand />
      </div>
    </>
  );
}
