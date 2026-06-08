import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MesasService } from '../mesas/mesas.service';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { PagarTicketDto } from './dto/pagar-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { EstadoTicket } from './enums/estado-ticket.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    private readonly mesasService: MesasService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { mesaId } = createTicketDto;
    const mesa = await this.obtenerMesaOError(mesaId);

    const pedidos = await this.pedidosRepository.find({
      where: { mesa: { id: mesaId } },
    });

    if (pedidos.length === 0) {
      throw new BadRequestException(
        `La mesa con id ${mesaId} no tiene pedidos`,
      );
    }

    const total = pedidos.reduce(
      (suma, pedido) => suma + Number(pedido.total),
      0,
    );

    const ticket = this.ticketsRepository.create({
      mesa,
      pedidos,
      total,
      estado: EstadoTicket.ABIERTO,
      metodoPago: null,
    });

    const guardado = await this.ticketsRepository.save(ticket);
    return this.findOne(guardado.id);
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: { mesa: true, pedidos: { platos: true } },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no encontrado`);
    }

    return ticket;
  }

  async pagar(id: number, pagarTicketDto: PagarTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.estado === EstadoTicket.PAGADO) {
      throw new BadRequestException(`El ticket con id ${id} ya está pagado`);
    }

    ticket.estado = EstadoTicket.PAGADO;
    ticket.metodoPago = pagarTicketDto.metodoPago;

    await this.ticketsRepository.save(ticket);
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
}
