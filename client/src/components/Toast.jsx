import { Link } from 'react-router';
import { useShop } from '../context/ShopContext.jsx';
import { CheckIcon, CloseIcon } from './Icons.jsx';

export default function Toast() {
  const { toast, dismissToast } = useShop();

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex justify-end sm:inset-x-auto sm:right-5 sm:bottom-5" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg bg-ink p-3 pr-2 text-white shadow-2xl">
          {toast.image && <img src={toast.image} alt="" className="size-14 rounded-md object-cover" />}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <CheckIcon className="size-4 text-volt" /> {toast.title}
            </p>
            <p className="truncate text-sm text-white/70">{toast.text}</p>
            <Link to="/panier" onClick={dismissToast} className="mt-0.5 inline-block text-sm font-bold text-volt underline underline-offset-4">
              Voir le panier
            </Link>
          </div>
          <button type="button" onClick={dismissToast} className="grid size-8 place-items-center self-start rounded-full hover:bg-white/10" aria-label="Fermer">
            <CloseIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
