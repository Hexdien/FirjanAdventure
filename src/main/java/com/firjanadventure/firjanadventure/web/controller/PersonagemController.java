package com.firjanadventure.firjanadventure.web.controller;

import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.service.PersonagemService;
import com.firjanadventure.firjanadventure.web.dto.AtualizarEstadoPersonagemDTO;

import jakarta.validation.Valid;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personagens")
public class PersonagemController {

  private final PersonagemService service;

  /*
   * // O Spring injeta automaticamente a implementação do Repository aqui
   * public PersonagemController(PersonagemRepository personagemRepository) {
   * this.personagemRepository = personagemRepository;
   * }
   * 
   * // LISTAR
   * 
   * @GetMapping
   * public List<PersonagemListDTO> listar() {
   * return personagemRepository.findAll().stream()
   * .map(PersonagemListDTO::fromEntity)
   * .toList();
   * }
   * 
   * // CARREGAR
   * 
   * @GetMapping("/{id}")
   * public ResponseEntity<PersonagemDetalheDTO> buscar(@PathVariable Long id) {
   * return personagemRepository.findById(id)
   * .map(PersonagemDetalheDTO::fromEntity)
   * .map(ResponseEntity::ok)
   * .orElse(ResponseEntity.notFound().build());
   * }
   * 
   * // CRIAR PADRÃO
   * 
   * @PostMapping
   * public ResponseEntity<PersonagemDetalheDTO> criarPadrao() {
   * Personagem p = criarPersonagemPadrao();
   * Personagem salvo = personagemRepository.save(p);
   * return ResponseEntity.status(HttpStatus.CREATED)
   * .body(PersonagemDetalheDTO.fromEntity(salvo));
   * }
   * 
   * // APAGAR
   * 
   * @DeleteMapping("/{id}")
   * public ResponseEntity<Void> deletar(@PathVariable Long id) {
   * if (!personagemRepository.existsById(id)) {
   * return ResponseEntity.notFound().build();
   * }
   * personagemRepository.deleteById(id);
   * return ResponseEntity.noContent().build();
   * }
   */
  // Atualizar estado

  public PersonagemController(PersonagemService service) {
    this.service = service;
  }

  @PutMapping("/{id}/estado")
  public ResponseEntity<Personagem> atualizarEstado(
      @PathVariable Long id,
      @Valid @RequestBody AtualizarEstadoPersonagemDTO dto) {
    Personagem atualizado = service.atualizarEstado(id, dto);
    return ResponseEntity.ok(atualizado);
  }

}
