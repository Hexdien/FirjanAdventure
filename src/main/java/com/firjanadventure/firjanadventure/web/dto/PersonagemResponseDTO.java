package com.firjanadventure.firjanadventure.web.dto;

import java.time.Instant;
import java.util.Map;

public record PersonagemResponseDTO(
    Long id,
    String nome,
    String sexo,
    int posX,
    int posY,
    Map<String, Object> atributos,
    Instant atualizadoEm) {
}
