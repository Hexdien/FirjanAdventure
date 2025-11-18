package com.firjanadventure.firjanadventure.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firjanadventure.firjanadventure.domain.util.AttrRules;
import com.firjanadventure.firjanadventure.domain.util.JacksonUtils;
import com.firjanadventure.firjanadventure.exception.NotFoundException;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.AtualizarEstadoPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.CriarPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.PersonagemResponseDTO;

@Service
public class PersonagemService {

  private final PersonagemRepository repo;
  // private final JacksonUtils jackUtils;

  public PersonagemService(PersonagemRepository repo, JacksonUtils jackUtils) {
    this.repo = repo;
    // this.jackUtils = jackUtils;
  }

  // Criação personagem
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
          "level", 99,
          "hpMax", 100,
          "hp", 100,
          "mp", 50,
          "forca", 1, // TODO: Configurar os padroes de status posteriormente
          "defesa", 0,
          "xp", 0,
          "statPoints", 99,
          "mapZ", 1);
    }
    p.setAtributosJson(JacksonUtils.toJson(attrs));
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
            JacksonUtils.fromJson(p.getAtributosJson()),
            p.getAtualizadoEm()))
        .collect(Collectors.toList());
  }

  // TODO: Atualizar método para trabalhar apenas com JacksonUtils e seus métodos
  @Transactional
  public Personagem atualizarEstado(Long id, AtualizarEstadoPersonagemDTO dto) {
    Personagem p = repo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Personagem não encontrado: " + id));

    // 1) Atualizar posição
    if (dto.getPosX() != null)
      p.setPosX(dto.getPosX());
    if (dto.getPosY() != null)
      p.setPosY(dto.getPosY());

    // 2) Atributos atuais do personagem
    Map<String, Object> atuais = JacksonUtils.fromJson(p.getAtributosJson());

    // 3) Novos atributos vindos do DTO
    Map<String, Object> novos = dto.getAtributos() == null ? Map.of() : dto.getAtributos();

    // 4) Merge simples: atributos novos sobrescrevem os antigos
    Map<String, Object> merged = new HashMap<>(atuais);
    merged.putAll(novos);

    // 5) Aplicar regras definidas em AttrRules
    aplicarRegrasDeAtributos(merged);

    // 6) Serializar e salvar
    p.setAtributosJson(JacksonUtils.toJson(merged));
    p.setAtualizadoEm(Instant.now());

    return repo.save(p);
  }

  private PersonagemResponseDTO toResponse(Personagem p) {
    return new PersonagemResponseDTO(
        p.getId(),
        p.getNome(),
        p.getSexo(),
        p.getPosX(),
        p.getPosY(),
        JacksonUtils.fromJson(p.getAtributosJson()),
        p.getAtualizadoEm());
  }

  private void aplicarRegrasDeAtributos(Map<String, Object> attrs) {

    for (Map.Entry<String, UnaryOperator<Integer>> e : AttrRules.INT_RULES.entrySet()) {

      String key = e.getKey();
      UnaryOperator<Integer> rule = e.getValue();

      // valor atual ou null
      Object rawValue = attrs.get(key);
      Integer coerced = rawValue == null ? null : ((Number) rawValue).intValue();

      // aplica regra (se for null, regra retorna default)
      Integer ajustado = rule.apply(coerced);

      attrs.put(key, ajustado);
    }
  }

}
