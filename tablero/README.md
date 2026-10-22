# C02 · Del código al tablero

Cuaderno interactivo de Java: seis misiones visuales de matrices, preparación de un proyecto con IntelliJ y Git desde su terminal, y el reto «Misión de rescate».

El cuaderno termina en el reto de programación. El progreso se conserva en el navegador.

## Publicación

[Abrir cuaderno](https://albertohdezakkari.github.io/java-sv-26-27-00/tablero/).

GitHub Pages sirve los archivos estáticos desde la rama `main`.

## Verificación local

Desde la raíz del repositorio:

```sh
node --check tablero/app.js
node tablero/verify.cjs
python3 -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/tablero/`.
