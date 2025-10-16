package Itens;


import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ItemFactory {

    public static final Item POCAO_VIDA =
            new Item("Poção de Vida", "Restaura 20 HP", "Consumivel", 20);

    public static final Item POCAO_MANA =
            new Item("Poção de Mana", "Restaura 20 MP", "Consumivel", 20);

    public static final Item ARMADURA_MALHA =
            new Item("Armadura de Malha", "Aumenta 15 de Defesa", "Equipamento", 15);

    public static final Item ARMADURA_PESADA =
            new Item("Armadura Pesada", "Aumenta 30 de Defesa", "Equipamento", 30);

    public static final Item ESCUDO =
            new Item("Escudo", "Escudo Equipavel", "Equipamento", 15);

    public static final Item ESPADA_BASICA =
            new Item("Espada Enferrujada", "Aumenta +2 de Força", "Equipamento", 2);

    public static final Item CHAVE_ANTIGA =
            new Item("Chave Antiga", "Pode abrir portas", "Missao", 0);

    public static final Item ESPADA_LENDARIA =
            new Item("Espada Lendaria", "Aumenta +15 de Força", "Equipamento", 15);

    public static final Item ESPADA_RARA =
            new Item("Espada Rara", "Aumenta +10 de Força", "Equipamento", 10);

    public static final Item STAFF_MAGICO =
            new Item("Staff magico", "Causa +5 de dano mágico: 5 DE MANA", "Equipamento", 5);

    public static final Item LIVRO_MAGICO =
            new Item("Livro magico", "Causa +15 de dano magico: 20 DE MANA", "Equipamento", 15);

    public static final Item PERGAMINHO_MAGICO =
            new Item("Livro magico", "Causa +15 de dano magico: 20 DE MANA", "Equipamento", 15);

    public static final Item CHAVE_BRONZE =
            new Item("Chave de Bronze", "Abre baús de bronze.", "Chave", 0);




    private static final List<Item> ITENS_COMUNS = new ArrayList<>();

    static {
        ITENS_COMUNS.add(POCAO_VIDA);
        ITENS_COMUNS.add(ESPADA_BASICA);
        ITENS_COMUNS.add(STAFF_MAGICO);
        ITENS_COMUNS.add(LIVRO_MAGICO);
        ITENS_COMUNS.add(ESPADA_RARA);
        ITENS_COMUNS.add(ESPADA_LENDARIA);
        ITENS_COMUNS.add(CHAVE_ANTIGA);
        ITENS_COMUNS.add(ESCUDO);
        ITENS_COMUNS.add(ARMADURA_MALHA);
        ITENS_COMUNS.add(ARMADURA_PESADA);
        ITENS_COMUNS.add(POCAO_MANA);
        ITENS_COMUNS.add(PERGAMINHO_MAGICO);
        ITENS_COMUNS.add(CHAVE_BRONZE);
    }

    public static Item getRandomCommonItem() {
        Random rng = new Random();
        int index = rng.nextInt(ITENS_COMUNS.size());
        return ITENS_COMUNS.get(index);
    }
}