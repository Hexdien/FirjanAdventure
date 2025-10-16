package Combate;

import caminho.caminhar;
import personagens.Personagem;
import monstros.Monstro;
import Itens.*;

import java.util.Random;
import java.util.Scanner;

public class Combate {



    public static void iniciarCombate(Personagem jogador, Monstro inimigo, Scanner sc) {
        Random rand = new Random();
        boolean defendendo = false;


        System.out.println("\n⚔️ Você enfrentará um " + inimigo.getClass().getSimpleName() +
                " de nível " + inimigo.getLevel() + "!");
        inimigo.getStatus();

        while (jogador.getHp() > 0 && inimigo.getHp() > 0) {
            System.out.println("\n-- SEU TURNO --");
            System.out.println("HP: " + jogador.getHp() + " | MP: " + jogador.getMp());
            System.out.println("1) Ataque físico");
            System.out.println("2) Usar magia (-10 MP)");
            System.out.println("3) Defender (metade do dano no próximo ataque)");
            System.out.println("4) Fugir");

            String escolha = sc.nextLine().trim();

            switch (escolha) {
                case "1":
                    if (inimigo instanceof monstros.Fantasma) {
                        System.out.println("⚠️ O ataque físico não funciona contra fantasmas!");
                    } else {
                        int dano = calcularDano(jogador.getForca());
                        inimigo.setHp(inimigo.getHp() - dano);
                        System.out.println("💥 Você causou " + dano + " de dano!");
                    }
                    defendendo = false;
                    break;
                case "2":
                    if (jogador.getMp() < 10) {
                        System.out.println("❌ MP insuficiente!");
                        continue;
                    }
                    jogador.setMp(jogador.getMp() - 10);
                    int danoMagico = (jogador.getForca() / 2) + (jogador.getMp() / 3); // 1.5x força + rand
                    inimigo.setHp(inimigo.getHp() - danoMagico);
                    System.out.println("🔥 Você usou magia e causou " + danoMagico + " de dano!");
                    defendendo = false;
                    break;
                case "3":
                    defendendo = true;
                    System.out.println("🛡️ Você se defende, metade do dano será recebido.");
                    break;
                case "4":
                    if (rand.nextInt(100) < 50) {
                        System.out.println("🏃 Você fugiu com sucesso!");
                        return;
                    } else {
                        System.out.println("❌ Você tentou fugir, mas falhou!");
                        defendendo = false;
                    }
                    break;
                default:
                    System.out.println("❌ Escolha inválida!");
                    continue;
            }

            // Verifica se o monstro morreu
            if (inimigo.getHp() <= 0) {
                System.out.println("✅ Você derrotou o " + inimigo.getClass().getSimpleName() + "!");
                System.out.println("🎁 Você ganhou " + inimigo.getExp() + " de experiência!");

                jogador.ganharExperiencia(inimigo.getExp());
                Item itemAleat = ItemFactory.getRandomCommonItem();

                jogador.adicionarItem(itemAleat);
                return;
            }

            // Turno do monstro
            System.out.println("\n-- TURNO DO MONSTRO --");
            int danoMonstro = calcularDano(inimigo.getForca());
            if (defendendo) {
                danoMonstro /= 2;
            }

            int danoFinal = Math.max(0, danoMonstro - jogador.getArm());
            jogador.setHp(jogador.getHp() - danoFinal);
            System.out.println("💢 O " + inimigo.getClass().getSimpleName() + " causou " + danoFinal + " de dano!");

            if (jogador.getHp() <= 0) {
                System.out.println("☠️ Você foi derrotado...");
                caminhar.reiniciar(jogador, sc);
            }
        }
    }

    private static int calcularDano(int forca) {
        Random rand = new Random();
        int multiplicador = 80 + rand.nextInt(41); // 80% a 120%
        return (forca * multiplicador) / 100;
    }
}
