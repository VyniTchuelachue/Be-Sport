import { useState } from 'react';
import { Link } from 'react-router';
import Logo from './Logo.jsx';
import { api, useApi } from '../lib/api.js';
import { groupedHours } from '../lib/hours.js';
import { whatsappLink } from '../lib/format.js';
import { ArrowIcon, CheckIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from './Icons.jsx';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', message: '' });
    try {
      await api('/newsletter', { method: 'POST', body: { email } });
      setState({ status: 'done', message: 'Inscription confirmée. Vous recevrez nos prochaines offres par e-mail.' });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="newsletter" className="text-sm text-white/70">
        Nouveautés, soldes et arrivages, directement par e-mail.
      </label>
      <div className="mt-3 flex overflow-hidden rounded-md bg-white">
        <input
          id="newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse e-mail"
          aria-invalid={state.status === 'error'}
          aria-describedby="newsletter-msg"
          className="min-w-0 flex-1 px-4 py-3 text-sm text-ink placeholder:text-steel focus:outline-none"
        />
        <button type="submit" disabled={state.status === 'sending'} className="grid w-12 place-items-center bg-volt text-ink hover:bg-volt-deep" aria-label="S'inscrire à la newsletter">
          {state.status === 'done' ? <CheckIcon className="size-5" /> : <ArrowIcon className="size-5" />}
        </button>
      </div>
      <p id="newsletter-msg" role="status" className={`mt-2 min-h-5 text-sm ${state.status === 'error' ? 'text-[#ff8a70]' : 'text-volt'}`}>
        {state.message}
      </p>
    </form>
  );
}

const linkCls = 'text-white/70 hover:text-white';

export default function Footer() {
  const { data: store } = useApi('/store');

  return (
    <footer className="on-dark bg-ink text-white">
      <div className="wrap grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr_1.4fr] lg:gap-10">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Vêtements, chaussures et équipements de sport des grandes marques, au Centre commercial Casino de Bonapriso.
          </p>
          {store && (
            <div className="mt-6 flex gap-2">
              <a href={store.social.facebook} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Be Sport sur Facebook">
                <FacebookIcon />
              </a>
              <a href={store.social.instagram} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Be Sport sur Instagram">
                <InstagramIcon />
              </a>
              <a href={whatsappLink(store.whatsapp.number, 'Bonjour Be Sport, ')} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Écrire à Be Sport sur WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          )}
        </div>

        <nav aria-label="Rayons">
          <h2 className="text-sm font-bold">Nos rayons</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className={linkCls} to="/boutique?sort=new">Nouveautés</Link></li>
            <li><Link className={linkCls} to="/boutique?category=chaussures">Chaussures</Link></li>
            <li><Link className={linkCls} to="/boutique?category=vetements">Vêtements</Link></li>
            <li><Link className={linkCls} to="/boutique?category=equipements">Équipements</Link></li>
            <li><Link className={linkCls} to="/boutique?category=accessoires">Accessoires</Link></li>
            <li><Link className={linkCls} to="/boutique?promo=1">Promotions</Link></li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="text-sm font-bold">Nos services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className={linkCls} to="/magasin">Conseils en magasin</Link></li>
            <li><Link className={linkCls} to="/panier">Commande WhatsApp</Link></li>
            <li><Link className={linkCls} to="/panier">Livraison à Douala</Link></li>
            <li><Link className={linkCls} to="/magasin">Retrait en magasin</Link></li>
            <li><Link className={linkCls} to="/favoris">Mes favoris</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold">Le magasin</h2>
          {store && (
            <address className="mt-4 space-y-2.5 text-sm text-white/70 not-italic">
              <p>
                {store.address.place}
                <br />
                {store.address.district}, {store.address.city}
              </p>
              {groupedHours(store.hours).map((h) => (
                <p key={h.days}>
                  {h.days}
                  <br />
                  <span className="text-white">{h.time}</span>
                </p>
              ))}
              <p>
                <a className="hover:text-white" href={`tel:${store.phone.href}`}>
                  {store.phone.display}
                </a>
              </p>
            </address>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold">Newsletter</h2>
          <div className="mt-4">
            <Newsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Be Sport Cameroun, Bonapriso, Douala.</p>
          <p>Prix en francs CFA (FCFA).</p>
        </div>
      </div>
    </footer>
  );
}
