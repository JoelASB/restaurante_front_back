'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { apiFetch, formatPrecio } from '@/lib/api';
import type { EstadoPedido, Mesa, Pedido, Plato } from '@/types';
import ErrorAlert from '@/components/ErrorAlert';

const estadoMesaLabel: Record<string, string> = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
};

const estadoPedidoLabel: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  en_preparacion: 'En preparación',
  listo: 'Listo',
  entregado: 'Entregado',
};

const estadoPedidoBadge: Record<EstadoPedido, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_preparacion: 'bg-blue-100 text-blue-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-600',
};

const ESTADOS_ACTIVOS: EstadoPedido[] = [
  'pendiente',
  'en_preparacion',
  'listo',
];

export default function PedidosContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mesaId, setMesaId] = useState('');
  const [platoIds, setPlatoIds] = useState<number[]>([]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosData, mesasData, platosData] = await Promise.all([
        apiFetch<Pedido[]>('/pedidos'),
        apiFetch<Mesa[]>('/mesas'),
        apiFetch<Plato[]>('/platos'),
      ]);
      setPedidos(pedidosData);
      setMesas(mesasData);
      setPlatos(platosData.filter((p) => p.disponible));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const pedidosActivos = pedidos.filter((p) =>
    ESTADOS_ACTIVOS.includes(p.estado),
  );

  function togglePlato(id: number) {
    setPlatoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (platoIds.length === 0) {
      setError('Selecciona al menos un plato');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch<Pedido>('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          mesaId: parseInt(mesaId, 10),
          platoIds,
        }),
      });
      setMesaId('');
      setPlatoIds([]);
      setShowForm(false);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pedido');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos activos</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo pedido'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Crear pedido
          </h2>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mesa
            </label>
            <select
              required
              value={mesaId}
              onChange={(e) => setMesaId(e.target.value)}
              className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Seleccionar mesa</option>
              {mesas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa {mesa.numero} ({estadoMesaLabel[mesa.estado] ?? mesa.estado})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Platos
            </label>
            {platos.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay platos disponibles.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {platos.map((plato) => (
                  <label
                    key={plato.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={platoIds.includes(plato.id)}
                      onChange={() => togglePlato(plato.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-800">
                      {plato.nombre} — {formatPrecio(plato.precio)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || platos.length === 0}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear pedido'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : pedidosActivos.length === 0 && !error ? (
        <p className="text-gray-500">No hay pedidos activos.</p>
      ) : (
        <div className="space-y-4">
          {pedidosActivos.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    Pedido #{pedido.id}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    Mesa {pedido.mesa?.numero ?? '—'}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoPedidoBadge[pedido.estado]}`}
                >
                  {estadoPedidoLabel[pedido.estado]}
                </span>
              </div>
              <ul className="mb-3 list-inside list-disc text-sm text-gray-700">
                {pedido.platos?.map((plato) => (
                  <li key={`${pedido.id}-${plato.id}`}>
                    {plato.nombre} — {formatPrecio(plato.precio)}
                  </li>
                ))}
              </ul>
              <p className="text-right text-sm font-semibold text-gray-900">
                Total: {formatPrecio(pedido.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
