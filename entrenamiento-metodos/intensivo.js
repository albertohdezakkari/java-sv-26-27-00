'use strict';

// Cada caso incluye el programa, cuatro predicciones y los pasos para cotejar la traza en papel.
const bloquesIntensivos = [
['Consola y llamadas', [
['Radar encadenado', 'Anidación y orden de impresión',
`int señal = eco(eco(2));
System.out.println("|" + señal);
aviso(señal);
System.out.print("fin");`,
`static int eco(int n) {
    System.out.print(n);
    return n + 1;
}

static void aviso(int n) {
    for (int i = 0; i < 2; i++) {
        System.out.print(n - i);
    }
    System.out.println();
}`,
['23|4 / 43 / fin','32|4 / 43 / fin','23|3 / 32 / fin','234 / |43fin'], 0,
['Llamada interior|eco(2) imprime 2 y devuelve 3.', 'Llamada exterior|eco(3) imprime 3 y devuelve 4. println completa 23|4.', 'Aviso y vuelta|aviso imprime 4 y 3 en otra línea. main imprime fin.']],
['El marcador y el signo +', 'Suma, concatenación y saltos',
`int a = puntos(2);
int b = puntos(a);
System.out.println(a + b + " P");
System.out.println("P " + a + b);
mostrar(a, b);`,
`static int puntos(int base) {
    System.out.print("[" + base + "]");
    return base + 3;
}

static void mostrar(int a, int b) {
    System.out.print("P " + (a + b));
}`,
['[2][5]13 P / P 13 / P 13','[2][5]13 P / P 58 / P 13','[2][5]58 P / P 58 / P 13','[2]13 P / [5]P 58 / P 58'], 1,
['Entradas|puntos recibe primero 2 y luego 5. Imprime [2][5] sin salto.', 'Resultados|a = 5 y b = 8. Antes de una cadena, a + b suma 13.', 'Concatenación|Con P al principio se encadenan 5 y 8. Los paréntesis de mostrar fuerzan la suma.']],
['Dos alarmas y un corte', 'return temprano y println',
`for (int turno = 1; turno <= 3; turno++) {
    System.out.print(turno + ":");
    alarma(turno);
    System.out.print(";");
}
System.out.print("FIN");`,
`static void alarma(int turno) {
    if (turno == 2) {
        return;
    }
    System.out.print("A");
    eco(turno);
}

static void eco(int turno) {
    System.out.println(turno * 2);
}`,
['1:A2 / ;2:;3:A6 / ;FIN','1:A2 / ;2:A4 / ;3:A6 / ;FIN','1:A2 / 2:;3:A6 / FIN','1:A2 / ;2:FIN'], 0,
['Turno 1|alarma escribe A y eco escribe 2 con salto. El punto y coma abre la línea siguiente.', 'Turno 2|return termina alarma. main todavía imprime su punto y coma.', 'Turno 3|A6 cierra la segunda línea. El último punto y coma comparte línea con FIN.']],
['Argumentos en cadena', 'Evaluación de izquierda a derecha',
`int x = 2;
int resultado = resta(sube(x), sube(x + 1));
System.out.println("=" + resultado);
System.out.print(x);`,
`static int sube(int n) {
    System.out.print(n + " ");
    n++;
    return n;
}

static int resta(int primero, int segundo) {
    System.out.print("(" + primero + "," + segundo + ")");
    return primero - segundo;
}`,
['3 2 (4,3)=1 / 2','2 3 (3,4)=-1 / 4','2 3 (3,4)=-1 / 2','2 4 (3,5)=-2 / 3'], 2,
['Primer argumento|sube(2) imprime 2 y devuelve 3.', 'Segundo argumento|x sigue en 2. sube(x + 1) imprime 3 y devuelve 4.', 'Resta|resta recibe 3 y 4. Imprime los argumentos, devuelve -1 y x sigue en 2.']],
['¿Cuántas veces suena?', 'Métodos booleanos y cortocircuito',
`boolean a = abrir(1) && abrir(2);
System.out.println(":" + a);
boolean b = abrir(2) || abrir(3);
System.out.println(":" + b);
System.out.print("fin");`,
`static boolean abrir(int llave) {
    aviso(llave);
    return llave % 2 == 0;
}

static void aviso(int llave) {
    System.out.print("L" + llave);
}`,
['L1L2:false / L2L3:true / fin','L1:false / L2:true / fin','L1:false / L2L3:true / fin','L2:false / L3:true / fin'], 1,
['Primer &&|abrir(1) imprime L1 y devuelve false. Se omite abrir(2).', 'Segundo OR|abrir(2) imprime L2 y devuelve true. Se omite abrir(3).', 'Consola|Cada println cierra su línea y fin queda en la tercera.']],
['La recompensa entra por firma', 'Sobrecarga y retornos sucesivos',
`int vidas = 3;
int puntos = premio(vidas);
puntos = premio(puntos, vidas);
System.out.println(">" + puntos);
System.out.print(vidas);`,
`static int premio(int vidas) {
    System.out.print("U");
    return premio(vidas, 2);
}

static int premio(int vidas, int extra) {
    System.out.print("D" + vidas);
    return vidas + extra;
}`,
['UD3D5>8 / 3','UD3D5>8 / 5','D3D5>8 / 3','UD3D3>6 / 3'], 0,
['Firma de un parámetro|premio(int) imprime U y delega con 3 y 2.', 'Firma de dos parámetros|Imprime D3 y devuelve 5. La llamada siguiente recibe 5 y 3.', 'Cierre|Se imprime D5, vuelve 8 y vidas en main conserva 3.']],
['Una vida que no cambia', 'Primitivos y alcance',
`int vidas = 4;
ajustar(vidas);
System.out.print("|" + vidas);
vidas = calcular(vidas);
System.out.print("|" + vidas);`,
`static void ajustar(int vidas) {
    vidas = calcular(vidas);
    System.out.print(vidas);
}

static int calcular(int vidas) {
    vidas--;
    System.out.print("(" + vidas + ")");
    return vidas * 2;
}`,
['(3)6|6(5)|10','(3)6|4(3)|6','(3)3|4(3)|3','(3)6|4(4)|8'], 1,
['Dentro de ajustar|calcular recibe una copia de 4, imprime (3) y devuelve 6. ajustar imprime 6.', 'En main|Su variable sigue valiendo 4. Se imprime |4.', 'Asignación final|calcular(4) imprime (3) y devuelve 6. main lo guarda e imprime |6.']],
['Puntos sin separador', 'Print, println y valor de char',
`char ficha = 'A';
imprimir(ficha, 1);
System.out.println(ficha + 1);
System.out.print(ficha + "" + 1);`,
`static void imprimir(char ficha, int puntos) {
    System.out.print(ficha);
    System.out.print(puntos);
    puntos++;
    System.out.println(puntos);
}`,
['A12 / A1 / A1','A12 / 66 / 66','A12 / 66 / A1','A21 / 65 / A1'], 2,
['Procedimiento|Imprime A, luego 1 y luego 2 con salto.', 'Aritmética|En ficha + 1, A se convierte a su código numérico 65. La suma da 66.', 'Cadena|ficha + "" produce la cadena A. Añadir 1 produce A1.']],
]],
['Arrays y referencias', [
['La mochila compartida', 'Alias y cambios de celdas',
`int[] mochila = {2, 4, 6};
int[] copia = mochila;
mover(copia, 0, 2);
System.out.print(mostrar(mochila));
System.out.print(" " + copia[0]);`,
`static void mover(int[] bolsa, int origen, int destino) {
    bolsa[destino] += bolsa[origen];
    bolsa[origen] = 0;
}

static String mostrar(int[] bolsa) {
    return bolsa[0] + "," + bolsa[1] + "," + bolsa[2];
}`,
['2,4,6 0','0,4,8 0','0,4,6 2','2,4,8 2'], 1,
['Referencias|mochila y copia apuntan al mismo array. bolsa recibe una copia de esa referencia.', 'Mover|La posición 2 sube a 8 y la posición 0 queda en 0.', 'Salida|Ambos nombres permiten leer la misma mochila modificada.']],
['La mochila de reserva', 'Reasignar frente a mutar',
`int[] original = {2, 4};
int[] nueva = preparar(original);
nueva[0]++;
System.out.print(original[0] + "," + original[1]);
System.out.print(" / " + nueva[0] + "," + nueva[1]);`,
`static int[] preparar(int[] bolsa) {
    bolsa[0]++;
    bolsa = new int[] {bolsa[0], bolsa[1]};
    bolsa[1] += 5;
    return bolsa;
}`,
['2,4 / 4,9','4,9 / 4,9','3,9 / 4,9','3,4 / 4,9'], 3,
['Primera escritura|bolsa comparte el original. La posición 0 se convierte en 3.', 'Nuevo array|La asignación cambia el destino de bolsa. La posición 1 del nuevo array se convierte en 9.', 'Retorno|nueva apunta al nuevo array y su posición 0 se convierte en 4. El original queda 3,4.']],
['Intercambio a medias', 'Primitivos frente a arrays',
`int x = 2;
int y = 5;
cambiar(x, y);
int[] pares = {x, y};
cambiar(pares);
System.out.print(x + "," + y + " / " + pares[0] + "," + pares[1]);`,
`static void cambiar(int x, int y) {
    int temporal = x;
    x = y;
    y = temporal;
}

static void cambiar(int[] numeros) {
    int temporal = numeros[0];
    numeros[0] = numeros[1];
    numeros[1] = temporal;
}`,
['2,5 / 5,2','5,2 / 5,2','2,5 / 2,5','5,2 / 2,5'], 0,
['Primera firma|cambiar(int, int) intercambia copias locales.', 'Construcción|pares empieza como 2,5 porque x e y conservan sus valores.', 'Segunda firma|cambiar(int[]) escribe sobre el array que ve main.']],
['Baterías en fila', 'Contar mientras se modifica',
`int[] bateria = {1, 2, 1, 3};
int antes = descargar(bateria, 1);
int despues = descargar(bateria, 0);
System.out.print(antes + "," + despues + " / " + total(bateria));`,
`static int descargar(int[] bateria, int nivel) {
    int cambios = 0;
    for (int i = 0; i < bateria.length; i++) {
        if (bateria[i] == nivel) {
            bateria[i]--;
            cambios++;
        }
    }
    return cambios;
}

static int total(int[] bateria) {
    int suma = 0;
    for (int valor : bateria) {
        suma += valor;
    }
    return suma;
}`,
['2,0 / 5','2,2 / 5','2,2 / 3','4,4 / 0'], 2,
['Nivel 1|Se cambian las posiciones 0 y 2 a cero. Vuelve 2.', 'Nivel 0|Las mismas dos posiciones bajan a -1. Vuelve 2.', 'Total|-1 + 2 - 1 + 3 = 3.']],
['Copia de la matriz por fuera', 'Clonado superficial de matriz',
`char[][] sala = {{'Y', '*'}, {'*', 'M'}};
char[][] espejo = sala.clone();
cambiar(espejo);
System.out.print(sala[0]);
System.out.print(" / ");
System.out.print(sala[1]);`,
`static void cambiar(char[][] mapa) {
    mapa[0][1] = 'V';
    mapa[1] = new char[] {'X', 'X'};
    mapa[1][0] = 'Y';
}`,
['Y* / *M','YV / *M','YV / YX','Y* / YX'], 1,
['clone|Se copia el array exterior. Las referencias a las filas se comparten.', 'Primera fila|Escribir V en la fila compartida se ve desde sala.', 'Segunda fila|Reemplazar una fila en espejo deja intacta la referencia de sala a *M.']],
['Dos nombres para una letra', 'Alias de char[] y String',
`char[] letras = {'S', 'O', 'L'};
String antes = new String(letras);
char[] despues = marcar(letras);
System.out.print(antes + " / ");
System.out.print(despues);
System.out.print(" / ");
System.out.print(letras);`,
`static char[] marcar(char[] palabra) {
    palabra[1] = '_';
    char[] copia = palabra.clone();
    copia[2] = 'S';
    return copia;
}`,
['S_L / S_S / S_S','SOL / S_S / S_L','SOL / S_L / S_S','S_L / S_S / S_L'], 1,
['Cadena inicial|new String crea SOL con los caracteres de ese momento.', 'Mutación|marcar modifica el array original a S_L.', 'Copia|El clon cambia a S_S. Las tres lecturas se hacen sobre valores diferentes.']],
['La última posición', 'Error de índice y salida parcial',
`int[] ruta = {3, 6, 9};
System.out.print(">");
mostrar(ruta);
System.out.print("<");`,
`static void mostrar(int[] ruta) {
    for (int i = 1; i <= ruta.length; i++) {
        salida(ruta[i]);
    }
}

static void salida(int valor) {
    System.out.print(valor);
}`,
['>69<','>369 y luego error de índice','>69 y luego error de índice','> y luego error de índice'], 2,
['i = 1|Se imprime 6. La posición 0 queda fuera del recorrido.', 'i = 2|Se imprime 9.', 'i = 3|La condición permite entrar. ruta[3] lanza ArrayIndexOutOfBoundsException antes de llamar a salida. No se llega a imprimir <.']],
['El marcador se da la vuelta', 'Desbordamiento de int',
`int[] puntos = {Integer.MAX_VALUE - 1};
System.out.print(sumar(puntos, 1) + " / ");
System.out.print(sumar(puntos, 1) + " / ");
System.out.print(puntos[0] < 0);`,
`static int sumar(int[] marcador, int cantidad) {
    marcador[0] += cantidad;
    return leer(marcador);
}

static int leer(int[] marcador) {
    return marcador[0];
}`,
['2147483647 / 2147483648 / false','2147483647 / -2147483648 / true','2147483646 / 2147483647 / false','2147483647 y luego excepción'], 1,
['Primer incremento|2147483646 + 1 llega al máximo de int.', 'Segundo incremento|La suma en int desborda y el valor pasa a -2147483648.', 'Estado final|El array guarda ese valor negativo. La comparación devuelve true.']],
]],
['Tableros', [
['Dos pilotos, un turno', 'Selección de matriz y referencia',
`char[][] yoda = {{'Y', '*'}};
char[][] vader = {{'V', '*'}};
char[][] actual = elegir(yoda, vader, false);
mover(actual);
actual = elegir(yoda, vader, true);
mover(actual);
System.out.print(yoda[0]);
System.out.print(" ");
System.out.print(vader[0]);`,
`static char[][] elegir(char[][] y, char[][] v, boolean turnoYoda) {
    return turnoYoda ? y : v;
}

static void mover(char[][] tablero) {
    char ficha = tablero[0][0];
    tablero[0][0] = '*';
    tablero[0][1] = ficha;
}`,
['Y* V*','*Y V*','Y* *V','*Y *V'], 3,
['Primer turno|false selecciona vader, que pasa a *V.', 'Segundo turno|true selecciona yoda, que pasa a *Y.', 'Impresión|Cada variable original sigue apuntando a su matriz.']],
['El paso diagonal', 'Fila y columna en llamadas sucesivas',
`char[][] t = {{'Y', '*'}, {'M', '*'}};
int f = 0;
int c = 0;
if (paso(t, f, c, 1, 0)) f++;
if (paso(t, f, c, 0, 1)) c++;
if (paso(t, f, c, 1, 0)) f++;
System.out.print(f + "," + c + " ");
System.out.print(t[1]);`,
`static boolean paso(char[][] t, int f, int c, int df, int dc) {
    if (t[f + df][c + dc] != '*') return false;
    t[f + df][c + dc] = t[f][c];
    t[f][c] = '*';
    return true;
}`,
['1,1 MY','1,0 YM','0,1 M*','1,1 M*'], 0,
['Abajo|Desde 0,0 se encuentra M. La posición sigue igual.', 'Derecha|Se mueve a 0,1 y main incrementa c.', 'Abajo otra vez|Se mueve a 1,1. La segunda fila queda MY.']],
['Casillas en filas desiguales', 'Longitud por fila y salida parcial',
`char[][] t = {{'Y','*','*'}, {'M'}, {'*','*'}};
System.out.println(contar(t));
imprimir(t);
System.out.print("FIN");`,
`static int contar(char[][] t) {
    int libres = 0;
    for (char[] fila : t) {
        for (char c : fila) {
            if (c == '*') libres++;
        }
    }
    return libres;
}

static void imprimir(char[][] t) {
    for (int f = 0; f < t.length; f++) {
        for (int c = 0; c < t[0].length; c++) {
            System.out.print(t[f][c]);
        }
        System.out.println();
    }
}`,
['4 / Y** / M y luego error de índice','4 / Y** / M / ** / FIN','3 / Y** / M y luego error de índice','4 y luego error de índice'], 0,
['Contar|El for mejorado recorre las longitudes reales y devuelve 4.', 'Primera fila|imprimir completa Y** y salta de línea.', 'Segunda fila|Se imprime M. La columna 1 queda fuera de esa fila y se produce la excepción.']],
['Cambia la coordenada, cambia el tablero', 'Retorno de columna y copia del entero',
`char[][] t = {{'Y','*','*'}};
int c = 0;
avanzar(t, c);
System.out.print(c + " ");
System.out.print(t[0]);
c = avanzar(t, c);
System.out.print(" " + c + " ");
System.out.print(t[0]);`,
`static int avanzar(char[][] t, int c) {
    int siguiente = c + 1;
    if (t[0][c] != 'Y' || t[0][siguiente] != '*') return c;
    t[0][c] = '*';
    t[0][siguiente] = 'Y';
    return siguiente;
}`,
['1 *Y* 2 **Y','0 Y** 1 *Y*','0 *Y* 1 **Y','0 *Y* 0 *Y*'], 3,
['Primer paso|El tablero cambia a *Y*. El resultado 1 se descarta.', 'Estado desincronizado|c en main sigue en 0. Allí ya no hay Y.', 'Segunda llamada|La primera condición es verdadera. Se devuelve 0 y el tablero queda igual.']],
['La puerta que cuenta dos veces', 'Consultar después de modificar',
`char[][] t = {{'Y','*'}, {'*','M'}};
int a = libres(t);
sellar(t, 0);
int b = libres(t);
sellar(t, 1);
System.out.print(a + " " + b + " " + libres(t));`,
`static void sellar(char[][] t, int f) {
    for (int c = 0; c < t[f].length; c++) {
        if (t[f][c] == '*') t[f][c] = 'M';
    }
}

static int libres(char[][] t) {
    int n = 0;
    for (char[] fila : t) {
        for (char c : fila) if (c == '*') n++;
    }
    return n;
}`,
['2 2 2','2 1 0','2 0 0','1 1 0'], 1,
['Antes|Hay dos estrellas, una en cada fila.', 'Fila 0|sellar deja YM y queda una estrella en la fila 1.', 'Fila 1|Tras sellarla queda MM. Las variables guardadas conservan 2 y 1.']],
['La ficha sale por la izquierda', 'Índice negativo y validación incompleta',
`char[][] t = {{'Y','*'}};
System.out.print("A");
System.out.print(libre(t, 0, -1));
System.out.print("Z");`,
`static boolean libre(char[][] t, int f, int c) {
    return filaValida(t, f) && c < t[f].length && t[f][c] == '*';
}

static boolean filaValida(char[][] t, int f) {
    return f >= 0 && f < t.length;
}`,
['AfalseZ','AtrueZ','A y luego error de índice','Error de compilación'], 2,
['Fila|filaValida devuelve true para 0.', 'Columna|-1 es menor que 2. Falta comprobar c >= 0.', 'Acceso|Se intenta leer t[0][-1]. Solo se había impreso A.']],
['Intercambio de filas', 'Referencias a filas conservadas',
`char[][] t = {{'Y','*'}, {'M','*'}};
char[] arriba = t[0];
girar(t);
marcar(arriba);
System.out.print(t[0]);
System.out.print(" ");
System.out.print(t[1]);`,
`static void girar(char[][] t) {
    char[] aux = t[0];
    t[0] = t[1];
    t[1] = aux;
}

static void marcar(char[] f) {
    f[1] = 'X';
}`,
['MX Y*','M* YX','YX M*','M* Y*'], 1,
['Guardar referencia|arriba apunta a la fila Y*.','Girar|Esa fila pasa a ser t[1].','Marcar|La referencia arriba sigue apuntando a ella y el resultado es M* YX.']],
['Vader persigue por turnos', 'Llamadas alternas y estado compartido',
`char[][] t = {{'Y','*','*','V'}};
int y = 0;
int v = 3;
for (int ronda = 0; ronda < 2; ronda++) {
    y = mover(t, y, 1);
    v = mover(t, v, -1);
}
System.out.print(y + "," + v + " ");
System.out.print(t[0]);`,
`static int mover(char[][] t, int c, int paso) {
    int d = c + paso;
    if (!libre(t, d)) return c;
    t[0][d] = t[0][c];
    t[0][c] = '*';
    return d;
}

static boolean libre(char[][] t, int d) {
    return d >= 0 && d < t[0].length && t[0][d] == '*';
}`,
['2,1 *VY*','1,2 *YV*','2,2 **V*','0,3 Y**V'], 1,
['Ronda 1|Yoda entra en 1 y Vader en 2. La fila es *YV*.','Ronda 2|Los dos destinos están ocupados. Ambos métodos devuelven la posición anterior.','Cierre|No se borra ninguna ficha en los intentos bloqueados.']],
]],
['Ahorcado', [
['Una letra en dos sitios', 'char[] compartido y aciertos repetidos',
`char[] palabra = {'C','A','S','A'};
char[] pista = {'_','_','_','_'};
int uno = jugar(palabra, pista, 'A');
int dos = jugar(palabra, pista, 'A');
System.out.print(uno + "," + dos + " ");
System.out.print(pista);`,
`static int jugar(char[] palabra, char[] pista, char letra) {
    int n = 0;
    for (int i = 0; i < palabra.length; i++) {
        if (palabra[i] == letra && pista[i] == '_') {
            pista[i] = letra;
            n++;
        }
    }
    return n;
}`,
['2,2 _A_A','2,0 _A_A','1,1 _A_A','2,0 ____'], 1,
['Primera A|Se descubren las posiciones 1 y 3. Vuelve 2.','Segunda A|Ninguna de esas posiciones sigue con _. Vuelve 0.','Estado|pista es el mismo array que modificó jugar.']],
['El fallo que cuesta una vida', 'Retornos encadenados y descartados',
`char[] pista = {'_','_'};
int vidas = 3;
turno(pista, 'Z', vidas);
vidas = turno(pista, 'S', vidas);
vidas = turno(pista, 'X', vidas);
System.out.print(vidas + " ");
System.out.print(pista);`,
`static int turno(char[] pista, char letra, int vidas) {
    return revelar(pista, letra) ? vidas : vidas - 1;
}

static boolean revelar(char[] pista, char letra) {
    if (letra != 'S') return false;
    pista[0] = letra;
    return true;
}`,
['1 S_','2 __','3 S_','2 S_'], 3,
['Z|Devuelve 2. main descarta el valor.','S|Cambia pista a S_ y devuelve las 3 vidas recibidas.','X|Devuelve 2 y main lo guarda.']],
['La primera coincidencia se lleva el turno', 'return antes de completar el recorrido',
`char[] p = {'A','L','A'};
char[] v = {'_','_','_'};
System.out.print(revelar(p, v, 'A') + " ");
System.out.print(revelar(p, v, 'A') + " ");
System.out.print(v);`,
`static int revelar(char[] p, char[] v, char letra) {
    for (int i = 0; i < p.length; i++) {
        if (p[i] == letra) {
            v[i] = letra;
            return i;
        }
    }
    return -1;
}`,
['0 2 A_A','0 0 A__','2 2 A_A','0 -1 A__'], 1,
['Primera llamada|La posición 0 coincide y se retorna inmediatamente.','Segunda llamada|La búsqueda vuelve a empezar en 0. No comprueba si ya se reveló.','Resultado|La última A sigue oculta.']],
['La pista de papel y la de memoria', 'Snapshot y mutación acumulada',
`char[] pista = {'_','_','_'};
String foto = new String(pista);
destapar(pista, 0, 'S');
char[] espejo = pista;
destapar(espejo, 2, 'L');
System.out.print(foto + " ");
System.out.print(pista);`,
`static void destapar(char[] pista, int i, char c) {
    pista[i] = c;
    System.out.print(i);
    mostrarSeparador(i);
}

static void mostrarSeparador(int i) {
    if (i == 2) System.out.println();
}`,
['02 / ___ S_L','0 / 2 / ___ S_L','02 / S_L S_L','02 / ___ S__'], 0,
['Primera llamada|Escribe S e imprime 0 sin salto.','Segunda llamada|espejo comparte el array. Escribe L, imprime 2 y hace un salto.','Foto|La cadena conserva ___. La pista mutable acaba S_L.']],
['Una pista demasiado corta', 'Longitud y error tras una escritura',
`char[] palabra = {'S','O','S'};
char[] pista = {'_','_'};
System.out.print(">");
revelar(palabra, pista, 'S');
System.out.print("<");`,
`static void revelar(char[] palabra, char[] pista, char letra) {
    for (int i = 0; i < palabra.length; i++) {
        if (palabra[i] == letra) escribir(pista, i, letra);
    }
}

static void escribir(char[] pista, int i, char letra) {
    pista[i] = letra;
    System.out.print(i);
}`,
['>0<','>02 y luego error de índice','>0 y luego error de índice','> y luego error de índice'], 2,
['i = 0|Se escribe S en pista y se imprime 0.','i = 1|O no coincide.','i = 2|La S coincide, pero pista[2] falla antes de la impresión.']],
['Mayúscula en el lugar equivocado', 'Convertir char y reutilizar resultados',
`char[] letras = {'A','a','A'};
int exactas = marcar(letras, 'a');
int otras = marcar(letras, Character.toUpperCase('a'));
System.out.print(exactas + " " + otras + " ");
System.out.print(letras);`,
`static int marcar(char[] letras, char intento) {
    int n = 0;
    for (int i = 0; i < letras.length; i++) {
        if (letras[i] == intento) {
            letras[i] = '*';
            n++;
        }
    }
    return n;
}`,
['3 0 ***','1 2 ***','1 1 A**','0 2 *a*'], 1,
['Minúscula|Solo coincide la posición 1.','Mayúscula|toUpperCase devuelve A. Coinciden las posiciones 0 y 2.','Resultado|Cada coincidencia se reemplazó por *.']],
['Los intentos no son la palabra', 'Dos arrays de caracteres y retorno booleano',
`char[] secreto = {'S','O','L'};
char[] vista = {'_','_','_'};
for (char letra : new char[]{'L','S','X','O'}) {
    aplicar(secreto, vista, letra);
    System.out.print(completa(vista) ? "G" : "-");
}
System.out.print(" ");
System.out.print(vista);`,
`static void aplicar(char[] secreto, char[] vista, char letra) {
    for (int i = 0; i < secreto.length; i++) {
        if (secreto[i] == letra) vista[i] = letra;
    }
}

static boolean completa(char[] vista) {
    for (char c : vista) if (c == '_') return false;
    return true;
}`,
['--GG SOL','---G SOL','---- SOL','---G LSO'], 1,
['L y S|Dejan __L y S_L. Todavía queda algún _.','X|No cambia la vista.','O|Completa SOL y se imprime G en el último turno.']],
]],
['Primitiva', [
['El boleto repetido', 'Cruce de dos arrays y retorno temprano',
`int[] boleto = {3, 8, 3, 15};
int[] sorteo = {3, 7, 15, 21};
int puntos = contar(boleto, sorteo);
System.out.println(puntos);
System.out.print(boleto[0] + "," + boleto[2]);`,
`static int contar(int[] boleto, int[] sorteo) {
    int total = 0;
    for (int numero : boleto) {
        if (sale(numero, sorteo)) total++;
    }
    return total;
}

static boolean sale(int n, int[] sorteo) {
    for (int x : sorteo) if (x == n) return true;
    return false;
}`,
['2 / 3,3','3 / 3,3','3 / 0,0','4 / 3,3'], 1,
['Primer 3|sale devuelve true y suma un punto.','Segundo 3|El código comprueba todas las posiciones del boleto y vuelve a sumar aunque el número esté repetido.','15|Añade el tercero. Las posiciones del boleto conservan sus valores.']],
['Una combinación usada', 'Marcar coincidencias y reutilizar el sorteo',
`int[] boleto = {3, 8, 3, 15};
int[] sorteo = {3, 7, 15, 21};
int a = contar(boleto, sorteo);
int b = contar(boleto, sorteo);
System.out.print(a + "," + b + " " + sorteo[2]);`,
`static int contar(int[] boleto, int[] sorteo) {
    int aciertos = 0;
    for (int n : boleto) {
        for (int i = 0; i < sorteo.length; i++) {
            if (sorteo[i] == n) {
                sorteo[i] = -1;
                aciertos++;
                break;
            }
        }
    }
    return aciertos;
}`,
['2,2 15','3,3 -1','2,0 -1','2,0 15'], 2,
['Primera pasada|Se consumen 3 y 15 y ambas posiciones pasan a -1.','Duplicado|El segundo 3 ya no encuentra pareja.','Segunda pasada|El mismo sorteo está modificado y devuelve 0.']],
['Complementario por separado', 'Array de retorno y condiciones',
`int[] boleto = {4, 9, 18, 22};
int[] sorteo = {4, 8, 18, 21};
int[] resumen = evaluar(boleto, sorteo, 9);
System.out.print(resumen[0] + "," + resumen[1]);
System.out.println(" " + categoria(resumen));`,
`static int[] evaluar(int[] boleto, int[] sorteo, int extra) {
    int[] r = {0, 0};
    for (int n : boleto) {
        if (contiene(sorteo, n)) r[0]++;
        else if (n == extra) r[1]++;
    }
    return r;
}

static boolean contiene(int[] a, int n) {
    for (int x : a) if (x == n) return true;
    return false;
}

static String categoria(int[] r) {
    return r[0] >= 2 && r[1] == 1 ? "B" : "A";
}`,
['3,0 A','2,1 B','2,1 A','1,2 B'], 1,
['Sorteo|Coinciden 4 y 18.','Complementario|9 pasa por el else if y aumenta la segunda celda.','Categoría|2 >= 2 y 1 == 1. Se devuelve B.']],
['Ordenar para comparar', 'Mutación de un boleto al ordenar',
`int[] a = {18, 4, 9};
int[] b = {4, 9, 18};
System.out.print(a[0] + " ");
System.out.print(iguales(a, b) + " ");
System.out.print(a[0]);`,
`static boolean iguales(int[] a, int[] b) {
    ordenar(a);
    ordenar(b);
    for (int i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

static void ordenar(int[] numeros) {
    java.util.Arrays.sort(numeros);
}`,
['18 true 4','18 true 18','18 false 4','4 true 4'], 0,
['Antes|Se imprime el 18 que ocupa a[0].','Ordenación|Ambas referencias apuntan a los arrays originales. a pasa a 4,9,18.','Después|Las tres posiciones coinciden y el primer valor de a ahora es 4.']],
['Control de boletos', 'Retornos, duplicados y salida de diagnóstico',
`int[][] boletos = {{1, 6, 7}, {4, 4, 8}, {3, 9, 50}};
int aceptados = 0;
for (int[] b : boletos) {
    if (valido(b)) aceptados++;
    System.out.print("|");
}
System.out.print(aceptados);`,
`static boolean valido(int[] b) {
    for (int i = 0; i < b.length; i++) {
        if (b[i] < 1 || b[i] > 49) {
            System.out.print("F");
            return false;
        }
        if (repetido(b, i)) {
            System.out.print("R");
            return false;
        }
    }
    return true;
}

static boolean repetido(int[] b, int i) {
    for (int j = 0; j < i; j++) if (b[j] == b[i]) return true;
    return false;
}`,
['|R|F|1','|F|R|1','R|F|1','|R|F|2'], 0,
['Boleto 1|Es válido. main escribe | y suma uno.','Boleto 2|La segunda posición repite 4. Se imprime R y luego |.','Boleto 3|50 está fuera del intervalo y se imprime F. Queda un aceptado.']],
['Lo que devuelve el sorteo', 'Devolver una referencia y observar el alias',
`int[] urna = {8, 12, 19};
int[] resultado = extraer(urna);
resultado[1] = 30;
System.out.print(urna[0] + "," + urna[1]);
System.out.print(" " + resultado[2]);`,
`static int[] extraer(int[] origen) {
    mover(origen);
    return origen;
}

static void mover(int[] a) {
    int temporal = a[0];
    a[0] = a[2];
    a[2] = temporal;
}`,
['8,12 8','19,12 8','19,30 19','19,30 8'], 3,
['mover|Intercambia la primera y la última celda. El array queda 19,12,8.','extraer|Devuelve una referencia al mismo array.','main|resultado[1] = 30 modifica también lo que se ve desde urna.']],
['Premio que no cabe en int', 'Promoción a long y desbordamiento previo',
`int aciertos = 3;
int base = 1_000_000_000;
long primero = premio(aciertos, base);
long segundo = premioSeguro(aciertos, base);
System.out.println(primero);
System.out.println(segundo);`,
`static long premio(int aciertos, int base) {
    return aciertos * base;
}

static long premioSeguro(int aciertos, int base) {
    return (long) aciertos * base;
}`,
['3000000000 / 3000000000','-1294967296 / -1294967296','-1294967296 / 3000000000','Error al compilar por devolver int'], 2,
['Primero|Los dos operandos son int. La multiplicación desborda y produce -1294967296.', 'Ampliación|Ese valor ya desbordado se convierte a long al retornar.', 'Segundo|La conversión del primer operando sucede antes de multiplicar. El producto sí cabe en long.']],
]],
];

const preguntasIntensivas = bloquesIntensivos.flatMap(([nivel, casos]) =>
    casos.map(([titulo, foco, main, metodo, opciones, correcta, pasos]) => ({
        titulo, nivel, foco, main, metodo, opciones, correcta,
        reto: '¿Qué imprime el programa o en qué punto se detiene? Traza las llamadas y los cambios en papel.',
        pasos: pasos.map(paso => {
            const separador = paso.indexOf('|');
            return [paso.slice(0, separador), paso.slice(separador + 1)];
        }),
    })),
);
