/*
// src/main/java/Main.java
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.infra.DatabaseInitializer;
import com.firjanadventure.firjanadventure.dao.PersonagemDAO;
import com.firjanadventure.firjanadventure.dao.ItemDAO;
import com.firjanadventure.firjanadventure.dao.InventarioDAO;
import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.modelo.enums.ItemTipo;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.service.CalcularDanoService;
import com.firjanadventure.firjanadventure.service.CombateService;
import com.firjanadventure.firjanadventure.service.GameStateService;
import com.firjanadventure.firjanadventure.service.InventarioService;
import com.firjanadventure.firjanadventure.service.MonstroFactory;

import java.util.Random;
import java.util.Scanner;

public class Main {
    private static final Random RNG = new Random();

    private static void imprimirInventario(java.util.List<InventarioDAO.InventarioItemDTO> lst) {
        System.out.println("Inventário:");
        for (int i = 0; i < lst.size(); i++) {
            var it = lst.get(i);
            String status = (it.equipadoEm != null) ? " [equipado em " + it.equipadoEm + "]" : "";
            System.out.printf("%d) %s x%d%s%n", i + 1, it.item.getNome(), it.quantidade, status);
        }
    }

    public static void main(String[] args) {
        DatabaseInitializer.init();

        //PersonagemDAO personagemDAO = new PersonagemDAO();
        //GameStateService game = new GameStateService(personagemDAO);


        GameStateService game = new GameStateService();


        ItemDAO itemDAO = new ItemDAO();
        InventarioDAO invDAO = new InventarioDAO();
        InventarioService inventario = new InventarioService(itemDAO, invDAO);

        CombateService combate = new CombateService(new CalcularDanoService());

        // Salvar ao encerrar (Ctrl+C, encerramento normal, etc.)
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                game.salvarAgora();
                System.out.println("\n[Jogo salvo antes de sair]");
            } catch (Exception e) {
                System.err.println("\n[Falha ao salvar no shutdown: " + e.getMessage() + "]");
            }
        }));

        System.out.println("Bem-vindo, " + game.getAtual().getNome() + "!");
        System.out.println("Use WASD + Enter para mover. Q para sair. L = status, I = inventário");

        try (Scanner sc = new Scanner(System.in)) {
            loop:
            while (true) {
                System.out.print("Comando (W/A/S/D, L, I ou Q): ");
                String cmd = sc.nextLine().trim();
                if (cmd.isEmpty()) continue;

                char c = Character.toUpperCase(cmd.charAt(0));
                switch (c) {
                    case 'W', 'A', 'S', 'D' -> {
                        game.mover(c); // Atualiza posX/posY e autosalva
                        var p = game.getAtual();
                        System.out.printf("Posição: (%d,%d) | HP: %d | LV: %d | EXP: %d%n",
                                p.getPosX(), p.getPosY(), p.getHp(), p.getLevel(), p.getXp());

                        // Ganhar um pouco de Vida ao andar
                            int newHp = p.getHp() + 5;
                            p.setHp(newHp);

                        // 1) Monstro (sorteio como na sua lógica antiga)
                        Monstro monstro = MonstroFactory.sortearMonstro(RNG);
                        if (monstro != null) {
                            System.out.println("⚔️ Um " + monstro.getClass().getSimpleName() +
                                    " selvagem apareceu! (Level " + monstro.getLevel() + ")");
                            System.out.print("Deseja lutar? (S/N): ");
                            String luta = sc.nextLine().trim().toUpperCase();
                            if (luta.equals("S")) {
                                var resultado = combate.iniciar(p, monstro, sc);
                                switch (resultado) {
                                    case VITORIA -> {
                                        // Recompensa simples
                                        game.ganhoExp(50); // TODO: escalar por nível do monstro
                                        // 40% de chance de drop
                                        if (RNG.nextInt(100) < 40) {
                                            var item = inventario.dropAleatorioEAdicionar(p.getId());
                                            System.out.println("Drop: " + item.getNome() + " adicionado ao inventário.");
                                        }
                                        game.salvarAgora();
                                    }
                                    case DERROTA -> {
                                        // Tratar morte
                                        if (!tratarDerrota(p, sc, game)) break loop; // se escolheu sair
                                    }
                                    case FUGA -> System.out.println("Você escapou do combate.");
                                }
                            } else {
                                System.out.println("🏃 Você evitou o combate.");
                            }
                        }

                        // 2) Baú (15%)
                        rolarBau(game, sc, inventario);
                    }

                    case 'L' -> {
                        var p = game.getAtual();
                        System.out.printf("Status — HP:%d MP:%d For:%d Arm:%d LV:%d EXP:%d Pos:(%d,%d)%n",
                                p.getHp(), p.getMp(), p.getForca(), p.getArmadura(),
                                p.getLevel(), p.getXp(), p.getPosX(), p.getPosY());
                    }


                    case 'I' -> {
                        var p = game.getAtual();
                        var lista = inventario.listar(p.getId());

                        if (lista.isEmpty()) {
                            System.out.println("Inventário: (vazio)");
                            break;
                        }

                        imprimirInventario(lista);



                        loopInv:
                        while (true) {
                            System.out.println("\nAção: (U) Usar  | (E) Equipar  | (R) Retirar  | (D) Descartar  | (S) Sair");
                            System.out.print("> ");
                            String acao = sc.nextLine().trim().toUpperCase();
                            if (acao.equals("S")) break loopInv;

                            System.out.print("Número do item: ");
                            String idxStr = sc.nextLine().trim();
                            int idx;
                            try {
                                idx = Integer.parseInt(idxStr) - 1;
                            } catch (Exception ex) {
                                System.out.println("Número inválido.");
                                continue;
                            }
                            if (idx < 0 || idx >= lista.size()) {
                                System.out.println("Fora de faixa.");
                                continue;
                            }

                            var escolhido = lista.get(idx);

                            try {
                                switch (acao) {
                                    case "U" -> {
                                        if (escolhido.item.getTipo() != ItemTipo.CONSUMIVEL) {
                                            System.out.println("Este item não é consumível.");
                                            continue;
                                        }
                                        inventario.consumirItem(p.getId(), escolhido.item.getId(), p);
                                        System.out.println("Usado: " + escolhido.item.getNome());
                                    }
                                    case "E" -> {
                                        if (escolhido.item.getTipo() != ItemTipo.EQUIPAVEL) {
                                            System.out.println("Este item não é equipável.");
                                            continue;
                                        }
                                        inventario.equiparItem(p.getId(), escolhido.item.getId(), p);
                                        System.out.println("Equipado: " + escolhido.item.getNome());
                                    }
                                    case "R" -> {
                                        if (escolhido.item.getTipo() != ItemTipo.EQUIPAVEL) {
                                            System.out.println("Apenas itens equipáveis podem ser retirados.");
                                            continue;
                                        }
                                        if (escolhido.equipadoEm == null) {
                                            System.out.println("Este item não está equipado.");
                                            continue;
                                        }
                                        inventario.desequiparItem(p.getId(), escolhido.item.getId(), p);
                                        System.out.println("Desequipado: " + escolhido.item.getNome());
                                    }
                                    case "D" -> {
                                        System.out.print("Tem certeza que deseja descartar '" + escolhido.item.getNome() + "'? (S/N): ");
                                        String conf = sc.nextLine().trim().toUpperCase();
                                        if (!conf.equals("S")) {
                                            System.out.println("Operação cancelada.");
                                            continue;
                                        }
                                        inventario.descartarItem(p.getId(), escolhido.item.getId(), p);
                                        System.out.println("Descartado: " + escolhido.item.getNome());
                                    }
                                    default -> {
                                        System.out.println("Ação inválida.");
                                        continue;
                                    }
                                }

                                // Persistir estado após a ação
                                game.salvarAgora();

                                // Recarrega lista para refletir mudanças
                                lista = inventario.listar(p.getId());
                                if (lista.isEmpty()) {
                                    System.out.println("Inventário: (vazio)");
                                    break loopInv;
                                }

                                // Mostrar novamente a lista atualizada
                                imprimirInventario(lista);

                                System.out.print("Continuar gerenciando o inventário? (S/N): ");
                                if (!sc.nextLine().trim().equalsIgnoreCase("S")) break loopInv;

                            } catch (Exception ex) {
                                System.out.println("Falha: " + ex.getMessage());
                            }
                        }
                    }


                    case 'Q' -> {
                        System.out.println("Saindo...");
                        game.salvarAgora();
                        break loop;
                    }

                    default -> System.out.println("Comando inválido.");
                }
            }
        }

        System.out.println("Até logo!");
    }

    private static void rolarBau(GameStateService game, Scanner sc, InventarioService inventario) {
        int chance = 15; // 15%
        int rolarDado = RNG.nextInt(100) + 1;
        if (rolarDado <= chance) {
            System.out.println("🎁 Você encontrou um baú!");

            // Se você tiver uma classe Bau com lógica própria:
            // Bau.encontrarBau(game.getAtual(), sc);

            // Exemplo simples: 1 item aleatório sempre
            var item = inventario.dropAleatorioEAdicionar(game.getAtual().getId());
            System.out.println("Você ganhou: " + item.getNome());
            game.salvarAgora();
        }
    }

    */
/**
     * Retorna false se o jogador escolheu sair do jogo.
     *//*

    private static boolean tratarDerrota(Personagem jogador, Scanner sc, GameStateService game) {
        System.out.print("Você morreu. Tentar novamente? (S/N): ");
        String escolha = sc.nextLine().trim().toUpperCase();
        if (escolha.equals("S")) {
            // Regra simples de "revive" — ajuste como preferir
            int hpRecover = Math.max(20, (int) Math.round(jogador.getHp() * 0.5)); // se já está 0, garanta mínimo
            jogador.setHp(hpRecover);
            game.salvarAgora();
            System.out.println("Você reviveu com " + hpRecover + " de HP.");
            return true;
        } else {
            System.out.println("Obrigado por jogar!");
            game.salvarAgora();
            return false;
        }
    }
}*/
