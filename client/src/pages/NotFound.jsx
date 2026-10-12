import { Link } from 'react-router';
import { ArrowIcon } from '../components/Icons.jsx';

export default function NotFound({ message = "Cette page n'existe pas ou a été déplacée." }) {
  return (
    <div className="wrap max-w-2xl py-28 text-center">
      <p className="sign text-lg [--wire:0px]">Hors rayon</p>
      <h1 className="title mt-8 text-[clamp(1.9rem,4vw,2.8rem)]">Page introuvable</h1>
      <p className="mt-3 text-steel">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/boutique" className="btn btn-ink">
          Voir le catalogue <ArrowIcon className="size-4" />
        </Link>
        <Link to="/" className="btn btn-line">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
