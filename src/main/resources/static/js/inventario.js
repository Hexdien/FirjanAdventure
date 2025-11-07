const API_URL = "http://localhost:8080/api/inventario";


// Carregar inventário
export async function carregarInventario() {
  const resp = await fetch(API_URL);
  const dados = await resp.json();
  return dados;
}

// Adicionar item
export async function adicionarItem(nome, tipo, quantidade) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, tipo, quantidade }),
  });
  return resp.json();
}

// Remover item
export async function removerItem(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
