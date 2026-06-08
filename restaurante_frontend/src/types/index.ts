export type EstadoMesa = 'disponible' | 'ocupada' | 'reservada';

export type EstadoPedido =
  | 'pendiente'
  | 'en_preparacion'
  | 'listo'
  | 'entregado';

export interface Plato {
  id: number;
  nombre: string;
  precio: number | string;
  disponible: boolean;
}

export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
}

export interface Pedido {
  id: number;
  mesa: Mesa;
  platos: Plato[];
  estado: EstadoPedido;
  total: number | string;
  createdAt: string;
}
