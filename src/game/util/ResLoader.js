import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

// TODO: add resources here
import cow from '../../obj/cow.obj'
import cowMtl from '../../obj/cow.mtl'
import landscape from '../../obj/landscape.obj'
import landscapeMtl from '../../obj/landscape.mtl'
import bushyTree from '../../obj/bushy_tree.obj'
import bushyTreeMtl from '../../obj/bushy_tree.mtl'
import boulder from '../../obj/boulder.obj'
import boulderMtl from '../../obj/boulder.mtl'
import player from '../../obj/player.obj'
import playerMtl from '../../obj/player.mtl'


export default class ResLoader {

  // load all resources, call callback passing an object with entries 'resName': loadedResource
  loadAll(callback) {
    // TODO: define resources to be loaded here
    // first elem is obj, second is mtl
    const allRes = {
      cow: [cow, cowMtl],
      landscape: [landscape, landscapeMtl],
      bushyTree: [bushyTree, bushyTreeMtl],
      boulder: [boulder, boulderMtl],
      player: [player, playerMtl]
    }

    let resReadyCount = 0
    const nRes = Object.keys(allRes).length
    const loadedRes = {}

    // load obj files and attach mtl file
    Object.keys(allRes).forEach(key => {
      const objLoader = new OBJLoader2()
      const mtlLoader = new MTLLoader()

      // load material, then load object
      mtlLoader.load(
        allRes[key][1], // mat path
        mat => {
          const objMat = MtlObjBridge.addMaterialsFromMtlLoader(mat)
          objLoader.addMaterials(objMat)
          // TODO: add material double siding?
          objLoader.load(
            allRes[key][0], // obj path
            obj => {
              loadedRes[key] = obj
              resReadyCount++
              if (resReadyCount === nRes) {
                callback(loadedRes)
              }
            },
            xhr => {},
            err => { console.log(err) }
          )
        },
        xhr => {},
        err => { console.log(err) }
      )
    })
  }
}
