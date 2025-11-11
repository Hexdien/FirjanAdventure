// js/config.js

// URL da API. Vazio '' significa mesmo host/porta do Spring Boot.
export const API_BASE = '/api';

// Caminho para o mapa principal
export const MAP_TMX = '/assets/maps/mapa.tmx';
// Sprite do jogador
export const PLAYER_IMG = '/assets/sprites/player.png';

// Configurações do sprite do player
export const PLAYER_W = 64; // Largura do sprite
export const PLAYER_H = 64; // Altura do sprite (use 64 para alinhar os pés)

// Mapeamento de sprites de monstros
export const MONSTER_SPRITES = {
  'Minotauro': 'assets/sprites/monsters/minotaur.png'
  // Adicione outros monstros aqui
};
