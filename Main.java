
import caminho.caminhar;
import personagens.*;
import validacoes.*;

import java.util.Scanner;


public class Main {
     public static void main(String[] args) {

        boolean nomeCerto = false;
        validador validador = new validador();
        Scanner sc = new Scanner(System.in);
        String nome = "";



        while(!nomeCerto){

            System.out.print("Digite o nome do seu personagem: ");
            String nomeDigitado = sc.nextLine();
            nomeCerto = validador.validaNome(nomeDigitado);

            if(nomeCerto){
                nome = nomeDigitado;
            }


            System.out.println(nome);

        }
        Personagem p = new Personagem(nome, "M");
            caminhar caminhar = new caminhar();
            caminhar.caminho(p);
            //sc.close();

        //Digitar.Digitar("Seja bem vindo Sr " + nome + "!\n", 50);
        //Digitar.Digitar("Você esta entrando em uma jornada sem volta.\n", 50);
        //Digitar.Digitar("A sua frente você vê um castelo gigantesco e sombrio.\n", 50);
        //Digitar.Digitar("Ao entrar você percebe um caminho largo \n repleto de monstro até uma porta dourada no fim da sala.\n", 100);







    }
}

