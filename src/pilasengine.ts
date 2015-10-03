/// <reference path="../phaser/typescript/phaser.d.ts"/>
/// <reference path="utils.ts" />
/// <reference path="entidad.ts" />

Utils.test();


interface State {
  entities: Entity[],
}

interface SpriteCache {
  id: string,
  sprite: Phaser.Sprite,
}

interface OpcionesIniciar {
  data_path: string;
}


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

class GameHistory {
  game: Pilas;
  game_state_history: State[];
  current_step: number;

  constructor(game:Pilas) {
    this.game = game;
    this.game_state_history = [];
    this.current_step = 0;
  }

  reset() {
    this.game_state_history = [];
    this.current_step = 0;
  }

  get_length() {
    return this.game_state_history.length;
  }

  save(state: State) {
    this.game_state_history.push(JSON.parse(JSON.stringify(state)));
    this.current_step = this.game_state_history.length;
  }

  get_state_by_step(step: number) {
    var total = this.get_length();

    if (step < 0 || step >= total) {
      throw new Error("No se puede recuperar el historial en el paso " + step)
    }

    return this.game_state_history[step];
  }

}

class ActorProxy {
  id:number;
  game:Pilas;

  constructor(game:Pilas, id:number) {
    this.id = id;
    this.game = game;
  }

  public set x(value: number) {
    this.data.x = value;
  }

  public get data() {
    return this.game.get_entity_by_id(this.id);
  }

}


class Pilas {
  game: Phaser.Game;
  game_state: State;
  game_history: GameHistory;
  pause_enabled: boolean = false;
  sprites: SpriteCache[] = [];
  scripts: any;
  actores: Actores;
  opciones: OpcionesIniciar;

  constructor(id_elemento_html:string, opciones: OpcionesIniciar) {

    var options = {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      render: this.render.bind(this)
    };

    this.opciones = opciones;
    this.game = new Phaser.Game(800, 600, Phaser.CANVAS, id_elemento_html, options);
    this.game_history = new GameHistory(this);

    this.game_state = {entities: []};

    this.load_scripts();
    this.actores = new Actores(this);
  }

  private load_scripts() {
    this.scripts = {
      rotate: function(entity:Entity, data:any) {
        entity.rotation += data.speed;
        },

        move: function(entity:Entity, data:any) {
          entity.x += data.dx;
          entity.y += data.dy;
        }
      }
    }

  private cargar_imagen(identificador: string, archivo:string) {
    var path = this.join(this.opciones.data_path, archivo);
    this.game.load.image(identificador, path);
  }

  /**
   * Concatena dos rutas de manera similar a la función os.path.join
   */  
  private join(a:string, b:string) {
    var path = [a, b].map(function (i) {
      return i.replace(/(^\/|\/$)/, '');
    }).join('/');
    
    return path;
  }
  
  
  /**
   * Concatena dos rutas de manera similar a la función os.path.join
   */  
  ejecutar() {
    console.log("llamando a pilas.ejecutar() ...");  
  }

  preload() {
    this.cargar_imagen('humo', 'humo.png');
    this.cargar_imagen('sin_imagen', 'sin_imagen.png');

    this.game.stage.disableVisibilityChange = true;
  }

  create() {
      this.actores.Actor(400, 100);
  }

  pause() {
    this.pause_enabled = true;
  }

  unpause() {
    this.pause_enabled = false;
    this.game_history.reset();
  }

  toggle_pause() {
    if (this.pause_enabled) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  update() {

    this.game_state.entities.forEach((entity:Entity) => {

      if (entity.sprite_id) {
        var sprite = this.get_sprite_by_id(entity.sprite_id);

        sprite.position.set(entity.x, entity.y);
        sprite.scale.set(entity.scale_x, entity.scale_y);
        sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
        sprite.angle = -entity.rotation;
      } else {
        var sprite: Phaser.Sprite = this.game.add.sprite(entity.x, entity.y, entity.image);
        var sprite_id = this.add_sprite(sprite);

        entity.sprite_id = sprite_id;

        sprite.position.set(entity.x, entity.y);
        sprite.scale.set(entity.scale_x, entity.scale_y);
        sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
        sprite.angle = -entity.rotation;
      }

      if (!this.pause_enabled) {
        // Actualiza las entidades.
        for (var name in entity.scripts) {
          this.apply_script(entity, name, entity.scripts[name]);
        }
      }

    });

    if (!this.pause_enabled) {
      this.game_history.save(this.game_state);
    }

  }

  render() {
  	this.game.debug.inputInfo(32, 32);
  }

  get_entity_by_id(id: number) {
    var entities = this.ls();
    var index = entities.indexOf(id);

    return this.game_state.entities[index];
  }

  private add_sprite(sprite:Phaser.Sprite) {
    var id = this.create_id();

    this.sprites.push({id: id, sprite: sprite});

    return id;
  }

  private create_id() {
    return (0|Math.random()*9e6).toString(36);
  }

  private get_sprite_by_id(id:string) {
    var sprite:Phaser.Sprite = null;

    for (var i=0; i<this.sprites.length; i++) {
      var element = this.sprites[i];

      if (element.id === id) {
        return element.sprite;
      }

    }

    throw new Error("No se encuentra el sprite con el ID " + id);
  }

  private apply_script(entity:Entity, script_name:string, script_data:any) {
    this.get_script_by_name(script_name)(entity, script_data);
  }

  private get_script_by_name(script_name:string) {
    return this.scripts[script_name];
  }

  restore(step: number) {
    var state = this.game_history.get_state_by_step(step);
    this.transition_to_step(state);
  }

  ls() {
    return this.game_state.entities.map((e) => {
      return(e.id)
    });
  }

  getActorProxy(id:number) {
    return new ActorProxy(this, id);
  }

  private transition_to_step(state: State) {
    var current_state = this.game_state;
    this.game_state = state;
  }

}

var pilasengine = {


/**
 * Inicializa la biblioteca completa.
 *
 * @example
 *     var pilas = pilasengine.iniciar("canvas_id");
 *     // => '&lt;script&gt;&lt;/script&gt;'
 *
 * @param {OpcionesIniciar} las opciones de inicialización.
 * @return {Game} el objeto instanciado que representa el contexto del juego.
 * @api public
 */
  iniciar: function(element_id: string, opciones: OpcionesIniciar = {data_path: 'data'}) {
    return new Pilas(element_id, opciones);
  }
}
