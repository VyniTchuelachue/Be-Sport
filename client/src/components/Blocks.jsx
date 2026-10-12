import { Link } from 'react-router';
import { useApi } from '../lib/api.js';
import { groupedHours, openStatus } from '../lib/hours.js';
import { whatsappLink } from '../lib/format.js';
import { ArrowIcon, CheckIcon, ClockIcon, PhoneIcon, PinIcon, StarIcon, WhatsAppIcon } from './Icons.jsx';

export function SectionHead({ title, link, linkLabel, id }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 id={id} className="title text-[clamp(1.5rem,3vw,2.1rem)]">
        {title}
      </h2>
      {link && (
        <Link to={link} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">
          {linkLabel}
          <ArrowIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function OpenBadge({ store, className = '' }) {
  const status = openStatus(store);
  if (!status) return null;
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-semibold ${className}`}>
      <span className={`relative size-2.5 rounded-full ${status.open ? 'bg-[#2fbf4a]' : 'bg-steel'}`} aria-hidden="true" />
      {status.label}
    </span>
  );
}

export function WhatsAppBand() {
  const { data: store } = useApi('/store');
  const href = store ? whatsappLink(store.whatsapp.number, 'Bonjour Be Sport, ') : '#';

  return (
    <section className="wrap" aria-labelledby="wa-title">
      <div className="on-dark grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-[1.25fr_1fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <h2 id="wa-title" className="title max-w-lg text-[clamp(1.6rem,3.2vw,2.4rem)]">
            Besoin d'un conseil ? Commandez directement sur WhatsApp.
          </h2>
          <ul className="mt-6 grid gap-3 text-[15px] text-white/85 sm:grid-cols-3 sm:gap-4">
            {['Conseils personnalisés', 'Disponibilité en temps réel', 'Livraison à Douala'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 shrink-0 text-volt" />
                {t}
              </li>
            ))}
          </ul>
          <a href={href} target="_blank" rel="noreferrer" className="btn btn-volt mt-8">
            <WhatsAppIcon className="size-5" />
            Écrire sur WhatsApp
          </a>
          {store && <p className="mt-3 text-sm text-white/60">{store.whatsapp.display}</p>}
        </div>

        {/* An example exchange, so people know what to expect. */}
        <div className="relative hidden items-end justify-center bg-[#1a1a1a] px-8 pt-10 md:flex" aria-hidden="true">
          <div className="w-full max-w-[290px] rounded-t-[28px] border-x-[6px] border-t-[6px] border-[#2c2c2c] bg-[#ece5dd] text-[13px] text-ink">
            <div className="flex items-center gap-3 rounded-t-[22px] bg-[#075e54] px-4 py-3 text-white">
              <span className="grid size-8 place-items-center rounded-full bg-white text-[10px] font-extrabold text-ink">be</span>
              <div>
                <p className="font-bold">Be Sport Cameroun</p>
                <p className="text-[11px] text-white/75">en ligne</p>
              </div>
            </div>
            <div className="space-y-2.5 p-3 pb-6">
              <p className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                Bonjour ! Les Hoka sont-elles disponibles en 42 ?
              </p>
              <p className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 shadow-sm">
                Bonjour ! Oui, il nous reste le 42. On vous les livre ou vous passez au magasin ?
              </p>
              <p className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">Livraison à Bonamoussadi svp 🙏</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoreBlock({ headingLevel: H = 'h2' }) {
  const { data: store } = useApi('/store');
  if (!store) return <div className="wrap h-[420px] animate-pulse rounded-xl bg-floor" />;

  return (
    <section className="wrap" aria-labelledby="store-title">
      <div className="grid overflow-hidden rounded-xl border border-line lg:grid-cols-[1.1fr_1fr_1fr]">
        <img
          src="/images/photos/storefront-wide.webp"
          alt="La façade noire du magasin Be Sport, à côté du supermarché Casino de Bonapriso"
          loading="lazy"
          className="aspect-[16/10] size-full object-cover lg:aspect-auto"
        />

        <div className="flex flex-col justify-center p-7 sm:p-9">
          <p className="flex items-center gap-3 text-sm font-semibold text-steel">
            Notre magasin <span className="h-[3px] w-6 bg-volt" aria-hidden="true" />
          </p>
          <H id="store-title" className="title mt-2 text-[clamp(1.5rem,2.6vw,2rem)]">
            Retrouvez-nous à Bonapriso
          </H>

          <dl className="mt-6 space-y-4 text-[15px]">
            <div className="flex gap-3">
              <dt>
                <PinIcon className="mt-0.5 size-5" />
                <span className="sr-only">Adresse</span>
              </dt>
              <dd>
                {store.address.place}, {store.address.district}, {store.address.city}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt>
                <ClockIcon className="mt-0.5 size-5" />
                <span className="sr-only">Horaires</span>
              </dt>
              <dd>
                {groupedHours(store.hours).map((h) => (
                  <span key={h.days} className="block">
                    {h.days} : <span className="font-semibold tabular-nums">{h.time}</span>
                  </span>
                ))}
                <OpenBadge store={store} className="mt-1.5" />
              </dd>
            </div>
            <div className="flex gap-3">
              <dt>
                <PhoneIcon className="mt-0.5 size-5" />
                <span className="sr-only">Téléphone</span>
              </dt>
              <dd>
                <a href={`tel:${store.phone.href}`} className="font-semibold underline-offset-4 hover:underline">
                  {store.phone.display}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={store.maps.directions} target="_blank" rel="noreferrer" className="btn btn-ink">
              Voir l'itinéraire
              <ArrowIcon className="size-4" />
            </a>
            <a href={`tel:${store.phone.href}`} className="btn btn-line">
              Appeler
            </a>
          </div>

          <a href={store.maps.place} target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-1.5 text-sm text-steel hover:text-ink">
            <span className="flex text-ink" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className={`size-4 ${i < Math.round(store.rating.value) ? '' : 'opacity-25'}`} />
              ))}
            </span>
            <span>
              {String(store.rating.value).replace('.', ',')}/5 sur {store.rating.source} ({store.rating.count} avis)
            </span>
          </a>
        </div>

        <iframe
          title="Plan d'accès au magasin Be Sport, Bonapriso"
          src={store.maps.embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 grayscale-[0.4] lg:h-full lg:min-h-[420px]"
        />
      </div>
    </section>
  );
}
