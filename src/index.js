import css from './main.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'

import cow from './obj/cow.obj'
import landscape from './obj/landscape.obj'

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let controls = new OrbitControls(camera, renderer.domElement)

const color = 0xFFFFFF
const intensity = 1
const light = new THREE.DirectionalLight(color, intensity)
light.position.set(0, 10, 0)
light.target.position.set(-5, 0, 0)
scene.add(light)
scene.add(light.target)

camera.position.set(0, 10, 10)
controls.target.set(0, 0, 0)
controls.update()

// instantiate a loader
var loader = new OBJLoader2()
var cowMaterial = new THREE.MeshToonMaterial({
  color: '#8f5d25',    // red (can also use a CSS color string here)
  flatShading: false,
});

// load a resource
loader.load(
	// resource URL
	cow,
	// called when resource is loaded
	(object) => {
		object.traverse((e)=>{ if (e.isMesh) e.material = cowMaterial })
		scene.add(object)
	},
  xhr => { },
  err => { console.log(err) }
)

loader = new OBJLoader2()

var grassMaterial = new THREE.MeshToonMaterial({
  color: '#2c9e4b',    // red (can also use a CSS color string here)
  flatShading: false,
});

loader.load(
	landscape,
	o => {
		scene.add(o)
		o.traverse((e)=>{ if (e.isMesh) e.material = grassMaterial })
	},
	xhr => { },
	err => { console.log(err) }
)

function animate() {
	requestAnimationFrame( animate )

  controls.update()

	renderer.render( scene, camera )
}
animate()
