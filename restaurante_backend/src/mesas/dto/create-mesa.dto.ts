import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { EstadoMesa } from '../enums/estado-mesa.enum';

export class CreateMesaDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  numero: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  capacidad: number;

  @IsOptional()
  @IsEnum(EstadoMesa)
  estado?: EstadoMesa;
}
