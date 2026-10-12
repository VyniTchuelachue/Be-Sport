import logoSvg from '../assets/logo.svg?raw';

// The official "be sport" monogram, traced from the store's logo. Colour follows `currentColor`.
export default function Logo({ className = 'h-10' }) {
  return (
    <span
      role="img"
      aria-label="Be Sport"
      className={`inline-block [&>svg]:h-full [&>svg]:w-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  );
}
