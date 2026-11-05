import { useState, type FormEvent } from 'react';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().trim().min(1, 'Escribí un nombre o símbolo para buscar.'),
  criterion: z.enum(['name', 'symbol']),
});

type SearchFormProps = {
  onSearch: (query: string, criterion: 'name' | 'symbol') => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [criterion, setCriterion] = useState<'name' | 'symbol'>('name');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = searchSchema.safeParse({ query, criterion });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    setErrorMessage('');
    onSearch(result.data.query, result.data.criterion);
  }

  return (
    <section className="query-panel">
      <h2>Buscar criptomonedas</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="search-query">Nombre o símbolo</label>
        <input
          id="search-query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej.: Bitcoin o BTC"
          aria-describedby={errorMessage ? 'search-error' : undefined}
        />

        <label htmlFor="search-criterion">Buscar por</label>
        <select
          id="search-criterion"
          value={criterion}
          onChange={(event) => setCriterion(event.target.value as 'name' | 'symbol')}
        >
          <option value="name">Nombre</option>
          <option value="symbol">Símbolo</option>
        </select>

        {errorMessage && (
          <p id="search-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit">Buscar</button>
      </form>
    </section>
  );
}
