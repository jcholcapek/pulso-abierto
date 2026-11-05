type QueryControlsProps = {
  loading: boolean;
  onRefresh: () => void;
};

export function QueryControls({ loading, onRefresh }: QueryControlsProps) {
  return (
    <section className="query-panel" aria-labelledby="query-title">
      <h2 id="query-title">Consultar cotizaciones</h2>

      <p>Presioná el botón para obtener los precios más recientes.</p>

      <button type="button" onClick={onRefresh} disabled={loading}>
        {loading ? 'Consultando...' : 'Consultar precios'}
      </button>
    </section>
  );
}
