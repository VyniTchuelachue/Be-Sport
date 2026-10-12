import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { findProduct, getStore, append, readList } from '../db.js';

const router = Router();

// WhatsApp messages get plain spaces: Intl uses narrow no-break spaces as thousands separators.
const fcfa = (n) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/[^0-9]/g, ' ')} FCFA`;

// Accepts 6XX XX XX XX, 2XX XX XX XX, with or without +237 / 00237.
function normalisePhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '').replace(/^(00)?237/, '');
  return /^[62]\d{8}$/.test(digits) ? `+237${digits}` : null;
}

function orderId() {
  const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Douala' }).format(new Date()).replace(/-/g, '').slice(2);
  return `BS-${d}-${randomBytes(2).toString('hex').toUpperCase()}`;
}

function validate(body) {
  const errors = {};
  const name = String(body?.name ?? '').trim();
  const phone = normalisePhone(body?.phone);
  const fulfilment = body?.fulfilment;
  const district = String(body?.district ?? '').trim();
  const note = String(body?.note ?? '').trim().slice(0, 500);

  if (name.length < 2 || name.length > 80) errors.name = 'Indiquez votre nom (2 caractères minimum).';
  if (!phone) errors.phone = 'Indiquez un numéro camerounais valide, par exemple 6 99 00 00 00.';
  if (!['livraison', 'retrait'].includes(fulfilment)) errors.fulfilment = 'Choisissez la livraison ou le retrait en magasin.';
  if (fulfilment === 'livraison' && district.length < 2) errors.district = 'Indiquez votre quartier pour la livraison.';

  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (rawItems.length === 0 || rawItems.length > 30) errors.items = 'Votre panier est vide.';

  const lines = [];
  for (const item of rawItems.slice(0, 30)) {
    const product = findProduct(item?.slug);
    const qty = Number.parseInt(item?.qty, 10);
    if (!product) {
      errors.items = 'Un article de votre panier n\'est plus disponible. Retirez-le puis réessayez.';
      continue;
    }
    if (!(qty >= 1 && qty <= 10)) {
      errors.items = 'La quantité doit être comprise entre 1 et 10 par article.';
      continue;
    }
    const size = product.sizes.length ? String(item.size ?? '') : null;
    if (product.sizes.length && !product.sizes.includes(size)) {
      errors.items = `Choisissez une taille pour « ${product.name} ».`;
      continue;
    }
    // Prices always come from the catalogue, never from the browser.
    lines.push({ slug: product.slug, brand: product.brand, name: product.name, size, qty, unitPrice: product.price, total: product.price * qty });
  }

  return { errors, order: { name, phone, fulfilment, district, note, lines } };
}

function whatsappMessage(o) {
  const items = o.lines
    .map((l) => `• ${l.qty} × ${l.brand} ${l.name}${l.size ? ` (taille ${l.size})` : ''} : ${fcfa(l.total)}`)
    .join('\n');
  const mode =
    o.fulfilment === 'livraison' ? `Livraison à Douala, quartier ${o.district}` : 'Retrait au magasin de Bonapriso';
  return [
    `Bonjour Be Sport, je souhaite passer la commande ${o.id} :`,
    '',
    items,
    '',
    `Total articles : ${fcfa(o.subtotal)}`,
    `Mode : ${mode}`,
    `Nom : ${o.name}`,
    `Téléphone : ${o.phone}`,
    o.note ? `Note : ${o.note}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

router.post('/orders', async (req, res, next) => {
  try {
    const { errors, order } = validate(req.body);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Certaines informations sont à corriger.', fields: errors });

    const record = {
      id: orderId(),
      createdAt: new Date().toISOString(),
      status: 'nouvelle',
      ...order,
      subtotal: order.lines.reduce((s, l) => s + l.total, 0),
    };
    await append('orders.json', record);

    const text = whatsappMessage(record);
    res.status(201).json({
      id: record.id,
      subtotal: record.subtotal,
      whatsappUrl: `https://wa.me/${getStore().whatsapp.number}?text=${encodeURIComponent(text)}`,
    });
  } catch (err) {
    next(err);
  }
});

// Minimal staff view of incoming orders: GET /api/orders?token=ADMIN_TOKEN
router.get('/orders', async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.query.token !== token) return res.status(401).json({ error: 'Accès réservé à l\'équipe Be Sport.' });
  const list = await readList('orders.json');
  res.json(list.reverse());
});

router.post('/newsletter', async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
      return res.status(422).json({ error: 'Cette adresse e-mail ne semble pas valide.' });
    }
    const list = await readList('newsletter.json');
    if (!list.some((s) => s.email === email)) await append('newsletter.json', { email, createdAt: new Date().toISOString() });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
