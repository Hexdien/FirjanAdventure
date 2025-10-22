// src/main/java/modelo/Item.java
package itens;

public class Item {
    private Long id;
    private String nome;
    private String descricao;
    private ItemTipo tipo; // "CONSUMIVEL" ou "EQUIPAVEL"
    private int bonusHp;
    private int bonusMp;
    private int bonusForca;
    private int bonusArm;
    private Slot slot = Slot.NENHUM;


    public Item() {}

    // Construtor completo
    public Item(String nome, String descricao, ItemTipo tipo,
                int bonusHp, int bonusMp, int bonusForca, int bonusArm, Slot slot) {
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo;
        this.bonusHp = bonusHp;
        this.bonusMp = bonusMp;
        this.bonusForca = bonusForca;
        this.bonusArm = bonusArm;
        this.slot = slot == null ? Slot.NENHUM : slot;
    }



    public Item(String nome, String descricao, String tipoString, int valor) {
        this.nome = nome;
        this.descricao = descricao;

        String t = tipoString == null ? "" : tipoString.trim().toLowerCase();
        switch (t) {
            case "consumivel":
                this.tipo = ItemTipo.CONSUMIVEL;
                // Heurística simples: Vida -> HP, Mana -> MP
                String lower = (nome + " " + descricao).toLowerCase();
                if (lower.contains("vida"))      this.bonusHp = valor;
                else if (lower.contains("mana")) this.bonusMp = valor;
                else this.bonusHp = valor; // fallback
                this.slot = Slot.NENHUM;
                break;
            case "equipamento":
                this.tipo = ItemTipo.EQUIPAVEL;
                String txt = (nome + " " + descricao).toLowerCase();
                if (txt.contains("armadur") || txt.contains("escudo") || txt.contains("defesa")) {
                    this.bonusArm = valor;
                    this.slot = txt.contains("escudo") ? Slot.MAO_SECUNDARIA : Slot.PEITO;
                } else if (txt.contains("espada") || txt.contains("staff") || txt.contains("livro")) {
                    this.bonusForca = valor;
                    this.slot = Slot.MAO;
                } else {
                    // padrão: força
                    this.bonusForca = valor;
                    this.slot = Slot.MAO;
                }
                break;
            case "missao":
                this.tipo = ItemTipo.MISSAO;
                this.slot = Slot.NENHUM;
                break;
            case "chave":
                this.tipo = ItemTipo.CHAVE;
                this.slot = Slot.NENHUM;
                break;
            default:
                this.tipo = ItemTipo.MISSAO; // fallback neutro
                this.slot = Slot.NENHUM;
        }
    }



    // getters e setters...


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ItemTipo getTipo() {
        return tipo;
    }

    public void setTipo(ItemTipo tipo) {
        this.tipo = tipo;
    }

    public int getBonusHp() {
        return bonusHp;
    }

    public void setBonusHp(int bonusHp) {
        this.bonusHp = bonusHp;
    }

    public int getBonusMp() {
        return bonusMp;
    }

    public void setBonusMp(int bonusMp) {
        this.bonusMp = bonusMp;
    }

    public int getBonusForca() {
        return bonusForca;
    }

    public void setBonusForca(int bonusForca) {
        this.bonusForca = bonusForca;
    }

    public int getBonusArm() {
        return bonusArm;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setBonusArm(int bonusArm) {
        this.bonusArm = bonusArm;
    }

    public Slot getSlot() {
        return slot;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
    }
}
