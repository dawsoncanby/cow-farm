import * as THREE from 'three'
import ResLoader from './util/ResLoader.js'
import InputHandler from './util/InputHandler.js'

import Player from './entity/Player.js'

export default class Game {

  constructor(scene, camera) {
    this.loadedRes = {}
    this.scene = scene
    this.camera = camera
    this.isInit = false

    this.inputHander = new InputHandler();
  }

  // load resources
  // call init when ready
  load() {
    new ResLoader().loadAll(e => {
      this.loadedRes = e
      this.init()
    })
  }

  // init game logic
  // called after resources are loaded
  init() {
    this.cow = this.loadedRes.cow.clone(true)
    this.cow2 = this.loadedRes.cow.clone(true)

    // TODO: refactor this so mats are dynamic

    // cow mat 1
    let cowMaterial = new THREE.MeshToonMaterial({
      color: '#8f5d25',
      flatShading: false,
    });
    this.cow.traverse((e)=>{ if (e.isMesh) e.material = cowMaterial })

    // cow mat 2
    let cowMaterial2 = new THREE.MeshToonMaterial({
      color: '#eee',
      flatShading: false,
    });
    this.cow2.traverse((e)=>{ if (e.isMesh) e.material = cowMaterial2 })

    // land mat
    let landMat = new THREE.MeshToonMaterial({
      color: '#24a113',
      flatShading: false,
    });
    this.loadedRes.landscape.traverse((e)=>{ if (e.isMesh) e.material = landMat})



    this.scene.add(this.cow)
    this.scene.add(this.cow2)
    this.scene.add(this.loadedRes.landscape.clone(true))

    this.player = new Player(this.scene, this.camera, this.loadedRes.player)
    this.player.spawn(0, 0.1, 0)

    this.isInit = true
  }

  // update game logic
  update(delta) {
    // only update after init is complete
    if (!this.isInit) return

    this.cow.rotateY(0.3 * delta)
    this.cow.translateX(0.3 * delta)

    this.cow2.rotateY(-0.2 * delta)
    this.cow2.translateX(0.2 * delta)

    this.player.update(delta, this.inputHander.getCurInput())

  }
}
