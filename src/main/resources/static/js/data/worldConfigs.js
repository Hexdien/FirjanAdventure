
export const mundos = {
  1: {
    file: "../../assets/maps/mapa1.tmj",
    mapZ: 1,

    sprites: [
      { name: "Map1", z: 0 },           // base
      { name: "Map1trees", z: 10 },     // overlay (acima do player)
    ],

    mapExit: [
      "mapa2",
    ],

    mapEntrance: [
      "mapEntrance1",
    ],

    enableMonsters: true,
  },

  2: {
    file: "../../assets/maps/mapa2.tmj",
    mapZ: 2,

    sprites: [
      { name: "Map2", z: 0 },
    ],

    mapExit: [
      "mapa1",
    ],

    mapEntrance: [
      "mapEntrance2",
    ],

    enableMonsters: true,
  },
};
