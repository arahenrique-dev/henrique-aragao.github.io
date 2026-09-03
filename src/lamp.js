import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

const lampGroup = new THREE.Group();

const loader = new GLTFLoader();

loader.load(
  '/models/Lamp/desk_lamp.glb',
  (gltf) => {
    const lamp = gltf.scene;

    lamp.scale.setScalar(0.2);

    lamp.position.set(
      0,
      0,
      0
    );

    lamp.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    lampGroup.add(lamp);

    const lampLight = new THREE.PointLight(
      0xffd6a3,
      1,
      2.5
    );

    lampLight.position.set(
      0,
      -0.2,
      0
    );

    lampLight.castShadow = true;

    lampLight.shadow.mapSize.set(
      1024,
      1024
    );

    lampGroup.add(lampLight);
  },
  undefined,
  (error) => {
    console.error(
      'Error loading desk lamp:',
      error
    );
  }
);

lampGroup.position.set(
  -1.45,
  1.35,
  -0.35
);

lampGroup.rotation.set(
  0,
  4.2,
  0
);

scene.add(lampGroup);

export {
  lampGroup
};