import { Display, GameObjects, Scene, Tilemaps } from 'phaser'
import { Player } from '../../classes/player'

export class Level1 extends Scene {
  private player!: GameObjects.Sprite;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  constructor () {
    super('level-1-scene')
  }

  private initMap (): void {
    this.map = this.make.tilemap({
      key: 'dungeon',
      tileWidth: 16,
      tileHeight: 16
    })
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles')
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
    this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0)
    this.physics.world.setBounds(
      0,
      0,
      this.wallsLayer.width,
      this.wallsLayer.height
    )
    this.wallsLayer.setCollisionByProperty({ collides: true })
    // this.showDebugWalls()
  }

  private showDebugWalls (): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7)
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243, 234, 48, 255)
    })
  }

  create (): void {
    this.initMap()

    this.map.findObject('player', (playerObj: any) => {
      this.player = new Player(this, playerObj.x, playerObj.y)
    })
    this.physics.add.collider(this.player, this.wallsLayer)
  }

  update (): void {
    this.player.update()
  }
}
