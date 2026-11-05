/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from './App';
import { fetchCryptoPrices } from './services/cryptoService';

vi.mock('./services/cryptoService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./services/cryptoService')>();

  return {
    ...actual,
    fetchCryptoPrices: vi.fn(),
  };
});

const mockedFetchCryptoPrices = vi.mocked(fetchCryptoPrices);

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
}

describe('Integración de la consulta de cotizaciones', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedFetchCryptoPrices.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('muestra las cotizaciones cuando la consulta es exitosa', async () => {
    mockedFetchCryptoPrices.mockResolvedValue({
      bitcoin: { usd: 65000 },
      ethereum: { usd: 3200 },
      solana: { usd: 150 },
    });

    renderApp();

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Solana')).toBeInTheDocument();
    expect(mockedFetchCryptoPrices).toHaveBeenCalledOnce();
  });

  it('muestra un mensaje cuando no hay cotizaciones disponibles', async () => {
    mockedFetchCryptoPrices.mockResolvedValue({});

    renderApp();

    expect(
      await screen.findByText('No hay cotizaciones disponibles para mostrar.'),
    ).toBeInTheDocument();

    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
  });

  it('permite reintentar la consulta después de un error', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockedFetchCryptoPrices
      .mockRejectedValueOnce(new Error('Error de conexión'))
      .mockResolvedValueOnce({
        bitcoin: { usd: 65000 },
        ethereum: { usd: 3200 },
        solana: { usd: 150 },
      });

    renderApp();

    expect(
      await screen.findByText(
        'No pudimos cargar las cotizaciones. Revisá tu conexión e intentá nuevamente.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Intentar nuevamente' }));

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(mockedFetchCryptoPrices).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
  });
});
