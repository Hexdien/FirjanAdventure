package caminho;
import java.util.Random;
import java.util.Scanner;
import Combate.*;
import Itens.ItemFactory;
import monstros.*;
import personagens.Personagem;

public class caminhar {
    public static void verificarEncontroBau(Personagem jogador, Scanner sc) {
        Random random = new Random();

        // 100% DE CHANCE PARA TESTE
        int chance = 100;

        // Para 15% de chance, mude para: int chance = 15;

        int rolarDado = random.nextInt(100) + 1; // Rola de 1 a 100

        if (rolarDado <= chance) {
            // O baú foi encontrado!
            Bau.encontrarBau(jogador, sc);
        }

        // Se você quiser ter encontros de monstro OU baú, você deve
        // combinar essa lógica com a encontrarMonstro no método 'caminho'.
    }

    public static void lutaChefe(Personagem jogador, Scanner sc){
     System.out.println("Voce decidiu entrar na sala do chefe!");

     Monstro monstro = new Chefefinal();
     Combate.iniciarCombate(jogador, monstro, sc);



    }
    public static void encontrarMonstro(Personagem jogador) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();
        int numeroAleatorio = random.nextInt(8); // gera de 0 a 7
        System.out.println("🎲 Número aleatório: " + numeroAleatorio);

        // 0 a 3 = nada acontece, 4 a 7 = monstro aparece
        if (numeroAleatorio > 3) {
            int levelMonstro = random.nextInt(3) + 1; // 1 a 3
            Monstro monstro = null;

            switch (numeroAleatorio) {
                case 4:
                    monstro = new Esqueleto(levelMonstro);
                    break;
                case 5:
                    monstro = new Goblin(levelMonstro);
                    break;
                case 6:
                    monstro = new Fantasma(levelMonstro);
                    break;
                case 7:
                    monstro = new Minotauro(levelMonstro);
                    break;
            }

            System.out.println("⚔️ Um " + monstro.getClass().getSimpleName() +
                    " selvagem apareceu! (Level " + levelMonstro + ")");
            System.out.println("Deseja lutar? (S/N)");
            String luta = sc.nextLine().trim().toUpperCase();
            if (luta.equals("S")) {
                System.out.println("💥 Você entra em combate com o " + monstro.getClass().getSimpleName() + "!");
                Combate.iniciarCombate(jogador, monstro, sc);
                if (jogador.getHp() <= 0) {
                    System.out.println("☠️ Fim de jogo.");
                }
            } else {
                System.out.println("🏃 Você fugiu do encontro.");
            }

        }
    }
    public static void reiniciar(Personagem jogador , Scanner sc) {
        System.out.println("Você morreu, deseja tentar novamente? >> S || N <<");
        String escolha = sc.nextLine().trim().toUpperCase();
        if (escolha.equals("S")) {
            caminho(jogador);
        }else{
            System.out.println("Obrigado por jogar até a proxima!");
            System.exit(0);
            // como implementar fechamento do jogo
        }
    }
    public static void caminho(Personagem jogador) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();

        int x = 0; // esquerda (-) / direita (+)
        int y = 0; // baixo (-) / cima   (+)
        boolean chefe = false;

        System.out.println("Use A (esquerda), D (direita), W (cima) e S (baixo) para se mover.");
        System.out.println("pressione L para verificar os status ");
        System.out.println("pressione I para abrir o inventario");
        System.out.println("Digite 'Q' para sair.");

        // REMOVER AS DUAS LINHAS ABAIXO
        jogador.adicionarItem(ItemFactory.ESPADA_BASICA);
        jogador.adicionarItem(ItemFactory.ESPADA_LENDARIA);
        jogador.adicionarItem(ItemFactory.CHAVE_BRONZE);


        while (!chefe) {
            System.out.print("Escolha a direção: ");
            String escolha = sc.nextLine().trim().toUpperCase();

            if (escolha.equals("Q")) {
                System.out.println("Você desistiu da jornada...");
                break;
            }

            //movimento do jogador
            switch (escolha) {
                case "A": // esquerda
                    if (x <= -6) {
                        System.out.println("⚠ Caminho bloqueado à esquerda!");
                    } else {
                        x--;
                        System.out.println("Você andou para a esquerda.");
                        encontrarMonstro(jogador);
                        verificarEncontroBau(jogador, sc);

                    }
                    break;

                case "D": // direita
                    if (x >= 6) {
                        System.out.println("⚠ Caminho bloqueado à direita!");
                    } else {
                        x++;
                        System.out.println("Você andou para a direita.");
                        encontrarMonstro(jogador);
                        verificarEncontroBau(jogador, sc);
                    }
                    break;

                case "W": // cima
                    if (y >= 5) {
                        System.out.println("⚠ Caminho bloqueado acima!");

                    } else {
                        y++;
                        System.out.println("Você andou para cima.");
                        encontrarMonstro(jogador);
                        verificarEncontroBau(jogador, sc);
                        }
                    break;

                case "S": // baixo
                    if (y <= 0) {
                        System.out.println("⚠ Caminho bloqueado abaixo!");
                    } else {
                        y--;
                        System.out.println("Você andou para baixo.");
                        encontrarMonstro(jogador);
                        verificarEncontroBau(jogador, sc);
                    }
                    break;

                case "I":
                    jogador.gerenciarIventario(sc);
                    break;
                case "L":
                    jogador.mostrarStatus();
                    break;


                default:
                    System.out.println("❌ Opção inválida! Use WASD para andar ou L para ver status ou I para ver inventario");
            }

            // Sorteia número para evento


            // condição para encontrar o chefe
            if (x == 6 && y == 5) {
                    System.out.println("🔥 Você encontrou a sala do chefe final!");
                    System.out.println("Deseja Enfrenta-lo? S Ou N");
                    String luta = sc.nextLine().trim().toUpperCase();
                if (luta.equals("S")) {
                    if(jogador.getLevel() == 1) {
                        lutaChefe(jogador, sc);
                        //TODO: método para encontrar chefe
                    } else {
                        System.out.println("Ok, talvez em outro momento.");
                        x--;
                    }


                }

            }

            System.out.println("📍 Posição atual: X=" + x + ", Y=" + y);
            System.out.println("----------------------------------");
        }

        sc.close();

    }

    public static void caminho() {
    }
}