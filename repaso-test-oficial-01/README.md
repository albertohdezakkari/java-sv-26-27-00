# Repaso tipo test oficial 01

Actividad formativa con las 15 preguntas tipo test del examen de repaso Java y sus cuatro opciones originales. El límite actual es de 90 segundos para todo el intento; el orden se aleatoriza. Se muestra una explicación después de cada respuesta y una revisión completa al final.

- Ruta prevista en GitHub Pages: `/repaso-test-oficial-01/`.
- Identificador de quiz reservado: `1SI-JAVA-REPASO-OFICIAL-01`.
- Selector de cuenta escolar (censo 1SI): `data/cuentas.js`. Las cuentas se publican como opciones en el código de esta página; seleccionar una no autentica su titular.
- Clave docente separada: `data/soluciones-docente.json`.
- Preguntas y lógica: `data/preguntas.js` y `app.js`.

La corrección y el progreso se guardan localmente en el navegador. El registro central actual de 1SI solo admite los quizzes `1SI-JAVA-DEBUG-TEST-01` y `1SI-JAVA-DEBUG-CHALLENGE-01`, con 20 preguntas del banco oficial y 60 segundos por pregunta. Por eso esta actividad aún no envía puntuaciones a Sheets. No se afirma que el registro central esté activado para este quiz.

## Vista docente

La vista de revisión está en `/repaso-test-oficial-01-profesor/`. Permite navegar por las preguntas, mostrar/ocultar la respuesta correcta y su explicación, y abrir una previsualización de la vista del alumnado. La previsualización no registra intentos ni ejecuta el temporizador.

La ruta docente no tiene autenticación. El sitio es público y cualquier persona que conozca la URL puede consultar la clave; `noindex` reduce su aparición en buscadores, pero no protege el acceso.
