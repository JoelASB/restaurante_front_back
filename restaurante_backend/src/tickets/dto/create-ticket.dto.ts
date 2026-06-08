import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mesaId: number;
}
