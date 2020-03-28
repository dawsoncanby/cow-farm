import css from './main.css'
import Game from './game/Game.js'

import * as THREE from 'three'

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const game = new Game(scene, camera);
game.load();

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const color = 0xFFFFFF
const intensity = 1
const light = new THREE.DirectionalLight(color, intensity)
light.position.set(0, 30, 0)
light.target.position.set(-5, 0, 0)

scene.background = new THREE.Color(0x40afff)
scene.add(light)
scene.add(light.target)

const clock = new THREE.Clock();
clock.start();

function animate() {
	requestAnimationFrame( animate )
  game.update(clock.getDelta())
	renderer.render( scene, camera )
}
animate()
