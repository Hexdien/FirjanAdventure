package service;
import java.util.Random;

public class CalcularDanoService {
    public static int calcularDano(int forca) {
        Random rand = new Random();
        int multiplicador = 80 + rand.nextInt(41); // 80% a 120%
        return (forca * multiplicador) / 100;
    }

}
