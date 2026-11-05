/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest';

import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { CryptoList } from '../CryptoList';
import { useFavoriteStore } from '../../store/favoriteStore';
import type { CryptoInfo } from '../../services/cryptoService';

const testCryptocurrencies: CryptoInfo[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
];

function renderCryptoList() {
  return render(
    <MemoryRouter>
      <CryptoList
        cryptocurrencies={testCryptocurrencies}
        getPrice={(id) => {
          if (id === 'bitcoin') return 65000;
          if (id === 'ethereum') return 3200;
          return undefined;
        }}
      />
    </MemoryRouter>,
  );
}

describe('CryptoList', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it('muestra las criptomonedas y sus precios', () => {
    renderCryptoList();

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('$65,000.00')).toBeInTheDocument();
    expect(screen.getByText('$3,200.00')).toBeInTheDocument();
  });

  it('permite marcar y desmarcar una criptomoneda como favorita', async () => {
    const user = userEvent.setup();

    renderCryptoList();

    const favoriteButton = screen.getAllByRole('button', {
      name: '☆ Marcar como favorita',
    })[0];

    await user.click(favoriteButton);

    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    expect(favoriteButton).toHaveTextContent('★ Favorita');

    await user.click(favoriteButton);

    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    expect(favoriteButton).toHaveTextContent('☆ Marcar como favorita');
  });

  it('guarda los favoritos en localStorage', async () => {
    const user = userEvent.setup();

    renderCryptoList();

    const favoriteButton = screen.getAllByRole('button', {
      name: '☆ Marcar como favorita',
    })[0];

    await user.click(favoriteButton);

    const savedFavorites = window.localStorage.getItem('pulso-abierto-favoritos');

    expect(savedFavorites).not.toBeNull();

    const parsedFavorites = JSON.parse(savedFavorites!);

    expect(parsedFavorites.state.favoriteIds).toEqual(['bitcoin']);
  });

  it('no muestra criptomonedas sin precio disponible', () => {
    render(
      <MemoryRouter>
        <CryptoList
          cryptocurrencies={testCryptocurrencies}
          getPrice={(id) => (id === 'bitcoin' ? 65000 : undefined)}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });
});
