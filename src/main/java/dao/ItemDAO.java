// src/main/java/dao/ItemDAO.java
package dao;

import infra.ConnectionFactory;
import itens.Item;
import itens.ItemTipo;
import itens.Slot;

import java.sql.*;
import java.util.Optional;

public class ItemDAO {

    public Optional<Item> findByNome(String nome) {
        String sql = "SELECT * FROM item WHERE nome = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nome);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(map(rs));
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar item por nome", e);
        }
    }

    public long insert(Item it) {
        String sql = "INSERT INTO item (nome, descricao, tipo, bonus_hp, bonus_mp, bonus_forca, bonus_arm, slot) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            int i = 1;
            ps.setString(i++, it.getNome());
            ps.setString(i++, it.getDescricao());
            ps.setString(i++, it.getTipo().name());
            ps.setInt(i++, it.getBonusHp());
            ps.setInt(i++, it.getBonusMp());
            ps.setInt(i++, it.getBonusForca());
            ps.setInt(i++, it.getBonusArm());
            ps.setString(i++, it.getSlot().name());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    long id = keys.getLong(1);
                    it.setId(id);
                    return id;
                }
            }
            throw new SQLException("Insert de item sem generated key.");
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao inserir item", e);
        }
    }

    public long findOrCreate(Item it) {
        return findByNome(it.getNome())
                .map(existing -> {
                    it.setId(existing.getId());
                    return existing.getId();
                })
                .orElseGet(() -> insert(it));
    }


    public Optional<Item> findById(long id) {
        final String sql = "SELECT * FROM item WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(map(rs));
                }
                return Optional.empty();
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar item por id: " + id, e);
        }
    }


    private Item map(ResultSet rs) throws SQLException {
        Item it = new Item();
        it.setId(rs.getLong("id"));
        it.setNome(rs.getString("nome"));
        it.setDescricao(rs.getString("descricao"));
        it.setTipo(ItemTipo.valueOf(rs.getString("tipo")));
        it.setBonusHp(rs.getInt("bonus_hp"));
        it.setBonusMp(rs.getInt("bonus_mp"));
        it.setBonusForca(rs.getInt("bonus_forca"));
        it.setBonusArm(rs.getInt("bonus_arm"));
        String slot = rs.getString("slot");
        it.setSlot(slot == null ? Slot.NENHUM : Slot.valueOf(slot));
        return it;
    }

    public void seedFromFactoryIfEmpty(java.util.List<itens.Item> catalogo) {
        String countSql = "SELECT COUNT(*) FROM item";
        try (Connection conn = ConnectionFactory.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(countSql)) {
            rs.next();
            if (rs.getInt(1) > 0) return; // já populado
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao verificar tabela item", e);
        }
        for (Item it : catalogo) {
            findOrCreate(it);
        }
    }
}