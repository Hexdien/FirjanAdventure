


export function mostrarMenuEquipaveis(x, y, itens, callback) {
  const m = document.getElementById("equipMenu");
  m.innerHTML = "";

  itens.forEach(i => {
    const btn = document.createElement("div");
    btn.textContent = i.nome;
    btn.style.padding = "6px";
    btn.style.cursor = "pointer";
    btn.style.borderBottom = "1px solid #444";

    btn.onclick = () => {
      callback(i);
      m.style.display = "none";
    };

    m.appendChild(btn);
  });

  // Posicionar menu no clique
  m.style.left = `${x}px`;
  m.style.top = `${y}px`;
  m.style.display = "block";
}



