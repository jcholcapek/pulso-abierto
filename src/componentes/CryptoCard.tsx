import { Link } from 'react-router-dom';
import type { CryptoInfo } from '../services/cryptoService';

type CryptoCardProps = {
  crypto: CryptoInfo;
  price: number;
  isFavorite: boolean;
  onToggleFavorite: (id: CryptoInfo['id']) => void;
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function CryptoCard({ crypto, price, isFavorite, onToggleFavorite }: CryptoCardProps) {
  return (
    <article className="crypto-card">
      <h3>{crypto.name}</h3>

      <p className="crypto-symbol">{crypto.symbol}</p>

      <p className="crypto-price">{usdFormatter.format(price)}</p>

      <Link to={`/criptomonedas/${crypto.id}`}>Ver detalle</Link>

      <button
        className="secondary-button"
        type="button"
        onClick={() => onToggleFavorite(crypto.id)}
        aria-pressed={isFavorite}
      >
        {isFavorite ? '★ Favorita' : '☆ Marcar como favorita'}
      </button>
    </article>
  );
}
