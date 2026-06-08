'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { apiFetch, formatPrecio } from '@/lib/api';
import type { Plato } from '@/types';
import ErrorAlert from '@/components/ErrorAlert';

export default function PlatosContent() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponible, setDisponible] = useState(true);

  const cargarPlatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Plato[]>('/platos');
      setPlatos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPlatos();
  }, [cargarPlatos]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch<Plato>('/platos', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre.trim(),
          precio: parseFloat(precio),
          disponible,
        }),
      });
      setNombre('');
      setPrecio('');
      setDisponible(true);
      setShowForm(false);
      await cargarPlatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear plato');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Platos</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo plato'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Crear plato
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Precio (S/)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                Disponible
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : 'Guardar plato'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando platos...</p>
      ) : platos.length === 0 && !error ? (
        <p className="text-gray-500">No hay platos registrados.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Disponible
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {platos.map((plato) => (
                <tr key={plato.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {plato.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatPrecio(plato.precio)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        plato.disponible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {plato.disponible ? 'Sí' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
