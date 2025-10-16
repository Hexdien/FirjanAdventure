package caminho;

import Itens.Item;
import Itens.ItemFactory;
import personagens.Personagem;
import java.util.Scanner;
import java.util.Random;

public class Bau {

    // ID da chave que abre este tipo de baú
    // Usa o nome do item que foi definido no ItemFactory (Chave de Bronze)
    private static final String ID_CHAVE_NECESSARIA = ItemFactory.CHAVE_BRONZE.getNome();

    /**
     * Inicia o encontro com o baú, gerencia a abertura e o saque.
     * @param jogador O Personagem atual.
     * @param sc O Scanner para entrada do usuário.
     */
    public static void encontrarBau(Personagem jogador, Scanner sc) {

        System.out.println("📦 Você encontrou um Baú de Bronze!");
        System.out.println("Deseja tentar abrir? (S/N)");
        String escolha = sc.nextLine().trim().toUpperCase();

        if (!escolha.equals("S")) {
            System.out.println("🚪 Você seguiu em frente, deixando o baú para trás.");
            return; // Encerra a interação
        }

        // *****************************************************************
        // 1. VERIFICAÇÃO DA CHAVE
        // *****************************************************************
        if (jogador.possuiItem(ID_CHAVE_NECESSARIA)) {

            System.out.println("✅ Você usa sua " + ID_CHAVE_NECESSARIA + " para abrir o baú!");

            // Consome a chave
            jogador.removerItemPeloNome(ID_CHAVE_NECESSARIA);

            // *****************************************************************
            // 2. DROP DE 2 ITENS ALEATÓRIOS
            // *****************************************************************
            System.out.println("🎉 O baú se abre e você encontra dois itens!");

            // Dropa o primeiro item
            Item item1 = ItemFactory.getRandomCommonItem();
            if (item1 != null) {
                jogador.adicionarItem(item1);
            }

            // Dropa o segundo item
            Item item2 = ItemFactory.getRandomCommonItem();
            if (item2 != null) {
                jogador.adicionarItem(item2);
            }

        } else {
            // Caso não tenha a chave
            System.out.println("❌ O baú está trancado. Você precisa da chave: '" + ID_CHAVE_NECESSARIA + "'.");
        }
    }
}