import './style.css';

type CryptoId = 'bitcoin' | 'ethereum' | 'solana';

type CryptoPrice = {
  usd: number;
};

type CryptoPrices = Partial<Record<CryptoId, CryptoPrice>>;

type CryptoInfo = {
  id: CryptoId;
  name: string;
  symbol: string;
};

const cryptocurrencies: CryptoInfo[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

const apiUrl =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

const refreshButton = document.querySelector<HTMLButtonElement>('#refresh-button');

const retryButton = document.querySelector<HTMLButtonElement>('#retry-button');

const statusMessage = document.querySelector<HTMLElement>('#status-message');

const resultsSection = document.querySelector<HTMLElement>('#results');

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

async function fetchCryptoPrices(): Promise<CryptoPrices> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = (await response.json()) as CryptoPrices;

  return data;
}

function renderLoading(): void {
  if (statusMessage) {
    statusMessage.textContent = 'Cargando cotizaciones...';
  }

  resultsSection?.replaceChildren();

  if (retryButton) {
    retryButton.hidden = true;
  }
}

function renderEmpty(): void {
  if (statusMessage) {
    statusMessage.textContent =
      'La consulta finalizó correctamente, pero no hay cotizaciones para mostrar.';
  }

  resultsSection?.replaceChildren();
}

function renderError(): void {
  if (statusMessage) {
    statusMessage.textContent =
      'No pudimos cargar las cotizaciones. Revisá tu conexión e intentá nuevamente.';
  }

  resultsSection?.replaceChildren();

  if (retryButton) {
    retryButton.hidden = false;
  }
}

function renderResults(prices: CryptoPrices): void {
  if (!resultsSection || !statusMessage) return;

  const availableCryptos = cryptocurrencies.filter(
    (crypto) =>
      typeof prices[crypto.id]?.usd === 'number' && Number.isFinite(prices[crypto.id]?.usd),
  );

  if (availableCryptos.length === 0) {
    renderEmpty();
    return;
  }

  resultsSection.replaceChildren();

  for (const crypto of availableCryptos) {
    const article = document.createElement('article');
    const title = document.createElement('h3');
    const symbol = document.createElement('p');
    const price = document.createElement('p');

    article.classList.add('crypto-card');
    title.textContent = crypto.name;
    symbol.classList.add('crypto-symbol');
    symbol.textContent = crypto.symbol;

    const value = prices[crypto.id]?.usd;

    if (typeof value !== 'number') continue;

    price.classList.add('crypto-price');
    price.textContent = usdFormatter.format(value);

    article.append(title, symbol, price);
    resultsSection.append(article);
  }

  statusMessage.textContent = `Se muestran ${availableCryptos.length} de ${cryptocurrencies.length} cotizaciones solicitadas.`;

  if (retryButton) {
    retryButton.hidden = true;
  }
}

async function loadCryptoPrices(): Promise<void> {
  if (!refreshButton || !retryButton) return;

  renderLoading();
  refreshButton.disabled = true;
  retryButton.disabled = true;

  try {
    const prices = await fetchCryptoPrices();
    renderResults(prices);
  } catch (error) {
    renderError();
    console.error('Error al consultar CoinGecko:', error);
  } finally {
    refreshButton.disabled = false;
    retryButton.disabled = false;
  }
}

refreshButton?.addEventListener('click', () => {
  void loadCryptoPrices();
});

retryButton?.addEventListener('click', () => {
  void loadCryptoPrices();
});
