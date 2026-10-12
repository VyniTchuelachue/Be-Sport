import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useShop } from '../context/ShopContext.jsx';
import { api } from '../lib/api.js';
import { fcfa } from '../lib/format.js';
import { ArrowIcon, BagIcon, CheckIcon, MinusIcon, PlusIcon, StoreIcon, TrashIcon, TruckIcon, WhatsAppIcon } from '../components/Icons.jsx';

function Field({ label, error, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[13px] text-steel">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] font-semibold text-tag">
          {error}
        </p>
      )}
    </div>
  );
}

function CartLine({ line }) {
  const { setQty, removeLine } = useShop();
  return (
    <li className="flex gap-4 py-5">
      <Link to={`/produit/${line.slug}`} className="shrink-0">
        <img src={line.image} alt="" className="size-24 rounded-md bg-floor object-cover sm:size-28" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-steel">{line.brand}</p>
            <Link to={`/produit/${line.slug}`} className="font-semibold hover:underline">
              {line.name}
            </Link>
            {line.size && <p className="mt-0.5 text-sm text-steel">Taille {line.size}</p>}
          </div>
          <p className="shrink-0 font-bold">{fcfa(line.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex h-9 items-center rounded-md border border-line">
            <button type="button" onClick={() => setQty(line.slug, line.size, line.qty - 1)} className="grid h-full w-9 place-items-center" aria-label={`Retirer un ${line.name}`}>
              <MinusIcon className="size-4" />
            </button>
            <span className="w-7 text-center text-sm font-bold tabular-nums">{line.qty}</span>
            <button type="button" onClick={() => setQty(line.slug, line.size, line.qty + 1)} className="grid h-full w-9 place-items-center" aria-label={`Ajouter un ${line.name}`}>
              <PlusIcon className="size-4" />
            </button>
          </div>
          <button type="button" onClick={() => removeLine(line.slug, line.size)} className="flex items-center gap-1.5 text-sm text-steel hover:text-tag">
            <TrashIcon className="size-4" /> Retirer
          </button>
        </div>
      </div>
    </li>
  );
}

function Checkout({ onDone }) {
  const { cart, cartTotal, clearCart } = useShop();
  const [form, setForm] = useState({ name: '', phone: '', fulfilment: 'livraison', district: '', note: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setMessage('');
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: { ...form, items: cart.map(({ slug, size, qty }) => ({ slug, size, qty })) },
      });
      clearCart();
      onDone(order);
    } catch (err) {
      setErrors(err.fields || {});
      setMessage(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Comment souhaitez-vous recevoir votre commande ?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { v: 'livraison', label: 'Livraison', sub: 'À Douala', Icon: TruckIcon },
            { v: 'retrait', label: 'Retrait', sub: 'Au magasin', Icon: StoreIcon },
          ].map(({ v, label, sub, Icon }) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] p-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 ${form.fulfilment === v ? 'border-ink bg-white' : 'border-line bg-white/60'}`}
            >
              <input type="radio" name="fulfilment" value={v} checked={form.fulfilment === v} onChange={set('fulfilment')} className="sr-only" />
              <Icon className="size-6 shrink-0" />
              <span>
                <span className="block text-sm font-bold">{label}</span>
                <span className="block text-[13px] text-steel">{sub}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Nom complet" id="name" error={errors.name}>
        <input id="name" className="field" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
      </Field>
      <Field label="Téléphone (WhatsApp de préférence)" id="phone" error={errors.phone} hint="Ex. 6 99 00 00 00">
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field"
          value={form.phone}
          onChange={set('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
      </Field>
      {form.fulfilment === 'livraison' && (
        <Field label="Quartier de livraison" id="district" error={errors.district} hint="Akwa, Bonamoussadi, Makepe, Bonapriso…">
          <input id="district" className="field" value={form.district} onChange={set('district')} aria-invalid={!!errors.district} aria-describedby={errors.district ? 'district-error' : undefined} />
        </Field>
      )}
      <Field label="Précisions (facultatif)" id="note">
        <textarea id="note" rows={3} className="field" value={form.note} onChange={set('note')} placeholder="Repère pour le livreur, couleur souhaitée…" />
      </Field>

      {(message || errors.items) && (
        <p className="rounded-md bg-tag/10 p-3 text-sm font-semibold text-tag" role="alert">
          {errors.items || message}
        </p>
      )}

      <div className="border-t border-line pt-5">
        <div className="flex justify-between text-[15px]">
          <span>Articles</span>
          <span className="font-semibold">{fcfa(cartTotal)}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-[15px]">
          <span>{form.fulfilment === 'livraison' ? 'Livraison' : 'Retrait'}</span>
          <span className="text-steel">{form.fulfilment === 'livraison' ? 'Selon le quartier, confirmé sur WhatsApp' : 'Gratuit'}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-bold">Total articles</span>
          <span className="text-2xl font-extrabold">{fcfa(cartTotal)}</span>
        </div>
      </div>

      <button type="submit" disabled={sending} className="btn btn-volt h-13 w-full text-[15px]">
        {sending ? 'Enregistrement…' : 'Valider ma commande'}
        {!sending && <ArrowIcon className="size-4" />}
      </button>
      <p className="text-center text-[13px] text-steel">Rien à payer sur le site : le règlement se fait avec l'équipe Be Sport à la confirmation.</p>
    </form>
  );
}

function Confirmation({ order }) {
  return (
    <div className="wrap max-w-2xl py-20 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-volt">
        <CheckIcon className="size-7" />
      </span>
      {/* `saved` is false when the host cannot store orders; WhatsApp is then the only record. */}
      <h1 className="title mt-6 text-[clamp(1.8rem,4vw,2.6rem)]">
        Commande {order.id} {order.saved ? 'enregistrée' : 'prête à envoyer'}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-steel">
        Dernière étape : envoyez-la sur WhatsApp. L'équipe Be Sport confirme la disponibilité, le délai et le prix de livraison dans la journée.
      </p>
      <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-wa mt-8 h-13 px-7 text-[15px]">
        <WhatsAppIcon /> Envoyer ma commande sur WhatsApp
      </a>
      <p className="mt-6">
        <Link to="/boutique" className="text-sm font-semibold underline underline-offset-4">
          Continuer mes achats
        </Link>
      </p>
    </div>
  );
}

export default function Cart() {
  const { cart, cartCount } = useShop();
  const [order, setOrder] = useState(null);

  // The form sits low on the page; bring the confirmation into view.
  useEffect(() => {
    if (order) window.scrollTo(0, 0);
  }, [order]);

  if (order) return <Confirmation order={order} />;

  if (cart.length === 0) {
    return (
      <div className="wrap max-w-xl py-24 text-center">
        <BagIcon className="mx-auto size-12" />
        <h1 className="title mt-5 text-3xl">Votre panier est vide</h1>
        <p className="mt-3 text-steel">Parcourez les rayons et ajoutez vos articles : vous validerez ensuite la commande en un message WhatsApp.</p>
        <Link to="/boutique?sort=new" className="btn btn-ink mt-8">
          Voir les nouveautés <ArrowIcon className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap pt-8 pb-20">
      <h1 className="title text-[clamp(1.9rem,4vw,2.9rem)]">Mon panier</h1>
      <p className="mt-1.5 text-steel">
        {cartCount} article{cartCount > 1 ? 's' : ''}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((l) => (
            <CartLine key={`${l.slug}-${l.size}`} line={l} />
          ))}
        </ul>
        <section aria-labelledby="checkout-title" className="self-start rounded-xl bg-floor p-5 sm:p-7 lg:sticky lg:top-24">
          <h2 id="checkout-title" className="text-xl font-bold">
            Finaliser la commande
          </h2>
          <p className="mt-1 mb-5 text-sm text-steel">Vos coordonnées servent uniquement à préparer et livrer votre commande.</p>
          <Checkout onDone={setOrder} />
        </section>
      </div>
    </div>
  );
}
