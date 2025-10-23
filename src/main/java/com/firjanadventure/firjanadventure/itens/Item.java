package com.firjanadventure.firjanadventure.itens;

import jakarta.persistence.*;
import com.firjanadventure.firjanadventure.modelo.enums.ItemTipo;
import com.firjanadventure.firjanadventure.modelo.enums.Slot;

@Entity
@Table(name = "item")
public class Item {


    public Item() {}

    // Construtor completo
    public Item(String nome, String descricao, ItemTipo tipo,
                int hpDelta, int mpDelta, int bonusForca, int bonusArmadura, Slot slot) {
        this.nome = nome;
        this.tipo = tipo;
        this.mpDelta = mpDelta;
        this.hpDelta = hpDelta;
        this.bonusForca = bonusForca;
        this.bonusArmadura = bonusArmadura;
        this.slot = slot == null ? Slot.NENHUM : slot;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private ItemTipo tipo;

    // Para equipáveis
    @Enumerated(EnumType.STRING)
    private Slot slot; // pode ser null para consumíveis

    // Bônus e efeitos: adapte nomes conforme seu schema (se já existirem)
    @Column(name = "bonus_forca")
    private Integer bonusForca;

    @Column(name = "bonus_armadura")
    private Integer bonusArmadura;

    // Para consumíveis
    @Column(name = "hp_delta")
    private Integer hpDelta;

    @Column(name = "mp_delta")
    private Integer mpDelta;

    // getters/setters

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

    public Slot getSlot() {
        return slot;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
    }

    public Integer getBonusForca() {
        return bonusForca;
    }

    public void setBonusForca(Integer bonusForca) {
        this.bonusForca = bonusForca;
    }

    public Integer getBonusArmadura() {
        return bonusArmadura;
    }

    public void setBonusArmadura(Integer bonusArmadura) {
        this.bonusArmadura = bonusArmadura;
    }

    public Integer getHpDelta() {
        return hpDelta;
    }

    public void setHpDelta(Integer hpDelta) {
        this.hpDelta = hpDelta;
    }

    public Integer getMpDelta() {
        return mpDelta;
    }

    public void setMpDelta(Integer mpDelta) {
        this.mpDelta = mpDelta;
    }
}