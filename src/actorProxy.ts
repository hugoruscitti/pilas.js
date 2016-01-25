
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

  public set y(value: number) {
    this.data.y = value;
  }

  public get data() {
    return this.game.obtener_entidad_por_id(this.id);
  }

}
