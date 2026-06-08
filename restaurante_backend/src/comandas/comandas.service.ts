import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidosService } from '../pedidos/pedidos.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { Comanda } from './entities/comanda.entity';
import { EstadoComanda } from './enums/estado-comanda.enum';

@Injectable()
export class ComandasService {
  constructor(
    @InjectRepository(Comanda)
    private readonly comandasRepository: Repository<Comanda>,
    private readonly pedidosService: PedidosService,
  ) {}

  async create(createComandaDto: CreateComandaDto): Promise<Comanda> {
    const { pedidoId, observaciones } = createComandaDto;
    const pedido = await this.pedidosService.findOne(pedidoId);

    const comanda = this.comandasRepository.create({
      pedido,
      observaciones: observaciones ?? null,
      estado: EstadoComanda.RECIBIDA,
    });

    const guardada = await this.comandasRepository.save(comanda);
    return this.findOne(guardada.id);
  }

  async findAll(): Promise<Comanda[]> {
    return this.comandasRepository.find({
      relations: { pedido: { platos: true } },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Comanda> {
    const comanda = await this.comandasRepository.findOne({
      where: { id },
      relations: { pedido: { platos: true } },
    });

    if (!comanda) {
      throw new NotFoundException(`Comanda con id ${id} no encontrada`);
    }

    return comanda;
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoComanda): Promise<Comanda> {
    const comanda = await this.findOne(id);
    comanda.estado = nuevoEstado;
    await this.comandasRepository.save(comanda);
    return this.findOne(id);
  }
}
