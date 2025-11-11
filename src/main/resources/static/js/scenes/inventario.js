
import { API_BASE } from "../config.js"

async function carregarInventario(ctx) {

  // Busca no endpoint do backend os itens do personagem com id >> ctx.id
  const resp = await fetch(`${API_BASE}/inventario/${(ctx.id)}`);
  return await resp.json();
}

// Cena de inventário
export async function setInventario(k, ctx) {
  k.add([
    k.rect(k.width() - 40, k.height() - 40),
    k.pos(20, 20),
    k.color(20, 20, 20),
    k.outline(2, k.rgb(200, 200, 200)),
    k.opacity(0.9),
    k.z(100),
  ]);

  const textoItens = k.add([
    k.text("Carregando...", { size: 16 }),
    k.pos(40, 40),
    k.z(101),
    k.color(255, 255, 255),
  ]);

  try {
    const itens = await carregarInventario(ctx);
    textoItens.text = itens.length
      ? itens.map((i) => `${i.nome} x${i.quantidade}`).join("\n")
      : "Inventário vazio";
  } catch (err) {
    textoItens.text = "Erro ao carregar inventário";
    console.error(err);
  }

  // Fecha inventário com tecla "I"
  k.onKeyPress("i", () => {
    k.popScene(); // volta para a cena world
  });
}



