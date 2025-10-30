package com.firjanadventure.firjanadventure.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.firjanadventure.firjanadventure.exception.NotFoundException;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.AtualizarEstadoPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.CriarPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.PersonagemResponseDTO;
import com.sun.nio.sctp.IllegalUnbindException;

import org.hibernate.validator.internal.engine.groups.DefaultValidationOrder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PersonagemService {

  private final PersonagemRepository repo;
  private final ObjectMapper mapper;

  public PersonagemService(PersonagemRepository repo, ObjectMapper mapper) {
    this.repo = repo;
    this.mapper = mapper;
  }

  // Criação personagem

  // --------- helpers JSON ----------
  private String toJson(Map<String, Object> m) {
    try {
      return mapper.writeValueAsString(m == null ? Map.of() : m);
    } catch (Exception e) {
      throw new RuntimeException("Falha ao serializar atributos", e);
    }
  }

  private Map<String, Object> fromJson(String json) {
    if (json == null || json.isBlank())
      return Map.of();
    try {
      return mapper.readValue(json, new TypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      return Map.of();
    }
  }

  // --------- criação ----------
  @Transactional
  public PersonagemResponseDTO criar(CriarPersonagemDTO dto) {
    Personagem p = new Personagem();
    p.setNome(dto.getNome());
    p.setSexo(dto.getSexo());
    p.setPosX(dto.getPosX());
    p.setPosY(dto.getPosY());
    Map<String, Object> attrs = null;

    if (attrs == null || attrs.isEmpty()) {
      attrs = Map.of(
          "level", 1,
          "hpMax", 100,
          "hp", 100,
          "mp", 50,
          "forca", 0,
          "defesa", 0,
          "xp", 0);
    }
    p.setAtributosJson(toJson(attrs));
    p.setAtualizadoEm(Instant.now());

    p = repo.save(p);
    return toResponse(p);
  }

  // Deletar personagem por ID

  @Transactional
  public void deletarPorId(Long id) {
    if (!repo.existsById(id)) {
      throw new NotFoundException("Personagem não encontrado: " + id);
    }
    repo.deleteById(id);

  }

  // Carregando personagem por ID

  @Transactional(readOnly = true)
  public PersonagemResponseDTO carregarPorId(Long id) {
    Personagem p = repo.findById(id)
        .orElseThrow(() -> new NotFoundException("Personagem não encontrado: " + id));
    return toResponse(p);
  }

  // Carregamento de todos os personagens

  /**
   * 2. Carrega uma lista de todos os personagens.
   * 
   * @return Uma lista de PersonagemResponseDTO.
   */
  @Transactional(readOnly = true)
  public List<PersonagemResponseDTO> carregarTodosPersonagens() {
    return repo.findAll().stream()
        // Mapeia cada Entidade para o DTO de Resposta
        .map(p -> new PersonagemResponseDTO(
            p.getId(),
            p.getNome(),
            p.getSexo(),
            p.getPosX(),
            p.getPosY(),
            fromJson(p.getAtributosJson()),
            p.getAtualizadoEm()))
        .collect(Collectors.toList());
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

  private PersonagemResponseDTO toResponse(Personagem p) {
    return new PersonagemResponseDTO(
        p.getId(),
        p.getNome(),
        p.getSexo(),
        p.getPosX(),
        p.getPosY(),
        fromJson(p.getAtributosJson()),
        p.getAtualizadoEm());
  }

}
