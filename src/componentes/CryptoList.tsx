import type { CryptoInfo } from '../services/cryptoService';
import { useFavoriteStore } from '../store/favoriteStore';
import { CryptoCard } from './CryptoCard';

type CryptoListProps = {
  cryptocurrencies: CryptoInfo[];
  getPrice: (id: CryptoInfo['id']) => number | undefined;
};

export function CryptoList({ cryptocurrencies, getPrice }: CryptoListProps) {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  return (
    <div className="crypto-grid">
      {cryptocurrencies.map((crypto) => {
        const price = getPrice(crypto.id);

        if (price === undefined) {
          return null;
        }

        return (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            price={price}
            isFavorite={favoriteIds.includes(crypto.id)}
            onToggleFavorite={toggleFavorite}
          />
        );
      })}
    </div>
  );
}
