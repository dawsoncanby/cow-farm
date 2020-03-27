import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'

// TODO: add resources here
import cow from '../../obj/cow.obj'
import landscape from '../../obj/landscape.obj'
import player from '../../obj/player.obj'

export default class ResLoader {

  // load all resources, call callback passing an object with entries 'resName': loadedResource
  loadAll(callback) {
    // TODO: define resources to be loaded here
    const allRes = {
      cow,
      landscape,
      player
    }

    let resReadyCount = 0
    const nRes = Object.keys(allRes).length
    const loadedRes = {}

    Object.keys(allRes).forEach(key => {
      new OBJLoader2().load(
        allRes[key],
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
    })
  }
}
