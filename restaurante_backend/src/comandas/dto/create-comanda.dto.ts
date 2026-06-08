import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateComandaDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  pedidoId: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
