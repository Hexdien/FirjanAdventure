package com.firjanadventure.firjanadventure.web.controller;

import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.modelo.MonstroFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/encontro")
@CrossOrigin
public class EncontroController {

    @GetMapping("/verificar")
    public Object verificarEncontro(@RequestParam int levelJogador) {
        if (MonstroFactory.deveAcontecerEncontro()) {
            Monstro monstro = MonstroFactory.gerarMonstro(levelJogador);
            return monstro;
        }
        return null;
    }
}
