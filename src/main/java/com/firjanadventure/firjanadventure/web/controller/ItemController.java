package com.firjanadventure.firjanadventure.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.modelo.Item;
import com.firjanadventure.firjanadventure.service.ItemService;
import com.firjanadventure.firjanadventure.web.dto.ItemDTO;

@RestController
@RequestMapping("/api/inventario")

public class ItemController {

  private final ItemService service;

  public ItemController(ItemService service) {
    this.service = service;
  }

  @GetMapping("/{personId}")
  public List<ItemDTO> listarTodos(@PathVariable Long personId) {
    return service.carregarTodosItens(personId);
  }

  @PostMapping("/{personId}")

  public ItemDTO criar(@PathVariable Long personId, @RequestBody Item item) {
    Item novoItem = service.adicionarItem(personId, item);
    return new ItemDTO(novoItem.getId(), novoItem.getNome(), novoItem.getTipo(), novoItem.getQuantidade());
  }

  @DeleteMapping("/{personId}/itens/{itemId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletar(@PathVariable Long personId, @PathVariable Long itemId) {
    service.deletarItem(personId, itemId);
  }

}
