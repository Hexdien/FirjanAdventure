package com.firjanadventure.firjanadventure.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firjanadventure.firjanadventure.exception.NotFoundException;
import com.firjanadventure.firjanadventure.modelo.Item;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.ItemRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.ItemDTO;

@Service
public class ItemService {

  private final ItemRepository itemRepo;
  private final PersonagemRepository personRepo;

  public ItemService(ItemRepository repo, PersonagemRepository personRepo) {
    this.itemRepo = repo;
    this.personRepo = personRepo;
  }

  @Transactional(readOnly = true)
  public List<ItemDTO> carregarTodosItens(Long personId) {
    List<Item> item = itemRepo.findByPersonagemId(personId);
    return item.stream()
        .map(itens -> new ItemDTO(
            itens.getId(),
            itens.getNome(),
            itens.getTipo(),
            itens.getQuantidade()))
        .collect(Collectors.toList());

  }

  @Transactional
  public Item adicionarItem(Long personId, Item item) {
    Personagem p = personRepo.findById(personId)
        .orElseThrow(() -> new NotFoundException("Personagem não existe! ID: " + personId));
    item.setPersonagem(p);
    return itemRepo.save(item);
  }

  @Transactional
  public void deletarItem(Long personId, Long itemId) {
    Item item = itemRepo.findById(itemId).orElseThrow(() -> new NotFoundException("Item não existe! ID: " + itemId));

    if (!item.getPersonagem().getId().equals(personId)) {
      throw new IllegalArgumentException("Item não pertence ao personagem informado!");
    }
    itemRepo.delete(item);

  }

}
