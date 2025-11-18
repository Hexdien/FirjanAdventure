package com.firjanadventure.firjanadventure.service;

import java.util.concurrent.ThreadLocalRandom;

public class DamageCalculator {

  public static int calcularDano(int ataque, int defesa, String tipoAtaque) {
    int danoBase = ataque - defesa;
    int calcRand = ThreadLocalRandom.current().nextInt(0, ataque);
    if ("MAGIA".equals(tipoAtaque)) {
      danoBase += 15;
    }
    return danoBase + calcRand;

  }

}
