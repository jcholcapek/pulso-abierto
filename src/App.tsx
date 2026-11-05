import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

import {
  cryptocurrencies,
  fetchCryptoPrices,
  type CryptoPrices,
  type CryptoId,
} from './services/cryptoService';

import { useFavoriteStore } from './store/favoriteStore';

import { SearchForm } from './componentes/SearchForm';
import { QueryControls } from './componentes/QueryControls';
import { OperationStatus } from './componentes/OperationStatus';
import { CryptoList } from './componentes/CryptoList';

type Status = 'initial' | 'loading' | 'success' | 'empty' | 'error';

function AppHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        Pulso Abierto
      </Link>
      <p>Información pública, al alcance de todos.</p>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="site-footer">
      <p>
        Fuente de datos:{' '}
        <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">
          CoinGecko
        </a>
      </p>
      <p>Los precios pueden variar con el tiempo.</p>
    </footer>
  );
}

function HomePage() {
  const [prices, setPrices] = useState<CryptoPrices>({});
  const [status, setStatus] = useState<Status>('initial');
  const [message, setMessage] = useState('Preparado para consultar las cotizaciones.');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriterion, setSearchCriterion] = useState<'name' | 'symbol'>('name');

  const favoriteCount = useFavoriteStore((state) => state.favoriteIds.length);

  // Identifica cada consulta para ignorar las respuestas anteriores.
  const requestId = useRef(0);

  const loadCryptoPrices = useCallback(async () => {
    const currentRequest = ++requestId.current;

    setStatus('loading');
    setMessage('Cargando cotizaciones...');

    try {
      const data = await fetchCryptoPrices();

      // Si comenzó otra consulta, no usamos esta respuesta.
      if (currentRequest !== requestId.current) {
        return;
      }

      const available = cryptocurrencies.filter((crypto) => {
        const price = data[crypto.id]?.usd;
        return typeof price === 'number' && Number.isFinite(price);
      });

      setPrices(data);

      if (available.length === 0) {
        setStatus('empty');
        setMessage('No hay cotizaciones disponibles para mostrar.');
      } else {
        setStatus('success');
        setMessage(
          `Se muestran ${available.length} de ${cryptocurrencies.length} cotizaciones solicitadas.`,
        );
      }
    } catch (error) {
      // Tampoco mostramos errores de consultas que ya quedaron atrás.
      if (currentRequest !== requestId.current) {
        return;
      }

      console.error('Error al consultar CoinGecko:', error);
      setStatus('error');
      setMessage('No pudimos cargar las cotizaciones. Revisá tu conexión e intentá nuevamente.');
    }
  }, []);

  useEffect(() => {
    void loadCryptoPrices();

    return () => {
      // Invalida cualquier consulta pendiente al salir de la página.
      requestId.current += 1;
    };
  }, [loadCryptoPrices]);

  const filteredCryptos = cryptocurrencies.filter((crypto) => {
    const value = searchCriterion === 'name' ? crypto.name : crypto.symbol;
    return value.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <main className="container">
      <section className="intro">
        <p className="eyebrow">MERCADO CRIPTO</p>
        <h1>Precios de criptomonedas</h1>
        <p>Criptomonedas favoritas: {favoriteCount}</p>
        <p>
          Consultá el valor actual de Bitcoin, Ethereum y Solana expresado en dólares
          estadounidenses.
        </p>
      </section>

      <QueryControls loading={status === 'loading'} onRefresh={() => void loadCryptoPrices()} />

      <SearchForm
        onSearch={(query, criterion) => {
          setSearchQuery(query);
          setSearchCriterion(criterion);
        }}
      />

      <OperationStatus status={status} message={message} onRetry={() => void loadCryptoPrices()} />

      {status === 'success' && (
        <>
          {filteredCryptos.length > 0 ? (
            <CryptoList cryptocurrencies={filteredCryptos} getPrice={(id) => prices[id]?.usd} />
          ) : (
            <p role="status">No encontramos criptomonedas que coincidan con tu búsqueda.</p>
          )}
        </>
      )}
    </main>
  );
}

function CryptoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const crypto = cryptocurrencies.find((item) => item.id === id);
  const cryptoId = crypto?.id;

  const [prices, setPrices] = useState<CryptoPrices>({});
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Cargando información...');

  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!cryptoId) {
      return;
    }

    const selectedCryptoId: CryptoId = cryptoId;
    let cancelled = false;

    async function loadPrice() {
      setStatus('loading');
      setMessage('Cargando cotización...');

      try {
        const data = await fetchCryptoPrices();

        if (cancelled) {
          return;
        }

        setPrices(data);

        const price = data[selectedCryptoId]?.usd;

        if (typeof price === 'number' && Number.isFinite(price)) {
          setStatus('success');
          setMessage('Cotización cargada correctamente.');
        } else {
          setStatus('empty');
          setMessage('No hay una cotización disponible para esta criptomoneda.');
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error('Error al consultar CoinGecko:', error);
        setStatus('error');
        setMessage('No pudimos cargar la cotización.');
      }
    }

    void loadPrice();

    return () => {
      cancelled = true;
    };
  }, [cryptoId]);

  if (!crypto) {
    return (
      <main className="container">
        <h1>Criptomoneda inexistente</h1>
        <p>El identificador solicitado no corresponde a una criptomoneda admitida.</p>
        <Link to="/">Volver a la consulta</Link>
      </main>
    );
  }

  const price = prices[crypto.id]?.usd;
  const isFavorite = favoriteIds.includes(crypto.id);

  return (
    <main className="container">
      <section className="intro">
        <p className="eyebrow">DETALLE DE CRIPTOMONEDA</p>
        <h1>{crypto.name}</h1>
        <p>Símbolo: {crypto.symbol}</p>
      </section>

      <section className="results-section">
        <h2>Cotización</h2>
        <p role="status" aria-live="polite">
          {message}
        </p>

        {status === 'success' && typeof price === 'number' && (
          <p className="crypto-price">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 2,
            }).format(price)}
          </p>
        )}

        <button
          className="secondary-button"
          type="button"
          onClick={() => toggleFavorite(crypto.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Favorita' : '☆ Marcar como favorita'}
        </button>

        {status === 'error' && (
          <button
            className="secondary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        )}
      </section>

      <p>
        <Link to="/">Volver a la consulta</Link>
      </p>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="container">
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no coincide con ninguna página de Pulso Abierto.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <AppHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/criptomonedas/:id" element={<CryptoDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AppFooter />
    </>
  );
}
