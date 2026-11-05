export type CryptoId = 'bitcoin' | 'ethereum' | 'solana';

export type CryptoInfo = {
  id: CryptoId;
  name: string;
  symbol: string;
};

export type CryptoPrice = {
  usd: number;
};

export type CryptoPrices = Partial<Record<CryptoId, CryptoPrice>>;

export const cryptocurrencies: CryptoInfo[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrencies
  .map((crypto) => crypto.id)
  .join(',')}&vs_currencies=usd`;

export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = (await response.json()) as CryptoPrices;

  return data;
}
