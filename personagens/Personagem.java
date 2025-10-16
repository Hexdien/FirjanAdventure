package personagens;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import Itens.*;
import monstros.Esqueleto;
import monstros.Fantasma;
import monstros.Goblin;
import monstros.Minotauro;

public class Personagem {
	private String nome;
    private String sexo;
    private int level = 1;
    private int hp = 100;
    private int mp = 50;
    private int forca = 20;
    private int arm = 0;
	private int exp = 0;
    private final ArrayList<Item> inventario;
    private Item espadaEquipada;
    private Item armaduraEquipada;
    private Item magiaEquipada;


	public Personagem(String nome, String sexo) {
		this.nome = nome;
		this.sexo = sexo;
        this.inventario = new ArrayList<>();
    }
    public void adicionarItem(Item item) {
        this.inventario.add(item);
        System.out.println(this.nome + " pegou: " + item.getNome());
    }

    public void mostrarInventario() {
        System.out.println("\n--- Inventário de " + this.nome + " ---");
        if (inventario.isEmpty()) {
            System.out.println("Inventário vazio.");
        } else {
            for (int i = 0; i < inventario.size(); i++) {
                // Use i + 1 para mostrar a contagem de 1 em diante
                System.out.println((i + 1) + ". " + inventario.get(i).getNome() +
                        " [" + inventario.get(i).getTipo() + "]");
            }
        }
        System.out.println("-----------------------------------");
    }



    public void ganharExperiencia(int xp) {
        this.exp += xp;
        if (this.exp >= this.level * 100) {
            this.levelUp();
        }
    }

    private void levelUp() {
        this.level++;
        this.forca += 5;
        this.hp += 20;
        this.mp += 10;
        System.out.println(nome + " subiu para o nível " + level + "!");
    }


    public boolean possuiItem(String nomeItem) {
        for (Item item : this.inventario) {
            if (item.getNome().equals(nomeItem)) {
                return true;
            }
        }
        return false;
    }
    public void removerItemPeloNome(String nomeItem) {
        Item itemParaRemover = null;

        // Encontra o item pelo nome (procura a primeira ocorrência)
        for (Item item : this.inventario) {
            if (item.getNome().equals(nomeItem)) {
                itemParaRemover = item;
                break; // Encontrou, pode parar
            }
        }

        // Remove o item se ele foi encontrado
        if (itemParaRemover != null) {
            this.inventario.remove(itemParaRemover);
            System.out.println("🔑 Item consumido: " + nomeItem + " removido do inventário.");
        }
    }


    public void usarItem(Item item){
        if(item == null){
            System.out.println("nenhum item foi selecionado");
            return;
        }

        switch (item.getTipo()){
            case "Consumivel":
                if(item.getNome().toLowerCase().contains("vida")){
                    this.hp += item.getEfeito();
                    System.out.printf("sua vida ❤ foi restaurada em : %d %n ", item.getEfeito());
                }else if(item.getNome().toLowerCase().contains("mana")){
                    this.mp += item.getEfeito();
                    System.out.printf("sua mana✨ foi restaurada em: %d %n ", item.getEfeito());
                }
                this.inventario.remove(item);
                System.out.printf("o item: %s foi removido do seu invetario %n", item.getNome());


            case "Equipamento":
                if(item.getNome().toLowerCase().contains("armadura") ||item.getNome().toLowerCase().contains("escudo")){
                    if (this.armaduraEquipada != null) {
                        // 2. DESEQUIPA a espada antiga: remove o efeito anterior
                        this.arm -= this.armaduraEquipada.getEfeito();
                        System.out.printf("Desequipando %s. Defesa revertida em: %d%n",
                                this.armaduraEquipada.getNome(),
                                this.armaduraEquipada.getEfeito());

                        this.inventario.add(this.armaduraEquipada);
                        // Opcional: Você pode querer devolver a espada antiga para o inventário
                    }

                    // 3. EQUIPA a nova espada: aplica o novo efeito
                    this.arm += item.getEfeito();
                    this.armaduraEquipada = item; // Atualiza o slot equipado
                    this.inventario.remove(item); // Remove do inventário, pois agora está equipada

                    System.out.printf("Equipando %s. Sua defesa aumentada em: %d. Defesa total: %d%n",
                            item.getNome(),
                            item.getEfeito(),
                            this.arm);


                    System.out.printf("sua defesa aumentada em: %d %n", item.getEfeito());
                }else if (item.getNome().toLowerCase().contains("espada")){
                    if (this.espadaEquipada != null) {
                        // 2. DESEQUIPA a espada antiga: remove o efeito anterior
                        this.forca -= this.espadaEquipada.getEfeito();
                        System.out.printf("Desequipando %s. Força revertida em: %d%n",
                                this.espadaEquipada.getNome(),
                                this.espadaEquipada.getEfeito());

                                this.inventario.add(this.espadaEquipada);
                        // Opcional: Você pode querer devolver a espada antiga para o inventário
                    }

                    // 3. EQUIPA a nova espada: aplica o novo efeito
                    this.forca += item.getEfeito();
                    this.espadaEquipada = item; // Atualiza o slot equipado
                    this.inventario.remove(item); // Remove do inventário, pois agora está equipada

                    System.out.printf("Equipando %s. Sua força aumentada em: %d. Força total: %d%n",
                            item.getNome(),
                            item.getEfeito(),
                            this.forca);


                    System.out.printf("sua forca aumentada em: %d %n", item.getEfeito());
                }else if (item.getNome().toLowerCase().contains("magico")){
                    if (this.magiaEquipada != null) {
                        // 2. DESEQUIPA a espada antiga: remove o efeito anterior
                        this.forca -= this.magiaEquipada.getEfeito();
                        System.out.printf("Desequipando %s. Defesa revertida em: %d%n",
                                this.magiaEquipada.getNome(),
                                this.magiaEquipada.getEfeito());

                        this.inventario.add(this.magiaEquipada);
                        // Opcional: Você pode querer devolver a espada antiga para o inventário
                    }

                    // 3. EQUIPA a nova espada: aplica o novo efeito
                    this.forca += item.getEfeito();
                    this.magiaEquipada = item; // Atualiza o slot equipado
                    this.inventario.remove(item); // Remove do inventário, pois agora está equipada

                    System.out.printf("Equipando %s. Sua defesa aumentada em: %d. Defesa total: %d%n",
                            item.getNome(),
                            item.getEfeito(),
                            this.forca);


                    System.out.printf("sua força magica aumentada em: %d %n", item.getEfeito());


                }
                break;

            case "Missao":
                System.out.println("❓ Este item é de missão e não pode ser usado no momento.");
                break;

             default:
                System.out.println("esse item nao tem uso definido");
                break;


        }
    }
    public void gerenciarIventario(Scanner sc){

        while (true){
            this.mostrarInventario();
            if(this.inventario.isEmpty()){
                break;
            }
            System.out.println("Digite o número do item para USAR/EQUIPAR, ou 'S' para sair do inventário:");
            String escolha = sc.nextLine().trim().toLowerCase();

            if (escolha.equals("s")){

                break;
            }

            try {
                int indice = Integer.parseInt(escolha) - 1;

                if (indice >= 0 && indice < this.inventario.size()){
                    Item itemSelecionado = this.inventario.get(indice);
                this.usarItem(itemSelecionado);
                } else {
                    System.out.println("❌ Número de item inválido!");
                }
            }catch (NumberFormatException e){
                System.out.println("❌ Opção inválida, digite um número ou S para sair! ");
            }
        }
    }

    public ArrayList<Item> getInventario() {
        return inventario;
    }

        public String getNome () {
            return nome;
        }
        public void  mostrarStatus() {
            System.out.println("--------------------------------------------------------------------------------------------------------");
             System.out.printf("Seu Level é: %d | Sua vida é de: %d  | Sua mana é de: %d | Sua Força é de: %d | Sua Defesa é de: %d |%n",level, hp, mp, forca, arm);
            System.out.println("--------------------------------------------------------------------------------------------------------");
        }

        public String getSexo () {
            return sexo;
        }

        public int getHp () {
            return hp;
        }

        public void setHp ( int hp){
            this.hp = hp;
        }

        public int getMp () {
            return mp;
        }

        public void setMp ( int mp){
            this.mp = mp;
        }

        public int getForca () {
            return forca;
        }

        public void setForca ( int forca){
            this.forca = forca;
        }

        public int getArm () {
            return arm;
        }

        public void setArm ( int arm){
            this.arm = arm;
        }


        public int getLevel () {
            return level;
        }

        public void setLevel ( int level){
            this.level = level;
        }

        public int getExp () {
            return exp;
        }

        public void setExp ( int exp){
            this.exp = exp;
        }

 }

