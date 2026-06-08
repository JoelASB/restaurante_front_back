import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ComandasService } from './comandas.service';
import { CambiarEstadoComandaDto } from './dto/cambiar-estado-comanda.dto';
import { CreateComandaDto } from './dto/create-comanda.dto';

@ApiTags('comandas')
@Controller('comandas')
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Post()
  create(@Body() createComandaDto: CreateComandaDto) {
    return this.comandasService.create(createComandaDto);
  }

  @Get()
  findAll() {
    return this.comandasService.findAll();
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar el estado de una comanda' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoComandaDto,
  ) {
    return this.comandasService.cambiarEstado(id, cambiarEstadoDto.estado);
  }
}
