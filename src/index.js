import css from './main.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'

import cow from './obj/cow.obj'

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let controls = new OrbitControls(camera, renderer.domElement)

var geometry = new THREE.BoxGeometry()
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
var cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

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

// load a resource
loader.load(
	// resource URL
	cow,
	// called when resource is loaded
	(object) => { scene.add(object) },
  xhr => { },
  err => { console.log(err) }
)

function animate() {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
	requestAnimationFrame( animate )

  controls.update()

	renderer.render( scene, camera )
}
animate()
