class Actores {
  game: Pilas;

  constructor(game: Pilas) {
    this.game = game;
  }

  Actor(x:number=0, y:number=0) {
    var entity = {
      id: 12,
      nombre: "sin_imagen",
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

  crear(diccionario:any) {
    var entidad:any = {
      id: Math.ceil(Math.random() * 1000000000000),
      nombre: diccionario.nombre || "",
      image: diccionario.imagen || 'sin_imagen',
      x: diccionario.x || 100,
      y: diccionario.y || 100,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      anchor_x: 0.5,
      anchor_y: 0.5,
      scripts: {
      }
    };

    


    entidad.contador = diccionario.contador;


    this.game.codigos[entidad.nombre] = {
      actualizar: diccionario.actualizar || function () {},
    }

    if (entidad.nombre == "") {
      console.error("Tienes que especificar le nombre de la entidad.", entidad);
      throw new Error("Tienes que especificar le nombre de la entidad.");
    }

    this.game.game_state.entities.push(entidad);
  }

}
