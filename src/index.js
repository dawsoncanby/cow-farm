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

var loadedObjs = []

// instantiate a loader
var loader = new OBJLoader2()
var cowMaterial = new THREE.MeshToonMaterial({
  color: '#8f5d25',
  flatShading: false,
});


var cowObj

// load a resource
loader.load(
	// resource URL
	cow,
	// called when resource is loaded
	(object) => {
		cowObj = object;
		loadedObjs.push(object)
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

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
var selectedObj = null

window.addEventListener('mousemove', event => {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
})

let colors = [new THREE.Color(0xebae34), new THREE.Color(0x262626), new THREE.Color(0x8f5d25)]
let curColIdx = 0
window.addEventListener('click', event => {
	if (selectedObj) {
		curColIdx++
		if (curColIdx >= colors.length) curColIdx = 0
		let newColor = colors[curColIdx]
		console.log(newColor);
		cowMaterial.color = newColor
		// cowMaterial.needsUpdate = true
	}
})

function animate() {
	requestAnimationFrame( animate )

	if (cowObj) {
		cowObj.rotateY(0.005)
		cowObj.translateX(0.005)
	}

  controls.update()

	raycaster.setFromCamera(mouse, camera)
	var intersects = raycaster.intersectObjects(loadedObjs, true)

	for ( var i = 0; i < intersects.length; i++ ) {
		selectedObj = intersects[i]
	}

	if (intersects.length === 0) selectedObj = null

	renderer.render( scene, camera )
}
animate()
