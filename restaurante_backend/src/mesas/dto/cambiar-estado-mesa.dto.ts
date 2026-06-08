import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoMesa } from '../enums/estado-mesa.enum';

export class CambiarEstadoMesaDto {
  @ApiProperty({
    enum: EstadoMesa,
    example: EstadoMesa.OCUPADA,
    description: 'Nuevo estado de la mesa',
  })
  @IsEnum(EstadoMesa, {
    message: 'estado debe ser: disponible, ocupada o reservada',
  })
  @IsNotEmpty()
  estado: EstadoMesa;
}
