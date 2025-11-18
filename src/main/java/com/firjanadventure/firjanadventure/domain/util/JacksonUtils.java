package com.firjanadventure.firjanadventure.domain.util;

import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JacksonUtils {

  private static final ObjectMapper mapper = new ObjectMapper();

  // --------- helpers JSON ----------
  public static String toJson(Map<String, Object> m) {
    try {
      return mapper.writeValueAsString(m == null ? Map.of() : m);
    } catch (Exception e) {
      throw new RuntimeException("Falha ao serializar atributos", e);
    }
  }

  public static Map<String, Object> fromJson(String json) {
    if (json == null || json.isBlank())
      return Map.of();
    try {
      return mapper.readValue(json, new TypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      return Map.of();
    }
  }

}
