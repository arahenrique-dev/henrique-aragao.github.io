import * as THREE from 'three';

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const scene = new THREE.Scene();

scene.background = new THREE.Color(0xb9aa9a);

export const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 3.2, 1.35);
camera.lookAt(0, 1, 0);

export const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#scene'),
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

const ambientLight =
  new THREE.AmbientLight(
    0xffeee0,
    0.9
  );

scene.add(ambientLight);

const keyLight =
  new THREE.DirectionalLight(
    0xffe2c4,
    2.2
  );

keyLight.position.set(
  -3,
  5,
  3
);

keyLight.castShadow = true;

keyLight.shadow.mapSize.set(
  2048,
  2048
);

keyLight.shadow.camera.left = -4;
keyLight.shadow.camera.right = 4;
keyLight.shadow.camera.top = 4;
keyLight.shadow.camera.bottom = -4;

scene.add(keyLight);

const wallMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xc8b9a8,
    roughness: 0.9
  });

const wallGeometry =
  new THREE.BoxGeometry(
    8,
    4,
    0.15
  );

const wall =
  new THREE.Mesh(
    wallGeometry,
    wallMaterial
  );

wall.position.set(
  0,
  2,
  -1
);

wall.receiveShadow = true;

scene.add(wall);

const deskMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x76553b,
    roughness: 0.78
  });

const deskTopGeometry =
  new RoundedBoxGeometry(
    4,
    0.14,
    1.65,
    4,
    0.06
  );

const deskTop =
  new THREE.Mesh(
    deskTopGeometry,
    deskMaterial
  );

deskTop.position.set(
  0,
  0.85,
  0
);

deskTop.castShadow = true;
deskTop.receiveShadow = true;

scene.add(deskTop);

const legGeometry =
  new RoundedBoxGeometry(
    0.16,
    0.78,
    0.16,
    3,
    0.04
  );

const legPositions = [
  [-1.65, 0.39, -0.65],
  [1.65, 0.39, -0.65],
  [-1.65, 0.39, 0.65],
  [1.65, 0.39, 0.65]
];

for (const [x, y, z] of legPositions) {
  const leg =
    new THREE.Mesh(
      legGeometry,
      deskMaterial
    );

  leg.position.set(
    x,
    y,
    z
  );

  leg.castShadow = true;
  leg.receiveShadow = true;

  scene.add(leg);
}

const supportGeometry =
  new RoundedBoxGeometry(
    3.5,
    0.08,
    0.08,
    3,
    0.02
  );

const support =
  new THREE.Mesh(
    supportGeometry,
    deskMaterial
  );

support.position.set(
  0,
  0.65,
  -0.5
);

support.castShadow = true;

scene.add(support);

const floorMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xc9b69f,
    roughness: 0.95
  });

const floorGeometry =
  new THREE.PlaneGeometry(
    8,
    8
  );

const floor =
  new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );

floor.rotation.x =
  -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);