/**
 * 17_CHALLENGES_JAVA_2026_27.gs
 * Añadir al proyecto Apps Script central.
 * En 13_QUIZ.gs, dentro de doPost y ANTES de registrarQuiz:
 *
 * if (datos.action === 'challenge' && datos.challengeId === '1SI-JAVA-CHALLENGE-02')
 *   return F17_challengeTesoro_(datos);
 * if (datos.action === 'challenge_papel' && datos.challengeId === '1SI-JAVA-CHALLENGE-PAPEL-01')
 *   return F17_challengePapel_(datos);
 *
 * Mantener intactas las rutas existentes RN01 y Challenge Star Wars.
 */
const F17_CENTRAL='1SNdLEmnBUlbXi6p8cpxKeAhr4zZIDtpSloupe1CWt6o';
const F17_PAPEL='1vD5qBWM8UBJ571ZpLq6Fe-q-2IEo2hdsWiOw9DrB82g';
function F17_json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
function F17_alumno_(grupo,alumno){
  const sh=SpreadsheetApp.openById(F17_CENTRAL).getSheetByName('ALUMNOS');
  if(!sh) throw new Error('Falta hoja ALUMNOS');
  const rows=sh.getDataRange().getDisplayValues().slice(1);
  return rows.some(r=>r[0]===grupo && r[1]===alumno && r[3].toUpperCase()==='SÍ');
}
function F17_challengeTesoro_(d){
 try{
  if(d.challengeId!=='1SI-JAVA-CHALLENGE-02'||d.grupo!=='1SI-JAVA'||!F17_alumno_(d.grupo,d.alumno))throw new Error('Challenge, grupo o alumno no válido');
  const levels={NC:['NO CONSEGUIDO',0,'NO','NO','NO'],C1:['CHALLENGE 1',5,'SI','NO','NO'],C2:['CHALLENGE 2',7,'SI','SI','NO'],C3:['CHALLENGE 3',10,'SI','SI','SI']};
  const v=levels[String(d.nivel||'')];
  if(!v)throw new Error('Nivel no válido');
  if(d.nivel==='NC'&&(!String(d.observaciones||'').trim()||d.compromiso!==true))throw new Error('Faltan observaciones o compromiso');
  const sh=SpreadsheetApp.openById(F17_CENTRAL).getSheetByName('CHALLENGE_RESULTADOS');
  sh.appendRow([new Date(),d.grupo,d.alumno,'',v[0],v[2],v[3],v[4],v[1],'NO','',d.nivel==='NC'?d.observaciones:'',d.nivel==='NC'?'SI':'']);
  return F17_json_({ok:true,challenge:v[0],notaDeclarada:v[1]});
 }catch(e){return F17_json_({ok:false,error:String(e.message||e)})}
}
function F17_challengePapel_(d){
 try{
  if(d.challengeId!=='1SI-JAVA-CHALLENGE-PAPEL-01'||d.grupo!=='1SI-JAVA'||!F17_alumno_(d.grupo,d.alumno))throw new Error('Challenge, grupo o alumno no válido');
  const nota=Number(d.nota);
  if(!Number.isInteger(nota)||nota<1||nota>10||d.confirmacion!==true)throw new Error('Nota o confirmación no válida');
  const ss=SpreadsheetApp.openById(F17_PAPEL),ent=ss.getSheetByName('ENTREGAS'),notas=ss.getSheetByName('NOTAS_1SI');
  if(!ent||!notas)throw new Error('Faltan hojas de notas');
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
   const fecha=new Date(),id=Utilities.getUuid();
   ent.appendRow([fecha,d.challengeId,d.grupo,d.alumno,nota,'SI','WEB','',id,'REGISTRADO']);
   const rows=notas.getDataRange().getDisplayValues();
   let index=-1;for(let i=1;i<rows.length;i++){if(rows[i][0]===d.grupo&&rows[i][1]===d.alumno){index=i+1;break}}
   if(index<0)throw new Error('Alumno no encontrado en NOTAS_1SI');
   const prev=Number(notas.getRange(index,5).getValue())||0;
   notas.getRange(index,3,1,4).setValues([[nota,fecha,prev+1,'REGISTRADO']]);
  }finally{lock.releaseLock()}
  return F17_json_({ok:true,notaDeclarada:nota});
 }catch(e){return F17_json_({ok:false,error:String(e.message||e)})}
}
