package com.firjanadventure.firjanadventure.web.dto;

public class PersonagemView {
    private Long id;
    private String nome;
    private int hp;
    private int mp;
    private int level;
    private int exp; // ou xp, conforme seu modelo
    private int forca;
    private int defesa; // se sua entidade usa "armadura", adapte no mapeamento
    private int posX;
    private int posY;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }

    public int getMp() { return mp; }
    public void setMp(int mp) { this.mp = mp; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getExp() { return exp; }
    public void setExp(int exp) { this.exp = exp; }

    public int getForca() { return forca; }
    public void setForca(int forca) { this.forca = forca; }

    public int getDefesa() { return defesa; }
    public void setDefesa(int defesa) { this.defesa = defesa; }

    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }

    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }
}