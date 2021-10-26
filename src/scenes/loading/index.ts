import { Scene, GameObjects } from 'phaser'

export class LoadingScene extends Scene {
  private king!: GameObjects.Sprite;

  constructor () {
    super('loading-scene')
  }

  preload (): void {
    this.load.baseURL = 'assets/'

    this.load.image({
      key: 'tiles',
      url: 'tilemaps/tiles/dungeon-16-16.png'
    })
    this.load.tilemapTiledJSON('dungeon', 'tilemaps/json/dungeon.json')

    // Our king texture
    this.load.image('king', 'sprites/king.png')
    // Our king atlas
    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json')
  }

  create (): void {
    this.scene.start('level-1-scene')
  }
}
