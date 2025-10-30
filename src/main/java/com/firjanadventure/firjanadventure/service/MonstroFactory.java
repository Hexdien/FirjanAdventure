// src/main/java/service/MonstroFactory.java
package com.firjanadventure.firjanadventure.service;

import com.firjanadventure.firjanadventure.modelo.*;


import java.util.Random;

public final class MonstroFactory {
    private MonstroFactory() {}

    /**
     * Sorteia um monstro (ou nenhum) seguindo a sua regra antiga:
     * 0..3 = nada; 4..7 = monstro (nível 1..3).
     * Retorna null quando não há monstro.
     */
    public static Monstro sortearMonstro(Random rng) {
        int numeroAleatorio = rng.nextInt(8); // 0..7
        if (numeroAleatorio <= 3) return null;

        int levelMonstro = 1 + rng.nextInt(3); // 1..3
        return switch (numeroAleatorio) {
            case 4 -> new Esqueleto(levelMonstro);
            case 5 -> new Goblin(levelMonstro);
            case 6 -> new Fantasma(levelMonstro);
            case 7 -> new Minotauro(levelMonstro);
            default -> null;
        };
    }
}