// src/main/java/infra/ConnectionFactory.java
package com.firjanadventure.firjanadventure.infra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.io.File;

public class ConnectionFactory {
    // Banco salvo em ./data/firjanadventure.mv.db
    private static final String URL  =
            "jdbc:h2:file:./data/firjanadventure;AUTO_SERVER=TRUE";
    private static final String USER = "sa";
    private static final String PASS = "";

    static {
        File dir = new File("data");
        if (!dir.exists() && !dir.mkdirs()) {
            throw new RuntimeException("Não foi possível criar o diretório ./data.");
        }
        try {
            Class.forName("org.h2.Driver"); // opcional nas versões atuais
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Driver H2 não encontrado no classpath do Maven.", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
