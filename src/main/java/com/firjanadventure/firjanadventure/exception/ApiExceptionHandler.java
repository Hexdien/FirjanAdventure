package com.firjanadventure.firjanadventure.exception;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
        "timestamp", Instant.now().toString(),
        "status", 404,
        "error", "Not Found",
        "message", ex.getMessage()));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(Map.of(
        "timestamp", Instant.now().toString(),
        "status", 400,
        "error", "Bad Request",
        "message", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    var errors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(
            fe -> fe.getField(),
            fe -> fe.getDefaultMessage() == null ? "invalid" : fe.getDefaultMessage(),
            (a, b) -> a));
    return ResponseEntity.badRequest().body(Map.of(
        "timestamp", Instant.now().toString(),
        "status", 400,
        "error", "Validation Failed",
        "message", "Payload inválido",
        "fields", errors));
  }
}
