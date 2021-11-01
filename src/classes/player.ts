import { Input, Scene } from 'phaser'
import { EVENTS_NAME, GAME_STATUS } from 'src/consts'
import { Actor } from './actor'
import { Text } from './text'

export class Player extends Actor {
  private keyW: Input.Keyboard.Key;
  private keyA: Input.Keyboard.Key;
  private keyS: Input.Keyboard.Key;
  private keyD: Input.Keyboard.Key;
  private keySpace: Input.Keyboard.Key;
  private hpValue: Text;

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y, 'king')

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W')
    this.keyA = this.scene.input.keyboard.addKey('A')
    this.keyS = this.scene.input.keyboard.addKey('S')
    this.keyD = this.scene.input.keyboard.addKey('D')
    this.keySpace = this.scene.input.keyboard.addKey(32)
    this.keySpace.on('down', (event: KeyboardEvent) => {
      this.anims.play('attack', true)
      this.scene.game.events.emit(EVENTS_NAME.attack)
    })
    this.hpValue = new Text(
      this.scene,
      this.x,
      this.y - this.height * 0.4,
      this.hp.toString()
    )
      .setFontSize(12)
      .setOrigin(0.8, 0.5)
      .setDepth(1)
    // PHYSICS
    this.getBody().setSize(30, 30)
    this.getBody().setOffset(8, 0)

    this.initAnimations()
  }

  private initAnimations (): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'run-',
        end: 7
      }),
      frameRate: 8
    })

    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'attack-',
        end: 2
      }),
      frameRate: 8
    })
  }

  public getDamage (value?: number): void {
    super.getDamage(value)
    this.hpValue.setText(this.hp.toString())
    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GAME_STATUS.LOSE)
    }
  }

  public getHealth (value?: number): void {
    super.getHealth(value)
    this.hpValue.setText(this.hp.toString())
  }

  run (): void {
    !this.anims.isPlaying && this.anims.play('run', true)
  }

  move (): void {
    this.getBody().setVelocity(0)
    this.run()
    if (this.keyW?.isDown) {
      this.body.velocity.y = -110
    }

    if (this.keyA?.isDown) {
      this.body.velocity.x = -110
      this.checkFlip()
      this.getBody().setOffset(48, 15)
    }

    if (this.keyS?.isDown) {
      this.body.velocity.y = 110
    }

    if (this.keyD?.isDown) {
      this.body.velocity.x = 110
      this.checkFlip()
      this.getBody().setOffset(15, 15)
    }
  }

  update (): void {
    super.update()
    this.move()
    this.hpValue.setPosition(this.x, this.y - this.height * 0.4)
    this.hpValue.setOrigin(0.8, 0.5)
  }
}
