





export async function introScene(k, ctx) {
  const cena = k.add([
    k.sprite("Intro"),
    k.scale(1),
    k.pos(0, 0)]);



  const music = k.play("tema-som-1", {
    volume: 0.2,
    loop: true
  })
  const box = k.add([
    k.rect(1272, 185, { radius: 16 }),     // bordas arredondadas
    k.color(43, 37, 33),                   // fundo #2b2521
    k.outline(4, k.rgb(107, 76, 42)),      // borda dourada #6b4c2a
    k.pos(5, 530),
    k.opacity(0.98),
    k.z(100),
    "intro-box"
  ]);

  const space = box.add([
    k.text("Pressione ESPAÇO para continuar", {
      size: 26,
      font: "sink",
      width: box.width - 20,
    }),
    k.color(230, 210, 160), // dourado suave
    k.outline(2, k.rgb(0, 0, 0)),
    k.pos(900, box.height - 34),
    k.z(1000),
  ]);


  // Texto
  const content = box.add([
    k.text("", {
      size: 34,
      font: "sink",
      width: box.width - 20,
    }),
    k.color(230, 210, 160), // dourado suave
    k.outline(2, k.rgb(0, 0, 0)),
    k.pos(20, 20),
    k.z(1000),
    {
      fullText: "Em Helheim, a glória não é herdada, é conquistada. Por séculos, o reino teme a sombra do Castelo de Helgrind, uma fortaleza macabra que não é uma prisão, e sim a forma de se libertar da floresta do Vale das Sombras.",
      cur: 0,
      update() {
        if (this.cur < this.fullText.length) {
          this.cur += 0.6; // velocidade da digitação
          this.text = this.fullText.slice(0, Math.floor(this.cur));
        }
      },
    },
  ]);

  let phase = "1";
  k.onKeyPress("space", async () => {

    if (phase === "1") {
      content.fullText = `Você, ${ctx.nome}, chegou a este lugar sem memória de seu passado recente, guiado apenas por um instinto: a necessidade de provar seu valor. Talvez você seja um forasteiro, um renegado. Não importa.`,
        content.cur = 0;
      phase = "2";
      return;
    };
    if (phase === "2") {
      content.fullText = "A única porta para um futuro em Helheim é a porta de saída de Helgrind.";
      content.cur = 0;
      phase = "3";
      return;
    };
    if (phase === "3") {
      cena.use(k.sprite("Intro2"));
      content.fullText = "Você foi lançado no Vale das Sombras, uma floresta frio e escura onde os ecos dos gritos antigos ainda pairam. Para cada passo que você dá, uma abominação se materializa. Estas criaturas não são guardas; são os restos amaldiçoados dos que falharam antes de você.";
      content.cur = 0;
      phase = "4";
      return;
    };
    if (phase === "4") {
      content.fullText = "O Castelo de Helgrind não se importa com sua força inicial, mas com sua vontade de crescer.";
      content.cur = 0;
      phase = "5";
      return;
    };
    if (phase === "5") {
      content.fullText = "Sobreviva. Cada monstro derrotado é uma lição aprendida e uma fonte de poder para evoluir suas habilidades.";
      content.cur = 0;
      phase = "6";
      return;
    };

    if (phase === "6") {
      content.fullText = "Busque. Os itens abandonados nas sombras são sua única esperança de se armar contra horrores maiores.";
      content.cur = 0;
      phase = "7";
      return;
    };

    if (phase === "7") {
      content.fullText = "Não pare. A unica forma de se libertar do vale da sombras é pelo castelo de Helgrind. A lenda diz que apenas quando o castelo sentir que você superou todos os seus limites – ao derrotar a última e mais poderosa maldição – a saída se revelará.";
      content.cur = 0;
      phase = "8";
      return;
    };

    if (phase === "8") {
      content.fullText = "Pise com cuidado. O ar é pesado com a essência da escuridão. O julgamento começou.";
      content.cur = 0;
      phase = "9";
      return;
    };

    if (phase === "9") {
      content.fullText = "Mate para evoluir. Evolua para sobreviver. Sobreviva para ser livre.";
      content.cur = 0;
      phase = "10";
      return;
    };








    if (phase === "10") {
      ctx.atributos.mapZ = 1;
      k.go("world", ctx);
    };



  });



}
