import * as THREE from 'three';

import { scene } from './scene.js';

const pinboard = new THREE.Group();

pinboard.position.set(
  -0.6,
  1.75,
  -0.88
);


const boardWidth = 2.3;
const boardHeight = 1.25;
const boardDepth = 0.1;
const frameThickness = 0.06;

const textureLoader = new THREE.TextureLoader();

const corkMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xb88962,
    roughness: 1
  });

const frameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xb8b8b5,
    metalness: 0.8,
    roughness: 0.28
  });

const corkGeometry =
  new THREE.BoxGeometry(
    boardWidth,
    boardHeight,
    boardDepth
  );

const cork = new THREE.Mesh(
  corkGeometry,
  corkMaterial
);

cork.castShadow = true;
cork.receiveShadow = true;

pinboard.add(cork);

const topFrame = new THREE.Mesh(
  new THREE.BoxGeometry(
    boardWidth + frameThickness * 2,
    frameThickness,
    boardDepth + 0.04
  ),
  frameMaterial
);

topFrame.position.y =
  boardHeight / 2 +
  frameThickness / 2;

const bottomFrame = topFrame.clone();

bottomFrame.position.y =
  -boardHeight / 2 -
  frameThickness / 2;

const leftFrame = new THREE.Mesh(
  new THREE.BoxGeometry(
    frameThickness,
    boardHeight,
    boardDepth + 0.04
  ),
  frameMaterial
);

leftFrame.position.x =
  -boardWidth / 2 -
  frameThickness / 2;

const rightFrame = leftFrame.clone();

rightFrame.position.x =
  boardWidth / 2 +
  frameThickness / 2;

for (const frame of [
  topFrame,
  bottomFrame,
  leftFrame,
  rightFrame
]) {
  frame.castShadow = true;
  frame.receiveShadow = true;
  pinboard.add(frame);
}

scene.add(pinboard);

function createPaper(
  width,
  height,
  color,
  position,
  rotation
) {
  const geometry =
    new THREE.PlaneGeometry(
      width,
      height
    );

  const material =
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      side: THREE.DoubleSide
    });

  const paper = new THREE.Mesh(
    geometry,
    material
  );

  paper.position.set(
    position[0],
    position[1],
    position[2]
  );

  paper.rotation.z = rotation;

  paper.castShadow = true;
  paper.receiveShadow = true;

  pinboard.add(paper);

  return paper;
}

function createImage(
  path,
  width,
  position,
  rotation
) {
  textureLoader.load(
    path,
    (texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      const imageWidth =
        texture.image.width;

      const imageHeight =
        texture.image.height;

      const aspectRatio =
        imageHeight / imageWidth;

      const height =
        width * aspectRatio;

      const geometry =
        new THREE.PlaneGeometry(
          width,
          height
        );

      const material =
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.9,
          side: THREE.DoubleSide
        });

      const image = new THREE.Mesh(
        geometry,
        material
      );

      image.position.set(
        position[0],
        position[1],
        position[2]
      );

      image.rotation.z = rotation;

      image.castShadow = true;
      image.receiveShadow = true;

      pinboard.add(image);
    },
    undefined,
    (error) => {
      console.error(
        `Error loading image ${path}:`,
        error
      );
    }
  );
}

function createTransparentImage(
  path,
  width,
  position,
  rotation
) {
  textureLoader.load(
    path,
    (texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      const imageWidth =
        texture.image.width;

      const imageHeight =
        texture.image.height;

      const aspectRatio =
        imageHeight / imageWidth;

      const height =
        width * aspectRatio;

      const geometry =
        new THREE.PlaneGeometry(
          width,
          height
        );

      const material =
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.01,
          roughness: 0.9,
          side: THREE.DoubleSide,
          depthWrite: false
        });

      const image = new THREE.Mesh(
        geometry,
        material
      );

      image.position.set(
        position[0],
        position[1],
        position[2]
      );

      image.rotation.z = rotation;

      image.castShadow = true;
      image.receiveShadow = true;

      scene.add(image);
    },
    undefined,
    (error) => {
      console.error(
        `Error loading transparent image ${path}:`,
        error
      );
    }
  );
}

function createSticker(
  path,
  width,
  position,
  rotation
) {
  textureLoader.load(
    path,
    (texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      const imageWidth =
        texture.image.width;

      const imageHeight =
        texture.image.height;

      const aspectRatio =
        imageHeight / imageWidth;

      const height =
        width * aspectRatio;

      const geometry =
        new THREE.PlaneGeometry(
          width,
          height
        );

      const material =
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.01,
          roughness: 0.9,
          side: THREE.DoubleSide
        });

      const sticker = new THREE.Mesh(
        geometry,
        material
      );

      sticker.position.set(
        position[0],
        position[1],
        position[2]
      );

      sticker.rotation.z = rotation;

      sticker.castShadow = true;
      sticker.receiveShadow = true;

      pinboard.add(sticker);
    },
    undefined,
    (error) => {
      console.error(
        `Error loading sticker ${path}:`,
        error
      );
    }
  );
}

function createPin(
  position,
  color = 0xc93636
) {
  const geometry =
    new THREE.SphereGeometry(
      0.025,
      12,
      12
    );

  const material =
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0
    });

  const pin = new THREE.Mesh(
    geometry,
    material
  );

  pin.position.set(
    position[0],
    position[1],
    position[2]
  );

  pin.castShadow = true;

  pinboard.add(pin);

  return pin;
}

createImage(
  '/images/carte_jussieu.png',
  0.65,
  [-0.58, 0.32, 0.065],
  -0.04
);

createPin([
  -0.58,
  0.32 + 0.24,
  0.09
]);

createImage(
  '/images/class_post_it.png',
  0.45,
  [-0.72, 0.03, 0.07],
  0.09
);

createPin(
  [
    -0.72,
    0.08 + 0.13,
    0.1
  ],
  0xe0a52b
);

createSticker(
  '/images/stickers/blender.png',
  0.2,
  [0.02, 0.48, 0.057],
  -0.07
);

createSticker(
  '/images/stickers/p5js.png',
  0.2,
  [0.27, 0.42, 0.068],
  0.08
);

createSticker(
  '/images/stickers/threejs.png',
  0.25,
  [0.06, 0.29, 0.07],
  0.04
);

createSticker(
  '/images/stickers/unity.png',
  0.24,
  [0.3, 0.25, 0.06],
  -0.1
);

createSticker(
  '/images/stickers/js.png',
  0.2,
  [0.19, 0.14, 0.065],
  0.06
);

createImage(
  '/images/dila_section.png',
  0.55,
  [0.72, 0.23, 0.065],
  0.06
);

createPin([
  0.72,
  0.2 + 0.36,
  0.095
]);

createImage(
  '/pinnedPhotos/photo_1.png',
  0.32,
  [-0.62, -0.4, 0.08],
  -0.07
);

createImage(
  '/pinnedPhotos/photo_2.png',
  0.3,
  [-0.18, -0.32, 0.07],
  0.05
);

createImage(
  '/pinnedPhotos/photo_3.png',
  0.32,
  [0.23, -0.27, 0.07],
  -0.04
);

createImage(
  '/pinnedPhotos/photo_4.png',
  0.3,
  [0.62, -0.28, 0.07],
  0.08
);

createPin(
  [
    -0.62,
    -0.4 + 0.18,
    0.095
  ],
  0x315f9e
);

createPin([
  -0.18,
  -0.27 + 0.125,
  0.095
]);

createPin(
  [
    0.23,
    -0.27 + 0.115,
    0.095
  ],
  0xe0a52b
);

createPin([
  0.62,
  -0.28 + 0.125,
  0.095
]);

createImage(
  '/images/language_post_it.png',
  0.48,
  [0.55, -0.55, 0.1],
  -0.06
);

createPin([
  0.4,
  -0.57 + 0.16,
  0.12
]);

createTransparentImage(
  '/images/poster.png',
  1,
  [-2.35, 1.7, -0.923],
  -0.03
);

export {
  pinboard,
  createPaper,
  createPin,
  createSticker
};