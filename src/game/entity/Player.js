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
    const rotRate = 1.5
    const speed = 0.7

    // get movement
    const movementKeys = [83, 87]
    let movAmt = 0
    for (let key of keysDown) {
      if (movementKeys.includes(key)) {
        if (key === 87) movAmt = speed
        if (key === 83) movAmt = -speed
      }
    }

    // get movement vector, local to player
    const grav = 0.01
    let moveVec = new THREE.Vector3(0, -grav, movAmt * delta)

    // apply movement
    this.raycastMove(moveVec)

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

  // move by 'moveVec', accounting for obstacles and terrain
  // TODO: maybe filter on certain types of objects, or colliders of objects
  raycastMove(moveVec) {
    // how high the player is off the ground
    const groundOffsetVec = new THREE.Vector3(0, 0.1, 0)

    // duplicate move vector, normalize
    let vec = new THREE.Vector3()
    vec.copy(moveVec)
    vec.normalize()

    // convert from local to world vector for raycast
    let rotMatrix = new THREE.Matrix4()
    rotMatrix.extractRotation(this.modelObj.matrix)
    vec.applyMatrix4(rotMatrix)

    // create raycast
    const raycaster = new THREE.Raycaster(this.modelObj.position, vec)
    const hits = raycaster.intersectObjects(this.scene.children, true)

    // if raycast hit something, move to that position
    if (hits.length > 0) {
      const firstHit = hits[0]
      // add offset from ground
      firstHit.point.add(groundOffsetVec)
      // if first hit is farther than length of original move vec, use original move vec
      if (this.modelObj.position.distanceTo(firstHit.point) > moveVec.length()) {
        this.modelObj.translateY(moveVec.y)
        this.modelObj.translateZ(moveVec.z)
      }
      // move to hit point
      this.modelObj.position.setX(firstHit.point.x)
      this.modelObj.position.setY(firstHit.point.y)
      this.modelObj.position.setZ(firstHit.point.z)
    }
    // move by original vec
    else {
      this.modelObj.translateY(moveVec.y)
      this.modelObj.translateZ(moveVec.z)
    }
  }

  // puts the camera behind the player on the -z axis
  camFollowPlayer() {
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

    this.camera.lookAt(this.modelObj.position)
    this.camera.position.setX(camPos.x)
    this.camera.position.setY(camPos.y)
    this.camera.position.setZ(camPos.z)
  }
}
