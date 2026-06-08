import { IsEnum } from 'class-validator';
import { MetodoPago } from '../enums/metodo-pago.enum';

export class PagarTicketDto {
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
