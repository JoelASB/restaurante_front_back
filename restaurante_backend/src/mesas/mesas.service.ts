import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from './entities/mesa.entity';
import { EstadoMesa } from './enums/estado-mesa.enum';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const existingMesa = await this.mesaRepository.findOne({
      where: { numero: createMesaDto.numero },
    });

    if (existingMesa) {
      throw new BadRequestException(`La mesa con el número ${createMesaDto.numero} ya existe`);
    }

    const mesa = this.mesaRepository.create(createMesaDto);
    return await this.mesaRepository.save(mesa);
  }

  async findAll(): Promise<Mesa[]> {
    return await this.mesaRepository.find();
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.findOne(id);

    if (updateMesaDto.numero && updateMesaDto.numero !== mesa.numero) {
      const existingMesa = await this.mesaRepository.findOne({
        where: { numero: updateMesaDto.numero },
      });
      if (existingMesa) {
        throw new BadRequestException(`La mesa con el número ${updateMesaDto.numero} ya existe`);
      }
    }

    Object.assign(mesa, updateMesaDto);
    return await this.mesaRepository.save(mesa);
  }

  async remove(id: number): Promise<void> {
    const mesa = await this.findOne(id);
    await this.mesaRepository.remove(mesa);
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoMesa): Promise<Mesa> {
    const mesa = await this.findOne(id);
    mesa.estado = nuevoEstado;
    return await this.mesaRepository.save(mesa);
  }
}
