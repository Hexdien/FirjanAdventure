package com.firjanadventure.firjanadventure.web.controller;

import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personagens")
public class PersonagemController {

  private final PersonagemRepository personagemRepository;

  // O Spring injeta automaticamente a implementação do Repository aqui
  public PersonagemController(PersonagemRepository personagemRepository) {
    this.personagemRepository = personagemRepository;
  }

  // LISTAR
  @GetMapping
  public List<PersonagemListDTO> listar() {
    return personagemRepository.findAll().stream()
        .map(PersonagemListDTO::fromEntity)
        .toList();
  }

  // CARREGAR
  @GetMapping("/{id}")
  public ResponseEntity<PersonagemDetalheDTO> buscar(@PathVariable Long id) {
    return personagemRepository.findById(id)
        .map(PersonagemDetalheDTO::fromEntity)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // CRIAR PADRÃO
  @PostMapping
  public ResponseEntity<PersonagemDetalheDTO> criarPadrao() {
    Personagem p = criarPersonagemPadrao();
    Personagem salvo = personagemRepository.save(p);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(PersonagemDetalheDTO.fromEntity(salvo));
  }

  // APAGAR
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable Long id) {
    if (!personagemRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    personagemRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // === Fábrica local temporária (mesma lógica do seu
  // GameStateService.criarPadrao()) ===
  private Personagem criarPersonagemPadrao() {
    Personagem p = new Personagem();
    p.setNome("Aventurier");
    p.setSexo("M");
    p.setLevel(1);
    p.setHp(100);
    p.setMp(50);
    p.setForca(10);
    p.setDefesa(2);
    p.setXp(0);
    p.setPosX(0);
    p.setPosY(0);
    return p;
  }

  static class PersonagemListDTO {
    public Long id;
    public String nome;
    public int level;
    public int hp;
    public int mp;

    static PersonagemListDTO fromEntity(Personagem p) {
      var d = new PersonagemListDTO();
      d.id = p.getId();
      d.nome = p.getNome();
      d.level = p.getLevel();
      d.hp = p.getHp(); // <-- adicionados
      d.mp = p.getMp(); // <--
      return d;
    }
  }

  static class PersonagemDetalheDTO {
    public Long id;
    public String nome;
    public String sexo;
    public int level;
    public int hp;
    public int mp;
    public int forca;
    public int defesa;
    public int exp;
    public int posX;
    public int posY;

    static PersonagemDetalheDTO fromEntity(Personagem p) {
      PersonagemDetalheDTO d = new PersonagemDetalheDTO();
      d.id = p.getId();
      d.nome = p.getNome();
      d.sexo = p.getSexo();
      d.level = p.getLevel();
      d.hp = p.getHp();
      d.mp = p.getMp();
      d.forca = p.getForca();
      d.defesa = p.getDefesa();
      d.exp = p.getXp();
      d.posX = p.getPosX();
      d.posY = p.getPosY();
      return d;
    }
  }

}
