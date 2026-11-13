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
