package com.firjanadventure.firjanadventure.web.controller;

import com.firjanadventure.firjanadventure.service.PersonagemService;
import com.firjanadventure.firjanadventure.web.dto.AtualizarEstadoPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.CriarPersonagemDTO;
import com.firjanadventure.firjanadventure.web.dto.PersonagemResponseDTO;

import jakarta.validation.Valid;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personagens")
public class PersonagemController {

  private final PersonagemService service;

  // Carregamento de personagem autor: Pedro

  @GetMapping
  public ResponseEntity<List<PersonagemResponseDTO>> carregarTodosPersonagens() {
    List<PersonagemResponseDTO> personagens = service.carregarTodosPersonagens();

    return ResponseEntity.ok(personagens); // Status 200 OK
  }

  // Carregando por id autor: Daniel
  @GetMapping("/{id}")
  public ResponseEntity<PersonagemResponseDTO> carregarPorId(@Valid @PathVariable Long id) {
    PersonagemResponseDTO personagem = service.carregarPorId(id);

    return ResponseEntity.ok(personagem); // Status 200 OK
  }

  // Criar personagem autor: Henrique

  @PostMapping
  public ResponseEntity<PersonagemResponseDTO> criar(@Valid @RequestBody CriarPersonagemDTO dto) {
    var created = service.criar(dto);
    return ResponseEntity.status(201).body(created);
  }

  // Deletar personagem autor: Marco

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable Long id) {
    service.deletarPorId(id);
    return ResponseEntity.noContent().build();
  }

  // Atualizar estado*/

  public PersonagemController(PersonagemService service) {
    this.service = service;
  }

  @PutMapping("/{id}/estado")
  public ResponseEntity<Void> atualizarEstado(
      @PathVariable Long id,
      @Valid @RequestBody AtualizarEstadoPersonagemDTO dto) {
    service.atualizarEstado(id, dto);
    return ResponseEntity.noContent().build();
  }

}
