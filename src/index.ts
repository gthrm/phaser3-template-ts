import { Game, Scale, Types, WEBGL } from 'phaser'

import { LoadingScene } from './scenes'

const sizeChanged = () => {
  if (game.isBooted) {
    setTimeout(() => {
      game.scale.resize(window.innerWidth, window.innerHeight)

      game.canvas.setAttribute(
        'style',
        `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
      )
    }, 100)
  }
}

window.onresize = () => {
  window.requestAnimationFrame(() => {
    sizeChanged()
  })
}

const gameConfig: Types.Core.GameConfig = {
  title: 'Phaser game tutorial',
  type: WEBGL,
  parent: 'game',
  backgroundColor: '#351f1b',
  scale: {
    mode: Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  render: {
    antialiasGL: false,
    pixelArt: true
  },
  callbacks: {
    postBoot: () => {
      sizeChanged()
    }
  },
  canvasStyle: 'display: block; width: 100%; height: 100%;',
  autoFocus: true,
  audio: {
    disableWebAudio: false
  },
  scene: [LoadingScene]
}

const game = new Game(gameConfig)
