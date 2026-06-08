import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mesaId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  platoIds: number[];
}
