import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MesasService } from './mesas.service';
import { CambiarEstadoMesaDto } from './dto/cambiar-estado-mesa.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@ApiTags('mesas')
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  findAll() {
    return this.mesasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.remove(id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar el estado de una mesa' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoMesaDto,
  ) {
    return this.mesasService.cambiarEstado(id, cambiarEstadoDto.estado);
  }
}
