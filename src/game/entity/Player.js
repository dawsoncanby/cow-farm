import * as THREE from 'three'

export default class Player {
  constructor(scene, camera, modelObj) {
    this.scene = scene
    this.camera = camera
    this.modelObj = modelObj.clone(true)
  }

  // add the player to the scene at the given coordinates
  spawn(x, y, z) {
    this.modelObj.position.setX(x)
    this.modelObj.position.setY(y)
    this.modelObj.position.setZ(z)
    this.scene.add(this.modelObj)
  }

  update(delta, keysDown) {
    this.move(delta, keysDown)
    this.camFollowPlayer()
  }

  // get and apply movement for the player based on input
  // TODO: maybe split this into two methods
  move(delta, keysDown) {

    const rotRate = 1
    const speed = 1

    // get movement
    const movementKeys = [83, 87]
    let movAmt = 0
    for (let key of keysDown) {
      if (movementKeys.includes(key)) {
        if (key === 87) movAmt = speed
        if (key === 83) movAmt = -speed
      }
    }

    // apply movement
    this.modelObj.translateZ(movAmt * delta)

    // get rotation
    const rotationKeys = [65, 68]
    let rotAmt = 0
    for (let key of keysDown) {
      if (rotationKeys.includes(key)) {
        // rotation for moving forwards
        if (movAmt >= 0) {
          if (key === 65) rotAmt = rotRate
          if (key === 68) rotAmt = -rotRate
        }
        // rotation for moving backwards
        else {
          if (key === 65) rotAmt = -rotRate
          if (key === 68) rotAmt = rotRate
        }
        break
      }
    }

    // apply rotation
    this.modelObj.rotateY(rotAmt * delta)



  }

  camFollowPlayer() {
    this.camera.lookAt(this.modelObj.position)

    // compute cam location relative to model object (world coordinates)
    const followVec = new THREE.Vector3(0, 0.06, -0.1).normalize()
    const followDist = 4
    const rotMatrix = new THREE.Matrix4()
    rotMatrix.extractRotation(this.modelObj.matrix)
    followVec.applyMatrix4(rotMatrix)
    followVec.multiplyScalar(followDist)

    // lerp cam toward correct position
    const camPos = this.camera.position.lerp(
      followVec.add(this.modelObj.position),
      0.1
    )

    this.camera.position.setX(camPos.x)
    this.camera.position.setY(camPos.y)
    this.camera.position.setZ(camPos.z)
  }
}
