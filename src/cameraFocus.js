import * as THREE from 'three';

import {
  camera
} from './scene.js';

let focused = false;
let animation = null;

const defaultPosition =
  camera.position.clone();

const defaultTarget =
  new THREE.Vector3(
    0,
    1.2,
    0
  );

let currentTarget =
  defaultTarget.clone();

export function focusCamera(
  position,
  target
) {
  focused = true;

  createBackButton();

  animation = {
    startPosition: camera.position.clone(),
    startTarget: currentTarget.clone(),
    endPosition: position.clone(),
    endTarget: target.clone(),
    progress: 0,
    duration: 800
  };
}

export function resetCamera() {
  if (!focused) {
    return;
  }

  animation = {
    startPosition: camera.position.clone(),
    startTarget: currentTarget.clone(),
    endPosition: defaultPosition.clone(),
    endTarget: defaultTarget.clone(),
    progress: 0,
    duration: 800,
    returning: true
  };
}

export function updateCameraFocus(delta) {
  if (!animation) {
    return;
  }

  animation.progress +=
    delta / (animation.duration / 1000);

  const t =
    Math.min(
      animation.progress,
      1
    );

  const eased =
    t < 0.5
      ? 4 * t * t * t
      : 1 -
        Math.pow(
          -2 * t + 2,
          3
        ) / 2;

  camera.position.lerpVectors(
    animation.startPosition,
    animation.endPosition,
    eased
  );

  currentTarget.lerpVectors(
    animation.startTarget,
    animation.endTarget,
    eased
  );

  camera.lookAt(
    currentTarget
  );

  if (t >= 1) {
    camera.position.copy(
      animation.endPosition
    );

    currentTarget.copy(
      animation.endTarget
    );

    camera.lookAt(
      currentTarget
    );

    if (animation.returning) {
      focused = false;
      removeBackButton();
    }

    animation = null;
  }
}

export function isCameraFocused() {
  return focused;
}

function createBackButton() {
  if (
    document.querySelector(
      '#camera-back'
    )
  ) {
    return;
  }

  const button =
    document.createElement(
      'button'
    );

  button.id =
    'camera-back';

  button.textContent =
    '← Back';

  button.addEventListener(
    'click',
    () => {
      resetCamera();
    }
  );

  document.body.appendChild(
    button
  );

  requestAnimationFrame(
    () => {
      button.classList.add(
        'visible'
      );
    }
  );

  window.addEventListener(
    'keydown',
    handleEscape
  );
}

function removeBackButton() {
  const button =
    document.querySelector(
      '#camera-back'
    );

  if (!button) {
    return;
  }

  button.classList.remove(
    'visible'
  );

  setTimeout(
    () => {
      button.remove();
    },
    200
  );

  window.removeEventListener(
    'keydown',
    handleEscape
  );
}

function handleEscape(event) {
  if (
    event.key ===
    'Escape'
  ) {
    resetCamera();
  }
}
