import java.util.Random;

public class Main {
    public static void main(String[] args) {
        char[][] tablero = new char[10][10];
        Random aleatorios = new Random();

        for (int fila = 0; fila < tablero.length; fila++) {
            for (int columna = 0; columna < tablero[fila].length; columna++) {
                tablero[fila][columna] = '*';
            }
        }

        tablero[0][0] = 'R';
        tablero[9][9] = 'F';

        for (int obstaculo = 0; obstaculo < 5; obstaculo++) {
            int fila;
            int columna;
            do {
                fila = aleatorios.nextInt(10);
                columna = aleatorios.nextInt(10);
            } while (tablero[fila][columna] != '*');
            tablero[fila][columna] = 'X';
        }

        int filaBateria;
        int columnaBateria;
        do {
            filaBateria = aleatorios.nextInt(10);
            columnaBateria = aleatorios.nextInt(10);
        } while (tablero[filaBateria][columnaBateria] != '*');
        tablero[filaBateria][columnaBateria] = 'B';

        for (int fila = 0; fila < tablero.length; fila++) {
            for (int columna = 0; columna < tablero[fila].length; columna++) {
                System.out.print(tablero[fila][columna] + " ");
            }
            System.out.println();
        }
    }
}
