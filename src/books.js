import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

const booksGroup = new THREE.Group();

const loader = new GLTFLoader();

loader.load(
  '/models/Books/pile_books.glb',
  (gltf) => {
    const books = gltf.scene;

    books.scale.setScalar(0.6);

    books.position.set(
      -0.25,
      0.04,
      0
    );

    books.rotation.set(
      0,
      -0.2,
      0
    );

    books.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    booksGroup.add(books);
  },
  undefined,
  (error) => {
    console.error(
      'Error loading books:',
      error
    );
  }
);

booksGroup.position.set(
  -1.25,
  0.88,
  0.25
);

booksGroup.rotation.y = -0.08;

scene.add(booksGroup);

export {
  booksGroup
};
