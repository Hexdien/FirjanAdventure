package com.firjanadventure.firjanadventure.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.modelo.Item;
import com.firjanadventure.firjanadventure.service.ItemService;

@RestController
@RequestMapping("/api/inventario")

public class ItemController {

  private final ItemService service;

  public ItemController(ItemService service) {
    this.service = service;
  }

  @GetMapping
  public List<Item> listar() {
    return service.listar();
  }

  @PostMapping
  public Item criar(@RequestBody Item item) {
    return service.adicionar(item);
  }

  @DeleteMapping("/{id}")
  public void deletar(@PathVariable Long id) {
    service.deletar(id);
  }

}
