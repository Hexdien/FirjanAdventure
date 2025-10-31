package com.firjanadventure.firjanadventure.domain.util;

import java.util.Map;
import java.util.function.UnaryOperator;

public final class AttrRules {

  // Regras para atributos inteiros "conhecidos"
  public static final Map<String, UnaryOperator<Integer>> INT_RULES = Map.of(
      "level", v -> Math.max(v != null ? v : 1, 1), // default 1, mínimo 1
      "forca", v -> nonNegativeOrDefault(v, 1), // default 1, >= 0
      "defesa", v -> nonNegativeOrDefault(v, 1), // default 1, >= 0
      "xp", v -> nonNegativeOrDefault(v, 0) // default 0, >= 0
  );

  private static Integer nonNegativeOrDefault(Integer v, int d) {
    int val = (v == null) ? d : v;
    if (val < 0)
      throw new IllegalArgumentException("Atributos não podem ser negativos");
    return val;
  }

  private AttrRules() {
  }
}
