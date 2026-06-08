import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoComanda } from '../enums/estado-comanda.enum';

export class CambiarEstadoComandaDto {
  @ApiProperty({
    enum: EstadoComanda,
    example: EstadoComanda.EN_PREPARACION,
    description: 'Nuevo estado de la comanda',
  })
  @IsEnum(EstadoComanda, {
    message: 'estado debe ser: recibida, en_preparacion o lista',
  })
  @IsNotEmpty()
  estado: EstadoComanda;
}
