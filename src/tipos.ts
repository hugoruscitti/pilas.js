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

interface CallBackEvento {
  (): void
}
