/// <reference path="../phaser/typescript/phaser.d.ts"/>

interface Entity {
  name: string,
  id: number,
  x: number,
  y: number,
  sprite_id?: string,
  scale_x: number,
  scale_y: number,
  rotation: number,
  anchor_x: number,
  anchor_y: number,
  image: string,
  scripts?: any
}

interface State {
  entities: Entity[],
}

interface SpriteCache {
  id: string,
  sprite: Phaser.Sprite,
}


class Actores {
  game: Game;

  constructor(game: Game) {
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
          speed: 0,
        }
      }
    };

    this.game.game_state.entities.push(entity);

  }
}


class Game {
  game: Phaser.Game;
  game_state: State;
  game_state_history: State[];
  pause: boolean = false;
  sprites: SpriteCache[] = [];
  scripts: any;
  actores: Actores;

  constructor(element_id:string) {

    var options = {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      render: this.render.bind(this)
    };

    this.game = new Phaser.Game(800, 600, Phaser.CANVAS, element_id, options);
    this.game_state_history = [];
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


  preload() {
    this.game.load.image('humo', 'data/humo.png');
    this.game.load.image('sin_imagen', 'data/sin_imagen.png');

    this.game.stage.disableVisibilityChange = true;
  }

  create() {
      var entity = {
        id: 12,
        name: "humo",
        image: 'humo',
        x: 100,
        y: 100,
        scale_x: 1,
        scale_y: 1,
        rotation: 0,
        anchor_x: 0.5,
        anchor_y: 0.5,
        scripts: {
          rotate: {
            speed: 0,
          }
        }
      };

      this.game_state.entities.push(entity);


      this.actores.Actor();
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

      if (!this.pause) {
        // Actualiza las entidades.
        for (var name in entity.scripts) {
          this.apply_script(entity, name, entity.scripts[name]);
        }
      }

    });

    if (!this.pause) {
      this.save_history(this.game_state);
    }

  }

  render() {
  	this.game.debug.inputInfo(32, 32);
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

  private save_history(state: State) {
    this.game_state_history.push(JSON.parse(JSON.stringify(state)));
  }
}





function initGame(element_id: string) {
  return new Game(element_id);
}


function old() {

  var state_history: any = [];
  var previous_sprites_render: any = [];






  var state = {
    entities: [
      {
        id: 12,
        name: "humo",
        image: 'humo',
        x: 100,
        y: 100,
        scale_x: 1,
        scale_y: 1,
        rotation: 0,
        anchor_x: 0.5,
        anchor_y: 0.5,
        scripts: {
          rotate: {
            speed: 1,
          }
        }
      },

      {
        id: 123,
        name: "humo",
        image: 'humo',
        x: 200,
        y: 200,
        scale_x: 1,
        scale_y: 1,
        rotation: 0,
        anchor_x: 0.5,
        anchor_y: 0.5,
        scripts: {
          rotate: {
            speed: 10,
          },
          move: {
            dx: 10
          }
        }
      }
    ]
  }






  function saveHistory(game_state_history:any, state_in_time:any) {
    function JSONClone(o:any) {
      if(!o || 'object' !== typeof o)  {
        return o;
      }
      var c = 'function' === typeof o.pop ? [] : {};
        var p:any, v:any;
        for(p in o) {
          if (p.toString().indexOf('_') === 0) {
            continue;
            } else {

              if(o.hasOwnProperty(p)) {
                v = o[p];

                if(v && 'object' === typeof v) {
                  c[p] = JSONClone(v);
                }
                else {
                  c[p] = v;
                }
              }
            }
        }

        return c;
    }


    game_state_history.push(JSONClone(state_in_time));
  }



  function restoreStateWithUndo(step:number) {
    if (step > 0) {
      state = state_history[step];
    }
  }

  function undo() {
    state = state_history.pop();
  }
  /*

  function showSlider() {
    slider.style.visibility = null;
    slider.setAttribute('max', state_history.length);
    slider.value = state_history.length;

    slider.onmousemove = function(value) {
      restoreStateWithUndo(this.value -1);
    };
  }

  function hideSlider() {
    slider.style.visibility = "hidden";
  }

  pauseButton.onclick = function() {
    pause = !pause;

    if (pause) {
      showSlider();
      this.textContent = "Play";
    } else {
      hideSlider();
      this.textContent = "Pause";
    }
  };
  */



}
