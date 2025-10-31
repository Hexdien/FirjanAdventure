package com.firjanadventure.firjanadventure.exception;

/**
 * Exceção de domínio para recursos não encontrados.
 * Lançada na camada de serviço quando um ID não existe.
 */
public class NotFoundException extends RuntimeException {
  public NotFoundException(String message) {
    super(message);
  }
}
