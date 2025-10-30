package com.firjanadventure.firjanadventure.modelo;

import com.firjanadventure.firjanadventure.itens.Item;
import jakarta.persistence.*;
import com.firjanadventure.firjanadventure.modelo.enums.Slot;

@Entity
@Table(name = "personagem_item")
public class PersonagemItem {

    @EmbeddedId
    private PersonagemItemId id;

    @MapsId("personagemId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personagem_id")
    private Personagem personagem;

    @MapsId("itemId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    private int quantidade;

    @Enumerated(EnumType.STRING)
    @Column(name = "equipado_em")
    private Slot equipadoEm; // null quando não equipado

    // getters/setters


    public PersonagemItemId getId() {
        return id;
    }

    public void setId(PersonagemItemId id) {
        this.id = id;
    }

    public Personagem getPersonagem() {
        return personagem;
    }

    public void setPersonagem(Personagem personagem) {
        this.personagem = personagem;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public Slot getEquipadoEm() {
        return equipadoEm;
    }

    public void setEquipadoEm(Slot equipadoEm) {
        this.equipadoEm = equipadoEm;
    }

    public boolean estaEquipado() {
        return this.equipadoEm != null;
    }
}