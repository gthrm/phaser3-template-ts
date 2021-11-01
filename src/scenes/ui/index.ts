import { Input, Scene } from 'phaser'
import { Text } from '../../classes/text'
import { EVENTS_NAME, GAME_STATUS } from '../../consts'

import { Score, ScoreOperations } from '../../classes/score'

export class UIScene extends Scene {
  private score!: Score;
  private gameEndPhrase!: Text;
  private keySpace: Input.Keyboard.Key | null;

  constructor () {
    super('ui-scene')
    this.keySpace = null
  }

  private chestLootHandler (): void {
    this.score.changeValue(ScoreOperations.INCREASE, 10)
  }

  private initListeners (): void {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this)
    this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this)
  }

  public restartHandler (): void {
    this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler)
    this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler)
    this.scene.get('level-1-scene').scene.restart()
    this.scene.restart()
  }

  private gameEndHandler (status: GAME_STATUS): void {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)')
    this.game.scene.pause('level-1-scene')

    this.gameEndPhrase = new Text(
      this,
      this.game.scale.width / 2,
      this.game.scale.height * 0.4,
      status === GAME_STATUS.LOSE
        ? 'WASTED!\nPRESS SPACE TO RESTART'
        : 'YOU ARE ROCK!\nPRESS SPACE TO RESTART'
    )
      .setAlign('center')
      .setColor(status === GAME_STATUS.LOSE ? '#19a0fb' : '#f2bc2c')

    this.gameEndPhrase.setPosition(
      this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
      this.game.scale.height * 0.4
    )

    this.keySpace?.on('down', this.restartHandler.bind(this))
  }

  create (): void {
    this.score = new Score(this, 20, 20, 0)
    this.keySpace = this.input.keyboard.addKey(32)
    this.initListeners()
  }
}
