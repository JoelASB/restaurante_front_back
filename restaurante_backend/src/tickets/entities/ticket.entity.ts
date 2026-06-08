import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { EstadoTicket } from '../enums/estado-ticket.enum';
import { MetodoPago } from '../enums/metodo-pago.enum';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mesa, { nullable: false })
  @JoinColumn({ name: 'mesaId' })
  mesa: Mesa;

  @ManyToMany(() => Pedido)
  @JoinTable({
    name: 'ticket_pedidos',
    joinColumn: { name: 'ticketId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'pedidoId', referencedColumnName: 'id' },
  })
  pedidos: Pedido[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'varchar', enum: MetodoPago, nullable: true })
  metodoPago: MetodoPago | null;

  @Column({
    type: 'varchar',
    enum: EstadoTicket,
    default: EstadoTicket.ABIERTO,
  })
  estado: EstadoTicket;

  @CreateDateColumn()
  createdAt: Date;
}
