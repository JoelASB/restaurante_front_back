import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoPedido } from '../enums/estado-pedido.enum';

export class CambiarEstadoPedidoDto {
  @ApiProperty({
    enum: EstadoPedido,
    example: EstadoPedido.EN_PREPARACION,
    description: 'Nuevo estado del pedido',
  })
  @IsEnum(EstadoPedido, {
    message:
      'estado debe ser: pendiente, en_preparacion, listo o entregado',
  })
  @IsNotEmpty()
  estado: EstadoPedido;
}
