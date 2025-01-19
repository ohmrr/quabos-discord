'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// https://github.com/yarnpkg/berry/blob/master/packages/docusaurus/src/components/StarrySky.tsx
const r = 1000;
const FACTOR = 4;
const SPEED = 0.3;

// https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/
function getPoint() {
  const u = Math.random();
  const v = Math.random();

  const theta = u * 2.0 * Math.PI;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const phi = Math.acos(2.0 * v - 1.0);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const r = Math.cbrt(Math.random());

  return {
    x: r * cosTheta * sinPhi,
    y: r * sinTheta * sinPhi,
    z: r * cosPhi,
  };
}

function getRandomParticlePos(particleCount: number) {
  const arr = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const { x, y, z } = getPoint();

    arr[i + 0] = x * r;
    arr[i + 1] = y * r;
    arr[i + 2] = z * r;
  }

  return arr;
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const { clientWidth, clientHeight } = canvas;

  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    renderer.setSize(clientWidth, clientHeight, false);
    return true;
  }

  return false;
}

function installBackground(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  const scene = new THREE.Scene();

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const fov = 75;
  const aspect = 2;
  const near = 1.5;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

  geometrys[0].setAttribute(
    `position`,
    new THREE.BufferAttribute(getRandomParticlePos(350 * FACTOR), 3),
  );

  geometrys[1].setAttribute(
    `position`,
    new THREE.BufferAttribute(getRandomParticlePos(1500 * FACTOR), 3),
  );

  const loader = new THREE.TextureLoader();

  const materials = [
    new THREE.PointsMaterial({
      map: loader.load('./star1.png'),
      alphaTest: 0.5,
      sizeAttenuation: true,
    }),
    new THREE.PointsMaterial({
      size: 1,
      map: loader.load('./star2.png'),
      alphaTest: 0.5,
      sizeAttenuation: true,
    }),
  ];

  const container = new THREE.Object3D();
  scene.add(container);

  const starsT1 = new THREE.Points(geometrys[0], materials[0]);
  const starsT2 = new THREE.Points(geometrys[1], materials[1]);
  container.add(starsT1);
  container.add(starsT2);

  let timer: ReturnType<typeof requestAnimationFrame>;

  let lastTime: number | null = null;
  let aggregatedTime = 0;

  const render = (time: number) => {
    aggregatedTime += Math.min(time - (lastTime ?? time), 1000 / 60);
    lastTime = time;

    container.rotation.x = (((aggregatedTime / 1000) * Math.PI) / 80) * SPEED;
    container.rotation.y = (((aggregatedTime / 1000) * Math.PI) / 80) * SPEED;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    timer = requestAnimationFrame(render);
  };

  timer = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(timer);
  };
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCrashed, setIsCrashed] = useState(false);

  useEffect(() => {
    try {
      installBackground(canvasRef.current!);
    } catch {
      setIsCrashed(true);
    }
  }, []);

  if (isCrashed) return null;

  return <canvas className='h-full w-full' ref={canvasRef} />;
}
