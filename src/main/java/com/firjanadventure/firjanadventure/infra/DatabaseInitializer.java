// src/main/java/infra/DatabaseInitializer.java
package com.firjanadventure.firjanadventure.infra;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseInitializer {
    public static void init() {
        String[] ddls = new String[] {
                "CREATE TABLE IF NOT EXISTS personagem (" +
                        "  id IDENTITY PRIMARY KEY," +
                        "  nome VARCHAR(60) NOT NULL," +
                        "  sexo CHAR(1) NOT NULL," +
                        "  level INT NOT NULL," +
                        "  hp INT NOT NULL," +
                        "  mp INT NOT NULL," +
                        "  forca INT NOT NULL," +
                        "  arm INT NOT NULL," +
                        "  exp INT NOT NULL," +
                        "  pos_x INT NOT NULL DEFAULT 0," +
                        "  pos_y INT NOT NULL DEFAULT 0," +
                        "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")",
                "CREATE TABLE IF NOT EXISTS item (" +
                        "  id IDENTITY PRIMARY KEY," +
                        "  nome VARCHAR(80) NOT NULL," +
                        "  descricao VARCHAR(255),"    +
                        "  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('CONSUMIVEL','EQUIPAVEL','MISSAO','CHAVE'))," +
                        "  bonus_hp INT DEFAULT 0," +
                        "  bonus_mp INT DEFAULT 0," +
                        "  bonus_forca INT DEFAULT 0," +
                        "  bonus_arm INT DEFAULT 0," +
                        "  slot VARCHAR(20)" +
                        ")",
                "CREATE TABLE IF NOT EXISTS personagem_item (" +
                        "  personagem_id BIGINT NOT NULL," +
                        "  item_id BIGINT NOT NULL," +
                        "  quantidade INT NOT NULL DEFAULT 1," +
                        "  equipado_em VARCHAR(20)," +
                        "  PRIMARY KEY (personagem_id, item_id)," +
                        "  FOREIGN KEY (personagem_id) REFERENCES personagem(id) ON DELETE CASCADE," +
                        "  FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE RESTRICT" +
                        ")"
        };

        try (Connection conn = ConnectionFactory.getConnection()) {
            try (Statement st = conn.createStatement()) {
                for (String ddl : ddls) {
                    st.execute(ddl);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Falha ao inicializar o banco H2", e);
        }
    }
}