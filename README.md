# Be Sport Cameroun

Site web du magasin de sport Be Sport, Centre commercial Casino, Bonapriso, Douala.

- **client/** : React 19, Tailwind CSS 4, Vite, React Router
- **server/** : Node.js, Express 5, données en fichiers JSON (pas de base de données à installer)

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

Le site s'ouvre sur http://localhost:5173. L'API tourne sur le port 4000 et Vite lui transmet les appels `/api`.

## Mettre en ligne

```bash
npm run build
```

```bash
npm start
```

`npm start` lance un seul serveur Node qui sert l'API et le site compilé (`client/dist`). Le port se règle avec la variable `PORT` (4000 par défaut). N'importe quel hébergeur Node convient (Render, Railway, un VPS avec PM2…).

## Modifier le contenu

Tout se passe dans `server/data/`. Les changements sont pris en compte à la requête suivante, sans redémarrer.

| Fichier | Contenu |
| --- | --- |
| `products.json` | Le catalogue : marque, nom, prix, tailles, photo, rayon, sport |
| `store.json` | Adresse, téléphone, numéro WhatsApp, horaires, réseaux sociaux |
| `promotions.json` | Le bandeau promo en haut du site, affiché entre les dates `start` et `end` |

Pour un produit :

- `category` : `chaussures`, `vetements`, `equipements` ou `accessoires`
- `sport` : `running`, `football`, `fitness`, `basketball`, `raquette`, `natation`, `cycle` ou `multisport`
- `gender` : `homme`, `femme`, `enfant` ou `mixte`
- `compareAt` : l'ancien prix. S'il est présent, l'article passe en promotion avec sa pastille de réduction.
- `badge` : `Nouveau` ou `Performance` (facultatif)
- `featured` : `true` pour l'afficher sur la page d'accueil
- `image` : chemin d'une photo placée dans `client/public/images/products/`

## Commandes

Le client remplit son panier, puis indique son nom, son téléphone et le mode de réception. Le serveur recalcule les prix à partir du catalogue, enregistre la commande dans `server/data/orders.json`, puis le site propose d'envoyer le récapitulatif sur WhatsApp au numéro défini dans `store.json`. Aucun paiement en ligne.

Pour consulter les commandes reçues, définissez un mot de passe dans la variable d'environnement `ADMIN_TOKEN`, puis ouvrez `/api/orders?token=VOTRE_MOT_DE_PASSE`.

Les inscriptions à la newsletter sont enregistrées dans `server/data/newsletter.json`.

## API

| Méthode | Route | Rôle |
| --- | --- | --- |
| GET | `/api/products` | Catalogue. Filtres : `category`, `sport`, `gender`, `q`, `promo`, `featured`, `sort` (`new`, `price-asc`, `price-desc`), `limit` |
| GET | `/api/products/:slug` | Un produit et des articles proches |
| GET | `/api/store` | Informations du magasin |
| GET | `/api/promotions` | Promotions en cours (selon la date à Douala) |
| POST | `/api/orders` | Enregistre une commande, renvoie le lien WhatsApp |
| POST | `/api/newsletter` | Inscription à la newsletter |

## À vérifier avant la mise en ligne

- **Prix, noms de modèles et tailles** du catalogue : ce sont des exemples plausibles, à remplacer par les vrais.
- **Numéro WhatsApp** : `store.json` utilise le +237 6 92 35 03 29 (page Facebook). Le +237 6 99 57 32 44 (fiche Google) sert pour les appels.
- **Photos produits** : recadrées à partir des photos du magasin publiées sur Google Maps et Facebook. Des photos prises produit par produit donneront un meilleur rendu.
