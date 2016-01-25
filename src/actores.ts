class Actores {
  game: Pilas;

  constructor(game: Pilas) {
    this.game = game;
  }

  /**
   * Representa a un actor genérico, con una imagen y propiedades
   * de transformación como ``x``, ``y``, ``escala_x``, ``escala_y`` etc...
   *
   * ![](../imagenes/sin_imagen.png)
   *
   * @param x - posición horizontal.
   * @param y - posición vertical.
   */
  Actor(x:number=0, y:number=0) {
    var entity = {
      id: 12,
      nombre: "sin_imagen",
      imagen: 'sin_imagen',
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

    this.game.game_state.entidades.push(entity);
    return entity;
  }

  Patito() {
    var entidad: any = this.crear({
      nombre: "patito",
      imagen: "data:patito.png"
    });

    return new ActorProxy(this.game, entidad.id);
  }

  crear(diccionario:any) {
    var entidad:any = {
      id: Math.ceil(Math.random() * 1000000000000),
      nombre: diccionario.nombre || "",
      imagen: diccionario.imagen || 'sin_imagen',
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

    this.game.game_state.entidades.push(entidad);
    return entidad;
  }

}
