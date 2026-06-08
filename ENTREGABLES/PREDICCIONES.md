## PREDICCIÓN 5
Comandas depende de Pedidos, que depende de Mesas y Platos. ¿La IA importará solo PedidosModule o necesitará también PlatosModule y MesasModule para cargar las relaciones anidadas?

**Joel:** La IA importara solo PedidosModule.

**Paolo:**  solo importara pedidos module para cargar relaciones anidadadas como pedidomesa o pedidoplatos


## PREDICCIÓN 6
Tickets necesita consultar los pedidos de una mesa para calcular el total. ¿La IA hará una query directa a la tabla pedidos o usará el servicio de PedidosModule? ¿Cuál es mejor práctica?

**Joel:**  La IA usara query directa a la tabla pedidos, no usara el servicio de pedidos module. La mejor practica seria usar el servicio de pedidos module.

**Paolo:**La IA podría intentar importar el servicio de Pedidos pero fallar en la configuración de dependencias circulares, optando finalmente por la query directa para evitar complicaciones técnicas durante la generación del código


## PREDICCIÓN 7
La IA va a crear varias páginas y componentes. ¿Cuántos archivos creará? ¿Generará componentes reutilizables o repetirá código en cada página? ¿Manejará los errores de fetch o asumirá que el backend siempre responde?

**Joel:**  Creara alrededor de 10 a 20 archivos. Generara componentes reutilizables y repetira codigo en cada pagina. Manejara los errores de fetch asumiendo que el backend siempre responde.

**Paolo:** La IA asumirá un caminosencillo donde el backend siempre responde correctamente. Es poco probable que implemente estados de error detallados o mensajes de usuario a menos que se lo exijamos explícitamente en el prompt, por lo que probablemente veamos pantallas blancas si el backend está caído.

