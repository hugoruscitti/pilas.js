class Fondos {
  pilas: Pilas;

  constructor(pilas: Pilas) {
    this.pilas = pilas;
  }

  Plano(x:number=0, y:number=0) {
    var entity = {
      id: 12,
      name: "fondos/plano",
      image: 'fondos/plano',
      x: x,
      y: y,
      tiled: true,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      anchor_x: 0.5,
      anchor_y: 0.5,
      scripts: {
      }
    };

    entity.id = Math.ceil(Math.random() * 1000000000000);

    this.pilas.game_state.entities.push(entity);
    return entity;
  }
}
