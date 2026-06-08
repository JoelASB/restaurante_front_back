import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { EstadoComanda } from '../enums/estado-comanda.enum';

@Entity('comandas')
export class Comanda {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, { nullable: false })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @Column({
    type: 'varchar',
    enum: EstadoComanda,
    default: EstadoComanda.RECIBIDA,
  })
  estado: EstadoComanda;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
