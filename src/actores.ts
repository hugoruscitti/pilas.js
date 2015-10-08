class Actores {
  game: Pilas;

  constructor(game: Pilas) {
    this.game = game;

  }

  Actor(x:number=0, y:number=0) {
    var entity = {
      id: 12,
      name: "sin_imagen",
      image: 'sin_imagen',
      x: x,
      y: y,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      anchor_x: 0.5,
      anchor_y: 0.5,
      scripts: {
        rotate: {
          speed: 0.5,
        }
      }
    };

    entity.id = Math.ceil(Math.random() * 1000000000000);

    this.game.game_state.entities.push(entity);
    return entity;
  }
}
