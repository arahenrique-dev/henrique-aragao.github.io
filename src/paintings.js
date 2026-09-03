import * as THREE from 'three';

import { scene } from './scene.js';

const paintingsGroup = new THREE.Group();

const textureLoader = new THREE.TextureLoader();

const frameColors = [
  0x8c4f3d,
  0x526b5b,
  0xb58a4f,
  0x6a596f,
  0x3f5f70
];

const frameThickness = 0.035;
const frameDepth = 0.045;

function createPainting(
  width,
  height,
  frameColor,
  imagePath,
  position,
  rotation = 0
) {
  const painting = new THREE.Group();

  const paintingTexture =
    textureLoader.load(imagePath);

  paintingTexture.colorSpace =
    THREE.SRGBColorSpace;

  const canvasMaterial =
    new THREE.MeshStandardMaterial({
      map: paintingTexture,
      roughness: 0.9
    });

  const frameMaterial =
    new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: 0.45,
      metalness: 0.05
    });

  const canvas = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      0.018
    ),
    canvasMaterial
  );

  canvas.position.z = 0;

  const glassMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.08,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false
    });

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      0.006
    ),
    glassMaterial
  );

  glass.position.z = 0.014;

  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + frameThickness * 2,
      frameThickness,
      frameDepth
    ),
    frameMaterial
  );

  topFrame.position.set(
    0,
    height / 2 + frameThickness / 2,
    0.005
  );

  const bottomFrame = topFrame.clone();

  bottomFrame.position.y =
    -height / 2 -
    frameThickness / 2;

  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(
      frameThickness,
      height,
      frameDepth
    ),
    frameMaterial
  );

  leftFrame.position.set(
    -width / 2 -
      frameThickness / 2,
    0,
    0.005
  );

  const rightFrame = leftFrame.clone();

  rightFrame.position.x =
    width / 2 +
    frameThickness / 2;

  painting.add(canvas);
  painting.add(glass);
  painting.add(topFrame);
  painting.add(bottomFrame);
  painting.add(leftFrame);
  painting.add(rightFrame);

  painting.position.set(
    position[0],
    position[1],
    position[2]
  );

  painting.rotation.z = rotation;

  painting.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;
  });

  paintingsGroup.add(painting);

  return painting;
}

// red
createPainting(
  0.585,
  0.4125,
  frameColors[0],
  '/images/cat_painting.png',
  [-0.55, 0.18, 0],
  -0.01
);

// green
createPainting(
  0.18,
  0.255,
  frameColors[1],
  '/images/rose_painting.png',
  [-0.72, -0.3, 0],
  0.02
);

// yellow
createPainting(
  0.18,
  0.255,
  frameColors[2],
  '/images/parrot_painting.png',
  [0.05, 0.2, 0],
  -0.02
);

// purple
createPainting(
  0.255,
  0.345,
  frameColors[3],
  '/images/pigeon_painting.png',
  [-0.3, -0.35, 0],
  -0.024
);

// blue
createPainting(
  0.30,
  0.30,
  frameColors[4],
  '/images/scott_painting.png',
  [0.2, -0.25, 0],
  0.02
);



paintingsGroup.position.set(
  1.6,
  1.85,
  -0.92
);

scene.add(paintingsGroup);

export {
  paintingsGroup,
  createPainting
};