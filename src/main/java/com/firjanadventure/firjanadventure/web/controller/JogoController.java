package com.firjanadventure.firjanadventure.web.controller;

import com.firjanadventure.firjanadventure.web.dto.GameStateDTO;
import com.firjanadventure.firjanadventure.web.dto.MoveRequest;
import com.firjanadventure.firjanadventure.service.GameStateService;
import com.firjanadventure.firjanadventure.web.mapper.GameStateMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/jogo")
public class JogoController {

    private final GameStateService gameStateService;
    private final GameStateMapper mapper;

    public JogoController(GameStateService gameStateService, GameStateMapper mapper) {
        this.gameStateService = gameStateService;
        this.mapper = mapper;
    }

    @PostMapping("/selecionar/{id}")
    public ResponseEntity<GameStateDTO> selecionar(@PathVariable Long id) {
        var estado = gameStateService.selecionar(id);
        return ResponseEntity.ok(mapper.toDTO(estado));
    }

    @PostMapping("/mover")
    public ResponseEntity<GameStateDTO> mover(@RequestBody MoveRequest req) {
        var estado = gameStateService.mover(req.getDx(), req.getDy());
        return ResponseEntity.ok(mapper.toDTO(estado));
    }
}
