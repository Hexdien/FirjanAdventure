// src/main/java/dao/InventarioDAO.java
package dao;

import infra.ConnectionFactory;
import itens.Item;
import itens.ItemTipo;
import itens.Slot;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class InventarioDAO {
    // Gerenciamento de inventario

    //🔎 Leitura & Checks (usam ConnectionFactory internamente)
    // Verifica se existe registro do item no inventário do personagem
    public boolean existeNoInventario(long personagemId, long itemId) {
        final String sql = "SELECT 1 FROM personagem_item WHERE personagem_id=? AND item_id=? LIMIT 1";
        try (var conn = ConnectionFactory.getConnection();
             var ps = conn.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setLong(2, itemId);
            try (var rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao verificar existência no inventário", e);
        }
    }

    // Retorna a quantidade do item (0 se não houver linha)
    public int quantidade(long personagemId, long itemId) {
        final String sql = "SELECT quantidade FROM personagem_item WHERE personagem_id=? AND item_id=?";
        try (var conn = ConnectionFactory.getConnection();
             var ps = conn.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setLong(2, itemId);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt("quantidade");
                return 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao obter quantidade do item no inventário", e);
        }
    }

    // Retorna o slot em que o item está equipado (ou null se não equipado)
    public String equipadoEm(long personagemId, long itemId) {
        final String sql = "SELECT equipado_em FROM personagem_item WHERE personagem_id=? AND item_id=?";
        try (var conn = ConnectionFactory.getConnection();
             var ps = conn.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setLong(2, itemId);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) return rs.getString("equipado_em"); // pode ser null
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao verificar se item está equipado", e);
        }
    }
    // Retorna o item_id que está equipado em um determinado slot (ou null se nenhum)
    public Long itemIdEquipadoNoSlot(long personagemId, String slot) {
        final String sql = "SELECT item_id FROM personagem_item WHERE personagem_id=? AND equipado_em=?";
        try (var conn = ConnectionFactory.getConnection();
             var ps = conn.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setString(2, slot);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) return rs.getLong("item_id");
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar item equipado no slot " + slot, e);
        }
    }
    //✍️ Escrita (recebem Connection para participar da transação)
    // Decrementa a quantidade (NÃO deixa negativa). Assuma que a linha existe.
    // Retorne o número de linhas afetadas para validação no Service (opcional).
        public int decrementarQuantidade(Connection c, long personagemId, long itemId, int qtd) throws SQLException {
            final String sql =
                    "UPDATE personagem_item " +
                            "SET quantidade = CASE WHEN quantidade - ? < 0 THEN 0 ELSE quantidade - ? END " +
                            "WHERE personagem_id=? AND item_id=?";
            try (var ps = c.prepareStatement(sql)) {
                ps.setInt(1, qtd);
                ps.setInt(2, qtd);
                ps.setLong(3, personagemId);
                ps.setLong(4, itemId);
                return ps.executeUpdate();
            }
        }
    // Remove a linha do inventário (tudo). Use quando quantidade chegar a 0 ou ao descartar.
    public int removerItem(Connection c, long personagemId, long itemId) throws SQLException {
        final String sql = "DELETE FROM personagem_item WHERE personagem_id=? AND item_id=?";
        try (var ps = c.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setLong(2, itemId);
            return ps.executeUpdate();
        }
    }
    // Marca item como equipado em um slot (ex.: "MAO", "PEITO"...)
    public int marcarEquipado(Connection c, long personagemId, long itemId, String slot) throws SQLException {
        final String sql = "UPDATE personagem_item SET equipado_em=? WHERE personagem_id=? AND item_id=?";
        try (var ps = c.prepareStatement(sql)) {
            ps.setString(1, slot);
            ps.setLong(2, personagemId);
            ps.setLong(3, itemId);
            return ps.executeUpdate();
        }
    }
    // Remove o "equipado_em" (desequipar)
    public int marcarDesequipado(Connection c, long personagemId, long itemId) throws SQLException {
        final String sql = "UPDATE personagem_item SET equipado_em=NULL WHERE personagem_id=? AND item_id=?";
        try (var ps = c.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            ps.setLong(2, itemId);
            return ps.executeUpdate();
        }
    }

    // Fim do Gerenciamento de inventario

    public void adicionarItem(long personagemId, long itemId, int quantidade) {
        String upsert =
                "MERGE INTO personagem_item AS pi " +
                        "KEY (personagem_id, item_id) " + // H2 aceita KEY na MERGE simplificada
                        "VALUES (?, ?, COALESCE((SELECT quantidade FROM personagem_item WHERE personagem_id=? AND item_id=?), 0) + ? , NULL)";
        // Observação: para manter 'equipado_em' como está, usamos NULL no MERGE básico. Podemos fazer um MERGE mais verboso também.

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(upsert)) {
            int i = 1;
            ps.setLong(i++, personagemId);
            ps.setLong(i++, itemId);
            ps.setLong(i++, personagemId);
            ps.setLong(i++, itemId);
            ps.setInt(i++, quantidade);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao adicionar item ao inventário", e);
        }
    }

    public List<InventarioItemDTO> listar(long personagemId) {
        String sql =
                "SELECT i.id, i.nome, i.descricao, i.tipo, i.bonus_hp, i.bonus_mp, i.bonus_forca, i.bonus_arm, i.slot, " +
                        "       pi.quantidade, pi.equipado_em " +
                        "FROM personagem_item pi " +
                        "JOIN item i ON i.id = pi.item_id " +
                        "WHERE pi.personagem_id = ? " +
                        "ORDER BY i.nome";
        List<InventarioItemDTO> out = new ArrayList<>();
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, personagemId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Item it = new Item();
                    it.setId(rs.getLong("id"));
                    it.setNome(rs.getString("nome"));
                    it.setDescricao(rs.getString("descricao"));
                    it.setTipo(itens.ItemTipo.valueOf(rs.getString("tipo")));
                    it.setBonusHp(rs.getInt("bonus_hp"));
                    it.setBonusMp(rs.getInt("bonus_mp"));
                    it.setBonusForca(rs.getInt("bonus_forca"));
                    it.setBonusArm(rs.getInt("bonus_arm"));
                    String slot = rs.getString("slot");
                    it.setSlot(slot == null ? Slot.NENHUM : Slot.valueOf(slot));

                    int qtd = rs.getInt("quantidade");
                    String equipadoEm = rs.getString("equipado_em");
                    out.add(new InventarioItemDTO(it, qtd, equipadoEm));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar inventário", e);
        }
        return out;
    }

    // DTO simples do inventário
    public static class InventarioItemDTO {
        public final Item item;
        public final int quantidade;
        public final String equipadoEm; // pode ser null

        public InventarioItemDTO(Item item, int quantidade, String equipadoEm) {
            this.item = item;
            this.quantidade = quantidade;
            this.equipadoEm = equipadoEm;
        }
    }
}
