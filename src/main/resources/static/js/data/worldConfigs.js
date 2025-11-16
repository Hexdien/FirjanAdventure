
export const mundos = {
  mapa1: {
    file: "../../assets/maps/mapa1.tmj",
    mapZ: 1,

    sprites: [
      { name: "Map1", z: 0 },           // base
      { name: "Map1trees", z: 10 },     // overlay (acima do player)
    ],

    mapExit: [
      "mapa2",
      "mapa3"
    ],

    mapEntrance: [
      "mapEntrance1",
    ],
    enableMonsters: true,
  },

  mapa2: {
    file: "../../assets/maps/mapa2.tmj",
    mapZ: 2,

    sprites: [
      { name: "Map2", z: 1 },
    ],

    transitions: {
      mapa_1: "mapa1",
    },

    exitObject: "mapa2Exit",
    enableMonsters: true,
  },
};
