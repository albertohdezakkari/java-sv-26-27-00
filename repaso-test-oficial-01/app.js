'use strict';
const APP = document.querySelector('#app');
const QUIZ = '1SI-JAVA-REPASO-OFICIAL-01';
const STORE = 'repaso_test_oficial_01_v2';
const SECONDS = 90;
const TOTAL = QUESTIONS.length;
const LETTERS = 'ABCD';
const REGISTRATION_ENDPOINT = '';
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const registrationNotice = REGISTRATION_ENDPOINT
  ? 'La cuenta elegida no verifica tu identidad. Al finalizar se enviarán al registro docente el correo seleccionado, tus respuestas, la puntuación y los tiempos.'
  : 'Seleccionar una cuenta no verifica quién la utiliza. La selección y tus respuestas se guardan solo en este navegador; este test no envía la nota al registro del profesor.';
let state = null;
let timer = null;
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved && saved.quiz === QUIZ && Array.isArray(saved.order) && saved.order.length === TOTAL &&
      saved.order.every(i => Number.isInteger(i) && i >= 0 && i < TOTAL) && new Set(saved.order).size === TOTAL &&
      Array.isArray(saved.answers) && saved.answers.length === TOTAL &&
      saved.answers.every(a => a === null || Number.isInteger(a) && a >= 0 && a < 4) &&
      Number.isInteger(saved.index) && saved.index >= 0 && saved.index < TOTAL &&
      Number.isFinite(saved.startedAt) && Number.isFinite(saved.deadline) &&
      ['question','feedback','review','result'].includes(saved.phase)) state = saved;
} catch {}
function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {} }
function shell(content) {
  APP.innerHTML = `<div class="shell"><header class="mast"><div class="brand"><span class="brand-mark">J1</span><span>PROGRAMACIÓN · JAVA</span></div><span class="pill">REPASO · TEST 01</span></header>${content}<footer>Cuestionario formativo · 15 preguntas</footer></div>`;
}
function intro() {
  clearInterval(timer);
  state = null;
  try { localStorage.removeItem(STORE); } catch {}
  shell(`<section class="hero"><div class="eyebrow">Lectura y depuración de código</div><h1>Repaso tipo test oficial 01</h1><p class="lead">Las 15 preguntas tipo test del examen de repaso. Dispones de <b>90 segundos para cada pregunta</b>.</p></section><section class="panel instructions"><p><b>Cómo funciona:</b> responde una pregunta cada vez. Al elegir una opción, tu respuesta queda bloqueada y aparece la corrección. Pulsa <b>Siguiente</b> para cargar la próxima pregunta. También puedes revisar preguntas anteriores, pero no cambiar sus respuestas.</p><p>Si se agota el tiempo, cuenta como pregunta sin responder y podrás continuar. No se resta por error.</p><div class="identity"><label for="student">Elige tu cuenta del colegio</label><select id="student" required><option value="">Selecciona tu correo…</option>${ACCOUNTS.map(email => `<option value="${esc(email)}">${esc(email)}</option>`).join('')}</select><p class="hint">${registrationNotice}</p></div><div class="actions"><span class="hint">15 preguntas · 90 segundos por pregunta</span><button class="btn" id="start">Empezar →</button></div></section>`);
  APP.querySelector('#start').onclick = () => {
    const email = APP.querySelector('#student').value;
    if (email && ACCOUNTS.includes(email)) start(email);
  };
}
function shuffle(values) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
function start(email) {
  state = {quiz:QUIZ, student:email, phase:'question', order:shuffle(QUESTIONS.map((_, i) => i)), index:0,
    attemptId:crypto.randomUUID(), answers:Array(TOTAL).fill(null), times:Array(TOTAL).fill(0), startedAt:Date.now(), deadline:Date.now() + SECONDS * 1000};
  save();
  renderQuestion();
}
function remaining() { return Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)); }
function clockText(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`; }
function renderQuestion() {
  clearInterval(timer);
  if (!state) return intro();
  if (state.phase === 'result') return renderResult();
  if (state.phase === 'feedback') return renderFeedback();
  if (state.phase === 'review') return renderPrevious();
  if (remaining() === 0) return lockAnswer(null);
  const question = QUESTIONS[state.order[state.index]];
  shell(`<section class="question-card"><div class="question-head"><span class="topic">${esc(question.topic.toUpperCase())} · PREGUNTA ${state.index + 1}/${TOTAL}</span><div id="timer" class="timer ${remaining() <= 15 ? 'warn' : ''}" role="timer" aria-label="Tiempo restante">${clockText(remaining())}</div></div><div class="progress-wrap"><div class="progress" style="width:${state.index / TOTAL * 100}%"></div></div><h1 class="prompt">${esc(question.question)}</h1>${question.code ? `<pre class="code"><code>${esc(question.code)}</code></pre>` : ''}<div class="options">${question.options.map((option, i) => `<button class="option" data-choice="${i}"><span class="key">${LETTERS[i]}</span><span>${esc(option)}</span></button>`).join('')}</div><div class="actions"><span class="hint">Tienes 90 segundos para esta pregunta.</span></div></section>`);
  APP.querySelectorAll('[data-choice]').forEach(button => button.onclick = () => lockAnswer(Number(button.dataset.choice)));
  timer = setInterval(updateTimer, 200);
}
function updateTimer() {
  if (state?.phase !== 'question') return;
  const seconds = remaining();
  const node = APP.querySelector('#timer');
  if (node) {
    node.textContent = clockText(seconds);
    node.classList.toggle('warn', seconds <= 15);
  }
  if (seconds === 0) lockAnswer(null);
}
function lockAnswer(choice) {
  if (state?.phase !== 'question') return;
  clearInterval(timer);
  const seconds = remaining();
  state.answers[state.index] = seconds === 0 ? null : choice;
  state.times[state.index] = Math.min(SECONDS, Math.max(0, SECONDS - seconds));
  state.frozen = seconds;
  state.phase = 'feedback';
  save();
  renderFeedback();
}
function renderFeedback() {
  clearInterval(timer);
  const question = QUESTIONS[state.order[state.index]];
  const choice = state.answers[state.index];
  const correct = choice === question.answer;
  const timeText = clockText(state.frozen ?? 0);
  shell(`<section class="question-card"><div class="question-head"><span class="topic">PREGUNTA ${state.index + 1}/${TOTAL} · RESPUESTA BLOQUEADA</span><span class="timer">${timeText}</span></div><h1 class="prompt">${choice === null ? 'Tiempo agotado.' : correct ? '✓ Correcto.' : '✕ Respuesta incorrecta.'}</h1><div class="options">${question.options.map((option, i) => `<div class="option ${i === question.answer ? 'correct' : ''} ${i === choice && choice !== question.answer ? 'wrong' : ''}"><span class="key">${LETTERS[i]}</span><span>${esc(option)}</span></div>`).join('')}</div><div class="feedback ${correct ? '' : 'bad'}"><b>Respuesta correcta: ${LETTERS[question.answer]} · ${esc(question.options[question.answer])}</b><p>${esc(question.explanation)}</p></div><div class="teacher-nav"><button class="btn secondary" id="review-previous" ${state.index === 0 ? 'disabled' : ''}>Revisar la anterior</button><span class="hint">La respuesta queda bloqueada.</span><button class="btn" id="next">${state.index === TOTAL - 1 ? 'Ver resultado' : 'Siguiente →'}</button></div></section>`);
  APP.querySelector('#review-previous').onclick = () => {
    if (state.index > 0) {
      state.phase = 'review';
      state.reviewIndex = state.index - 1;
      save();
      renderPrevious();
    }
  };
  APP.querySelector('#next').onclick = advance;
}
function renderPrevious() {
  clearInterval(timer);
  const i = state.reviewIndex;
  const question = QUESTIONS[state.order[i]];
  const choice = state.answers[i];
  shell(`<section class="question-card"><div class="question-head"><span class="topic">REVISIÓN · PREGUNTA ${i + 1}/${TOTAL} · SOLO LECTURA</span><span class="preview-label">RESPUESTA BLOQUEADA</span></div><h1 class="prompt">${esc(question.question)}</h1>${question.code ? `<pre class="code"><code>${esc(question.code)}</code></pre>` : ''}<div class="options">${question.options.map((option, n) => `<div class="option ${n === question.answer ? 'correct' : ''} ${n === choice && choice !== question.answer ? 'wrong' : ''}"><span class="key">${LETTERS[n]}</span><span>${esc(option)}</span></div>`).join('')}</div><div class="feedback ${choice === question.answer ? '' : 'bad'}"><b>Tu respuesta: ${choice === null ? 'Sin responder (se agotó el tiempo)' : `${LETTERS[choice]} · ${esc(question.options[choice])}`}</b><p>Correcta: <b>${LETTERS[question.answer]} · ${esc(question.options[question.answer])}</b></p><p>${esc(question.explanation)}</p></div><div class="teacher-nav"><button class="btn secondary" id="review-earlier" ${i === 0 ? 'disabled' : ''}>Revisar la anterior</button><span class="hint">No puedes modificar respuestas anteriores.</span><button class="btn" id="return-current">Volver a la pregunta actual</button></div></section>`);
  APP.querySelector('#review-earlier').onclick = () => {
    if (state.reviewIndex > 0) {
      state.reviewIndex--;
      save();
      renderPrevious();
    }
  };
  APP.querySelector('#return-current').onclick = () => {
    state.phase = 'feedback';
    delete state.reviewIndex;
    save();
    renderFeedback();
  };
}
function advance() {
  if (state?.phase !== 'feedback') return;
  if (state.index === TOTAL - 1) {
    state.phase = 'result';
    state.finishedAt = Date.now();
    save();
    renderResult();
    return;
  }
  state.index++;
  state.phase = 'question';
  state.deadline = Date.now() + SECONDS * 1000;
  delete state.frozen;
  save();
  renderQuestion();
  window.scrollTo(0, 0);
}
function renderResult() {
  clearInterval(timer);
  const ordered = state.order.map(i => QUESTIONS[i]);
  const correct = ordered.reduce((count, question, i) => count + (state.answers[i] === question.answer ? 1 : 0), 0);
  const blank = state.answers.filter(answer => answer === null || answer === undefined).length;
  const wrong = TOTAL - correct - blank;
  if (!state.result) state.result = {correct, wrong, blank, grade: Math.round(correct / TOTAL * 1000) / 100};
  if (!state.finishedAt) state.finishedAt = Date.now();
  save();
  if (state.registration === 'sending') state.registration = null;
  const registrationText = !REGISTRATION_ENDPOINT ? 'Este intento se conserva en el navegador. El registro central aún no está activado.' : state.registration === 'saved' ? '✓ Intento guardado en el registro del profesor.' : state.registration === 'uncertain' ? 'No se ha podido confirmar el guardado.' : 'Enviando el intento al registro del profesor…';
  shell(`<section class="hero"><div class="eyebrow">Intento terminado</div><h1>Tu resultado</h1><p class="lead">${state.student ? `Cuenta seleccionada: ${esc(state.student)} · ` : ''}${Math.max(0, Math.round((state.finishedAt - state.startedAt) / 1000))} segundos</p></section><section class="panel"><div class="score">${Number(state.result.grade).toLocaleString('es-ES', {minimumFractionDigits:1, maximumFractionDigits:1})}<span style="font-size:.28em"> / 10</span></div><div class="stats"><div class="stat"><b>${state.result.correct}</b>Aciertos</div><div class="stat"><b>${state.result.wrong}</b>Errores</div><div class="stat"><b>${state.result.blank}</b>Sin responder</div></div><p class="notice" id="registration-status">${registrationText}</p>${REGISTRATION_ENDPOINT && state.registration === 'uncertain' ? '<button class="btn secondary" id="retry-save">Reintentar envío</button>' : ''}<section class="review"><h2>Corrección comentada</h2>${ordered.map((question, i) => `<article class="review-item"><div class="eyebrow">${String(i + 1).padStart(2, '0')} · ${esc(question.topic)}</div><h3>${esc(question.question)}</h3>${question.code ? `<pre class="code"><code>${esc(question.code)}</code></pre>` : ''}<p class="${state.answers[i] === question.answer ? 'good' : 'badtext'}">Tu respuesta: ${state.answers[i] === null || state.answers[i] === undefined ? 'Sin responder' : `${LETTERS[state.answers[i]]} · ${esc(question.options[state.answers[i]])}`}</p><p class="good">Correcta: ${LETTERS[question.answer]} · ${esc(question.options[question.answer])}</p><p>${esc(question.explanation)}</p></article>`).join('')}</section><div class="actions"><span class="hint">Clave docente guardada aparte en data/soluciones-docente.json.</span><button class="btn" id="again" ${REGISTRATION_ENDPOINT && state.registration !== 'saved' ? 'disabled' : ''}>Hacer otro intento →</button></div></section>`);
  APP.querySelector('#again').onclick = intro;
  APP.querySelector('#retry-save')?.addEventListener('click',()=>{state.registration=null;sendResult();});
  if (REGISTRATION_ENDPOINT && state.registration !== 'saved' && state.registration !== 'uncertain') sendResult();
}
async function sendResult() {
  if (!state || !REGISTRATION_ENDPOINT || ['sending','saved','uncertain'].includes(state.registration)) return;
  state.registration = 'sending';
  save();
  const payload = {action:'quiz',quiz:QUIZ,attemptId:state.attemptId,alumno:state.student,email:state.student,grupo:'1SI-JAVA',tiempoTotal:Math.max(0,Math.round((state.finishedAt-state.startedAt)/1000)),respuestas:state.order.map((q,i)=>({preguntaId:QUESTIONS[q].id,respuesta:state.answers[i]===null?'':'ABCD'[state.answers[i]],segundos:state.times?.[i]??90}))};
  try {
    const response = await fetch(REGISTRATION_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    if (!response.ok) throw new Error('Error HTTP '+response.status);
    const result = await response.json();
    if (!result.ok || result.attemptId !== state.attemptId) throw new Error(result.error || 'Respuesta de registro no válida');
    state.registration = 'saved';
    save();
    const status = APP.querySelector('#registration-status');
    if (status) status.textContent = '✓ Intento guardado en el registro del profesor.';
    const again = APP.querySelector('#again');
    if (again) again.disabled = false;
  } catch {
    state.registration = 'uncertain';
    save();
    const status = APP.querySelector('#registration-status');
    if (status) status.innerHTML = 'No se ha podido confirmar el guardado. Tus respuestas siguen en este navegador. <button class="btn secondary" id="retry-save">Reintentar envío</button>';
    APP.querySelector('#retry-save')?.addEventListener('click',()=>{state.registration=null;sendResult();});
  }
}
if (state) {
  if (state.phase === 'result') renderResult();
  else if (state.phase === 'feedback') renderFeedback();
  else if (state.phase === 'review') renderPrevious();
  else if (remaining() === 0) lockAnswer(null);
  else renderQuestion();
} else intro();
