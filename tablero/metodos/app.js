'use strict';

const tabs = Array.from(document.querySelectorAll('#steps [role="tab"]'));

function openTab(index, focus = false) {
    tabs.forEach((tab, position) => {
        const active = position === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => openTab(index));
    tab.addEventListener('keydown', event => {
        const destinations = {
            ArrowLeft: (index + tabs.length - 1) % tabs.length,
            ArrowRight: (index + 1) % tabs.length,
            Home: 0,
            End: tabs.length - 1,
        };
        if (!(event.key in destinations)) return;
        event.preventDefault();
        openTab(destinations[event.key], true);
    });
});

async function copyText(value, status) {
    try {
        await navigator.clipboard.writeText(value);
        status.textContent = 'Copiado al portapapeles.';
    } catch {
        status.textContent = 'Selecciona el texto y cópialo con el teclado.';
    }
}

document.querySelectorAll('[data-copy]').forEach(button => {
    const status = document.createElement('span');
    status.className = 'copy-status';
    status.setAttribute('role', 'status');
    button.after(status);
    button.addEventListener('click', () => {
        copyText(document.getElementById(button.dataset.copy).textContent, status);
    });
});

[...fases, ...fundamentos].forEach((fase, index) => {
    const viewer = document.querySelector('[data-example="' + fase.id + '"]');
    const example = fase.file ?? archivoDeEjemplo(index);
    const pageSize = 14;
    let page = 0;
    viewer.innerHTML = `
        <div class="code-toolbar">
          <h3>Ejemplo de clase · Main.java</h3>
          <div class="controls" role="group" aria-label="Contenido del visor">
            <button data-view="method" aria-pressed="true">Método y llamada</button>
            <button data-view="paged" aria-pressed="false">Archivo por páginas</button>
            <button data-view="all" aria-pressed="false">Archivo entero</button>
          </div>
        </div>
        <pre tabindex="0" aria-label="Código Java"><code></code></pre>
        <div class="controls">
          <button data-action="previous" hidden>← Página anterior</button>
          <span data-page role="status"></span>
          <button data-action="next" hidden>Página siguiente →</button>
          <button data-action="copy">Copiar bloque</button>
          <span class="copy-status" role="status"></span>
        </div>`;
    const pre = viewer.querySelector('pre');
    const code = viewer.querySelector('code');
    const modes = Array.from(viewer.querySelectorAll('[data-view]'));
    const previous = viewer.querySelector('[data-action="previous"]');
    const next = viewer.querySelector('[data-action="next"]');
    const copy = viewer.querySelector('[data-action="copy"]');
    const status = viewer.querySelector('.copy-status');
    const pageLabel = viewer.querySelector('[data-page]');
    const fragment = '// Dentro de main\n' + fase.calls + '\n\n// Fuera de main, dentro de Main\n' + fase.method;
    const lines = example.trimEnd().split('\n');
    const pages = Math.ceil(lines.length / pageSize);
    let view = 'method';

    function renderCode() {
        const start = page * pageSize;
        const visible = view === 'method' ? fragment.split('\n') :
            view === 'paged' ? lines.slice(start, start + pageSize) : lines;
        const rows = visible.map(line => {
            const row = document.createElement('span');
            row.className = 'code-line';
            if (fase.highlights.some(pattern => line.includes(pattern))) row.classList.add('highlight');
            row.textContent = line;
            return row;
        });
        code.replaceChildren(...rows);
        pre.scrollTop = 0;
        pre.scrollLeft = 0;
        previous.hidden = next.hidden = view !== 'paged';
        previous.disabled = page === 0;
        next.disabled = page === pages - 1;
        pageLabel.textContent = view === 'paged' ? 'Página ' + (page + 1) + ' de ' + pages : '';
        copy.textContent = view === 'method' ? 'Copiar bloque' : 'Copiar archivo completo';
        status.textContent = '';
    }

    modes.forEach(button => button.addEventListener('click', () => {
        view = button.dataset.view;
        page = 0;
        modes.forEach(mode => mode.setAttribute('aria-pressed', String(mode === button)));
        renderCode();
    }));
    previous.addEventListener('click', () => { page--; renderCode(); });
    next.addEventListener('click', () => { page++; renderCode(); });
    copy.addEventListener('click', () => copyText(view === 'method' ? fragment : example, status));
    renderCode();
});

const result = document.querySelector('#result');
const board = document.querySelector('#board');

function consult(fila, columna) {
    const libre = tablero[fila]?.[columna] === '*';
    result.textContent = 'esCasillaLibre(matriz, ' + fila + ', ' + columna + ') → ' + libre;
}

const headings = board.createTHead().insertRow();
for (const title of ['Fila', ...tablero[0].map((_, index) => index)]) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = title;
    headings.append(cell);
}

const body = board.createTBody();
tablero.forEach((fila, filaIndex) => {
    const row = body.insertRow();
    const heading = document.createElement('th');
    heading.scope = 'row';
    heading.textContent = filaIndex;
    row.append(heading);
    fila.forEach((symbol, columna) => {
        const button = document.createElement('button');
        button.textContent = symbol;
        button.dataset.symbol = symbol;
        button.setAttribute('aria-label', 'Fila ' + filaIndex + ', columna ' + columna + ', símbolo ' + symbol);
        button.addEventListener('click', () => consult(filaIndex, columna));
        row.insertCell().append(button);
    });
});
document.querySelector('#outside').addEventListener('click', () => consult(-1, 0));

const traceStep = document.querySelector('#trace-step');
const traceCode = document.querySelector('#trace-code');
const traceDescription = document.querySelector('#trace-description');
const traceBack = document.querySelector('#trace-back');
const traceNext = document.querySelector('#trace-next');
const traceReset = document.querySelector('#trace-reset');
let traceIndex = 0;

function renderTrace() {
    const [line, description] = recorrido[traceIndex];
    traceStep.textContent = 'Paso ' + (traceIndex + 1) + ' de ' + recorrido.length;
    traceCode.textContent = line;
    traceDescription.textContent = description;
    traceBack.disabled = traceIndex === 0;
    traceReset.disabled = traceIndex === 0;
    traceNext.disabled = traceIndex === recorrido.length - 1;
}

traceBack.addEventListener('click', () => { traceIndex--; renderTrace(); });
traceNext.addEventListener('click', () => { traceIndex++; renderTrace(); });
traceReset.addEventListener('click', () => { traceIndex = 0; renderTrace(); });
renderTrace();
