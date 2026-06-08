# Segundo Checklist

| # | Qué revisar | Hallazgo | ✓ |
|---|---|---|---|
| F1 | ¿Las páginas hacen fetch a http://localhost:3000 (backend real)? | **Joel:** Si, hace fetch. **Paolo:** Sí, todas usan el helper `apiFetch` apuntando a `http://localhost:3000`. | ✓ |
| F2 | ¿Si el backend no responde, muestra mensaje de error (no pantalla blanca)? | **Joel:** Si me muestra un mensaje de error. **Paolo:** Sí, se usa `ErrorAlert.tsx` para capturar y mostrar el error. | ✓ |
| F3 | ¿La navegación funciona entre todas las páginas? | **Joel:** Si, funciona. **Paolo:** Sí, funciona fluidamente a través del componente `Nav.tsx` en el layout. | ✓ |
| F4 | ¿El formulario de crear plato realmente crea un plato en el backend? | **Joel:** Si, crea los platos en el backend. **Paolo:** Sí, envía un POST a `/platos` y actualiza la lista al instante. | ✓ |
| F5 | ¿El cambio de estado de mesa se refleja sin refrescar la página? | **Joel:** No, debo refrescar para que cambie de estado. **Paolo:** En `/mesas` cambia al instante. En `/pedidos` no actualiza el estado de la mesa automáticamente al crear un pedido. | ✓ |
| F6 | ¿La IA creó componentes reutilizables o repitió código? | **Joel:** Creo componentes reutilizables. **Paolo:** Sí, reutilizó `Nav` y `ErrorAlert` y separó las vistas en componentes independientes. | ✓ |
| F7 | ¿Los estilos Tailwind se ven coherentes entre páginas? | **Joel:** SI, se ven coherentes. **Paolo:** Sí, mantiene colores de estado (verde/rojo/amarillo) y acento naranja consistentes. | ✓ |
