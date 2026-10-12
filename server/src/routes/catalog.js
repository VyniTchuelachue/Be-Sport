import { Router } from 'express';
import { getProducts, getStore, getPromotions, findProduct } from '../db.js';

const router = Router();

const normalise = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

// Today's date in Douala, as YYYY-MM-DD, so promotions switch at local midnight.
function doualaToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: getStore().timezone || 'Africa/Douala' }).format(new Date());
}

function countBy(list, key) {
  const counts = {};
  for (const item of list) counts[item[key]] = (counts[item[key]] || 0) + 1;
  return counts;
}

const sorters = {
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

router.get('/store', (_req, res) => res.json(getStore()));

router.get('/promotions', (_req, res) => {
  const today = doualaToday();
  res.json(getPromotions().filter((p) => p.start <= today && today <= p.end));
});

router.get('/products', (req, res) => {
  const { category, sport, gender, q, sort = 'new', featured, promo, limit } = req.query;
  let list = getProducts();

  if (q) {
    const terms = normalise(q).split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const hay = normalise(`${p.brand} ${p.name} ${p.category} ${p.sport} ${p.description}`);
      return terms.every((t) => hay.includes(t));
    });
  }
  // Facets are computed before the category/sport/gender filters so the
  // sidebar always shows every option that the search query allows.
  const facets = {
    category: countBy(list, 'category'),
    sport: countBy(list, 'sport'),
    gender: countBy(list, 'gender'),
  };

  if (category) list = list.filter((p) => p.category === category);
  if (sport) list = list.filter((p) => p.sport === sport);
  if (gender) {
    // A "mixte" item belongs in every gender aisle except kids.
    list = list.filter((p) => p.gender === gender || (p.gender === 'mixte' && gender !== 'enfant'));
  }
  if (featured) list = list.filter((p) => p.featured);
  if (promo) list = list.filter((p) => p.compareAt);

  list = [...list].sort(sorters[sort] || sorters.new);
  const total = list.length;
  const n = Number.parseInt(limit, 10);
  if (n > 0) list = list.slice(0, n);

  res.json({ items: list, total, facets });
});

router.get('/products/:slug', (req, res) => {
  const product = findProduct(req.params.slug);
  if (!product) return res.status(404).json({ error: "Ce produit n'existe pas ou n'est plus en vente." });

  const related = getProducts()
    .filter((p) => p.slug !== product.slug && (p.sport === product.sport || p.category === product.category))
    .sort((a, b) => (b.sport === product.sport) - (a.sport === product.sport))
    .slice(0, 4);

  res.json({ product, related });
});

export default router;
