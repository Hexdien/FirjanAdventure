// src/main/java/service/InventarioService.java
package com.firjanadventure.firjanadventure.service;

import com.firjanadventure.firjanadventure.dao.InventarioDAO;
import com.firjanadventure.firjanadventure.dao.ItemDAO;
import com.firjanadventure.firjanadventure.dao.PersonagemDAO;
import com.firjanadventure.firjanadventure.infra.ConnectionFactory;

import com.firjanadventure.firjanadventure.itens.Item;
import com.firjanadventure.firjanadventure.itens.ItemFactory;
import com.firjanadventure.firjanadventure.modelo.Personagem;

import com.firjanadventure.firjanadventure.modelo.enums.Slot;
import com.firjanadventure.firjanadventure.modelo.enums.ItemTipo;

<<<<<<< HEAD

import java.util.Random;

public class InventarioService {
    private final ItemDAO itemDAO;
    private final InventarioDAO inventarioDAO;
    private final Random rng = new Random();

    public InventarioService(ItemDAO itemDAO, InventarioDAO inventarioDAO) {
        this.itemDAO = itemDAO;
        this.inventarioDAO = inventarioDAO;
    }

    private void aplicarBonus(Personagem p, Item it, boolean reverter) {
        int sinal = reverter ? -1 : 1;
        if (it.getBonusForca() != 0) {
            p.setForca(p.getForca() + sinal * it.getBonusForca());
        }
        if (it.getBonusArmadura() != 0) {
            p.setDefesa(p.getArmadura() + sinal * it.getBonusArmadura());
        }
        // Evite modificar HP/MP por equipável (a menos que tenha maxHp/mp definidos)
    }


    public void descartarItem(long personagemId, long itemId, Personagem p) {
        var personagemDAO = new PersonagemDAO();

        try (var c = ConnectionFactory.getConnection()) {
            c.setAutoCommit(false);

            if (!inventarioDAO.existeNoInventario(personagemId, itemId)) {
                // nada a descartar
                c.commit();
                return;
            }

            var opt = itemDAO.findById(itemId);
            if (opt.isEmpty()) throw new IllegalArgumentException("Item inexistente: " + itemId);
            var item = opt.get();

            // Se estiver equipado, desequipa e reverte bônus
            String slotAtual = inventarioDAO.equipadoEm(personagemId, itemId);
            if (slotAtual != null) {
                inventarioDAO.marcarDesequipado(c, personagemId, itemId);
                if (item.getTipo() == ItemTipo.EQUIPAVEL) {
                    aplicarBonus(p, item, true);
                    personagemDAO.update(p);
                }
            }

            inventarioDAO.removerItem(c, personagemId, itemId);

            c.commit();
        } catch (Exception e) {
            try { /* rollback */ } catch (Exception ignore) {}
            throw new RuntimeException("Falha ao descartar item: " + e.getMessage(), e);
        }
    }

    public void desequiparItem(long personagemId, long itemId, Personagem p) {
        var personagemDAO = new PersonagemDAO();

        try (var c = ConnectionFactory.getConnection()) {
            c.setAutoCommit(false);

            var opt = itemDAO.findById(itemId);
            if (opt.isEmpty()) throw new IllegalArgumentException("Item inexistente: " + itemId);
            var item = opt.get();
            if (item.getTipo() != ItemTipo.EQUIPAVEL) {
                throw new IllegalStateException("Item não é equipável.");
            }

            String slotAtual = inventarioDAO.equipadoEm(personagemId, itemId);
            if (slotAtual == null) {
                // idempotente: nada equipado; apenas retorne
                c.commit();
                return;
            }

            inventarioDAO.marcarDesequipado(c, personagemId, itemId);
            aplicarBonus(p, item, true); // reverter bônus
            personagemDAO.update(p);

            c.commit();
        } catch (Exception e) {
            try { /* rollback */ } catch (Exception ignore) {}
            throw new RuntimeException("Falha ao desequipar item: " + e.getMessage(), e);
        }
    }


    public void equiparItem(long personagemId, long itemId, Personagem p) {
        var personagemDAO = new PersonagemDAO();

        try (var c = ConnectionFactory.getConnection()) {
            c.setAutoCommit(false);

            // 1) Carrega item e valida
            var opt = itemDAO.findById(itemId);
            if (opt.isEmpty()) throw new IllegalArgumentException("Item inexistente: " + itemId);
            var item = opt.get();
            if (item.getTipo() != ItemTipo.EQUIPAVEL) {
                throw new IllegalStateException("Item não é equipável.");
            }
            if (!inventarioDAO.existeNoInventario(personagemId, itemId)) {
                throw new IllegalStateException("Item não está no inventário do personagem.");
            }
            Slot slot = item.getSlot();
            if (slot == null || slot == Slot.NENHUM) {
                throw new IllegalStateException("Item equipável sem slot definido.");
            }

            // 2) Se existe algo no mesmo slot, desequipe e reverta bônus
            Long antigoId = inventarioDAO.itemIdEquipadoNoSlot(personagemId, slot.name());
            if (antigoId != null && !antigoId.equals(itemId)) {
                var antigoOpt = itemDAO.findById(antigoId);
                if (antigoOpt.isPresent()) {
                    var antigo = antigoOpt.get();
                    inventarioDAO.marcarDesequipado(c, personagemId, antigoId);
                    aplicarBonus(p, antigo, true);   // reverter
                }
            }

            // 3) Marca equipado o novo item e aplica bônus
            inventarioDAO.marcarEquipado(c, personagemId, itemId, slot.name());
            aplicarBonus(p, item, false);            // aplicar
            personagemDAO.update(p);

            c.commit();
        } catch (Exception e) {
            try { /* rollback seguro */ } catch (Exception ignore) {}
            throw new RuntimeException("Falha ao equipar item: " + e.getMessage(), e);
        }
    }


    public void consumirItem(long personagemId, long itemId, Personagem p) {
        var personagemDAO = new PersonagemDAO();

        try (var c = ConnectionFactory.getConnection()) {
            c.setAutoCommit(false);

            // 1) Carrega o item (para saber tipo/bonus)
            var opt = itemDAO.findById(itemId); // se não tiver esse método, crie no ItemDAO
            if (opt.isEmpty()) throw new IllegalArgumentException("Item inexistente: " + itemId);
            var item = opt.get();
            if (item.getTipo() != ItemTipo.CONSUMIVEL) {
                throw new IllegalStateException("Item não é consumível.");
            }

            // 2) Verifica quantidade
            int qtd = inventarioDAO.quantidade(personagemId, itemId);
            if (qtd <= 0) throw new IllegalStateException("Item sem quantidade disponível.");

            // 3) Aplica efeitos
            p.setHp(p.getHp() + item.getHpDelta());
            p.setMp(p.getMp() + item.getMpDelta());
            // TODO (futuro): limitar por hp_max/mp_max quando existir
            // 4) Persiste personagem e inventário
            personagemDAO.update(p);
            inventarioDAO.decrementarQuantidade(c, personagemId, itemId, 1);
            if (qtd - 1 == 0) {
                inventarioDAO.removerItem(c, personagemId, itemId);
            }

            c.commit();
        } catch (Exception e) {
            // rollback silencioso
            //noinspection EmptyCatchBlock
            try { /* c is effectively final */ } catch (Exception ignore) {}
            throw new RuntimeException("Falha ao consumir item: " + e.getMessage(), e);
        }
    }


    /** Sorteia 1 item comum da factory, garante que existe no catálogo (DB) e adiciona ao inventário do personagem. */
    public Item dropAleatorioEAdicionar(long personagemId) {
        Item sorteado = ItemFactory.getRandomCommonItem();
        long itemId = itemDAO.findOrCreate(sorteado);
        inventarioDAO.adicionarItem(personagemId, itemId, 1);
        return sorteado;
    }

    public java.util.List<InventarioDAO.InventarioItemDTO> listar(long personagemId) {
        return inventarioDAO.listar(personagemId);
    }
}
=======
import java.util.Random;

public class InventarioService {
  private final ItemDAO itemDAO;
  private final InventarioDAO inventarioDAO;
  private final Random rng = new Random();

  public InventarioService(ItemDAO itemDAO, InventarioDAO inventarioDAO) {
    this.itemDAO = itemDAO;
    this.inventarioDAO = inventarioDAO;
  }

  private void aplicarBonus(Personagem p, Item it, boolean reverter) {
    int sinal = reverter ? -1 : 1;
    if (it.getBonusForca() != 0) {
      p.setForca(p.getForca() + sinal * it.getBonusForca());
    }
    if (it.getBonusArmadura() != 0) {
      p.setDefesa(p.getDefesa() + sinal * it.getBonusArmadura());
    }
    // Evite modificar HP/MP por equipável (a menos que tenha maxHp/mp definidos)
  }

  public void descartarItem(long personagemId, long itemId, Personagem p) {
    var personagemDAO = new PersonagemDAO();

    try (var c = ConnectionFactory.getConnection()) {
      c.setAutoCommit(false);

      if (!inventarioDAO.existeNoInventario(personagemId, itemId)) {
        // nada a descartar
        c.commit();
        return;
      }

      var opt = itemDAO.findById(itemId);
      if (opt.isEmpty())
        throw new IllegalArgumentException("Item inexistente: " + itemId);
      var item = opt.get();

      // Se estiver equipado, desequipa e reverte bônus
      String slotAtual = inventarioDAO.equipadoEm(personagemId, itemId);
      if (slotAtual != null) {
        inventarioDAO.marcarDesequipado(c, personagemId, itemId);
        if (item.getTipo() == ItemTipo.EQUIPAVEL) {
          aplicarBonus(p, item, true);
          personagemDAO.update(p);
        }
      }

      inventarioDAO.removerItem(c, personagemId, itemId);

      c.commit();
    } catch (Exception e) {
      try {
        /* rollback */ } catch (Exception ignore) {
      }
      throw new RuntimeException("Falha ao descartar item: " + e.getMessage(), e);
    }
  }

  public void desequiparItem(long personagemId, long itemId, Personagem p) {
    var personagemDAO = new PersonagemDAO();

    try (var c = ConnectionFactory.getConnection()) {
      c.setAutoCommit(false);

      var opt = itemDAO.findById(itemId);
      if (opt.isEmpty())
        throw new IllegalArgumentException("Item inexistente: " + itemId);
      var item = opt.get();
      if (item.getTipo() != ItemTipo.EQUIPAVEL) {
        throw new IllegalStateException("Item não é equipável.");
      }

      String slotAtual = inventarioDAO.equipadoEm(personagemId, itemId);
      if (slotAtual == null) {
        // idempotente: nada equipado; apenas retorne
        c.commit();
        return;
      }

      inventarioDAO.marcarDesequipado(c, personagemId, itemId);
      aplicarBonus(p, item, true); // reverter bônus
      personagemDAO.update(p);

      c.commit();
    } catch (Exception e) {
      try {
        /* rollback */ } catch (Exception ignore) {
      }
      throw new RuntimeException("Falha ao desequipar item: " + e.getMessage(), e);
    }
  }

  public void equiparItem(long personagemId, long itemId, Personagem p) {
    var personagemDAO = new PersonagemDAO();

    try (var c = ConnectionFactory.getConnection()) {
      c.setAutoCommit(false);

      // 1) Carrega item e valida
      var opt = itemDAO.findById(itemId);
      if (opt.isEmpty())
        throw new IllegalArgumentException("Item inexistente: " + itemId);
      var item = opt.get();
      if (item.getTipo() != ItemTipo.EQUIPAVEL) {
        throw new IllegalStateException("Item não é equipável.");
      }
      if (!inventarioDAO.existeNoInventario(personagemId, itemId)) {
        throw new IllegalStateException("Item não está no inventário do personagem.");
      }
      Slot slot = item.getSlot();
      if (slot == null || slot == Slot.NENHUM) {
        throw new IllegalStateException("Item equipável sem slot definido.");
      }

      // 2) Se existe algo no mesmo slot, desequipe e reverta bônus
      Long antigoId = inventarioDAO.itemIdEquipadoNoSlot(personagemId, slot.name());
      if (antigoId != null && !antigoId.equals(itemId)) {
        var antigoOpt = itemDAO.findById(antigoId);
        if (antigoOpt.isPresent()) {
          var antigo = antigoOpt.get();
          inventarioDAO.marcarDesequipado(c, personagemId, antigoId);
          aplicarBonus(p, antigo, true); // reverter
        }
      }

      // 3) Marca equipado o novo item e aplica bônus
      inventarioDAO.marcarEquipado(c, personagemId, itemId, slot.name());
      aplicarBonus(p, item, false); // aplicar
      personagemDAO.update(p);

      c.commit();
    } catch (Exception e) {
      try {
        /* rollback seguro */ } catch (Exception ignore) {
      }
      throw new RuntimeException("Falha ao equipar item: " + e.getMessage(), e);
    }
  }

  public void consumirItem(long personagemId, long itemId, Personagem p) {
    var personagemDAO = new PersonagemDAO();

    try (var c = ConnectionFactory.getConnection()) {
      c.setAutoCommit(false);

      // 1) Carrega o item (para saber tipo/bonus)
      var opt = itemDAO.findById(itemId); // se não tiver esse método, crie no ItemDAO
      if (opt.isEmpty())
        throw new IllegalArgumentException("Item inexistente: " + itemId);
      var item = opt.get();
      if (item.getTipo() != ItemTipo.CONSUMIVEL) {
        throw new IllegalStateException("Item não é consumível.");
      }

      // 2) Verifica quantidade
      int qtd = inventarioDAO.quantidade(personagemId, itemId);
      if (qtd <= 0)
        throw new IllegalStateException("Item sem quantidade disponível.");

      // 3) Aplica efeitos
      p.setHp(p.getHp() + item.getHpDelta());
      p.setMp(p.getMp() + item.getMpDelta());
      // TODO (futuro): limitar por hp_max/mp_max quando existir
      // 4) Persiste personagem e inventário
      personagemDAO.update(p);
      inventarioDAO.decrementarQuantidade(c, personagemId, itemId, 1);
      if (qtd - 1 == 0) {
        inventarioDAO.removerItem(c, personagemId, itemId);
      }

      c.commit();
    } catch (Exception e) {
      // rollback silencioso
      // noinspection EmptyCatchBlock
      try {
        /* c is effectively final */ } catch (Exception ignore) {
      }
      throw new RuntimeException("Falha ao consumir item: " + e.getMessage(), e);
    }
  }

  /**
   * Sorteia 1 item comum da factory, garante que existe no catálogo (DB) e
   * adiciona ao inventário do personagem.
   */
  public Item dropAleatorioEAdicionar(long personagemId) {
    Item sorteado = ItemFactory.getRandomCommonItem();
    long itemId = itemDAO.findOrCreate(sorteado);
    inventarioDAO.adicionarItem(personagemId, itemId, 1);
    return sorteado;
  }

  public java.util.List<InventarioDAO.InventarioItemDTO> listar(long personagemId) {
    return inventarioDAO.listar(personagemId);
  }
}
>>>>>>> feat/login
