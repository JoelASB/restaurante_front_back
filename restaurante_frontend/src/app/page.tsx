import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import type { Mesa, Pedido, Plato } from '@/types';
import ErrorAlert from '@/components/ErrorAlert';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

function esPedidoDelDia(createdAt: string): boolean {
  const hoy = new Date();
  const fecha = new Date(createdAt);
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

export default async function DashboardPage() {
  const [platos, mesas, pedidos] = await Promise.all([
    fetchJson<Plato[]>('/platos'),
    fetchJson<Mesa[]>('/mesas'),
    fetchJson<Pedido[]>('/pedidos'),
  ]);

  const backendError = platos === null || mesas === null || pedidos === null;
  const pedidosDelDia = pedidos?.filter((p) => esPedidoDelDia(p.createdAt)) ?? [];

  const cards = [
    {
      title: 'Total platos',
      value: platos?.length ?? 0,
      href: '/platos',
      color: 'bg-orange-500',
    },
    {
      title: 'Total mesas',
      value: mesas?.length ?? 0,
      href: '/mesas',
      color: 'bg-blue-500',
    },
    {
      title: 'Pedidos del día',
      value: pedidosDelDia.length,
      href: '/pedidos',
      color: 'bg-green-500',
    },
  ];

  const navLinks = [
    { href: '/platos', label: 'Gestionar platos', desc: 'Ver y crear platos del menú' },
    { href: '/mesas', label: 'Estado de mesas', desc: 'Controlar disponibilidad de mesas' },
    { href: '/pedidos', label: 'Pedidos activos', desc: 'Crear y monitorear pedidos' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Sistema de Restaurante
        </h1>
        <p className="mt-1 text-gray-600">
          Panel de control del restaurante
        </p>
      </div>

      {backendError && (
        <ErrorAlert message="No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:3000" />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color} text-lg font-bold text-white`}
            >
              {card.value}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
              {card.title}
            </h2>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Navegación</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50"
            >
              <h3 className="font-semibold text-gray-900">{link.label}</h3>
              <p className="mt-1 text-sm text-gray-600">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
