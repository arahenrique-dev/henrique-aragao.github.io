import * as THREE from 'three';

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const interactiveObjects = [];

let hoveredObject = null;

const outlineColor = 0xffe4c4;

function createOutline(object) {
  if (object.userData.outlineGroup) {
    return;
  }

  const outlineGroup = new THREE.Group();

  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) {
      return;
    }

    const edgesGeometry =
      new THREE.EdgesGeometry(
        child.geometry,
        25
      );

    const glowMaterial =
      new THREE.LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

    const glow =
      new THREE.LineSegments(
        edgesGeometry,
        glowMaterial
      );

    glow.scale.setScalar(1.015);

    const lineMaterial =
      new THREE.LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });

    const line =
      new THREE.LineSegments(
        edgesGeometry,
        lineMaterial
      );

    line.scale.setScalar(1.008);

    glow.raycast = () => {};
    line.raycast = () => {};

    child.add(glow);
    child.add(line);

    outlineGroup.userData.lines =
      outlineGroup.userData.lines || [];

    outlineGroup.userData.lines.push(
      glow,
      line
    );
  });

  object.userData.outlineGroup =
    outlineGroup;

  object.userData.outlineOpacity = 0;
}

function setOutlineTarget(object, active) {
  if (!object) {
    return;
  }

  createOutline(object);

  object.userData.outlineTarget =
    active ? 1 : 0;
}

function updateOutline(object, delta) {
  if (!object?.userData.outlineGroup) {
    return;
  }

  const target =
    object.userData.outlineTarget || 0;

  const current =
    object.userData.outlineOpacity || 0;

  const speed = 8;

  const next =
    THREE.MathUtils.lerp(
      current,
      target,
      1 - Math.exp(-speed * delta)
    );

  object.userData.outlineOpacity =
    next;

  const lines =
    object.userData.outlineGroup.userData.lines;

  if (!lines) {
    return;
  }

  lines.forEach((line, index) => {
    if (index % 2 === 0) {
      line.material.opacity =
        next * 0.16;
    } else {
      line.material.opacity =
        next * 0.85;
    }
  });
}

function getInteractiveObject(intersections) {
  for (const intersection of intersections) {
    let object =
      intersection.object;

    while (object) {
      if (
        interactiveObjects.includes(
          object
        )
      ) {
        return object;
      }

      object =
        object.parent;
    }
  }

  return null;
}

export function registerInteractive(
  object,
  onClick
) {
  object.userData.onClick =
    onClick;

  object.userData.outlineTarget =
    0;

  object.userData.outlineOpacity =
    0;

  interactiveObjects.push(
    object
  );
}

export function setupInteractions(
  camera,
  renderer
) {
  const canvas =
    renderer.domElement;

  canvas.addEventListener(
    'pointermove',
    (event) => {
      const rect =
        canvas.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      pointer.y =
        -(
          ((event.clientY - rect.top) /
            rect.height) *
            2 -
          1
        );

      raycaster.setFromCamera(
        pointer,
        camera
      );

      const intersections =
        raycaster.intersectObjects(
          interactiveObjects,
          true
        );

      const object =
        getInteractiveObject(
          intersections
        );

      if (
        object !==
        hoveredObject
      ) {
        if (hoveredObject) {
          setOutlineTarget(
            hoveredObject,
            false
          );
        }

        hoveredObject =
          object;

        if (hoveredObject) {
          setOutlineTarget(
            hoveredObject,
            true
          );
        }

        canvas.style.cursor =
          object
            ? 'pointer'
            : 'default';
      }
    }
  );

  canvas.addEventListener(
    'pointerleave',
    () => {
      if (hoveredObject) {
        setOutlineTarget(
          hoveredObject,
          false
        );

        hoveredObject = null;
      }

      canvas.style.cursor =
        'default';
    }
  );

  canvas.addEventListener(
    'click',
    () => {
      raycaster.setFromCamera(
        pointer,
        camera
      );

      const intersections =
        raycaster.intersectObjects(
          interactiveObjects,
          true
        );

      const object =
        getInteractiveObject(
          intersections
        );

      if (
        object &&
        typeof object.userData
          .onClick ===
          'function'
      ) {
        object.userData.onClick();
      }
    }
  );
}

export function updateInteractions(
  delta
) {
  interactiveObjects.forEach(
    (object) => {
      updateOutline(
        object,
        delta
      );
    }
  );
}
