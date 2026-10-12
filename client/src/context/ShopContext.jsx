import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ShopContext = createContext(null);

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage full: the cart still works for this visit.
  }
}

const lineKey = (slug, size) => `${slug}::${size ?? ''}`;

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load('bs-cart', []));
  const [favorites, setFavorites] = useState(() => load('bs-favorites', []));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => save('bs-cart', cart), [cart]);
  useEffect(() => save('bs-favorites', favorites), [favorites]);

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ ...message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const addToCart = useCallback(
    (product, size = null, qty = 1) => {
      setCart((lines) => {
        const key = lineKey(product.slug, size);
        const existing = lines.find((l) => lineKey(l.slug, l.size) === key);
        if (existing) {
          return lines.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
        }
        const { slug, brand, name, price, image } = product;
        return [...lines, { slug, brand, name, price, image, size, qty }];
      });
      notify({ title: 'Ajouté au panier', text: `${product.brand} ${product.name}${size ? `, taille ${size}` : ''}`, image: product.image });
    },
    [notify],
  );

  const setQty = useCallback((slug, size, qty) => {
    setCart((lines) =>
      lines
        .map((l) => (lineKey(l.slug, l.size) === lineKey(slug, size) ? { ...l, qty: Math.max(0, Math.min(10, qty)) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback((slug, size) => {
    setCart((lines) => lines.filter((l) => lineKey(l.slug, l.size) !== lineKey(slug, size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: cart.reduce((n, l) => n + l.qty * l.price, 0),
      addToCart,
      setQty,
      removeLine,
      clearCart,
      favorites,
      isFavorite: (slug) => favorites.includes(slug),
      toggleFavorite,
      toast,
      dismissToast: () => setToast(null),
    }),
    [cart, favorites, toast, addToCart, setQty, removeLine, clearCart, toggleFavorite],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
