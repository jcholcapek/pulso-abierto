import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCryptoPrices } from '../cryptoService';

describe('fetchCryptoPrices', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve las cotizaciones cuando la respuesta es correcta', async () => {
    const mockData = {
      bitcoin: { usd: 65000 },
      ethereum: { usd: 3200 },
      solana: { usd: 150 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      }),
    );

    const result = await fetchCryptoPrices();

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('lanza un error cuando la respuesta HTTP no es correcta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchCryptoPrices()).rejects.toThrow('Error HTTP: 500');
  });
});
