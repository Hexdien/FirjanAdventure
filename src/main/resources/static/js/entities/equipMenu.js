
import { mostrarMenuEquipaveis } from "../scenes/openSlot.js";
import { carregarInventario } from "../scenes/inventario.js";


let menuEquip = null;
let equippedSlots = [];
export function createSlot(k, pos) {
  return [
    k.sprite("slot"),
    k.pos(pos.x, pos.y),
    k.area(),
    k.scale(1),
    k.z(99),
    {
      item: null,
      setItem(spriteName) {
        if (this.item) this.item.destroy();
        this.item = this.add([
          k.sprite(spriteName),
          k.anchor("center"),
          k.pos(16, 16),  // Centro do slot (assumindo 32x32)
          k.scale(0.6),
          k.z(100)  // Acima do slot
        ]);
      }, clearItem() {
        if (this.item) this.item.destroy();
        this.item = null;
        console.log('Item limpo!')
      }
    },
    "slot"
  ];
}



export function abrirMenuEquip(k, ctx) {

  // SE JÁ EXISTE → FECHA
  if (menuEquip) {
    menuEquip.destroy();
    menuEquip = null;
    return;
  }

  // SE NÃO EXISTE → ABRE
  menuEquip = k.add([
    k.sprite("uiEquip"),
    k.pos(ctx.player.pos),
    k.anchor("center"),
    k.scale(1),
    k.z(20),
    "menuEquip",
    {
      update() {
        this.pos = ctx.player.pos;
      }
    }
  ]);

  const invSlots = [];

  const invStartX = 10;
  const invStartY = -55;

  const rows = 4;
  const cols = 3;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      const s = menuEquip.add(createSlot(k, {
        x: invStartX + (x * 32),
        y: invStartY + (y * 32)
      }));
      s.index = index;  // Armazena índice no slot
      invSlots.push(s);
      // Hover no slot individual
      s.onHoverUpdate(() => {
        if (!menuEquip) return;
        s.use(k.sprite("slotS"));
        k.setCursor("pointer");
      });
      s.onHoverEnd(() => {
        if (!menuEquip) return;
        s.use(k.sprite("slot"));
        k.setCursor("default");
      });
      // Click no slot individual
      s.onClick(async () => {
        if (!menuEquip) return;
        k.play("btn_up");
        const inventario = await carregarInventario(ctx);
        const equipaveis = inventario.filter(i => i.tipo === "EQUIPAVEL");
        if (equipaveis.length === 0) {
          alert("Você não tem nenhum item equipável.");
          return;
        }
        const mouse = k.mousePos();
        const canvasRect = k.canvas.getBoundingClientRect();
        const px = canvasRect.left + mouse.x;
        const py = canvasRect.top + mouse.y;
        mostrarMenuEquipaveis(px, py, equipaveis, (itemEscolhido) => {
          const spriteName = itemEscolhido.nome === "Capacete de Ferro"
            ? "item_capacete_ferro"
            : "item_padrao";
          s.setItem(spriteName);
          equippedSlots[index] = spriteName;
          console.log("Item equipado:", itemEscolhido);
          if (itemEscolhido.slot === "HEAD") {
            const headSlot = document.querySelector('[data-slot="head"]');
            const headImg = headSlot.querySelector('.slot-img');
            headImg.src = `../../assets/sprites/${spriteName}.png`;
            headImg.alt = itemEscolhido.nome;
            headSlot.querySelector('.slot-placeholder').style.display = 'none';
            headImg.style.display = 'block';
          }
        });
      });
    }
  }
  for (let i = 0; i < invSlots.length; i++) {
    if (equippedSlots[i]) {
      invSlots[i].setItem(equippedSlots[i]);
    }
  }
}
