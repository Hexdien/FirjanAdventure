package com.firjanadventure.firjanadventure.modelo;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PersonagemItemId implements Serializable {
    @Column(name = "personagem_id")
    private Long personagemId;

    @Column(name = "item_id")
    private Long itemId;

    public PersonagemItemId() {}

    public PersonagemItemId(Long personagemId, Long itemId) {
        this.personagemId = personagemId;
        this.itemId = itemId;
    }

    // getters/setters

    public Long getPersonagemId() {
        return personagemId;
    }

    public void setPersonagemId(Long personagemId) {
        this.personagemId = personagemId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PersonagemItemId)) return false;
        PersonagemItemId that = (PersonagemItemId) o;
        return Objects.equals(personagemId, that.personagemId) &&
                Objects.equals(itemId, that.itemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(personagemId, itemId);
    }
}