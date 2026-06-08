# Segundo Checklist

| # | Qué revisar | Hallazgo | ✓ |
|---|---|---|---|
| R1 | ¿Pedido tiene @ManyToOne a Mesa y @ManyToMany a Plato? |**Joel:** Si, los tiene. **Paolo:**Si, los tiene | ✓ |
| R2 | ¿Existe @JoinTable en la relación ManyToMany? | **Joel:** Si, existe. **Paolo:**Si, existe | ✓ |
| R3 | ¿El DTO pide mesaId (number) y platoIds (number[])? | **Joel:** Si, el DTO pede mesaId y platoIds. **Paolo:**Si, lo pide | ✓ |
| R4 | ¿El servicio valida que mesaId y platoIds existen ANTES de crear? | **Joel:** El servicio valida que mesaId y platoIds existen ANTES de crear. **Paolo:**Si, lo valida | ✓ |
| R5 | ¿Errores de IDs inexistentes dan 400 (BadRequest) y NO 500? | **Joel:** Si, me da 400. **Paolo:**Si da 400 | ✓ |
| R6 | ¿El total se calcula sumando precios de platos? | **Joel:** Si, se suman sus precios. **Paolo:**Si, lo calcula | ✓ |
| R7 | ¿GET /pedidos retorna pedidos CON mesa y platos cargados (relations)? | **Joel:** Si los trae. **Paolo:**Si los trae | ✓ |
| R8 | ¿La IA modificó plato.entity.ts o mesa.entity.ts? ¿Era necesario? | **Joel:** No, no modificó nada. **Paolo:**No los modifico | ✓ |
| R9 | ¿PedidosModule importa PlatosModule y MesasModule? | **Joel:** Si, los importa. **Paolo:**Si los importa | ✓ |
| R10 | ¿GET /platos y GET /mesas SIGUEN funcionando? | **Joel:** Si funcionan. **Paolo:**Si funcionan | ✓ |
