package com.firjanadventure.firjanadventure.web.dto;

/** Estado completo que o front precisa para desenhar a tela. */
public class GameStateDTO {
    private String estado; // "EXPLORACAO" | "BATALHA"
    private PersonagemView personagem;
    private MonstroView monstro; // null quando não estiver em batalha
    private String log; // mensagem curta do último evento

<<<<<<< HEAD
=======
    // GameStateDTO.java (adicione campos)
    private Integer ultimoDx; // null/0 quando não aplicável
    private Integer ultimoDy;



    // getters/setters...


    public Integer getUltimoDx() {
        return ultimoDx;
    }

    public void setUltimoDx(Integer ultimoDx) {
        this.ultimoDx = ultimoDx;
    }

    public Integer getUltimoDy() {
        return ultimoDy;
    }

    public void setUltimoDy(Integer ultimoDy) {
        this.ultimoDy = ultimoDy;
    }

>>>>>>> feat/login
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public PersonagemView getPersonagem() { return personagem; }
    public void setPersonagem(PersonagemView personagem) { this.personagem = personagem; }

    public MonstroView getMonstro() { return monstro; }
    public void setMonstro(MonstroView monstro) { this.monstro = monstro; }

    public String getLog() { return log; }
    public void setLog(String log) { this.log = log; }
}