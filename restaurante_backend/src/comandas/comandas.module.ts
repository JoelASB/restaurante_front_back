import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ComandasController } from './comandas.controller';
import { ComandasService } from './comandas.service';
import { Comanda } from './entities/comanda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda]), PedidosModule],
  controllers: [ComandasController],
  providers: [ComandasService],
  exports: [ComandasService],
})
export class ComandasModule {}
