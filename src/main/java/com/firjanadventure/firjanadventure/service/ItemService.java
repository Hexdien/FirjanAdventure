package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firjanadventure.firjanadventure.exception.NotFoundException;
import com.firjanadventure.firjanadventure.modelo.Item;
import com.firjanadventure.firjanadventure.repository.ItemRepository;

@Service
public class ItemService {

  private final ItemRepository repo;

  public ItemService(ItemRepository repo) {
    this.repo = repo;
  }

  @Transactional(readOnly = true)
  public List<Item> listar() {
    return repo.findAll();
  }

  public Item adicionar(Item item) {
    return repo.save(item);
  }

  public void deletar(Long id) {
    if (!repo.existsById(id)) {
      throw new NotFoundException("Item com o ID: %d não existe" + id);
    }
    repo.deleteById(id);
  }

}
