// src/main/java/service/CombateService.java
package com.firjanadventure.firjanadventure.service;

import com.firjanadventure.firjanadventure.modelo.Fantasma;
import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.modelo.Personagem;

import java.util.Random;
import java.util.Scanner;

public final class CombateService {
<<<<<<< HEAD
    private final CalcularDanoService calcularDano;
    private final Random rand = new Random();

    public CombateService(CalcularDanoService calcularDano) {
        this.calcularDano = calcularDano;
    }

    public enum ResultadoCombate { VITORIA, DERROTA, FUGA }

    public ResultadoCombate iniciar(Personagem jogador, Monstro inimigo, Scanner sc) {
        boolean defendendo = false;

        System.out.println("\n⚔️ Você enfrentará um " + inimigo.getClass().getSimpleName() +
                " de nível " + inimigo.getLevel() + "!");
        inimigo.getStatus();

        while (jogador.getHp() > 0 && inimigo.getHp() > 0) {
            System.out.println("\n-- SEU TURNO --");
            System.out.println("HP: " + jogador.getHp() + " | MP: " + jogador.getMp());
            System.out.println("1) Ataque físico");
            System.out.println("2) Usar magia (-10 MP)");
            System.out.println("3) Defender (metade do dano no próximo ataque do inimigo)");
            System.out.println("4) Fugir");
            System.out.print("> ");

            String escolha = sc.nextLine().trim();

            switch (escolha) {
                case "1" -> {
                    if (inimigo instanceof Fantasma) {
                        System.out.println("⚠️ O ataque físico não funciona contra fantasmas!");
                    } else {
                        int dano = calcularDano.calcularDano(jogador.getForca());
                        inimigo.setHp(Math.max(0, inimigo.getHp() - dano));
                        System.out.println("💥 Você causou " + dano + " de dano!");
                    }
                    defendendo = false;
                }
                case "2" -> {
                    if (jogador.getMp() < 10) {
                        System.out.println("❌ MP insuficiente!");
                        continue;
                    }
                    jogador.setMp(jogador.getMp() - 10);
                    int danoMagico = Math.max(1, (int) Math.round(jogador.getForca() * 0.5 + jogador.getMp() * 0.33));
                    inimigo.setHp(Math.max(0, inimigo.getHp() - danoMagico));
                    System.out.println("🔥 Você usou magia e causou " + danoMagico + " de dano!");
                    defendendo = false;
                }
                case "3" -> {
                    defendendo = true;
                    System.out.println("🛡️ Você se defende. O próximo dano recebido será reduzido pela metade.");
                }
                case "4" -> {
                    if (rand.nextInt(100) < 50) {
                        System.out.println("🏃 Você fugiu com sucesso!");
                        return ResultadoCombate.FUGA;
                    } else {
                        System.out.println("❌ Você tentou fugir, mas falhou!");
                        defendendo = false;
                    }
                }
                default -> {
                    System.out.println("❌ Escolha inválida!");
                    continue;
                }
            }

            if (inimigo.getHp() <= 0) {
                System.out.println("✅ Você derrotou o " + inimigo.getClass().getSimpleName() + "!");

                return ResultadoCombate.VITORIA;
            }

            System.out.println("\n-- TURNO DO MONSTRO --");
            int danoMonstro = calcularDano.calcularDano(inimigo.getForca());
            if (defendendo) danoMonstro /= 2;

            int danoFinal = Math.max(0, danoMonstro - jogador.getArmadura());
            jogador.setHp(Math.max(0, jogador.getHp() - danoFinal));
            System.out.println("💢 O " + inimigo.getClass().getSimpleName() + " causou " + danoFinal + " de dano!");

            if (jogador.getHp() <= 0) {
                System.out.println("☠️ Você foi derrotado...");
                return ResultadoCombate.DERROTA;
            }
        }
        return (jogador.getHp() > 0) ? ResultadoCombate.VITORIA : ResultadoCombate.DERROTA;
    }
}
=======
  private final CalcularDanoService calcularDano;
  private final Random rand = new Random();

  public CombateService(CalcularDanoService calcularDano) {
    this.calcularDano = calcularDano;
  }

  public enum ResultadoCombate {
    VITORIA, DERROTA, FUGA
  }

  public ResultadoCombate iniciar(Personagem jogador, Monstro inimigo, Scanner sc) {
    boolean defendendo = false;

    System.out.println("\n⚔️ Você enfrentará um " + inimigo.getClass().getSimpleName() +
        " de nível " + inimigo.getLevel() + "!");
    inimigo.getStatus();

    while (jogador.getHp() > 0 && inimigo.getHp() > 0) {
      System.out.println("\n-- SEU TURNO --");
      System.out.println("HP: " + jogador.getHp() + " | MP: " + jogador.getMp());
      System.out.println("1) Ataque físico");
      System.out.println("2) Usar magia (-10 MP)");
      System.out.println("3) Defender (metade do dano no próximo ataque do inimigo)");
      System.out.println("4) Fugir");
      System.out.print("> ");

      String escolha = sc.nextLine().trim();

      switch (escolha) {
        case "1" -> {
          if (inimigo instanceof Fantasma) {
            System.out.println("⚠️ O ataque físico não funciona contra fantasmas!");
          } else {
            int dano = calcularDano.calcularDano(jogador.getForca());
            inimigo.setHp(Math.max(0, inimigo.getHp() - dano));
            System.out.println("💥 Você causou " + dano + " de dano!");
          }
          defendendo = false;
        }
        case "2" -> {
          if (jogador.getMp() < 10) {
            System.out.println("❌ MP insuficiente!");
            continue;
          }
          jogador.setMp(jogador.getMp() - 10);
          int danoMagico = Math.max(1, (int) Math.round(jogador.getForca() * 0.5 + jogador.getMp() * 0.33));
          inimigo.setHp(Math.max(0, inimigo.getHp() - danoMagico));
          System.out.println("🔥 Você usou magia e causou " + danoMagico + " de dano!");
          defendendo = false;
        }
        case "3" -> {
          defendendo = true;
          System.out.println("🛡️ Você se defende. O próximo dano recebido será reduzido pela metade.");
        }
        case "4" -> {
          if (rand.nextInt(100) < 50) {
            System.out.println("🏃 Você fugiu com sucesso!");
            return ResultadoCombate.FUGA;
          } else {
            System.out.println("❌ Você tentou fugir, mas falhou!");
            defendendo = false;
          }
        }
        default -> {
          System.out.println("❌ Escolha inválida!");
          continue;
        }
      }

      if (inimigo.getHp() <= 0) {
        System.out.println("✅ Você derrotou o " + inimigo.getClass().getSimpleName() + "!");

        return ResultadoCombate.VITORIA;
      }

      System.out.println("\n-- TURNO DO MONSTRO --");
      int danoMonstro = calcularDano.calcularDano(inimigo.getForca());
      if (defendendo)
        danoMonstro /= 2;

      int danoFinal = Math.max(0, danoMonstro - jogador.getDefesa());
      jogador.setHp(Math.max(0, jogador.getHp() - danoFinal));
      System.out.println("💢 O " + inimigo.getClass().getSimpleName() + " causou " + danoFinal + " de dano!");

      if (jogador.getHp() <= 0) {
        System.out.println("☠️ Você foi derrotado...");
        return ResultadoCombate.DERROTA;
      }
    }
    return (jogador.getHp() > 0) ? ResultadoCombate.VITORIA : ResultadoCombate.DERROTA;
  }
}
>>>>>>> feat/login
