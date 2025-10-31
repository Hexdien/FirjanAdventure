
package com.firjanadventure.firjanadventure.domain.util;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

public final class JsonAttrUtils {

  private JsonAttrUtils() {
  }

  @SuppressWarnings("unchecked")
  public static Map<String, Object> readJsonAttrsOrEmpty(String json, ObjectMapper mapper) {
    if (json == null || json.isBlank())
      return new LinkedHashMap<>();
    try {
      return mapper.readValue(json, LinkedHashMap.class);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao desserializar atributos existentes do Personagem", e);
    }
  }

  public static Integer coerceToInt(Object value) {
    if (value == null)
      return null;
    if (value instanceof Integer i)
      return i;
    if (value instanceof Long l)
      return Math.toIntExact(l);
    if (value instanceof Double d)
      return (int) Math.round(d);
    if (value instanceof Float f)
      return Math.round(f);
    if (value instanceof String s) {
      if (s.isBlank())
        return null;
      return Integer.parseInt(s.trim());
    }
    throw new IllegalArgumentException("Valor numérico inválido: " + value);
  }

  public static Map<String, Object> copyOrEmpty(Map<String, Object> src) {
    return Optional.ofNullable(src).map(HashMap::new).orElseGet(HashMap::new);
  }

  /**
   * Merge superficial (shallow). Se precisar de nested, me avisa que te passo o
   * deep-merge.
   */
  public static Map<String, Object> shallowMerge(Map<String, Object> base, Map<String, Object> incoming) {
    Map<String, Object> merged = new LinkedHashMap<>(Optional.ofNullable(base).orElseGet(LinkedHashMap::new));
    if (incoming != null) {
      merged.putAll(incoming);
    }
    return merged;
  }
}
