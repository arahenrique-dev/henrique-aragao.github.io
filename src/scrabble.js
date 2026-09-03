import * as THREE from 'three';

import { scene, camera, renderer } from './scene.js';

let revealStarted = false;

let revealProgress = 0;

const board = new THREE.Group();

board.position.set(
  0,
  0,
  0.05
);

scene.add(board);

const boardSize = 0.85;

const cells = 10;

const tileSize = boardSize / cells;

const boardMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x3f6b52,
    roughness: 0.8
  });

const boardGeometry =
  new THREE.BoxGeometry(
    boardSize,
    0.06,
    boardSize
  );

const boardBase =
  new THREE.Mesh(
    boardGeometry,
    boardMaterial
  );

boardBase.position.y = 0.96;

boardBase.castShadow = true;

boardBase.receiveShadow = true;

board.add(boardBase);

function createGrid() {
  const material =
    new THREE.LineBasicMaterial({
      color: 0x315340
    });

  const halfSize =
    boardSize / 2;

  for (
    let i = 0;
    i <= cells;
    i++
  ) {
    const offset =
      -halfSize +
      i * tileSize;

    const horizontalPoints = [
      new THREE.Vector3(
        -halfSize,
        0.992,
        offset
      ),
      new THREE.Vector3(
        halfSize,
        0.992,
        offset
      )
    ];

    const verticalPoints = [
      new THREE.Vector3(
        offset,
        0.992,
        -halfSize
      ),
      new THREE.Vector3(
        offset,
        0.992,
        halfSize
      )
    ];

    const horizontalGeometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          horizontalPoints
        );

    const verticalGeometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          verticalPoints
        );

    board.add(
      new THREE.Line(
        horizontalGeometry,
        material
      )
    );

    board.add(
      new THREE.Line(
        verticalGeometry,
        material
      )
    );
  }
}

function createLetterSprite(
  letter
) {
  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.width = 128;

  canvas.height = 128;

  const context =
    canvas.getContext('2d');

  context.fillStyle =
    '#3b3028';

  context.font =
    'bold 72px Arial, Helvetica, sans-serif';

  context.textAlign =
    'center';

  context.textBaseline =
    'middle';

  context.fillText(
    letter,
    64,
    64
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  const material =
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

  const geometry =
    new THREE.PlaneGeometry(
      0.14,
      0.14
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.rotation.x =
    -Math.PI / 2;

  return mesh;
}

const tileColors = [
  0xe8c98f,
  0xf0b89c,
  0xa9c8b2,
  0xb5c7e3,
  0xd6b3d8,
  0xe5b8a8,
  0xc8d59b,
  0xe7c6a5
];

function getRandomTileColor() {
  return tileColors[
    Math.floor(
      Math.random() *
      tileColors.length
    )
  ];
}

function createTile(
  letter,
  row,
  column
) {
  const geometry =
    new THREE.BoxGeometry(
      tileSize * 0.92,
      0.03,
      tileSize * 0.92
    );

  const material =
    new THREE.MeshStandardMaterial({
      color:
        getRandomTileColor(),
      roughness: 0.8
    });

  const tile =
    new THREE.Mesh(
      geometry,
      material
    );

  const halfSize =
    boardSize / 2;

  tile.position.set(
    -halfSize +
      column * tileSize +
      tileSize / 2,
    1.03,
    -halfSize +
      row * tileSize +
      tileSize / 2
  );

  tile.castShadow = true;

  tile.receiveShadow = true;

  tile.userData.letter =
    letter;

  const letterSprite =
    createLetterSprite(
      letter
    );

  letterSprite.position.y =
    0.018;

  tile.add(
    letterSprite
  );

  board.add(tile);

  return tile;
}

const layout = [
  ['E', 1, 0],
  ['X', 1, 1],
  ['P', 1, 2],
  ['E', 1, 3],
  ['R', 1, 4],
  ['I', 1, 5],
  ['E', 1, 6],
  ['N', 1, 7],
  ['C', 1, 8],
  ['E', 1, 9],

  ['R', 2, 2],
  ['J', 4, 2],
  ['E', 5, 2],
  ['C', 6, 2],
  ['T', 7, 2],
  ['S', 8, 2],

  ['A', 3, 0],
  ['B', 3, 1],
  ['O', 3, 2],
  ['U', 3, 3],
  ['T', 3, 4],

  ['S', 8, 2],
  ['K', 8, 3],
  ['I', 8, 4],
  ['L', 8, 5],
  ['L', 8, 6],
  ['S', 8, 7],

  ['E', 1, 9],
  ['D', 2, 9],
  ['U', 3, 9],
  ['C', 4, 9],
  ['A', 5, 9],
  ['T', 6, 9],
  ['I', 7, 9],
  ['O', 8, 9],
  ['N', 9, 9],

  ['U', 0, 7],
  ['N', 1, 7],
  ['L', 2, 7],
  ['O', 3, 7],
  ['K', 5, 7]
];

for (
  const [letter, row, column]
  of layout
) {
  createTile(
    letter,
    row,
    column
  );
}

createGrid();

const halfSize =
  boardSize / 2;

const looseC =
  createTile(
    'C',
    0,
    0
  );

looseC.position.set(
  0.7,
  1.03,
  0.65
);

looseC.rotation.y =
  0.40;

looseC.userData.draggable =
  true;

const unlockTarget =
  new THREE.Vector3(
    -halfSize +
      4 * tileSize +
      tileSize / 2,
    1.03,
    -halfSize +
      4 * tileSize +
      tileSize / 2
  );

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

const dragPlane =
  new THREE.Plane(
    new THREE.Vector3(
      0,
      1,
      0
    ),
    -1.03
  );

const dragPoint =
  new THREE.Vector3();

let isDragging =
  false;

function updatePointer(
  event
) {
  const rect =
    renderer.domElement
      .getBoundingClientRect();

  pointer.x =
    ((event.clientX -
      rect.left) /
      rect.width) *
      2 -
    1;

  pointer.y =
    -(
      ((event.clientY -
        rect.top) /
        rect.height) *
        2 -
      1
    );
}

renderer.domElement.addEventListener(
  'pointerdown',
  (event) => {
    updatePointer(event);

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const intersections =
      raycaster.intersectObject(
        looseC,
        true
      );

    if (
      intersections.length === 0
    ) {
      return;
    }

    isDragging = true;

    looseC.rotation.y =
      0;

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
    if (!isDragging) {
      return;
    }

    updatePointer(event);

    raycaster.setFromCamera(
      pointer,
      camera
    );

    if (
      raycaster.ray.intersectPlane(
        dragPlane,
        dragPoint
      )
    ) {
      const localPoint =
        board.worldToLocal(
          dragPoint.clone()
        );

      looseC.position.x =
        localPoint.x;

      looseC.position.z =
        localPoint.z;
    }
  }
);

renderer.domElement.addEventListener(
  'pointerup',
  (event) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    renderer.domElement.releasePointerCapture(
      event.pointerId
    );

    renderer.domElement.style.cursor =
      'default';

    const target =
      new THREE.Vector3(
        -boardSize / 2 +
          7 * tileSize +
          tileSize / 2,
        1.03,
        -boardSize / 2 +
          4 * tileSize +
          tileSize / 2
      );

    const distance =
      looseC.position.distanceTo(
        target
      );

    console.log(
      'C position:',
      looseC.position
    );

    console.log(
      'Target:',
      target
    );

    console.log(
      'Distance:',
      distance
    );

    if (
      distance <
      tileSize * 2
    ) {
      looseC.position.copy(
        target
      );

      looseC.userData.draggable =
        false;

      console.log(
        'UNLOCK!'
      );

      setTimeout(
        () => {
          revealWorkspace();
        },
        400
      );
    }
  }
);

function revealWorkspace() {
  if (revealStarted) {
    return;
  }

  revealStarted = true;

  const startPosition =
    camera.position.clone();

  const startTarget =
    new THREE.Vector3(
      0,
      0.9,
      0
    );

  const endPosition =
    new THREE.Vector3(
      0,
      2.3,
      2.5
    );

  const endTarget =
    new THREE.Vector3(
      0,
      1.4,
      0
    );

  const duration =
    1800;

  const startTime =
    performance.now();

  function animateReveal(
    time
  ) {
    const elapsed =
      time - startTime;

    revealProgress =
      Math.min(
        elapsed / duration,
        1
      );

    const eased =
      1 -
      Math.pow(
        1 - revealProgress,
        3
      );

    camera.position.lerpVectors(
      startPosition,
      endPosition,
      eased
    );

    const target =
      new THREE.Vector3()
        .lerpVectors(
          startTarget,
          endTarget,
          eased
        );

    camera.lookAt(
      target
    );

    if (
      revealProgress < 1
    ) {
      requestAnimationFrame(
        animateReveal
      );
    }
  }

  requestAnimationFrame(
    animateReveal
  );
}
