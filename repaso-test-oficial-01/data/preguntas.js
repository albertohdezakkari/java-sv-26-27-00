'use strict';
// Banco completo del test oficial: 15 preguntas tipo test del examen de repaso.
const QUESTIONS = [
  {
    "id": "RTO01Q01",
    "source": "Examen de repaso Java · pregunta 1",
    "topic": "Arrays",
    "question": "¿Qué fragmento declara y crea un array de n enteros y muestra su primer elemento?",
    "code": "",
    "options": [
      "int[] datos = new int[n]; System.out.println(datos[0]);",
      "int datos = new int[n]; System.out.println(datos[0]);",
      "int[] datos; System.out.println(datos[0]);",
      "int[] datos = new int; System.out.println(datos[0]);"
    ],
    "answer": 0,
    "explanation": "La opción A declara la variable como array de enteros, reserva n posiciones con new int[n] y después lee datos[0]. Las otras opciones tienen un tipo incorrecto, usan una variable local sin inicializar o no indican la longitud del array."
  },
  {
    "id": "RTO01Q02",
    "source": "Examen de repaso Java · pregunta 2",
    "topic": "Expresiones",
    "question": "¿Qué valor devuelve esta expresión?",
    "code": "(6 * 12 < (327 - 6 / 2)) && false",
    "options": [
      "0.00257.",
      "true.",
      "1.",
      "false."
    ],
    "answer": 3,
    "explanation": "La precedencia hace que 6 * 12 valga 72 y 327 - 6 / 2 valga 324. La comparación 72 < 324 es true; después true && false da false."
  },
  {
    "id": "RTO01Q03",
    "source": "Examen de repaso Java · pregunta 3",
    "topic": "Métodos",
    "question": "¿Qué diferencia hay entre las dos versiones del método?",
    "code": "// Versión A\npublic void imprimirNumero(int numero) {\n    System.out.println(numero);\n}\n\n// Versión B (alternativa)\npublic int imprimirNumero(int numero) {\n    return numero;\n}",
    "options": [
      "El primero devuelve un entero y el segundo lo imprime.",
      "El primero imprime el entero y el segundo devuelve un entero.",
      "Ambos imprimen el número.",
      "Ambos devuelven un entero."
    ],
    "answer": 1,
    "explanation": "La versión A tiene retorno void e imprime el argumento. La versión B tiene retorno int y devuelve el valor; no lo imprime."
  },
  {
    "id": "RTO01Q04",
    "source": "Examen de repaso Java · pregunta 4",
    "topic": "Bucles",
    "question": "Sobre los bucles while, do-while y for, ¿qué afirmación es correcta?",
    "code": "",
    "options": [
      "Todos evalúan su condición antes de ejecutar el cuerpo.",
      "Toda condición explícita de un bucle debe ser booleana; en un for se puede omitir la condición.",
      "El cuerpo del bucle se repite hasta que la condición resulta verdadera.",
      "Todo bucle termina cuando el cuerpo devuelve true."
    ],
    "answer": 1,
    "explanation": "Las condiciones que aparecen en while, do-while y for deben ser booleanas. En for se puede omitir la condición; un for sin condición de salida puede continuar indefinidamente. do-while evalúa después del cuerpo, por eso A es falsa."
  },
  {
    "id": "RTO01Q05",
    "source": "Examen de repaso Java · pregunta 5",
    "topic": "Condicionales",
    "question": "En Java 8, ¿qué afirmación describe correctamente if y el switch tradicional?",
    "code": "",
    "options": [
      "Tanto if como switch exigen que su expresión sea booleana.",
      "Una rama else if se ejecuta aunque su condición sea falsa.",
      "Todo switch debe terminar cada caso con break.",
      "if evalúa una expresión booleana; switch admite selectores como byte, short, char, int, String y enum."
    ],
    "answer": 3,
    "explanation": "if evalúa una condición booleana. En Java 8 el switch tradicional admite los tipos enumerados en la opción D. break suele evitar la continuación al caso siguiente, pero no es obligatorio en todos los casos."
  },
  {
    "id": "RTO01Q06",
    "source": "Examen de repaso Java · pregunta 6",
    "topic": "Métodos",
    "question": "¿Qué imprime el programa?",
    "code": "public class Ejer1 {\n    public static void a(int b, int c) {\n        b = c;\n        c = 3;\n        b = b * c;\n    }\n    public static void main(String[] args) {\n        int i = 0;\n        int z = 2;\n        i = z + 1;\n        a(z, i);\n        System.out.println(\"El valor de i y z es: \" + i + \" \" + z + \".\");\n    }\n}",
    "options": [
      "El valor de i y z es: 3 2.",
      "El valor de i y z es: 9 2.",
      "El valor de i y z es: 1 2.",
      "Ninguna de las anteriores."
    ],
    "answer": 0,
    "explanation": "Java pasa los valores primitivos por valor. Las asignaciones a b y c modifican las copias de los argumentos dentro de a, no i ni z en main. i vale 3 y z vale 2."
  },
  {
    "id": "RTO01Q07",
    "source": "Examen de repaso Java · pregunta 7",
    "topic": "Variables estáticas",
    "question": "¿Qué imprime el programa?",
    "code": "class Elemento {\n    private static String name;\n    private static int numElementos = 0;\n    public static void modificaElementos(String nombre) {\n        name = nombre;\n        numElementos++;\n    }\n    static int numeroDeElementos() { return numElementos; }\n    public static void main(String[] args) {\n        Elemento.modificaElementos(\"Hidrógeno\");\n        Elemento.modificaElementos(\"Helio\");\n        Elemento.modificaElementos(\"Litio\");\n        System.out.println(\"Creados: \" + Elemento.numeroDeElementos() + \".\");\n    }\n}",
    "options": [
      "Creados: 0.",
      "Creados: 3.",
      "Creados: .",
      "No compila porque un método estático no puede acceder a variables estáticas."
    ],
    "answer": 1,
    "explanation": "modificaElementos se llama tres veces y en cada llamada incrementa numElementos. Los métodos estáticos sí pueden acceder a campos estáticos."
  },
  {
    "id": "RTO01Q08",
    "source": "Examen de repaso Java · pregunta 8",
    "topic": "Arrays",
    "question": "¿Qué ocurre al ejecutar el programa?",
    "code": "public class ComparaArrays {\n    public static void main(String[] args) {\n        int[] a1 = new int[10];\n        int[] a2 = new int[10];\n        for (int i = 0; i < a1.length - 1; i++) {\n            a1[i] = 47;\n            a2[i] = 47;\n        }\n        if (a1[10] == a2[10]) {\n            System.out.println(\"True.\");\n        } else {\n            System.out.println(\"False.\");\n        }\n        a2[3] = 11;\n        if (a1[10] == a2[10] || a1[3] == a2[3]) {\n            System.out.println(\"True.\");\n        } else {\n            System.out.println(\"False.\");\n        }\n        String[] s1 = new String[6];\n        for (int i = 0; i < s1.length - 1; i++) s1[i] = \"Hi\";\n        String[] s2 = {\"Hi\", \"Hi\", \"Hi\", \"Hi\", \"Hi\"};\n        if (s1[5] == s2[5]) System.out.println(\"True.\");\n        else System.out.println(\"False.\");\n    }\n}",
    "options": [
      "Imprime True, False y True.",
      "Imprime True, True y True.",
      "Imprime True, True y False.",
      "Se lanza ArrayIndexOutOfBoundsException al evaluar a1[10], antes de la primera impresión."
    ],
    "answer": 3,
    "explanation": "Un array de longitud 10 tiene índices de 0 a 9. El acceso a a1[10] lanza ArrayIndexOutOfBoundsException al evaluar la primera condición; por tanto, no se imprime ninguna línea."
  },
  {
    "id": "RTO01Q09",
    "source": "Examen de repaso Java · pregunta 9",
    "topic": "Bucles",
    "question": "¿Qué sucede al ejecutar el bucle?",
    "code": "static int count = 0;\npublic static void main(String[] args) {\n    for (int x = 0; x < 4; x--) {\n        x++;\n        test('4');\n    }\n    System.out.println(\"Cuenta: \" + count + \".\");\n}\nstatic boolean test(char num) {\n    System.out.print(num + \" \");\n    count++;\n    return true;\n}",
    "options": [
      "El programa no compila porque test devuelve boolean.",
      "Imprime 1 2 3 4 y después Cuenta: 3.",
      "Imprime Cuenta: 0.",
      "El bucle no termina."
    ],
    "answer": 3,
    "explanation": "Cada vuelta empieza con x = 0, el cuerpo lo incrementa a 1 y la actualización del for lo decrementa a 0. La condición x < 4 nunca deja de cumplirse."
  },
  {
    "id": "RTO01Q10",
    "source": "Examen de repaso Java · pregunta 10",
    "topic": "Arrays",
    "question": "¿Qué imprime el programa?",
    "code": "int[] a1 = {1, 2, 3, 4, 5};\nint[] a2 = {0, 0, 0, 0, 0};\nfor (int i = 0; i < a2.length; i++) a1[i] = a2[i];\nfor (int i = 0; i < a1.length; i++)\n    System.out.print(\"a1[\" + i + \"]=\" + a1[i] + \".\\n\");",
    "options": [
      "Los valores de a1 son 2, 3, 4, 5 y 6.",
      "Los valores de a1 son 1, 2, 3, 4 y 5.",
      "Los valores de a1 son cinco ceros.",
      "No compila."
    ],
    "answer": 2,
    "explanation": "El primer bucle copia cada elemento de a2 sobre la posición correspondiente de a1. Todos los elementos de a2 son 0, así que a1 queda lleno de ceros."
  },
  {
    "id": "RTO01Q11",
    "source": "Examen de repaso Java · pregunta 11",
    "topic": "Variables estáticas",
    "question": "¿Qué imprime el programa?",
    "code": "class Balance {\n    static String nombre;\n    static double bal;\n    static String[] valores = new String[2];\n    static void modifica(String n, double b, int posicion) {\n        nombre = n;\n        bal = b;\n        valores[posicion] = nombre;\n    }\n    static void show(int posicion) {\n        if (bal < 0) {\n            System.out.print(\"- - > \");\n            System.out.print(valores[posicion] + \": & \" + bal + \".\\n\");\n        }\n    }\n    public static void main(String[] args) {\n        Balance.modifica(\"Pepe\", 100, 0);\n        Balance.modifica(\"Luis\", -100, 1);\n        for (int i = 0; i < 2; i++) Balance.show(i);\n    }\n}",
    "options": [
      "Imprime una línea para Pepe y otra para Luis, ambas con saldo -100.0.",
      "Imprime únicamente: - - > Luis: & -100.0.",
      "Imprime únicamente: - - > Pepe: & 100.0.",
      "No compila porque show no puede acceder a campos estáticos."
    ],
    "answer": 0,
    "explanation": "bal es un campo estático compartido y queda en -100 tras la segunda llamada. show comprueba ese mismo saldo para ambas posiciones e imprime los nombres Pepe y Luis, ambos con -100.0."
  },
  {
    "id": "RTO01Q12",
    "source": "Examen de repaso Java · pregunta 12",
    "topic": "Bucles",
    "question": "¿Qué valor imprime contador al terminar?",
    "code": "int a = 9;\nint contador = 0;\nfor (int i = 0; i < 100; i++) {\n    if ((a % 4 == 0) || (i % 2) == 0)\n        System.out.println(a + \" \" + i);\n    contador = contador + 1;\n}\nSystem.out.println(contador);",
    "options": [
      "51.",
      "0.",
      "23.",
      "100."
    ],
    "answer": 3,
    "explanation": "contador se incrementa una vez en cada una de las 100 iteraciones. La instrucción está fuera del if, así que su valor final es 100."
  },
  {
    "id": "RTO01Q13",
    "source": "Examen de repaso Java · pregunta 13",
    "topic": "Arrays",
    "question": "¿Qué imprime el programa?",
    "code": "int[] arrayInteger = new int[5];\narrayInteger[0] = 0;\narrayInteger[1] = 3;\narrayInteger[2] = 4;\narrayInteger[3] = 5;\narrayInteger[4] = 6;\nfor (int i = 0; i < arrayInteger.length; i++)\n    System.out.print(arrayInteger[i]);\nSystem.out.print(\".\");",
    "options": [
      "01234.",
      "null34567.",
      "3456null.",
      "03456."
    ],
    "answer": 3,
    "explanation": "El array contiene 0, 3, 4, 5 y 6. El bucle los imprime seguidos y luego imprime el punto: 03456."
  },
  {
    "id": "RTO01Q14",
    "source": "Examen de repaso Java · pregunta 14",
    "topic": "Ámbito de variables",
    "question": "¿Qué sucede al compilar este fragmento?",
    "code": "int x = 12;\nfor (int i = 0; i < 100; i++) {\n    int x = 100;\n    x = x + 1;\n}\nSystem.out.println(x);",
    "options": [
      "Compila e imprime 13.",
      "Compila e imprime 101.",
      "Compila e imprime 12.",
      "No compila: x ya está declarada en el método main."
    ],
    "answer": 3,
    "explanation": "La variable local x ya está declarada en el método. No se puede declarar otra x en el bloque anidado del for dentro de ese mismo ámbito."
  },
  {
    "id": "RTO01Q15",
    "source": "Examen de repaso Java · pregunta 15",
    "topic": "Variables estáticas",
    "question": "¿Qué imprime el programa?",
    "code": "class Ejer3 {\n    static int z = 0;\n    static int i = 0;\n    public static void a(int b, int c) {\n        z = c;\n        i = 3;\n        z = b * i;\n    }\n    public static void main(String[] args) {\n        i = 0;\n        z = 2;\n        i = z + 1;\n        a(z, i);\n        System.out.println(\"El valor de i y z es: \" + i + \" \" + z);\n    }\n}",
    "options": [
      "El valor de i y z es: 3 2.",
      "El valor de i y z es: 9 2.",
      "El valor de i y z es: 3 6.",
      "Ninguna de las anteriores."
    ],
    "answer": 2,
    "explanation": "i y z son campos estáticos, no parámetros locales. Antes de llamar a a valen i = 3 y z = 2. El método asigna i = 3 y después z = b * i = 2 * 3 = 6."
  }
];
