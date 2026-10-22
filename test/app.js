'use strict';
const KEY='1si-tablero-test-v2',SECONDS=40;
const QUIZ='1SI-JAVA-TABLERO-02';
const REGISTRATION_ENABLED=true; // Verificado con la versión 9 y Sheets API v4.
const ENDPOINT='https://script.google.com/macros/s/AKfycbzX9MQXPhHhkcKA9idKifON05j1IbxJhKAvXIvdj_N3F7H1lsiTGbdzREomAnCnMn-l/exec';
let sending=false;
const app=document.querySelector('#test-app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={phase:'intro'},timer=null;
try{
 const candidate=JSON.parse(localStorage.getItem(KEY)||'null');
 if(candidate&&['question','feedback','result'].includes(candidate.phase)&&Array.isArray(candidate.order)&&candidate.order.length===QUESTIONS.length&&new Set(candidate.order).size===QUESTIONS.length&&candidate.order.every(i=>Number.isInteger(i)&&i>=0&&i<QUESTIONS.length)&&Array.isArray(candidate.answers)&&candidate.answers.every(a=>a===null||Number.isInteger(a)&&a>=0&&a<4)&&Number.isInteger(candidate.index)&&candidate.index>=0&&candidate.index<QUESTIONS.length&&Number.isFinite(candidate.deadline)&&candidate.answers.length===(candidate.phase==='question'?candidate.index:candidate.phase==='feedback'?candidate.index+1:QUESTIONS.length))state=candidate;
}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function stop(){clearInterval(timer);timer=null;}
function validStudent(student){return student&&STUDENTS.some(s=>s.group===student.group&&s.name===student.name);}
function identify(resume=false){
 app.innerHTML=`<span class="tag">LECTURA DE CÓDIGO</span><h1>Del código al tablero.</h1><p class="lead">20 preguntas sobre el programa de clase. Tienes 40 segundos por pregunta.</p><div class="panel"><h2>Selecciona tu nombre.</h2><p class="small">Grupo: <b>1SI-JAVA</b></p><label for="student">Alumno/a</label><select id="student" required><option value="">Selecciona tu nombre…</option>${STUDENTS.map((s,i)=>`<option value="${i}">${esc(s.name)}</option>`).join('')}</select><p class="small">Comprueba tu nombre antes de comenzar. Tu puntuación quedará asociada a esta selección.</p>${resume?'<p>Tu intento actual se conserva. Selecciona tu nombre para continuar.</p>':'<p>El contador se detiene al responder. Si se agota, cuenta como no respondida. Cada acierto suma 0,5 puntos sobre 10; los errores no restan.</p>'}<button class="primary" id="start" disabled>${resume?'Continuar mi intento →':'Comenzar test →'}</button><p class="small">Al terminar, se enviarán tu nombre, grupo y respuestas al registro del profesor. La nota se calculará y guardará en el servidor.</p></div>`;
 const select=document.querySelector('#student'),button=document.querySelector('#start');
 select.onchange=()=>{button.disabled=select.value==='';};
 button.onclick=()=>{
  if(select.value==='')return;
  const student=STUDENTS[Number(select.value)];
  if(!validStudent(student))return;
  if(resume){state.student={...student};state.attemptId=state.attemptId||crypto.randomUUID();save();render();}
  else start(student);
 };
}
function start(student){
 if(!validStudent(student))return;
 const order=QUESTIONS.map((_,i)=>i);
 for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 state={phase:'question',student:{...student},attemptId:crypto.randomUUID(),startedAt:new Date().toISOString(),order,index:0,answers:[],times:[],duration:SECONDS,deadline:Date.now()+SECONDS*1000};save();render();
}
function render(){
 stop();
 if(state.phase==='intro'){identify();return;}
 if(!validStudent(state.student)){identify(true);return;}
 if(state.phase==='result'){finish();return;}
 const q=QUESTIONS[state.order[state.index]],locked=state.phase==='feedback',answer=state.answers[state.index];
 const left=TestLogic.remaining(state.deadline,Date.now());
 app.innerHTML=`<span class="tag">LECTURA DE CÓDIGO</span><p class="small identity">${esc(state.student.name)} · ${esc(state.student.group)}</p><section class="panel"><div class="qmeta"><div><b>Pregunta ${state.index+1} de ${QUESTIONS.length}</b><p class="small">Una respuesta correcta</p></div><div><div class="timer-label">TIEMPO</div><div id="timer" class="timer ${locked?'stopped':''}" role="timer" aria-label="Tiempo restante">00:${String(left).padStart(2,'0')}</div></div></div><div class="progress"><i style="width:${state.index/QUESTIONS.length*100}%"></i></div><h2>${esc(q.q)}</h2><pre><code>${esc(q.code)}</code></pre><div class="options">${q.opts.map((o,i)=>`<button data-answer="${i}" class="option ${locked&&i===q.a?'correct':''} ${locked&&i===answer&&answer!==q.a?'wrong':''}" ${locked?'disabled':''}><b>${'ABCD'[i]}</b><span>${esc(o)}</span>${locked&&i===q.a?'<span class="mark" aria-label="Respuesta correcta">✓</span>':locked&&i===answer?'<span class="mark" aria-label="Respuesta incorrecta">✕</span>':''}</button>`).join('')}</div><div id="feedback" aria-live="polite">${locked?`<div class="feedback ${answer===q.a?'':'bad'}"><b>${answer===null?'Tiempo agotado.':answer===q.a?'✓ Correcto.':'✕ Respuesta incorrecta.'}</b><p>Respuesta correcta: <b>${'ABCD'[q.a]} · ${esc(q.opts[q.a])}</b></p><p>${esc(q.why)}</p></div><button class="primary" id="continue">${state.index===QUESTIONS.length-1?'Ver puntuación':'Siguiente →'}</button>`:''}</div></section>`;
 if(locked){document.querySelector('#timer').textContent=state.frozen;document.querySelector('#continue').onclick=next;}
 else{
  app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>respond(+b.dataset.answer));
  updateTimer();if(state.phase==='question')timer=setInterval(updateTimer,200);
 }
}
function updateTimer(){
 if(state.phase!=='question')return;
 const left=TestLogic.remaining(state.deadline,Date.now()),el=document.querySelector('#timer');
 if(el){el.textContent='00:'+String(left).padStart(2,'0');el.classList.toggle('warn',left<=8);}
 if(left===0)respond(null);
}
function respond(choice){
 if(state.phase!=='question')return;
 const now=Date.now();stop();
 state.answers.push(TestLogic.resolve(choice,state.deadline,now));
 state.times=state.times||[];state.times[state.index]=Math.min(SECONDS,Math.max(0,Math.floor(SECONDS-(state.deadline-now)/1000)));
 state.frozen='00:'+String(TestLogic.remaining(state.deadline,now)).padStart(2,'0');
 state.phase='feedback';save();render();
}
function next(){
 if(state.phase!=='feedback')return;
 if(state.index===QUESTIONS.length-1){state.phase='result';}
 else{state.index++;state.phase='question';state.deadline=Date.now()+SECONDS*1000;}
 save();render();window.scrollTo(0,0);
}
function finish(){
 const questions=state.order.map(i=>QUESTIONS[i]),local=TestLogic.score(questions,state.answers);
 state.result={...local};state.finishedAt=state.finishedAt||new Date().toISOString();save();
 const confirmed=state.registration&&state.registration.status==='saved';
 const r=confirmed?state.registration.result:{nota:local.grade,aciertos:local.correct,errores:local.wrong,blanco:local.blank};
 app.innerHTML=`<span class="tag">TEST COMPLETADO</span><h1>Tu puntuación.</h1><p class="identity"><b>${esc(state.student.name)}</b><br>${esc(state.student.group)}</p><div class="panel"><div class="score">${Number(r.nota).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1})}<small> / 10</small></div><div class="stats"><div class="stat"><strong>${r.aciertos}</strong>Aciertos</div><div class="stat"><strong>${r.errores}</strong>Errores</div><div class="stat"><strong>${r.blanco}</strong>Sin responder</div></div><div id="registration" class="note ${confirmed?'':'warning'}" role="status">${confirmed?'✓ Resultado calculado por el servidor y guardado en el registro del profesor.':'Guardando tu resultado en el registro del profesor…'}</div><div class="result-actions"><button id="restart" ${confirmed?'':'disabled'}>Hacer otro intento</button></div></div>`;
 document.querySelector('#restart').onclick=()=>{state={phase:'intro'};save();render();window.scrollTo(0,0);};
 if(!confirmed){if(REGISTRATION_ENABLED)sendResult();else document.querySelector('#registration').textContent='Registro central pendiente de activación. Tus respuestas y tu puntuación se conservan en este navegador; todavía no se han enviado.';}
}
async function sendResult(){
 if(sending)return;
 if(state.registration&&state.registration.status==='uncertain'){showUncertain();return;}
 if(!state.payload){
  state.payload={quiz:QUIZ,attemptId:state.attemptId,alumno:state.student.name,grupo:state.student.group,
   tiempoTotal:Math.max(0,Math.round((Date.parse(state.finishedAt)-Date.parse(state.startedAt||state.finishedAt))/1000)),
   respuestas:state.order.map((q,i)=>({preguntaId:QUESTIONS[q].id,respuesta:state.answers[i]===null?'':'ABCD'[state.answers[i]],segundos:state.answers[i]===null?SECONDS:Math.min(SECONDS-1,(state.times||[])[i]||0)}))};
 }
 sending=true;state.registration={status:'sending'};save();
 try{
  const data=await TestLogic.submitWithRetry(async()=>{
   const controller=new AbortController(),limit=setTimeout(()=>controller.abort(),45000);
   try{
    const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(state.payload),signal:controller.signal});
    if(!response.ok)throw new Error('Registro temporalmente no disponible');
    const result=await response.json();
    if(!result.ok&&/lock|bloqueo|too many|timeout|tiempo de espera|simult[aá]ne/i.test(String(result.error||'')))throw new Error('Servidor ocupado');
    return result;
   }finally{clearTimeout(limit);}
  },{onRetry:()=>{const el=document.querySelector('#registration');if(el)el.textContent='El servidor está ocupado. Conservamos tus respuestas y estamos reintentando el guardado…';}});
  if(!data.ok){
   state.registration={status:'rejected',error:String(data.error||'No se ha podido registrar el intento.')};save();
   document.querySelector('#registration').innerHTML='<b>No se ha confirmado el registro.</b><p>'+esc(state.registration.error)+'</p><p>Avisa al profesor para revisar este intento.</p>';return;
  }
  const r=data.resultado;
  if(!r||r.attemptId!==state.attemptId||r.total!==20||!Number.isFinite(r.nota))throw new Error('Respuesta de registro no válida');
  state.registration={status:'saved',result:r};save();finish();
 }catch{
  state.registration={status:'uncertain'};save();showUncertain();
 }finally{sending=false;}
}
function showUncertain(){
 const target=document.querySelector('#registration');if(!target)return;
 target.innerHTML='<b>No hemos podido confirmar el guardado.</b><p>Tu envío puede haberse registrado. Avisa al profesor e indica este identificador:</p><code>'+esc(state.attemptId)+'</code><p>Conservamos tus respuestas. Comprobar el mismo intento no crea otro registro.</p><button id="retry-registration">Comprobar mi registro</button>';
 document.querySelector('#retry-registration').onclick=()=>{state.registration={status:'pending'};save();target.textContent='Comprobando el registro…';sendResult();};
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateTimer();});
render();
