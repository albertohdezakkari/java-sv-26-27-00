/**
 * Registro privado para los repasos tipo test de 1SI Java.
 * Despliega este proyecto como aplicación web: ejecutar como propietario,
 * acceso para cualquier usuario. La clave correcta se valida en el servidor.
 */
const QUIZ_REG = {
  SPREADSHEET_ID: '1-qPuyft2X55Wd1J7bpkbl7B51I9ZpjIiqTCdR_VlWdw',
  QUIZ_ID: '1SI-JAVA-REPASO-OFICIAL-01',
  GROUP: '1SI-JAVA',
  RESULT_SHEET: 'QUIZ_RESULTADOS',
  ANSWER_SHEET: 'QUIZ_RESPUESTAS'
};
const QUIZ_KEY = [
  {id:'RTO01Q01', answer:'A'}, {id:'RTO01Q02', answer:'D'},
  {id:'RTO01Q03', answer:'B'}, {id:'RTO01Q04', answer:'B'},
  {id:'RTO01Q05', answer:'D'}, {id:'RTO01Q06', answer:'A'},
  {id:'RTO01Q07', answer:'B'}, {id:'RTO01Q08', answer:'D'},
  {id:'RTO01Q09', answer:'D'}, {id:'RTO01Q10', answer:'C'},
  {id:'RTO01Q11', answer:'A'}, {id:'RTO01Q12', answer:'D'},
  {id:'RTO01Q13', answer:'D'}, {id:'RTO01Q14', answer:'D'},
  {id:'RTO01Q15', answer:'C'}
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    const payload = JSON.parse(e && e.postData && e.postData.contents || '{}');
    const data = validateQuizPayload_(payload);
    const book = SpreadsheetApp.openById(QUIZ_REG.SPREADSHEET_ID);
    const results = requiredSheet_(book, QUIZ_REG.RESULT_SHEET);
    const answers = requiredSheet_(book, QUIZ_REG.ANSWER_SHEET);
    const duplicate = findAttempt_(results, data.attemptId);
    if (duplicate) return json_({ok:true, attemptId:data.attemptId, duplicate:true, resultado:duplicate});

    const priorAnswers = findAttemptAnswers_(answers, data.attemptId);
    const now = new Date();
    let correct = 0, blank = 0;
    const answerRows = data.respuestas.map(item => {
      const key = QUIZ_KEY.find(entry => entry.id === item.preguntaId);
      const isBlank = item.respuesta === '';
      const isCorrect = !isBlank && item.respuesta === key.answer;
      if (isBlank) blank++;
      if (isCorrect) correct++;
      return [now, data.quiz, data.email, key.id, 'Lectura y depuración Java', item.respuesta, key.answer,
        isBlank ? 'BLANCO' : isCorrect ? 'CORRECTA' : 'INCORRECTA', item.segundos, data.attemptId];
    });
    const wrong = QUIZ_KEY.length - correct - blank;
    const grade = Math.round(correct / QUIZ_KEY.length * 1000) / 100;
    const result = {attemptId:data.attemptId, total:QUIZ_KEY.length, aciertos:correct, errores:wrong, blanco:blank, nota:grade};
    const resultRow = [now, data.quiz, data.alumno, data.email, data.grupo, QUIZ_KEY.length, correct, wrong, blank, grade, data.tiempoTotal, data.attemptId];

    // El bloqueo y la búsqueda por attemptId evitan duplicados por reintentos.
    if (priorAnswers.length === 0) answers.getRange(answers.getLastRow()+1,1,answerRows.length,answerRows[0].length).setValues(answerRows);
    else if (priorAnswers.length !== QUIZ_KEY.length) throw new Error('El intento tiene una escritura parcial. Identificador: '+data.attemptId);
    results.appendRow(resultRow);
    SpreadsheetApp.flush();
    return json_({ok:true, attemptId:data.attemptId, resultado:result});
  } catch (err) {
    return json_({ok:false, error:String(err && err.message || err)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet() {
  return json_({ok:true, service:'1SI Java quiz registration', quiz:QUIZ_REG.QUIZ_ID});
}

function validateQuizPayload_(p) {
  if (!p || p.action !== 'quiz' || p.quiz !== QUIZ_REG.QUIZ_ID) throw new Error('Cuestionario no válido.');
  if (typeof p.attemptId !== 'string' || !/^[a-f0-9-]{36}$/i.test(p.attemptId)) throw new Error('Identificador de intento no válido.');
  if (p.grupo !== QUIZ_REG.GROUP) throw new Error('Grupo no válido.');
  if (typeof p.email !== 'string' || !/^[a-z0-9._%+-]+@svalero\.com$/i.test(p.email)) throw new Error('Cuenta del colegio no válida.');
  if (p.alumno !== p.email) throw new Error('La cuenta seleccionada no coincide.');
  if (!Array.isArray(p.respuestas) || p.respuestas.length !== QUIZ_KEY.length) throw new Error('El intento debe contener las 15 respuestas.');
  const ids = p.respuestas.map(item => item && item.preguntaId);
  if (new Set(ids).size !== QUIZ_KEY.length) throw new Error('Hay preguntas repetidas o ausentes.');
  const answers = p.respuestas.map((item, i) => {
    if (!item || typeof item.preguntaId !== 'string' || !QUIZ_KEY.some(key => key.id === item.preguntaId) || !['','A','B','C','D'].includes(item.respuesta)) throw new Error('Respuesta no válida en pregunta '+(i+1)+'.');
    const seconds = Number(item.segundos);
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 90) throw new Error('Tiempo no válido en pregunta '+(i+1)+'.');
    return {preguntaId:item.preguntaId, respuesta:item.respuesta, segundos:seconds};
  });
  const elapsed = Number(p.tiempoTotal);
  if (!Number.isInteger(elapsed) || elapsed < 0 || elapsed > 15*90) throw new Error('Duración del intento no válida.');
  return {quiz:p.quiz, attemptId:p.attemptId, alumno:p.alumno, email:p.email, grupo:p.grupo, tiempoTotal:elapsed, respuestas:answers};
}

function requiredSheet_(book, name) {
  const sheet = book.getSheetByName(name);
  if (!sheet) throw new Error('No existe la pestaña '+name+'.');
  if (sheet.getLastRow() === 0) throw new Error('Faltan los encabezados en '+name+'.');
  return sheet;
}

function findAttempt_(sheet, attemptId) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const matches = sheet.getRange(2,12,last-1,1).createTextFinder(attemptId).matchEntireCell(true).findNext();
  if (!matches) return null;
  const row = matches.getRow();
  const values = sheet.getRange(row,1,1,12).getValues()[0];
  return {attemptId:String(values[11]), total:Number(values[5]), aciertos:Number(values[6]), errores:Number(values[7]), blanco:Number(values[8]), nota:Number(values[9])};
}

function findAttemptAnswers_(sheet, attemptId) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const found = sheet.getRange(2,10,last-1,1).createTextFinder(attemptId).matchEntireCell(true).findAll();
  return found || [];
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
