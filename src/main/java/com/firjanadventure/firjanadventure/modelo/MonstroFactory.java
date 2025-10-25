package com.firjanadventure.firjanadventure.modelo;

import java.util.Random;

public class MonstroFactory {
    private static final Random random = new Random();

    public static Monstro gerarMonstro(int levelJogador) {
        int tipo = random.nextInt(4);
        return switch (tipo) {
            case 0 -> new Fantasma(levelJogador);
            case 1 -> new Esqueleto(levelJogador);
            case 2 -> new Minotauro(levelJogador);
            default -> new Goblin(levelJogador);
        };
    }

    public static boolean deveAcontecerEncontro() {
        return random.nextInt(100) < 10; // 10% de chance
    }
}
