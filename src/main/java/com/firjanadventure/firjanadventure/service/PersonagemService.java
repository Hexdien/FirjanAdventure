package com.firjanadventure.firjanadventure.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.AtualizarEstadoPersonagemDTO;
import com.sun.nio.sctp.IllegalUnbindException;

import org.hibernate.validator.internal.engine.groups.DefaultValidationOrder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
public class PersonagemService {

  private final PersonagemRepository repo;
  private final ObjectMapper mapper;

  public PersonagemService(PersonagemRepository repo, ObjectMapper mapper) {
    this.repo = repo;
    this.mapper = mapper;
  }

  @Transactional
  public Personagem atualizarEstado(Long id, AtualizarEstadoPersonagemDTO dto) {
    Personagem p = repo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Personagem não encontrado: " + id));

    // 1) Atualizar posição
    p.setPosX(dto.getPosX());
    p.setPosY(dto.getPosY());

    // 2) Validar atributos mínimos
    Map<String, Object> attrs = dto.getAtributos();
    int level = getInt(attrs, "level", 1);
    int forca = getInt(attrs, "forca", 1);
    int defesa = getInt(attrs, "defesa", 1);
    int xp = getInt(attrs, "xp", 1);

    if (level < 1)
      level = 1;
    if (forca < 0 || defesa < 0 || xp < 0) {
      throw new IllegalArgumentException("Atributos não podem ser negativos");

    }

    attrs.put("level", level);
    attrs.put("forca", forca);
    attrs.put("defesa", defesa);
    attrs.put("xp", xp);

    try {
      p.setAtributosJson(mapper.writeValueAsString(dto.getAtributos()));
    } catch (Exception e) {
      throw new RuntimeException("Erro ao serializar JSON do estado", e);
    }

    p.setAtualizadoEm(Instant.now());
    return repo.save(p);
  }

  private int getInt(Map<String, Object> m, String key, int defaultValue) {
    Object v = m.get(key);
    if (v == null)
      return defaultValue;
    if (v instanceof Number n)
      return n.intValue();
    try {
      return Integer.parseInt(v.toString());
    } catch (

    Exception e) {
      return defaultValue;
    }
  }

  public Map<String, Object> parseAtributos(String json) {
    if (json == null || json.isBlank())
      return Map.of();
    try {
      return mapper.readValue(json, new TypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      return Map.of();
    }

  }
}
