
const API_URL = "http://localhost:8080/api/inventario";

async function carregarInventario() {
  const resp = await fetch(API_URL);
  return await resp.json();
}

// Cena de inventário
export async function setInventario(ctx) {
  add([
    rect(width() - 40, height() - 40),
    pos(20, 20),
    color(20, 20, 20),
    outline(2, rgb(200, 200, 200)),
    opacity(0.9),
    z(100),
  ]);

  const textoItens = add([
    text("Carregando...", { size: 16 }),
    pos(40, 40),
    z(101),
    color(255, 255, 255),
  ]);

  try {
    const itens = await carregarInventario();
    textoItens.text = itens.length
      ? itens.map((i) => `${i.nome} x${i.quantidade}`).join("\n")
      : "Inventário vazio";
  } catch (err) {
    textoItens.text = "Erro ao carregar inventário";
    console.error(err);
  }

  // Fecha inventário com tecla "I"
  onKeyPress("i", () => {
    go("world", ctx); // volta para a cena world
  });
}



