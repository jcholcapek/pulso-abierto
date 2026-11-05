type OperationStatusProps = {
  status: 'initial' | 'loading' | 'success' | 'empty' | 'error';
  message: string;
  onRetry: () => void;
};

export function OperationStatus({ status, message, onRetry }: OperationStatusProps) {
  return (
    <section className="results-section" aria-labelledby="results-title">
      <h2 id="results-title">Cotizaciones</h2>

      <p role="status" aria-live="polite">
        {message}
      </p>

      {status === 'error' && (
        <button className="secondary-button" type="button" onClick={onRetry}>
          Intentar nuevamente
        </button>
      )}
    </section>
  );
}
