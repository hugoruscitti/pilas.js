
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
