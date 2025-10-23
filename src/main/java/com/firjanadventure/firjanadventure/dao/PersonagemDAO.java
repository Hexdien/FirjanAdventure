// src/main/java/dao/PersonagemDAO.java
package com.firjanadventure.firjanadventure.dao;

import com.firjanadventure.firjanadventure.infra.ConnectionFactory;
import com.firjanadventure.firjanadventure.modelo.Personagem;

import java.sql.*;
import java.util.Optional;

public class PersonagemDAO {

    public Optional<Personagem> findFirst() {
        String sql = "SELECT * FROM personagem ORDER BY id LIMIT 1";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(map(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar personagem", e);
        }
    }

    public void save(Personagem p) {
        String sql = "INSERT INTO personagem (nome, sexo, level, hp, mp, forca, arm, exp, pos_x, pos_y) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            int i = 1;
            ps.setString(i++, p.getNome());
            ps.setString(i++, p.getSexo());
            ps.setInt(i++, p.getLevel());
            ps.setInt(i++, p.getHp());
            ps.setInt(i++, p.getMp());
            ps.setInt(i++, p.getForca());
            ps.setInt(i++, p.getArmadura());
            ps.setInt(i++, p.getXp());
            ps.setInt(i++, p.getPosX());
            ps.setInt(i++, p.getPosY());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) p.setId(keys.getLong(1));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao salvar personagem", e);
        }
    }

    public void update( Personagem p) {
        if (p.getId() == null) throw new IllegalStateException("Personagem sem ID.");
        String sql = "UPDATE personagem SET nome=?, sexo=?, level=?, hp=?, mp=?, forca=?, arm=?, exp=?, pos_x=?, pos_y=?, updated_at=CURRENT_TIMESTAMP WHERE id=?";
        try (   Connection conn = ConnectionFactory.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            int i = 1;
            ps.setString(i++, p.getNome());
            ps.setString(i++, p.getSexo());
            ps.setInt(i++, p.getLevel());
            ps.setInt(i++, p.getHp());
            ps.setInt(i++, p.getMp());
            ps.setInt(i++, p.getForca());
            ps.setInt(i++, p.getArmadura());
            ps.setInt(i++, p.getXp());
            ps.setInt(i++, p.getPosX());
            ps.setInt(i++, p.getPosY());
            ps.setLong(i++, p.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar personagem", e);
        }
    }

    private Personagem map(ResultSet rs) throws SQLException {
        Personagem p = new Personagem();
        p.setId(rs.getLong("id"));
        p.setNome(rs.getString("nome"));
        p.setSexo(rs.getString("sexo"));
        p.setLevel(rs.getInt("level"));
        p.setHp(rs.getInt("hp"));
        p.setMp(rs.getInt("mp"));
        p.setForca(rs.getInt("forca"));
        p.setDefesa(rs.getInt("arm"));
        p.setXp(rs.getInt("exp"));
        p.setPosX(rs.getInt("pos_x"));
        p.setPosY(rs.getInt("pos_y"));
        return p;
    }
}
