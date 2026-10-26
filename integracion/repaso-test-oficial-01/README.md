# Registro de cuestionarios 1SI Java

Estado: backend privado preparado en Apps Script, pestañas destino preparadas y cliente del cuestionario preparado. La URL de despliegue aún no se ha insertado en el cliente; por tanto, el cuestionario no transmite intentos todavía.

## Proyecto Apps Script privado

Proyecto creado en la cuenta docente: [Registro de cuestionarios Java 1SI](https://script.google.com/home/projects/1SELHNmmSlN_XNWfOyPAYDpQ-GPzdBm2CmOgvFubWJ8z1hphuOCK949_J/edit). Contiene el receptor `doPost`, valida estructura, respuestas y duración, calcula la nota en servidor y usa un ID de intento para que los reintentos no dupliquen filas.

El código fuente exportable está en `Code.gs`. Está aislado del Apps Script antiguo de 2SI y escribe en la hoja 1SI, pestañas `QUIZ_RESULTADOS` y `QUIZ_RESPUESTAS`. Se añadió una columna `ID_INTENTO` al final de cada pestaña para asegurar idempotencia. La clave correcta nunca se envía desde el navegador.

## Activación pendiente

1. Abrir el proyecto Apps Script anterior y confirmar que el editor contiene `doPost` y `doGet`.
2. Implementar como **Aplicación web**, ejecutada como la cuenta docente, con acceso para **cualquier usuario**. Esto hace público el endpoint de recepción, pero la hoja debe seguir privada.
3. Completar la autorización de acceso a la hoja y copiar la URL terminada en `/exec`.
4. Pegar esa URL en `REGISTRATION_ENDPOINT` de `repaso-test-oficial-01/app.js`.
5. Cambiar la versión de `app.js` en `index.html`, publicar Pages y comprobar un intento de prueba con una cuenta autorizada. Confirmar una fila en ambas pestañas antes de anunciarlo al alumnado.

La publicación del endpoint requiere la autorización del docente, porque habilita un receptor accesible públicamente para guardar correos seleccionados, respuestas y calificaciones en la hoja privada. La selección de cuenta por sí sola no autentica la identidad.

## Para el próximo cuestionario

Copia `Code.gs` a un proyecto privado del mismo curso (o amplía con revisión explícita), asigna un `quiz` nuevo y sus IDs de pregunta y clave en `KEY`. Mantén el mismo contrato de envío: `action`, `quiz`, `attemptId`, `alumno`, `email`, `grupo`, `tiempoTotal`, y respuestas `{preguntaId,respuesta,segundos}`. Reutiliza la columna `ID_INTENTO` y confirma el guardado con un intento de prueba antes de publicar.
