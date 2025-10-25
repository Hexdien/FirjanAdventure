package com.firjanadventure.firjanadventure.service;

<<<<<<< HEAD
import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
=======
import com.firjanadventure.firjanadventure.modelo.Minotauro;
import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


>>>>>>> feat/login
import java.util.Random;

@Service
public class GameStateService {

    private final PersonagemRepository personagemRepository;
    private final Random rng = new Random();

    private Personagem atual;        // personagem ativo (selecionado pelo usuário)
    private Monstro monstroAtual;    // null se não estiver em batalha
    private Fase faseAtual = Fase.EXPLORACAO;

<<<<<<< HEAD
    public enum Fase { EXPLORACAO, BATALHA }
=======

    public enum Fase { EXPLORACAO, ENCONTRO, BATALHA }

    private int ultimoDx = 0;
    private int ultimoDy = 0;
>>>>>>> feat/login

    // ======== Construtor ========
    public GameStateService(PersonagemRepository personagemRepository) {
        this.personagemRepository = personagemRepository;


        // ===== Opção B: NÃO auto-criar (recomendado p/ página inicial de seleção) =====
        // Deixe 'atual' como null até que o controller chame selecionar(personagemId).
        this.atual = null;
    }

<<<<<<< HEAD
=======
    @Transactional
    public EstadoJogo decidirEncontro(boolean lutar) {
        if (this.faseAtual != Fase.ENCONTRO) return snapshotEstado("Ignorou decisão fora de encontro");
        if (lutar) {
            this.faseAtual = Fase.BATALHA;
            // inicializa combate (combateService.startCombat(personagem, monstroAtual))
        } else {
            this.monstroAtual = null;
            this.faseAtual = Fase.EXPLORACAO;
        }
        // salvar autosave se necessário
        return snapshotEstado("Decisão tomada: " + (lutar ? "Lutar" : "Ignorar"));
    }

    // Decisão do encontro

>>>>>>> feat/login
    // ======== Selecionar personagem ativo (chamado pelo JogoController) ========
    public EstadoJogo selecionar(Long personagemId) {
        Personagem p = personagemRepository.findById(personagemId)
                .orElseThrow(() -> new IllegalArgumentException("Personagem não encontrado: " + personagemId));
        this.atual = p;
        this.monstroAtual = null;
        this.faseAtual = Fase.EXPLORACAO;
        return snapshotEstado("Personagem selecionado: " + p.getNome());
    }

    // ======== Mover por delta (dx, dy) ========
    public EstadoJogo mover(int dx, int dy) {
        garantirPersonagemSelecionado();

        // 1) Aplica deslocamento
        atual.setPosX(atual.getPosX() + dx);
        atual.setPosY(atual.getPosY() + dy);

        // 1.1) (Opcional) Aplicar limites do mapa aqui (clamp). Exemplo:
<<<<<<< HEAD
        // atual.setPosX(Math.max(0, Math.min(atual.getPosX(), MAX_X)));
        // atual.setPosY(Math.max(0, Math.min(atual.getPosY(), MAX_Y)));
=======
        atual.setPosX(Math.max(0, Math.min(atual.getPosX(), 12)));
        atual.setPosY(Math.max(0, Math.min(atual.getPosY(), 7)));


        // guarda delta para o front desenhar o monstro "na frente"
        this.ultimoDx = dx;
        this.ultimoDy = dy;

>>>>>>> feat/login

        // 2) Verifica encontro de monstro
        String log;
        if (rolaEncontroMonstro()) {
            iniciarEncontroMonstro();
<<<<<<< HEAD
            faseAtual = Fase.BATALHA;
=======
            faseAtual = Fase.ENCONTRO;
>>>>>>> feat/login
            log = "Você encontrou um " + nomeMonstro(monstroAtual) + "!";
        } else {
            faseAtual = Fase.EXPLORACAO;
            log = "Você se moveu.";
        }

        // 3) Autosave
        personagemRepository.save(atual);

        // 4) Retorna snapshot do estado atual
        return snapshotEstado(log);
    }

    // ======== Regras auxiliares ========
    public boolean rolaEncontroMonstro() {
<<<<<<< HEAD
        // 30% de chance
        //return rng.nextInt(100) < 30;
        return false;           //TODO: implementar encontro com monstro
=======
        // 10% de chance
        return rng.nextInt(100) < 10;
        //TODO: implementar encontro com monstro
>>>>>>> feat/login
    }

    public boolean rolaBau() {
        // 10% de chance (mantido para uso futuro)
        return rng.nextInt(100) < 10;
    }

    public void ganhoExp(int qtd) {
        garantirPersonagemSelecionado();
        atual.setXp(atual.getXp() + qtd);
        while (atual.getXp() >= expNecessariaProximoNivel(atual.getLevel())) {
            atual.setLevel(atual.getLevel() + 1);
            atual.setHp(atual.getHp() + 20);
            atual.setForca(atual.getForca() + 5);
        }
        personagemRepository.save(atual);
    }

    private int expNecessariaProximoNivel(int level) {
        return level * 100; // regra simples
    }

    public void salvarAgora() {
        garantirPersonagemSelecionado();
        personagemRepository.save(atual);
    }

    public Personagem getAtual() {
        return atual;
    }

    // ======== Encontro / Monstro ========
    private void iniciarEncontroMonstro() {
        // Aqui você instancia sua classe de Monstro conforme sua regra atual.
        // Ex.: monstroAtual = MonstroFactory.aleatorioPorRegiao(...);
        // Por enquanto, use um stub simples se não tiver factory aqui.
<<<<<<< HEAD
        monstroAtual = new Monstro("Esqueleto", 20, 0, 3, 0); // ajuste ao seu modelo real
=======
        //Minotauro monstroAtual = new Minotauro(1);
        int nivel = Math.max(1, atual.getLevel());
        this.monstroAtual = new Minotauro(nivel);
>>>>>>> feat/login
    }

    private String nomeMonstro(Monstro m) {
        // Ajuste conforme seu modelo (tipo, nome de classe, etc.)
        return m.getNome() != null ? m.getNome() : m.getClass().getSimpleName();
    }

    private void garantirPersonagemSelecionado() {
        if (atual == null) {
            throw new IllegalStateException("Nenhum personagem selecionado. Chame selecionar(personagemId) antes.");
        }
    }

    // ======== Snapshot p/ controller mapear em DTO ========
    public EstadoJogo snapshotEstado(String log) {
        EstadoJogo e = new EstadoJogo();
        e.setFase(faseAtual);
        e.setPersonagem(atual);
        e.setMonstro(monstroAtual);
        e.setLog(log);
<<<<<<< HEAD
=======
        e.setUltimoDx(ultimoDx);
        e.setUltimoDy(ultimoDy);

>>>>>>> feat/login
        return e;
    }

    // ======== Fábrica legado (mantida apenas para fallback dev) ========
    private Personagem criarPadrao() {
        Personagem p = new Personagem();
        p.setNome("Aventurier");
        p.setSexo("M");
        p.setLevel(1);
        p.setHp(100);
        p.setMp(50);
        p.setForca(10);
        p.setDefesa(2);
        p.setXp(0);
        p.setPosX(0);
        p.setPosY(0);
        return p;
    }

    // ======== DTO interno do service (domínio), mapeado pelo GameStateMapper ========
    public static class EstadoJogo {
        private Fase fase;
        private Personagem personagem;
        private Monstro monstro;
        private String log;

<<<<<<< HEAD
=======
        private int ultimoDx;
        private int ultimoDy;


>>>>>>> feat/login
        public Fase getFase() { return fase; }
        public void setFase(Fase fase) { this.fase = fase; }

        public Personagem getPersonagem() { return personagem; }
        public void setPersonagem(Personagem personagem) { this.personagem = personagem; }

        public Monstro getMonstro() { return monstro; }
        public void setMonstro(Monstro monstro) { this.monstro = monstro; }

        public String getLog() { return log; }
        public void setLog(String log) { this.log = log; }
<<<<<<< HEAD
=======


        public Integer getUltimoDx() { return ultimoDx; }
        public void setUltimoDx(Integer dx){this.ultimoDx = dx;}

        public Integer getUltimoDy() { return ultimoDy; }
        public void setUltimoDy(Integer dy){this.ultimoDy = dy;}

>>>>>>> feat/login
    }
}
