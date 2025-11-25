package com.firjanadventure.firjanadventure.web.dto;

public record ItemDTO(
    Long id,
    String nome,
    String tipo,
    String slot,
    int quantidade) {
}
