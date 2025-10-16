package Itens;


public class Item {
    private String nome;
    private String descricao;
    private String tipo;
    private int efeito;

    public Item(String nome, String descricao, String tipo, int efeito) {
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo;
        this.efeito = efeito;
    }

    // --- Getters ---
    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getTipo() {
        return tipo;
    }

    public int getEfeito() {
        return efeito;
    }

    // Opcional: Um método simples para mostrar o item
    @Override
    public String toString() {
        return nome + " (" + descricao + ") - Efeito: " + efeito;
    }
}