package com.firjanadventure.firjanadventure.web.dto;

/** Requisição para mover o personagem na grade. */
public class MoveRequest {
    private int dx;
    private int dy;

    public MoveRequest() {}
    public MoveRequest(int dx, int dy) { this.dx = dx; this.dy = dy; }

    public int getDx() { return dx; }
    public void setDx(int dx) { this.dx = dx; }

    public int getDy() { return dy; }
    public void setDy(int dy) { this.dy = dy; }
}