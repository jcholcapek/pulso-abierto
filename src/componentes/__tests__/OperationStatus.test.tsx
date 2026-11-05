/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OperationStatus } from '../OperationStatus';

afterEach(() => {
  cleanup();
});

describe('OperationStatus', () => {
  it('muestra el mensaje de error y el botón para reintentar', () => {
    render(
      <OperationStatus
        status="error"
        message="No se pudieron cargar las cotizaciones"
        onRetry={() => {}}
      />,
    );

    expect(screen.getByText('No se pudieron cargar las cotizaciones')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Intentar nuevamente' })).toBeInTheDocument();
  });

  it('ejecuta la función de reintento al presionar el botón', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<OperationStatus status="error" message="Ocurrió un error" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Intentar nuevamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('no muestra el botón de reintento cuando no hay un error', () => {
    render(
      <OperationStatus
        status="success"
        message="Cotizaciones cargadas correctamente"
        onRetry={() => {}}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Intentar nuevamente' })).not.toBeInTheDocument();
  });
});
