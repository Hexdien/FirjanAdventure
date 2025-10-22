package modelo;

public class Monstro {
	private String nome;
	private int hp;
	private int level;
	private int forca;
	private int exp;

	public Monstro (String nome, int hp, int level, int forca, int exp) {
		this.nome = nome;
		this.hp = hp;
		this.level = level;
		this.forca = forca;
		this.exp = exp;
		
		if (level > 1) {
			int dificuldade = level * 10;
			this.hp = (this.hp * dificuldade) / 100; 
			this.forca = (this.forca * dificuldade) / 100; 
			this.exp = (this.exp * (dificuldade * 2)) / 100; 
			
		}
	}
	
	public void getStatus() {
		System.out.println("O " + nome + " lv "+ level + " possui " + forca + " de força e " + hp + " de hp.");
	}

	public int getExp() {
		return exp;
	}

	public int getHp() {
		return hp;
	}

    public int getLevel() {
        return level;
    }

    public int getForca() {
        return forca;
    }

    public void setHp(int hp) {
		this.hp = hp;
	}

	public void setForca(int forca) {
		this.forca = forca;
	}	

}
