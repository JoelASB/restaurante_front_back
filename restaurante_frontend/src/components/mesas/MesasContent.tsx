'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { EstadoMesa, Mesa } from '@/types';
import ErrorAlert from '@/components/ErrorAlert';

const ESTADOS: EstadoMesa[] = ['disponible', 'ocupada', 'reservada'];

const estadoStyles: Record<EstadoMesa, string> = {
  disponible: 'border-green-300 bg-green-50',
  ocupada: 'border-red-300 bg-red-50',
  reservada: 'border-yellow-300 bg-yellow-50',
};

const estadoBadge: Record<EstadoMesa, string> = {
  disponible: 'bg-green-100 text-green-800',
  ocupada: 'bg-red-100 text-red-800',
  reservada: 'bg-yellow-100 text-yellow-800',
};

const estadoLabel: Record<EstadoMesa, string> = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
};

function siguienteEstado(actual: EstadoMesa): EstadoMesa {
  const index = ESTADOS.indexOf(actual);
  return ESTADOS[(index + 1) % ESTADOS.length];
}

export default function MesasContent() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cambiandoId, setCambiandoId] = useState<number | null>(null);

  const cargarMesas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Mesa[]>('/mesas');
      setMesas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMesas();
  }, [cargarMesas]);

  async function cambiarEstado(mesa: Mesa) {
    const nuevoEstado = siguienteEstado(mesa.estado);
    setCambiandoId(mesa.id);
    setError(null);
    try {
      const actualizada = await apiFetch<Mesa>(`/mesas/${mesa.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setMesas((prev) =>
        prev.map((m) => (m.id === mesa.id ? actualizada : m)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cambiar estado',
      );
    } finally {
      setCambiandoId(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mesas</h1>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <p className="text-gray-500">Cargando mesas...</p>
      ) : mesas.length === 0 && !error ? (
        <p className="text-gray-500">No hay mesas registradas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              className={`rounded-lg border-2 p-4 shadow-sm ${estadoStyles[mesa.estado]}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Mesa {mesa.numero}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadge[mesa.estado]}`}
                >
                  {estadoLabel[mesa.estado]}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Capacidad: {mesa.capacidad} personas
              </p>
              <button
                type="button"
                onClick={() => cambiarEstado(mesa)}
                disabled={cambiandoId === mesa.id}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {cambiandoId === mesa.id
                  ? 'Actualizando...'
                  : `Cambiar a: ${estadoLabel[siguienteEstado(mesa.estado)]}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
