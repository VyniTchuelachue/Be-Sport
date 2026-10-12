const nf = new Intl.NumberFormat('fr-FR');

const NBSP = String.fromCharCode(160);

// 95000 becomes "95 000 FCFA", glued with no-break spaces so a price never wraps mid-number.
export const fcfa = (n) => `${nf.format(n).replace(/[^0-9]/g, NBSP)}${NBSP}FCFA`;

export const CATEGORIES = {
  chaussures: 'Chaussures',
  vetements: 'Vêtements',
  equipements: 'Équipements',
  accessoires: 'Accessoires',
};

export const SPORTS = {
  running: 'Running',
  football: 'Football',
  fitness: 'Fitness',
  basketball: 'Basketball',
  raquette: 'Sports de raquette',
  natation: 'Natation',
  cycle: 'Cycle',
  multisport: 'Multisport',
};

export const GENDERS = {
  homme: 'Homme',
  femme: 'Femme',
  enfant: 'Enfant',
};

export const discount = (p) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export function whatsappLink(number, text) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
