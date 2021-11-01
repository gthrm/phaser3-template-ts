import { GameObjects, Physics, Scene } from 'phaser'
const INITIAL_HP = 100
export class Actor extends Physics.Arcade.Sprite {
    protected hp = INITIAL_HP;
    public light!: GameObjects.Light

    constructor (scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
      super(scene, x, y, texture, frame)

      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.getBody().setCollideWorldBounds(true)
      this.light = scene.lights.addLight(this.x, this.y)
      this.light.color.set(241, 80, 69)
      this.light.intensity = 0.01
    }

    public getDamage (value?: number): void {
      this.scene.tweens.add({
        targets: this,
        duration: 100,
        repeat: 3,
        yoyo: true,
        alpha: 0.5,
        onStart: () => {
          if (value) {
            this.hp = this.hp - value
          }
        },
        onComplete: () => {
          this.setAlpha(1)
        }
      })
    }

    public getHealth (value?: number): void {
      if (value && this.hp < INITIAL_HP) {
        this.hp = this.hp + value
      }
    }

    public getHPValue (): number {
      return this.hp
    }

    protected checkFlip (): void {
      if (this.body.velocity.x < 0) {
        this.scaleX = -1
      } else {
        this.scaleX = 1
      }
    }

    protected getBody (): Physics.Arcade.Body {
      return this.body as Physics.Arcade.Body
    }

    public destroy () {
      super.destroy()
      this.light.intensity = 0
    }

    public handleLight ():void {
      this.light.x = this.x
      this.light.y = this.y
    }

    public update () {
      super.update()
      this.handleLight()
    }
}
