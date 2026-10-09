/**
 * 18_FORM_1SI_CHALLENGES.gs
 * Ejecutar F18_configurarFormulario_1SI() UNA VEZ en Apps Script.
 * Genera preguntas de 1SI y vincula las respuestas a su Spreadsheet.
 * La corrección por rúbrica queda PENDIENTE de conectar al motor existente de 2SI.
 */
const F18_FORM_ID='1_18a1Iwlqis3hZ7rWyI1r9kf_sr18yootATLnkbznCc';
const F18_SHEET_ID='1-qPuyft2X55Wd1J7bpkbl7B51I9ZpjIiqTCdR_VlWdw';
const F18_ACTIVIDADES={
 'CHALLENGE PAPEL · HOMER':'1SI-JAVA-CHALLENGE-PAPEL-01',
 'CHALLENGE 02 · BUSCA EL TESORO':'1SI-JAVA-CHALLENGE-02'
};
function F18_configurarFormulario_1SI(){
 const form=FormApp.openById(F18_FORM_ID);
 form.setTitle('1SI · Programación Java · Entrega de Challenges');
 form.setDescription('Entrega los dos programas Java. Valora solo el Challenge de papel; el Challenge normal será corregido por el profesor con ayuda de ChatGPT.');
 // Actualización conservadora: no borrar preguntas ni respuestas previas.
 // Actualiza títulos conocidos y crea solo los campos que falten.
 const existing=form.getItems();
 const byTitle=t=>existing.find(i=>i.getTitle()===t);
 const oldActivity=byTitle('Actividad');
 if(oldActivity)form.deleteItem(oldActivity);
 const oldCode=byTitle('Código Java completo');
 if(oldCode)oldCode.setTitle('CHALLENGE PAPEL · HOMER — Código Java');
 const ss=SpreadsheetApp.openById(F18_SHEET_ID);
 const alumnos=ss.getSheetByName('ALUMNOS').getDataRange().getDisplayValues().slice(1)
   .filter(r=>r[0]==='1SI-JAVA'&&r[3]==='SÍ').map(r=>r[1]);
 const alumnoItem=byTitle('Alumno');
 if(alumnoItem)alumnoItem.asListItem().setChoiceValues(alumnos).setRequired(true);
 else form.addListItem().setTitle('Alumno').setChoiceValues(alumnos).setRequired(true);
 const papel=form.getItems().find(i=>i.getTitle()==='CHALLENGE PAPEL · HOMER — Código Java');
 if(papel)papel.asParagraphTextItem().setRequired(true);
 else form.addParagraphTextItem().setTitle('CHALLENGE PAPEL · HOMER — Código Java').setRequired(true);
 const notaItem=byTitle('Nota que crees haber conseguido');
 if(notaItem)notaItem.asScaleItem().setRequired(true);
 else form.addScaleItem().setTitle('Nota que crees haber conseguido').setBounds(1,10).setLabels('1','10').setRequired(true);
 let normal=byTitle('CHALLENGE NORMAL · BUSCA EL TESORO — Código Java');
 if(!normal)normal=form.addParagraphTextItem().setTitle('CHALLENGE NORMAL · BUSCA EL TESORO — Código Java').setRequired(true);
 const declaracion=byTitle('Declaración honesta');
 if(!declaracion)form.addCheckboxItem().setTitle('Declaración honesta').setChoiceValues(['Confirmo que los dos códigos son míos y la valoración del papel es honesta']).setRequired(true);
 // Orden definitivo: alumno, código papel, nota papel, código normal, declaración.
 const desired=['Alumno','CHALLENGE PAPEL · HOMER — Código Java','Nota que crees haber conseguido','CHALLENGE NORMAL · BUSCA EL TESORO — Código Java','Declaración honesta'];
 desired.forEach((title,index)=>{const item=form.getItems().find(i=>i.getTitle()===title);if(item)form.moveItem(item,index)});
 form.setCollectEmail(true);
 form.setDestination(FormApp.DestinationType.SPREADSHEET,F18_SHEET_ID);
 // Instalar un solo trigger de este proyecto para evitar registros duplicados.
 ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='F18_registrarEntrega_1SI')
   .forEach(t=>ScriptApp.deleteTrigger(t));
 ScriptApp.newTrigger('F18_registrarEntrega_1SI').forForm(form).onFormSubmit().create();
 Logger.log('Formulario alumnado: '+form.getPublishedUrl());
}
function F18_registrarEntrega_1SI(e){
 if(!e||!e.response)throw new Error('Ejecutar desde el disparador de envío del formulario.');
 const resp=e.response, values={};
 resp.getItemResponses().forEach(ir=>values[ir.getItem().getTitle()]=ir.getResponse());
 const alumno=String(values['Alumno']||'').trim();
 const papel=String(values['CHALLENGE PAPEL · HOMER — Código Java']||'');
 const normal=String(values['CHALLENGE NORMAL · BUSCA EL TESORO — Código Java']||'');
 const nota=Number(values['Nota que crees haber conseguido']);
 const confirmado=values['Declaración honesta'];
 if(!alumno||!papel.trim()||!normal.trim()||!Number.isInteger(nota)||nota<1||nota>10||!confirmado)
   throw new Error('Entrega incompleta: faltan datos o alguno de los códigos.');
 const ss=SpreadsheetApp.openById(F18_SHEET_ID);
 const lista=ss.getSheetByName('ALUMNOS').getDataRange().getDisplayValues().slice(1);
 if(!lista.some(r=>r[0]==='1SI-JAVA'&&r[1]===alumno&&r[3]==='SÍ'))throw new Error('Alumno no autorizado');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const sh=ss.getSheetByName('ENTREGAS_CODIGO');
  const id=resp.getId();
  const ids=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat():[];
  if(ids.includes(id+'-PAPEL')&&ids.includes(id+'-NORMAL'))return;
  const common=[resp.getTimestamp(),'1SI-JAVA',alumno,resp.getRespondentEmail()||''];
  if(!ids.includes(id+'-PAPEL'))
    sh.appendRow([id+'-PAPEL',...common,F18_ACTIVIDADES['CHALLENGE PAPEL · HOMER'],papel,nota,'AUTOEVALUADO','GOOGLE_FORMS','','','','']);
  if(!ids.includes(id+'-NORMAL'))
    sh.appendRow([id+'-NORMAL',...common,F18_ACTIVIDADES['CHALLENGE 02 · BUSCA EL TESORO'],normal,'','PENDIENTE_CORRECCION','GOOGLE_FORMS','','','','']);
 }finally{lock.releaseLock()}
}
