package validacoes;

public class validador {
    public boolean validaNome (String nome){

        if (nome == null || nome.isEmpty()){
            System.out.println("O nome não pode estar vazio.");
            return false;
        }

        if (nome.length() < 5) {
            System.out.println("O nome deve ter pelo menos 5 caracteres.");
            return false;
        }

        if (nome.matches(".*\\d.*")) { // Expressão regular: contém número
            System.out.println("O Nome não pode conter números.");
            return false;
        }

        return true;

    }
}
