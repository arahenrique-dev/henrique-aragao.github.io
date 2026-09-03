import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { scene } from './scene.js';

import {
  registerInteractive
} from './interaction.js';

const mp3PlayerGroup = new THREE.Group();

const loader = new GLTFLoader();

const textureLoader = new THREE.TextureLoader();

const audio = new Audio(
  '/audio/lofi_loop.mp3'
);

audio.loop = true;

let isPlaying = false;
let screen = null;

const playTexture =
  textureLoader.load(
    '/images/play.png'
  );

const pauseTexture =
  textureLoader.load(
    '/images/pause.png'
  );

playTexture.colorSpace =
  THREE.SRGBColorSpace;

pauseTexture.colorSpace =
  THREE.SRGBColorSpace;

loader.load(
  '/models/MP3Player/mp3_player.glb',
  (gltf) => {
    const mp3Player = gltf.scene;

    mp3Player.scale.setScalar(1.3);

    mp3Player.position.set(
      -0.1,
      -0.01,
      -0.75
    );
    mp3Player.rotation.set(
      0,
      -1.7,
      0
    );

    mp3Player.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (
        child.name ===
        'Plane_Material.001_0.001'
      ) {
        screen = child;

        screen.material =
          screen.material.clone();

        screen.material.map =
          pauseTexture;

        screen.material.needsUpdate =
          true;
      }
    });

    mp3PlayerGroup.add(mp3Player);

    startAudio();
  },
  undefined,
  (error) => {
    console.error(
      'Error loading MP3 player:',
      error
    );
  }
);

mp3PlayerGroup.position.set(
  0.65,
  0.89,
  0.25
);

mp3PlayerGroup.rotation.y = -0.15;

scene.add(mp3PlayerGroup);

registerInteractive(
  mp3PlayerGroup,
  () => {
    toggleAudio();
  }
);

function startAudio() {
  audio.play()
    .then(() => {
      isPlaying = true;
      setScreen(pauseTexture);
    })
    .catch(() => {
      window.addEventListener(
        'pointerdown',
        startAudioFromInteraction,
        { once: true }
      );
    });
}

function startAudioFromInteraction() {
  audio.play()
    .then(() => {
      isPlaying = true;
      setScreen(pauseTexture);
    })
    .catch((error) => {
      console.error(
        'Could not play audio:',
        error
      );
    });
}

function toggleAudio() {
  if (isPlaying) {
    audio.pause();

    isPlaying = false;

    setScreen(playTexture);

    return;
  }

  audio.play()
    .then(() => {
      isPlaying = true;

      setScreen(pauseTexture);
    })
    .catch((error) => {
      console.error(
        'Could not play audio:',
        error
      );
    });
}

function setScreen(texture) {
  if (!screen) return;

  screen.material.map = texture;

  screen.material.needsUpdate = true;
}

export {
  mp3PlayerGroup
};