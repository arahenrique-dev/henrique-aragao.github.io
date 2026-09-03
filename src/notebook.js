import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

import {
  registerInteractive
} from './interaction.js';

const notebookGroup = new THREE.Group();

const loader = new GLTFLoader();

let mixer = null;

loader.load(
  '/models/Notebook/notebook.glb',
  (gltf) => {
    const notebook = gltf.scene;

    notebook.scale.setScalar(0.17);

    notebook.position.set(
      -0.45,
      0.05,
      0.2
    );

    notebook.rotation.set(
      0,
      0.35,
      0
    );

    notebook.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    notebookGroup.add(notebook);

    registerInteractive(
    notebook,
    () => {
        openNotebook();
    }
    );

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(notebook);

      for (const clip of gltf.animations) {
        const action = mixer.clipAction(clip);

        action.reset();
        action.setLoop(
          THREE.LoopRepeat,
          Infinity
        );
        action.play();
      }
    } else {
      console.warn(
        'Notebook GLB contains no animations.'
      );
    }
  },
  undefined,
  (error) => {
    console.error(
      'Error loading notebook:',
      error
    );
  }
);

notebookGroup.position.set(
  -0.38,
  0.89,
  0.27
);

notebookGroup.rotation.y = -0.12;

scene.add(notebookGroup);

function openNotebook() {
  let overlay = document.querySelector(
    '#notebook-overlay'
  );

  if (overlay) return;

  overlay = document.createElement('div');

  overlay.id = 'notebook-overlay';

  overlay.innerHTML = `
    <div id="notebook-window">
      <button id="notebook-close">×</button>

      <div id="notebook-content">
        <h1>Notebook</h1>

        <p>
          I’ve always liked mixing things that don’t necessarily belong together.
</p>
<p>
I studied technology, but I’ve always been drawn to art, music and creative expression too. What interests me most is finding ways to bring these worlds together and use technology to create experiences that feel different, interactive and personal.
</p>
<p>
That’s also the idea behind this portfolio. It’s still a work in progress, but I wanted to make something that feels a little more like me than a traditional CV.
</p>
<p>
I’m curious, I like learning new things, and I’m always looking for new ways to create. I hope I can bring that curiosity, creativity and versatility to whatever I work on next.
</p>
<p>
— Henrique
</p>  
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });

  overlay
    .querySelector('#notebook-close')
    .addEventListener(
      'click',
      (event) => {
        event.stopPropagation();
        closeNotebook();
      }
    );

  overlay.addEventListener(
    'click',
    (event) => {
      if (event.target === overlay) {
        closeNotebook();
      }
    }
  );
}

function closeNotebook() {
  const overlay =
    document.querySelector(
      '#notebook-overlay'
    );

  if (!overlay) return;

  overlay.classList.remove(
    'visible'
  );

  setTimeout(() => {
    overlay.remove();
  }, 200);
}

function updateNotebook(delta) {
  if (!mixer) return;

  mixer.update(delta);
}

export {
  notebookGroup,
  updateNotebook
};