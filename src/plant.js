import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

const plantGroup = new THREE.Group();

const loader = new GLTFLoader();

loader.load(
  '/models/Plant/indoorsPlant.glb',
  (gltf) => {
    const plant = gltf.scene;

    plant.scale.setScalar(0.29);

    plant.position.set(
      0.7,
      0.1,
      0
    );

    plant.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    plantGroup.add(plant);
  },
  undefined,
  (error) => {
    console.error(
      'Error loading plant:',
      error
    );
  }
);

plantGroup.position.set(
  1.65,
  0,
  -0.25
);

scene.add(plantGroup);

export {
  plantGroup
};