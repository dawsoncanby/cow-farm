import * as THREE from 'three'

export default class RandomLandscapeGen {
  constructor(treeModels, terrain, scene) {
    this.treeModels = treeModels
    this.terrain = terrain
    this.scene = scene
  }

  // add random landscape objects to the scene
  gen() {
    // get the list of verticies on the terrain
    let buffGeom = this.terrain.children[0].geometry
    let geom = new THREE.Geometry().fromBufferGeometry(buffGeom)
    let verts = geom.vertices

    const nTrees = 10

    for (let i = 0; i < nTrees; i++) {
      const point = this.randItemFromArr(verts)
      const tree = this.randItemFromArr(this.treeModels)
      this.scene.add(tree.clone(true))
      tree.position.setX(point.x)
      tree.position.setY(point.y)
      tree.position.setZ(point.z)
    }
  }

  // get a random element from an array
  randItemFromArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

}
