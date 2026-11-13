'use strict';

const $ = id => document.getElementById(id);
const banco = [...preguntas.map(pregunta => ({...pregunta, nivel: 'Calentamiento'})), ...preguntasIntensivas];
const intentos = banco.map(() => ({ opcion: null, corregida: false }));
const bloques = new Map();
let indice = 0;

for (const nivel of new Set(banco.map(pregunta => pregunta.nivel))) {
    const grupo = document.createElement('section');
    grupo.className = 'bloque';
    const titulo = document.createElement('h2');
    titulo.textContent = nivel;
    const botones = document.createElement('div');
    botones.className = 'preguntas';
    grupo.append(titulo, botones);
    $('mapa').append(grupo);
    bloques.set(nivel, botones);
}

const mapa = banco.map((pregunta, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = i + 1;
    boton.setAttribute('aria-label', 'Pregunta ' + (i + 1) + ' · ' + pregunta.titulo);
    boton.onclick = () => abrir(i);
    bloques.get(pregunta.nivel).append(boton);
    return boton;
});

function abrir(nueva, enfocar = true) {
    indice = nueva;
    const pregunta = banco[indice];
    const intento = intentos[indice];
    $('nivel').textContent = pregunta.nivel + ' · ' + pregunta.foco;
    $('titulo').textContent = pregunta.titulo;
    $('reto').textContent = pregunta.reto;
    $('codigo').textContent = archivoJava(pregunta);
    $('codigo').parentElement.scrollTo(0, 0);
    $('copia-estado').textContent = '';
    const separadorLiteral = pregunta.main.includes('" / "');
    const variasLineas = pregunta.opciones.some(opcion => opcion.includes(' / '));
    $('formato-salida').hidden = !variasLineas;
    $('formato-salida').textContent = separadorLiteral ?
        'En esta pregunta, / se imprime literalmente.' : 'En las opciones, / representa un salto de línea.';
    $('opciones').replaceChildren(...pregunta.opciones.map((opcion, i) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'prediccion';
        input.checked = intento.opcion === i;
        input.disabled = intento.corregida;
        input.onchange = () => {
            intento.opcion = i;
            $('comprobar').disabled = false;
        };
        if (intento.corregida && i === pregunta.correcta) label.className = 'correcta';
        label.append(input, document.createTextNode(opcion));
        return label;
    }));
    $('comprobar').disabled = intento.corregida || intento.opcion === null;
    $('siguiente').disabled = indice === banco.length - 1;
    $('solucion').hidden = !intento.corregida;
    if (intento.corregida) mostrarSolucion(pregunta, intento);
    mapa.forEach((boton, i) => {
        boton.setAttribute('aria-current', i === indice ? 'step' : 'false');
        boton.classList.toggle('revisada', intentos[i].corregida);
    });
    const revisadas = intentos.filter(item => item.corregida).length;
    $('progreso').textContent = revisadas + ' de ' + banco.length + ' trazas revisadas.';
    if (enfocar) $('titulo').focus();
}

function mostrarSolucion(pregunta, intento) {
    $('solucion-titulo').textContent = intento.opcion === pregunta.correcta ? 'Has acertado · Revisa la traza' :
        'Compara tu predicción · ' + pregunta.opciones[pregunta.correcta];
    $('pasos').replaceChildren(...pregunta.pasos.map(([etapa, detalle]) => {
        const li = document.createElement('li');
        const encabezado = document.createElement('strong');
        encabezado.textContent = etapa;
        li.append(encabezado, document.createTextNode(' · ' + detalle));
        return li;
    }));
}

$('siguiente').onclick = () => abrir(indice + 1);
$('comprobar').onclick = () => {
    intentos[indice].corregida = true;
    abrir(indice, false);
    $('solucion-titulo').focus();
};
$('copiar').onclick = async () => {
    try {
        await navigator.clipboard.writeText($('codigo').textContent);
        $('copia-estado').textContent = 'Archivo copiado.';
    } catch {
        $('copia-estado').textContent = 'Selecciona el código y cópialo con el teclado.';
    }
};
abrir(0, false);
