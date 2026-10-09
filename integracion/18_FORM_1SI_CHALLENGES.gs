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
 form.setDescription('Selecciona tu nombre y actividad. Pega tu código Java completo. La nota declarada no sustituye la corrección del profesor.');
 // La copia procede del formulario de 2.º: eliminar sus ítems antiguos.
 form.getItems().forEach(item=>form.deleteItem(item));
 const ss=SpreadsheetApp.openById(F18_SHEET_ID);
 const alumnos=ss.getSheetByName('ALUMNOS').getDataRange().getDisplayValues().slice(1)
   .filter(r=>r[0]==='1SI-JAVA'&&r[3]==='SÍ').map(r=>r[1]);
 form.addListItem().setTitle('Alumno').setChoiceValues(alumnos).setRequired(true);
 form.addListItem().setTitle('Actividad').setChoiceValues(Object.keys(F18_ACTIVIDADES)).setRequired(true);
 form.addParagraphTextItem().setTitle('Código Java completo').setHelpText('Pega el contenido de Main.java. No pegues únicamente la salida de consola.').setRequired(true);
 form.addScaleItem().setTitle('Nota que crees haber conseguido').setBounds(1,10).setLabels('1','10').setRequired(true);
 form.addCheckboxItem().setTitle('Declaración honesta').setChoiceValues(['Confirmo que el código es mío y que mi valoración refleja el trabajo realizado']).setRequired(true);
 form.setCollectEmail(true);
 form.setDestination(FormApp.DestinationType.SPREADSHEET,F18_SHEET_ID);
 // Instalar un solo trigger de este proyecto para evitar registros duplicados.
 ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='F18_registrarEntrega_1SI')
   .forEach(t=>ScriptApp.deleteTrigger(t));
 ScriptApp.newTrigger('F18_registrarEntrega_1SI').forForm(form).onFormSubmit().create();
 Logger.log('Formulario alumnado: '+form.getPublishedUrl());
}
function F18_registrarEntrega_1SI(e){
 if(!e||!e.response)throw new Error('Esta función debe ejecutarse por el trigger del formulario.');
 const resp=e.response;
 const values={};
 resp.getItemResponses().forEach(ir=>values[ir.getItem().getTitle()]=ir.getResponse());
 const alumno=String(values['Alumno']||'').trim();
 const actividad=F18_ACTIVIDADES[values['Actividad']];
 const codigo=String(values['Código Java completo']||'');
 const nota=Number(values['Nota que crees haber conseguido']);
 const confirmacion=values['Declaración honesta'];
 if(!actividad||!alumno||!codigo.trim()||!Number.isInteger(nota)||nota<1||nota>10||!confirmacion)throw new Error('Entrega incompleta');
 const ss=SpreadsheetApp.openById(F18_SHEET_ID);
 const lista=ss.getSheetByName('ALUMNOS').getDataRange().getDisplayValues().slice(1);
 if(!lista.some(r=>r[0]==='1SI-JAVA'&&r[1]===alumno&&r[3]==='SÍ'))throw new Error('Alumno no autorizado');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
   const sh=ss.getSheetByName('ENTREGAS_CODIGO');
   const id=resp.getId();
   const ids=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat():[];
   if(ids.includes(id))return;
   sh.appendRow([id,resp.getTimestamp(),'1SI-JAVA',alumno,resp.getRespondentEmail()||'',actividad,
      codigo,nota,'PENDIENTE_CORRECCION','GOOGLE_FORMS','','','','']);
 }finally{lock.releaseLock()}
}
