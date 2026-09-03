import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene, camera, renderer } from './scene.js';

const objects = new THREE.Group();

let globeGroup;
let globeBall;
let globeVelocity = 0;

function createGlobe() {
  globeGroup = new THREE.Group();

  const loader = new GLTFLoader();

  loader.load(
    '/models/Globe/Globe.glb',
    (gltf) => {
      const object = gltf.scene;

      object.scale.setScalar(1);

      let largestHorizontalArea = 0;

      object.traverse((child) => {
        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;

        const box = new THREE.Box3().setFromObject(child);
        const size = new THREE.Vector3();

        box.getSize(size);

        const horizontalArea = size.x * size.z;

        if (horizontalArea > largestHorizontalArea) {
          largestHorizontalArea = horizontalArea;
          globeBall = child;
        }
      });

      globeGroup.add(object);
    },
    undefined,
    (error) => {
      console.error(
        'Error loading globe:',
        error
      );
    }
  );

  globeGroup.position.set(
    -0.9,
    0.9,
    -0.35
  );

  globeGroup.rotation.set(
    0,
    -1,
    0
  );

  objects.add(globeGroup);

  return globeGroup;
}

const globeRaycaster = new THREE.Raycaster();
const globePointer = new THREE.Vector2();

let rotatingGlobe = false;
let lastPointerX = 0;

function updateGlobePointer(event) {
  const rect =
    renderer.domElement.getBoundingClientRect();

  globePointer.x =
    ((event.clientX - rect.left) /
      rect.width) *
      2 -
    1;

  globePointer.y =
    -(
      ((event.clientY - rect.top) /
        rect.height) *
        2 -
      1
    );
}

function rotateGlobe(amount) {
  if (!globeBall) return;

  const localAxis =
    new THREE.Vector3(0, 1, 0);

  const quaternion =
    new THREE.Quaternion();

  quaternion.setFromAxisAngle(
    localAxis,
    amount
  );

  globeBall.quaternion.multiply(
    quaternion
  );
}

renderer.domElement.addEventListener(
  'pointerdown',
  (event) => {
    if (!globeBall) return;

    updateGlobePointer(event);

    globeRaycaster.setFromCamera(
      globePointer,
      camera
    );

    const intersections =
      globeRaycaster.intersectObject(
        globeBall,
        true
      );

    if (intersections.length === 0) {
      return;
    }

    rotatingGlobe = true;
    lastPointerX = event.clientX;
    globeVelocity = 0;

    renderer.domElement.setPointerCapture(
      event.pointerId
    );

    renderer.domElement.style.cursor =
      'grabbing';
  }
);

renderer.domElement.addEventListener(
  'pointermove',
  (event) => {
    if (
      !rotatingGlobe ||
      !globeBall
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      lastPointerX;

    const rotationAmount =
      deltaX * 0.01;

    rotateGlobe(
      rotationAmount
    );

    globeVelocity =
      globeVelocity * 0.7 +
      rotationAmount * 0.3;

    lastPointerX =
      event.clientX;
  }
);

renderer.domElement.addEventListener(
  'pointerup',
  (event) => {
    if (!rotatingGlobe) {
      return;
    }

    rotatingGlobe = false;

    renderer.domElement.releasePointerCapture(
      event.pointerId
    );

    renderer.domElement.style.cursor =
      'default';
  }
);

renderer.domElement.addEventListener(
  'pointercancel',
  (event) => {
    if (!rotatingGlobe) {
      return;
    }

    rotatingGlobe = false;

    renderer.domElement.releasePointerCapture(
      event.pointerId
    );

    renderer.domElement.style.cursor =
      'default';
  }
);

function updateGlobe() {
  if (
    !rotatingGlobe &&
    globeBall
  ) {
    rotateGlobe(
      globeVelocity
    );

    globeVelocity *= 0.95;

    if (
      Math.abs(globeVelocity) <
      0.0001
    ) {
      globeVelocity = 0;
    }
  }
}

const globe = createGlobe();

scene.add(objects);

export {
  objects,
  globe,
  updateGlobe
};