import { Scene } from 'phaser'
import { EVENTS_NAME } from 'src/consts'

import { Score, ScoreOperations } from '../../classes/score'

export class UIScene extends Scene {
  private chestLootHandler: () => void;
  private score!: Score;

  constructor () {
    super('ui-scene')
    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOperations.INCREASE, 10)
    }
  }

  private initListeners (): void {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this)
  }

  create (): void {
    this.score = new Score(this, 20, 20, 0)
    this.initListeners()
  }
}
