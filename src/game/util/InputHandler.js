export default class InputHandler {
  constructor() {
    this.pressedKeys = []

    document.addEventListener('keydown', event => {
      if (!this.pressedKeys.includes(event.keyCode)) {
        this.pressedKeys.unshift(event.keyCode)
      }
    }, false)

    document.addEventListener('keyup', event => {
      this.pressedKeys = this.pressedKeys.filter(e => event.keyCode !== e)
    }, false)
  }

  // get array of pressed keycodes, most recent press first and
  getCurInput() {
    return this.pressedKeys
  }

}
