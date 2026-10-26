'use strict';
// Clave equivalente conservada en data/soluciones-docente.json para la publicación docente.
const QUESTIONS = [
  {
    id: 'RTO01Q01', topic: 'Arrays',
    question: '¿Qué sucede al ejecutar el programa?',
    code: `public class ComparaArrays {
    public static void main(String[] args) {
        int[] a1 = new int[10];
        int[] a2 = new int[10];
        for (int i = 0; i < a1.length - 1; i++) {
            a1[i] = 47;
            a2[i] = 47;
        }
        if (a1[10] == a2[10]) {
            System.out.println("True.");
        } else {
            System.out.println("False.");
        }
    }
}`,
    options: [
      'Imprime True porque las dos últimas posiciones tienen el mismo valor.',
      'Imprime False porque la última posición de ambos arrays vale 0.',
      'No compila porque los arrays no se pueden comparar.',
      'Lanza ArrayIndexOutOfBoundsException al evaluar a1[10], antes de imprimir.'
    ], answer: 3,
    explanation: 'La longitud es 10, así que los índices válidos son 0..9. El acceso [10] está fuera del array.'
  },
  {
    id: 'RTO01Q02', topic: 'Bucles',
    question: '¿Qué sucede al ejecutar este bucle?',
    code: `for (int x = 0; x < 4; x--) {
    x++;
    test('4');
}`,
    options: [
      'El cuerpo se ejecuta cuatro veces y el bucle termina.',
      'Da error de compilación porque no se puede llamar a test dentro de un for.',
      'Se ejecuta una sola vez porque x alcanza 4.',
      'El bucle no termina: x aumenta en el cuerpo y vuelve a 0 en cada actualización.'
    ], answer: 3,
    explanation: 'x empieza en 0, el cuerpo lo cambia a 1 y la actualización x-- lo devuelve a 0. La condición x < 4 sigue siendo verdadera.'
  },
  {
    id: 'RTO01Q03', topic: 'Ámbito de variables',
    question: '¿Qué sucede al compilar este fragmento dentro de main?',
    code: `int x = 12;
for (int i = 0; i < 2; i++) {
    int x = 100;
    x = x + 1;
}
System.out.println(x);`,
    options: [
      'Compila e imprime 13.',
      'Compila e imprime 101.',
      'Compila e imprime 12.',
      'No compila: x ya está declarada en el método main.'
    ], answer: 3,
    explanation: 'El bloque del for está dentro del ámbito de la x local de main. No se puede declarar otra variable local con el mismo nombre en ese bloque anidado.'
  },
  {
    id: 'RTO01Q04', topic: 'Expresiones',
    question: '¿Qué valor produce la expresión?',
    code: '(6 * 12 < (327 - 6 / 2)) && false',
    options: ['true', '72', '324', 'false'], answer: 3,
    explanation: 'La comparación es true porque 72 < 324. Después, true && false produce false.'
  },
  {
    id: 'RTO01Q05', topic: 'Variables estáticas',
    question: '¿Qué imprime el programa?',
    code: `class Balance {
    static String nombre;
    static double bal;
    static String[] valores = new String[2];
    static void modifica(String n, double b, int posicion) {
        nombre = n;
        bal = b;
        valores[posicion] = nombre;
    }
    static void show(int posicion) {
        if (bal < 0) {
            System.out.print(valores[posicion] + ": " + bal + "\\n");
        }
    }
    public static void main(String[] args) {
        Balance.modifica("Pepe", 100, 0);
        Balance.modifica("Luis", -100, 1);
        for (int i = 0; i < 2; i++) Balance.show(i);
    }
}`,
    options: [
      'Dos líneas: Pepe: -100.0 y Luis: -100.0.',
      'Solo Luis: -100.0.',
      'Solo Pepe: 100.0.',
      'No compila porque show no puede acceder a los campos estáticos.'
    ], answer: 0,
    explanation: 'bal es un campo estático compartido y queda en -100 tras la segunda llamada. show imprime cada nombre almacenado junto con ese valor.'
  },
  {
    id: 'RTO01Q06', topic: 'Métodos',
    question: '¿Qué imprime el programa?',
    code: `public class Ejer1 {
    public static void a(int b, int c) {
        b = c;
        c = 3;
        b = b * c;
    }
    public static void main(String[] args) {
        int i = 0;
        int z = 2;
        i = z + 1;
        a(z, i);
        System.out.println("El valor de i y z es: " + i + " " + z + ".");
    }
}`,
    options: [
      'El valor de i y z es: 3 2.',
      'El valor de i y z es: 9 2.',
      'El valor de i y z es: 1 2.',
      'Ninguna de las anteriores.'
    ], answer: 0,
    explanation: 'Los argumentos int se pasan por valor. El método cambia sus copias b y c, no las variables i y z de main.'
  }
];
