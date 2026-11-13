'use strict';

const preguntas = [
{
  titulo: 'Dos señales en la base', nivel: 'Llamadas', foco: 'Orden de ejecución',
  main: `System.out.print("A ");
aviso();
System.out.print("C");
aviso();`,
  metodo: `static void aviso() {
    System.out.print("B ");
}`,
  reto: '¿Qué se imprime? Ignora el espacio final. Sigue cada llamada y marca dónde vuelve a main.',
  opciones: ['A B CB', 'A B C', 'B A CB', 'A C B B'], correcta: 0,
  pasos: [['Primera impresión', 'Se escribe A y un espacio.'], ['Primera llamada', 'aviso imprime B y un espacio. Se vuelve a main.'], ['Vuelta a main', 'Se escribe C, sin espacio detrás.'], ['Segunda llamada', 'Se añade B y un espacio. La salida es A B CB, con un espacio final.']],
},
{
  titulo: 'Dos coordenadas, un orden', nivel: 'Llamadas', foco: 'Argumentos por posición',
  main: `int fila = 1;
int columna = 2;
System.out.print(codigo(columna, fila));`,
  metodo: `static int codigo(int fila, int columna) {
    return fila * 10 + columna;
}`,
  reto: '¿Qué número sale? Anota cuánto valen fila y columna dentro de cada método.',
  opciones: ['12', '21', '3', '22'], correcta: 1,
  pasos: [['En main', 'fila vale 1 y columna vale 2.'], ['En codigo', 'El primer argumento es 2 y entra en fila. El segundo es 1 y entra en columna.'], ['En return', '2 × 10 + 1 da 21. main imprime ese valor.']],
},
{
  titulo: 'Energía de repuesto', nivel: 'Llamadas', foco: 'Guardar el valor de retorno',
  main: `int energia = 3;
recargar(energia);
System.out.print(energia + " ");
energia = recargar(energia);
System.out.print(energia);`,
  metodo: `static int recargar(int energia) {
    return energia + 2;
}`,
  reto: '¿Qué dos números aparecen? Dibuja una columna para el retorno y otra para energia en main.',
  opciones: ['5 7', '3 3', '3 5', '5 5'], correcta: 2,
  pasos: [['Primera llamada', 'recargar(3) devuelve 5. La llamada está sola y su resultado se descarta.'], ['Primera impresión', 'La variable de main conserva 3.'], ['Segunda llamada', 'recargar(3) vuelve a devolver 5. Ahora se asigna a energia.'], ['Segunda impresión', 'La salida completa es 3 5.']],
},
{
  titulo: 'El informe que no compila', nivel: 'Llamadas', foco: 'void y valor de retorno',
  main: `int puntos = mostrarPuntos(4);
System.out.print(puntos);`,
  metodo: `static void mostrarPuntos(int puntos) {
    System.out.print(puntos);
}`,
  reto: '¿Qué ocurre al intentar compilar y ejecutar el programa?',
  opciones: ['Imprime 4 una vez.', 'Imprime 4 dos veces.', 'Imprime 4 y después 0.', 'La asignación impide compilar.'], correcta: 3,
  pasos: [['Lee la declaración', 'mostrarPuntos recibe un int y tiene tipo de retorno void.'], ['Revisa la asignación', 'La parte derecha tendría que producir un valor para guardarlo en puntos.'], ['Comprueba la salida', 'La compilación falla. Una llamada independiente mostrarPuntos(4); sí puede imprimir 4.']],
},
{
  titulo: 'Primera estrella a la vista', nivel: 'Tablero', foco: 'return dentro de un bucle',
  main: `char[] pasillo = {'M', '*', '*'};
System.out.print(buscarLibre(pasillo));`,
  metodo: `static int buscarLibre(char[] pasillo) {
    for (int i = 0; i < pasillo.length; i++) {
        if (pasillo[i] == '*') {
            return i;
        }
    }
    return -1;
}`,
  reto: '¿Qué índice se imprime? Escribe los valores de i que se llegan a comprobar.',
  opciones: ['2', '1', '-1', '3'], correcta: 1,
  pasos: [['i = 0', 'La casilla contiene M. El if es falso.'], ['i = 1', 'La casilla contiene *. Se ejecuta return 1.'], ['Vuelta a main', 'Se imprime 1. El método ya terminó cuando habría tocado comprobar i = 2.']],
},
{
  titulo: 'Un muro que sí se queda', nivel: 'Tablero', foco: 'Modificar una matriz desde void',
  main: `char[][] mapa = {{'Y', '*', '*'}};
ponerMuro(mapa, 2);
System.out.print(mapa[0]);`,
  metodo: `static void ponerMuro(char[][] mapa, int columna) {
    mapa[0][columna] = 'M';
}`,
  reto: '¿Qué fila se imprime? Dibuja la fila antes y después de la llamada. print(char[]) escribe los caracteres seguidos.',
  opciones: ['Y*M', 'YM*', 'Y**', 'M**'], correcta: 0,
  pasos: [['En main', 'La única fila empieza como Y**.'], ['En ponerMuro', 'columna recibe 2. Las dos referencias apuntan a la misma matriz.'], ['Después de la llamada', 'La última casilla contiene M. El método es void y el cambio se ve desde main.']],
},
{
  titulo: 'Una fila nueva, dos mapas', nivel: 'Tablero', foco: 'Reasignar el parámetro',
  main: `char[][] mapa = {{'Y', '*'}};
reiniciar(mapa);
System.out.print(mapa[0]);`,
  metodo: `static void reiniciar(char[][] mapa) {
    mapa = new char[][] {{'*', '*'}};
    mapa[0][1] = 'M';
}`,
  reto: '¿Qué fila ve main? Dibuja a qué matriz apunta cada variable mapa tras la asignación.',
  opciones: ['*M', 'YM', '**', 'Y*'], correcta: 3,
  pasos: [['Al entrar', 'El parámetro contiene una copia de la referencia a la matriz de main.'], ['new y asignación', 'El parámetro pasa a apuntar a otra matriz. La variable de main conserva su referencia.'], ['Escritura y vuelta', 'La matriz nueva acaba como *M. main imprime su matriz original, Y*.']],
},
{
  titulo: 'Un paso más allá del borde', nivel: 'Tablero', foco: 'Evaluación de &&',
  main: `char[][] mapa = {{'Y', '*'}};
System.out.print(libre(mapa, 0, 2));`,
  metodo: `static boolean libre(char[][] mapa, int f, int c) {
    return c < mapa[f].length && mapa[f][c] == '*';
}`,
  reto: '¿Qué sucede? Revisa qué parte de la condición se evalúa primero. En este ejemplo f es válida.',
  opciones: ['Imprime true.', 'Da error al acceder a la matriz.', 'Imprime false.', 'No compila.'], correcta: 2,
  pasos: [['Primera condición', 'La fila tiene longitud 2. 2 < 2 es falso.'], ['Cortocircuito', 'Con && y un lado izquierdo falso, se omite mapa[f][c].'], ['Resultado', 'libre devuelve false y main lo imprime.']],
},
{
  titulo: 'El muro corta la marcha', nivel: 'Turno completo', foco: 'Mutación y retorno en el mismo método',
  main: `char[][] mapa = {{'Y', '*', 'M', '*'}};
int c = 0;
c = avanzar(mapa, c);
c = avanzar(mapa, c);
System.out.print(c + " ");
System.out.print(mapa[0]);`,
  metodo: `static int avanzar(char[][] mapa, int c) {
    int destino = c + 1;
    if (destino >= mapa[0].length || mapa[0][destino] != '*') {
        return c;
    }
    mapa[0][c] = '*';
    mapa[0][destino] = 'Y';
    return destino;
}`,
  reto: '¿Qué columna y qué fila quedan tras los dos intentos? Traza c, destino y la fila para cada llamada.',
  opciones: ['0 Y*M*', '1 *YM*', '2 **Y*', '1 YYM*'], correcta: 1,
  pasos: [['Primer intento', 'c = 0 y destino = 1. Hay una estrella. Se borra Y del origen y se coloca en 1.'], ['Primer retorno', 'main guarda 1. La fila es *YM*.'], ['Segundo intento', 'c = 1 y destino = 2. Hay un muro y se devuelve 1 antes de escribir.'], ['Salida', 'La columna sigue siendo 1 y la fila sigue siendo *YM*.']],
},
{
  titulo: 'Un contador sin memoria', nivel: 'Turno completo', foco: 'Variables locales y llamadas sucesivas',
  main: `char[] fila = {'Y', '*', '*'};
int antes = contar(fila);
fila[2] = 'M';
System.out.print(antes + " " + contar(fila));`,
  metodo: `static int contar(char[] fila) {
    int libres = 0;
    for (int i = 0; i < fila.length; i++) {
        if (fila[i] == '*') {
            libres++;
        }
    }
    return libres;
}`,
  reto: '¿Qué pareja aparece? Anota el valor inicial del contador en cada llamada.',
  opciones: ['1 1', '2 3', '2 1', '2 2'], correcta: 2,
  pasos: [['Primera llamada', 'libres empieza en 0 y encuentra dos estrellas. antes guarda 2.'], ['Cambio en main', 'La fila se convierte en Y*M. La variable antes conserva su valor.'], ['Segunda llamada', 'Se crea un nuevo contador con valor 0. Solo la columna 1 suma.'], ['Salida', 'Se imprime 2 1.']],
},
{
  titulo: 'El código de la puerta', nivel: 'Turno completo', foco: 'Llamadas anidadas y firma',
  main: `mostrar(codigo(2));
mostrar(codigo(2, 3));`,
  metodo: `static int codigo(int zona) {
    return codigo(zona, 0);
}

static int codigo(int zona, int puerta) {
    return zona * 10 + puerta;
}

static void mostrar(int valor) {
    System.out.print(valor + " ");
}`,
  reto: '¿Qué se imprime? Escribe qué firma se usa en cada llamada a codigo, incluida la llamada interna.',
  opciones: ['20 23', '2 23', '23 20', 'El nombre repetido impide compilar.'], correcta: 0,
  pasos: [['codigo(2)', 'Se elige codigo(int). Dentro llama a codigo(int, int) con 2 y 0.'], ['Primera salida', 'El retorno 20 pasa a mostrar(int).'], ['codigo(2, 3)', 'Se elige directamente codigo(int, int).'], ['Segunda salida', 'mostrar imprime 23. Las firmas difieren en el número de parámetros.']],
},
{
  titulo: 'Salida de emergencia', nivel: 'Turno completo', foco: 'return en un procedimiento',
  main: `char[][] mapa = {{'Y', '*', 'M'}};
marcar(mapa, 2);
marcar(mapa, 1);
System.out.print(mapa[0]);`,
  metodo: `static void marcar(char[][] mapa, int c) {
    if (mapa[0][c] != '*') {
        return;
    }
    mapa[0][c] = 'X';
    System.out.print(c + " ");
}`,
  reto: '¿Qué sale en consola? Traza qué instrucciones se ejecutan en cada llamada y cuál se salta.',
  opciones: ['2 1 YXX', '1 YXM', 'YXM', 'No compila por usar return en void.'], correcta: 1,
  pasos: [['marcar(mapa, 2)', 'La casilla es M. return; termina esta llamada antes de escribir o imprimir.'], ['marcar(mapa, 1)', 'La casilla es *. El if es falso. Se escribe X y se imprime 1 seguido de espacio.'], ['Vuelta a main', 'main imprime YXM. La salida completa es 1 YXM.']],
},
];

function archivoJava(pregunta) {
    const indentar = (codigo, espacios) => codigo.split('\n').map(linea => linea ? ' '.repeat(espacios) + linea : '').join('\n');
    return 'public class Main {\n    public static void main(String[] args) {\n' +
        indentar(pregunta.main, 8) + '\n    }\n\n' + indentar(pregunta.metodo, 4) + '\n}\n';
}
