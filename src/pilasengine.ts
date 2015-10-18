/// <reference path="../phaser/typescript/phaser.d.ts"/>
/// <reference path="entidad.ts" />
/// <reference path="actores.ts" />
/// <reference path="fondos.ts" />
/// <reference path="historial.ts" />
/// <reference path="actorProxy.ts" />
/// <reference path="tipos.ts" />



class Pilas {
  game: Phaser.Game;
  game_state: State;
  game_history: Historial;
  pause_enabled: boolean = false;
  sprites: SpriteCache[] = [];
  scripts: any;
  actores: Actores;
  opciones: OpcionesIniciar;
  fondos: Fondos;

  evento_inicia: any;
  _cuando_inicia_callback: any;

  constructor(id_elemento_html:string, opciones: OpcionesIniciar) {

    var options = {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      render: this.render.bind(this)
    };

    console.log(`%cpilasengine.js v${VERSION} | http://www.pilas-engine.com.ar`, 'color: blue');

    this.opciones = opciones;
    this.game = new Phaser.Game(800, 600, Phaser.CANVAS, id_elemento_html, options);
    this.game_history = new Historial(this);

    this.game_state = {entities: []};

    this.load_scripts();
    this.actores = new Actores(this);
    this.fondos = new Fondos(this);

    this.evento_inicia = document.createEvent("Event");
  }


  cuando(nombre_evento: string, callback: CallBackEvento) {
    if (nombre_evento === "inicia") {
      this._cuando_inicia_callback = callback;
      window.addEventListener('evento_inicia', () => {callback()});
    } else {
      alert(`El evento ${nombre_evento} no está soportado.`);
    }
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
    if (this.opciones.en_test) {
      this._cuando_inicia_callback.call(this);
    }
  }

  preload() {
    this.cargar_imagen('humo', 'humo.png');
    this.cargar_imagen('sin_imagen', 'sin_imagen.png');
    this.cargar_imagen('fondos/plano', 'fondos/plano.png');

    this.game.stage.disableVisibilityChange = true;
  }

  create() {
    window.dispatchEvent(new CustomEvent("evento_inicia"));
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
      var sprite: any = null;

      if (entity.sprite_id) {
        sprite = this.get_sprite_by_id(entity.sprite_id);

        sprite.position.set(entity.x, entity.y);
        sprite.scale.set(entity.scale_x, entity.scale_y);
        sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
        sprite.angle = -entity.rotation;
      } else {

        if (entity['tiled']) {
          sprite = this.game.add.tileSprite(entity.x, entity.y, 800, 600, entity.image);
        } else {
          sprite = this.game.add.sprite(entity.x, entity.y, entity.image);
        }

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

/**
 * Representa el espacio de nombres para acceder a todos los componentes
 * de pilasengine.
 */
var pilasengine = {

  /**
   * Inicializa la biblioteca completa.
   *
   * @example
   *     var pilas = pilasengine.iniciar("canvas_id");
   *
   * @param {OpcionesIniciar} las opciones de inicialización.
   * @return {Game} el objeto instanciado que representa el contexto del juego.
   * @api public
   */
  iniciar: function(element_id: string, opciones: OpcionesIniciar = {data_path: 'data', en_test: false}) {
    return new Pilas(element_id, opciones);
  }

}
