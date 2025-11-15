package com.firjanadventure.firjanadventure.web.dto;

import java.util.List;

public record MonsterInstance(

    Long id,
    String tipo, // Id do tample que tambem serve de nome ex:Minotauro
    int level,

    int hpFinal,
    int atkFinal,
    int defFinal,

    List<ItemDTO> itemDrops) {
}
