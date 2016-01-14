class Historial {
  game: Pilas;
  game_state_history: Estado[];
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

  save(state: Estado) {
    this.game_state_history.push(JSON.parse(JSON.stringify(state)));
    this.current_step = this.game_state_history.length;
  }

  get_state_by_step(step: number) {
    var total = this.get_length();

    if (step < 0 || step >= total) {
      throw new Error("No se puede recuperar el historial en el paso " + step);
    }

    return this.game_state_history[step];
  }

}
