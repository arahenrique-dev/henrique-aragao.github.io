import * as THREE from 'three';

import './style.css';

import './scrabble.js';

import './pinboard.js';

import './laptop.js';

import './plant.js';

import './books.js';

import {
  updateNotebook
} from './notebook.js';

import {
  updateGlobe
} from './globe.js';

import './mp3Player.js';

import { paintingsGroup } from './paintings.js';

import './scene.js';

import { lampGroup } from './lamp.js';

import {
  scene,
  camera,
  renderer
} from './scene.js';

import {
  setupInteractions,
  updateInteractions
} from './interaction.js';

const clock = new THREE.Clock();

setupInteractions(
  camera,
  renderer
);

const baseCameraPosition =
  camera.position.clone();

const mouse =
  new THREE.Vector2();

window.addEventListener(
  'pointermove',
  (event) => {

    mouse.x =
      (event.clientX /
        window.innerWidth) *
      2 -
      1;

    mouse.y =
      (event.clientY /
        window.innerHeight) *
      2 -
      1;

  }
);

function updateCamera() {

  const targetX =
    baseCameraPosition.x +
    mouse.x * 0.12;

  const targetY =
    baseCameraPosition.y -
    mouse.y * 0.015;

  camera.position.x +=
    (targetX -
      camera.position.x) *
    0.06;

  camera.position.y +=
    (targetY -
      camera.position.y) *
    0.06;

  camera.lookAt(
    0,
    1.4,
    0
  );
}

function animate() {

  requestAnimationFrame(
    animate
  );

  const delta =
    clock.getDelta();

  updateNotebook(delta);


  updateInteractions(delta);

  updateGlobe();

  updateCamera();

  renderer.render(
    scene,
    camera
  );
}

animate();

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);