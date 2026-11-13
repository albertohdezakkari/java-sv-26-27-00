'use strict';

const mostrar = `    static void mostrarTablero(char[][] matriz) {
        for (int fila = 0; fila < matriz.length; fila++) {
            for (int columna = 0; columna < matriz[fila].length; columna++) {
                System.out.print(matriz[fila][columna] + " ");
            }
            System.out.println();
        }
    }`;

const contar = `    static int contarLibres(char[][] matriz) {
        int libres = 0;
        for (int fila = 0; fila < matriz.length; fila++) {
            for (int columna = 0; columna < matriz[fila].length; columna++) {
                if (matriz[fila][columna] == '*') {
                    libres++;
                }
            }
        }
        return libres;
    }`;

const consultar = `    static boolean esCasillaLibre(char[][] matriz, int fila, int columna) {
        if (fila < 0 || fila >= matriz.length) {
            return false;
        }
        if (columna < 0 || columna >= matriz[fila].length) {
            return false;
        }
        return matriz[fila][columna] == '*';
    }`;

const tablero = [
    ['Y', '*', 'P', '*'],
    ['*', '*', '*', '*'],
    ['*', '*', '*', '*'],
    ['*', '*', '*', 'F'],
];

const fases = [
    {
        id: 'mostrar',
        method: mostrar,
        calls: '        mostrarTablero(matriz);',
        highlights: ['static void', 'System.out.println()', 'mostrarTablero(matriz)'],
    },
    {
        id: 'contar',
        method: contar,
        calls: `        int libres = contarLibres(matriz);
        System.out.println("Casillas libres: " + libres);`,
        highlights: ['static int', 'libres++', 'return libres', 'contarLibres(matriz)'],
    },
    {
        id: 'consultar',
        method: consultar,
        calls: `        System.out.println(esCasillaLibre(matriz, 0, 1));
        System.out.println(esCasillaLibre(matriz, 0, 2));
        System.out.println(esCasillaLibre(matriz, -1, 0));`,
        highlights: ['static boolean', 'fila < 0', 'columna < 0', 'return matriz', 'println(esCasillaLibre'],
    },
];

function archivoDeEjemplo(indice) {
    const fasesActuales = fases.slice(0, indice + 1);
    const filasJava = tablero.map(fila => '            {' + fila.map(celda => "'" + celda + "'").join(', ') + '}');
    return `public class Main {
    public static void main(String[] args) {
        char[][] matriz = {
${filasJava.join(',\n')}
        };

${fasesActuales.map(fase => fase.calls).join('\n')}
    }

${fasesActuales.map(fase => fase.method).join('\n\n')}
}
`;
}

const sumar = `    static int sumar(int a, int b) {
        return a + b;
    }`;
const mostrarTotal = `    static void mostrarTotal(int total) {
        System.out.println("Total: " + total);
    }`;
const llamadas = `        int resultado = sumar(4, 3);
        mostrarTotal(resultado);
        mostrarTotal(sumar(10, 2));`;
const ejemploInicial = `public class Main {
    public static void main(String[] args) {
${llamadas}
    }

${sumar}

${mostrarTotal}
}
`;

const modificarDatos = `    static void cambiarNumero(int numero) {
        numero = 7;
    }

    static void ponerObstaculo(char[][] matriz) {
        matriz[0][0] = 'P';
    }`;
const llamadasDatos = `        int puntos = 4;
        char[][] tablero = {{'*'}};
        cambiarNumero(puntos);
        ponerObstaculo(tablero);
        System.out.println(puntos);
        System.out.println(tablero[0][0]);`;

const fundamentos = [
    {
        id: 'fundamentos',
        method: sumar + '\n\n' + mostrarTotal,
        calls: llamadas,
        file: ejemploInicial,
        highlights: ['static int', 'static void', 'return a + b', 'mostrarTotal(resultado)'],
    },
    {
        id: 'firma',
        method: sumar,
        calls: '        int resultado = sumar(4, 3);',
        file: ejemploInicial,
        highlights: ['static int sumar', 'return a + b', 'resultado = sumar'],
    },
    {
        id: 'datos',
        method: modificarDatos,
        calls: llamadasDatos,
        file: `public class Main {
    public static void main(String[] args) {
${llamadasDatos}
    }

${modificarDatos}
}
`,
        highlights: ['cambiarNumero(puntos)', 'ponerObstaculo(tablero)', 'numero = 7', "matriz[0][0] = 'P'"],
    },
];

const recorrido = [
    ['int resultado = sumar(4, 3);', 'Empiezas en main. Para completar la asignación, primero se ejecuta la llamada a sumar.'],
    ['static int sumar(int a, int b)', 'Entras en sumar. El parámetro a recibe 4 y el parámetro b recibe 3, en el mismo orden que los argumentos.'],
    ['return a + b;', 'Java calcula 4 + 3. La llamada a sumar termina y entrega el entero 7 a main.'],
    ['int resultado = sumar(4, 3);', 'Se completa la asignación. La variable resultado de main guarda 7. La consola sigue vacía.'],
    ['mostrarTotal(resultado);', 'Entras en mostrarTotal. Su parámetro total recibe una copia del 7 guardado en resultado.'],
    ['System.out.println("Total: " + total);', 'Aparece Total: 7 en la consola. Al cerrar mostrarTotal, vuelves a main sin recibir ningún valor.'],
    ['mostrarTotal(sumar(10, 2));', 'Primero se ejecuta sumar(10, 2). Después mostrarTotal recibe el 12 y escribe Total: 12.'],
];
