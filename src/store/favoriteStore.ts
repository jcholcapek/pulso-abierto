import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CryptoId } from '../services/cryptoService';

type FavoriteStore = {
  favoriteIds: CryptoId[];
  toggleFavorite: (id: CryptoId) => void;
};

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set) => ({
      favoriteIds: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
            : [...state.favoriteIds, id],
        })),
    }),
    {
      name: 'pulso-abierto-favoritos',
    },
  ),
);
