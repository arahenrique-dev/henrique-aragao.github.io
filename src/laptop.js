
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

import {
  registerInteractive
} from './interaction.js';

const laptopGroup = new THREE.Group();

const loader = new GLTFLoader();

loader.load(
  '/models/Laptop/macbook_neo.glb',
  (gltf) => {
    const laptop = gltf.scene;

    laptop.scale.setScalar(2.5);

    laptop.position.set(
      0.15,
      0.03,
      0
    );

    laptop.rotation.set(
      0,
      -0.6,
      0
    );

    laptop.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      registerInteractive(
        child,
        () => {
          openLaptop();
        }
      );
    });

    laptopGroup.add(laptop);
  },
  undefined,
  (error) => {
    console.error(
      'Error loading laptop:',
      error
    );
  }
);

laptopGroup.position.set(
  0.95,
  0.89,
  0.05
);

laptopGroup.rotation.y = -0.12;

scene.add(laptopGroup);

function openLaptop() {
  let overlay =
    document.querySelector(
      '#laptop-overlay'
    );

  if (overlay) return;

  overlay =
    document.createElement(
      'div'
    );

  overlay.id =
    'laptop-overlay';

  overlay.innerHTML = `
    <div id="laptop-window">
      <button id="laptop-close">×</button>

      <div id="laptop-content">
        <div id="laptop-header">
          <span>My work</span>
        </div>

        <a
          class="github-card"
          href="https://github.com/arahenrique-dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="github-icon">⌘</div>

          <div>
            <h1>GitHub</h1>
            <p>Check out more of my projects!</p>
          </div>

          <span class="github-arrow">↗</span>
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(
    overlay
  );

  requestAnimationFrame(() => {
    overlay.classList.add(
      'visible'
    );
  });

  overlay
    .querySelector(
      '#laptop-close'
    )
    .addEventListener(
      'click',
      (event) => {
        event.stopPropagation();
        closeLaptop();
      }
    );

  overlay.addEventListener(
    'click',
    (event) => {
      if (
        event.target === overlay
      ) {
        closeLaptop();
      }
    }
  );
}

function closeLaptop() {
  const overlay =
    document.querySelector(
      '#laptop-overlay'
    );

  if (!overlay) return;

  overlay.classList.remove(
    'visible'
  );

  setTimeout(() => {
    overlay.remove();
  }, 200);
}

export {
  laptopGroup
};
