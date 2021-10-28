import { Display, GameObjects, Scene, Tilemaps } from 'phaser'
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point'
import { Player } from '../../classes/player'
import { EVENTS_NAME } from 'src/consts'

export class Level1 extends Scene {
  private player!: GameObjects.Sprite;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;
  private chests!: GameObjects.Sprite[];

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

  private initChests (): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Chests', obj => obj.name === 'ChestPoint')
    )

    this.chests = chestPoints.map(chestPoint =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5)
    )

    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot)
        obj2.destroy()
        this.cameras.main.flash()
      })
    })
  }

  private initCamera (): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(3)
  }

  create (): void {
    this.initMap()

    this.map.findObject('player', (playerObj: any) => {
      this.player = new Player(this, playerObj.x, playerObj.y)
    })
    this.initCamera()
    this.initChests()
    this.physics.add.collider(this.player, this.wallsLayer)
  }

  update (): void {
    this.player.update()
  }
}
