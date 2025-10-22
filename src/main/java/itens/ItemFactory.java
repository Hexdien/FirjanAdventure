
package itens;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import static itens.ItemTipo.*;
import static itens.Slot.*;
import itens.Item.*;


public class ItemFactory {

    public static final Item POCAO_VIDA =
            new Item("Poção de Vida", "Restaura 20 HP", CONSUMIVEL,
                    20, 3, 0, 0, NENHUM);

    public static final Item ANEL_MAGICO =
            new Item("Anel Magico", "Aumenta  20", EQUIPAVEL,
                    0, 6, 20, 0, ACESSORIO);

    public static final Item COLAR_MAGICO =
            new Item("Colar Magico", "Aumenta 15 de Força magica", EQUIPAVEL,
                    0, 6, 15, 0, ACESSORIO);

    public static final Item CAPA =
            new Item("Capa", "Aumenta 10 de Força magica", EQUIPAVEL,
                    0, 10, 10, 0, ACESSORIO);

    public static final Item CAPACETE_OURO =
            new Item("Capacete", "Capacete bronze", EQUIPAVEL,
                    0, 0, 0, 20, CABECA);

    public static final Item CAPACETE_BRONZE =
            new Item("Capacete Bronze", "Capacete bronze", EQUIPAVEL,
                    0, 0, 0, 10, CABECA);

    public static final Item POCAO_MANA =
            new Item("Poção de Mana", "Restaura 20 MP", CONSUMIVEL,
                    0, 20, 0, 0, NENHUM);

    public static final Item ARMADURA_MALHA =
            new Item("Armadura de Malha", "Aumenta 15 de Defesa", EQUIPAVEL,
                    0, 0, 0, 15, PEITO);

    public static final Item ARMADURA_PESADA =
            new Item("Armadura Pesada", "Aumenta 30 de Defesa", EQUIPAVEL,
                    0, 0, 0, 30, PEITO);

    public static final Item ESCUDO =
            new Item("Escudo", "Escudo Equipável", EQUIPAVEL,
                    0, 0, 0, 15, MAO_SECUNDARIA);

    public static final Item ESPADA_BASICA =
            new Item("Espada Enferrujada", "Aumenta +2 de Força", EQUIPAVEL,
                    0, 0, 2, 0, MAO);

    public static final Item ESPADA_RARA =
            new Item("Espada Rara", "Aumenta +10 de Força", EQUIPAVEL,
                    0, 0, 10, 0, MAO);

    public static final Item ESPADA_LENDARIA =
            new Item("Espada Lendária", "Aumenta +15 de Força", EQUIPAVEL,
                    0, 0, 15, 0, MAO);

    public static final Item CHAVE_ANTIGA =
            new Item("Chave Antiga", "Pode abrir portas", MISSAO,
                    0, 0, 0, 0, NENHUM);


    private static final List<Item> ITENS_COMUNS = new ArrayList<>();

    static {
        ITENS_COMUNS.add(POCAO_VIDA);
        ITENS_COMUNS.add(ANEL_MAGICO);
        ITENS_COMUNS.add(COLAR_MAGICO);
        ITENS_COMUNS.add(CAPA);
        ITENS_COMUNS.add(CAPACETE_BRONZE);
        ITENS_COMUNS.add(CAPACETE_OURO);
        ITENS_COMUNS.add(POCAO_MANA);
        ITENS_COMUNS.add(ARMADURA_MALHA);
        ITENS_COMUNS.add(ARMADURA_PESADA);
        ITENS_COMUNS.add(ESCUDO);
        ITENS_COMUNS.add(ESPADA_BASICA);
        ITENS_COMUNS.add(ESPADA_RARA);
        ITENS_COMUNS.add(ESPADA_LENDARIA);
        ITENS_COMUNS.add(CHAVE_ANTIGA);

    }

    public static Item getRandomCommonItem() {
        Random rng = new Random();
        int index = rng.nextInt(ITENS_COMUNS.size());
        return ITENS_COMUNS.get(index);
    }

    public static List<Item> catalogo() {
        return Collections.unmodifiableList(ITENS_COMUNS);
    }
}
