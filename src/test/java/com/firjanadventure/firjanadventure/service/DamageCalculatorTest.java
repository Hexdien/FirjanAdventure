package com.firjanadventure.firjanadventure.service;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class DamageCalculatorTest {

  @Test
  void calcularDano() {
    for (int i = 0 ; i < 10; i++ ){
    int dano = DamageCalculator.calcularDano(20, 10, "FISICO");
    System.out.println("Dano gerado: " + dano);


    }
  }

}
