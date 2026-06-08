import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MesasService } from '../mesas/mesas.service';
import { Plato } from '../platos/entities/plato.entity';
import { PlatosService } from '../platos/platos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { EstadoPedido } from './enums/estado-pedido.enum';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    private readonly mesasService: MesasService,
    private readonly platosService: PlatosService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const { mesaId, platoIds } = createPedidoDto;

    const mesa = await this.obtenerMesaOError(mesaId);
    const platos = await this.obtenerPlatosOError(platoIds);
    const total = this.calcularTotal(platos);

    const pedido = this.pedidosRepository.create({
      mesa,
      platos,
      total,
      estado: EstadoPedido.PENDIENTE,
    });

    const guardado = await this.pedidosRepository.save(pedido);
    return this.findOne(guardado.id);
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      relations: { mesa: true, platos: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: { mesa: true, platos: true },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.mesaId !== undefined) {
      pedido.mesa = await this.obtenerMesaOError(updatePedidoDto.mesaId);
    }

    if (updatePedidoDto.platoIds !== undefined) {
      const platos = await this.obtenerPlatosOError(updatePedidoDto.platoIds);
      pedido.platos = platos;
      pedido.total = this.calcularTotal(platos);
    }

    await this.pedidosRepository.save(pedido);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidosRepository.remove(pedido);
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoPedido): Promise<Pedido> {
    const pedido = await this.findOne(id);
    pedido.estado = nuevoEstado;
    await this.pedidosRepository.save(pedido);
    return this.findOne(id);
  }

  private async obtenerMesaOError(mesaId: number) {
    try {
      return await this.mesasService.findOne(mesaId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Mesa con id ${mesaId} no existe`);
      }
      throw error;
    }
  }

  private async obtenerPlatosOError(platoIds: number[]): Promise<Plato[]> {
    const idsUnicos = [...new Set(platoIds)];
    const platos: Plato[] = [];

    for (const platoId of idsUnicos) {
      try {
        platos.push(await this.platosService.encontrarUno(platoId));
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException(`Plato con id ${platoId} no existe`);
        }
        throw error;
      }
    }

    const platosDelPedido: Plato[] = [];
    for (const platoId of platoIds) {
      const plato = platos.find((p) => p.id === platoId);
      if (plato) {
        platosDelPedido.push(plato);
      }
    }

    return platosDelPedido;
  }

  private calcularTotal(platos: Plato[]): number {
    return platos.reduce((suma, plato) => suma + Number(plato.precio), 0);
  }
}
