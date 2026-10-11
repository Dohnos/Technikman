// ─────────────────────────────────────────────────────────────
//  3D náhled protokolu: auto s mapou tloušťky laku po dílech
//  a špendlíky u sekcí s nálezem. Otáčení tažením (OrbitControls).
// ─────────────────────────────────────────────────────────────
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildCar, panelPlacement, rbox } from './car-model';
import { paintStatus, panels, sections, sectionStatus, statuses, type Protocol, type Status } from '../data/protocol';

const tone: Record<Status, string> = { ok: '#1E8A5A', warn: '#E3A008', bad: '#D64545', na: '#9AA0A6' };

export type Layer = 'paint' | 'findings';

export function createProtocolScene(canvas: HTMLCanvasElement, overlay: HTMLElement, protocol: Protocol) {
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(6.2, 3.6, 6.2);

  scene.add(new HemisphereLight('#ffffff', '#dcd6cb', 1.6));
  const sun = new DirectionalLight('#fff6ec', 2.2);
  sun.position.set(4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
  sun.shadow.radius = 6;
  scene.add(sun);
  const rim = new DirectionalLight('#ffe2d2', 0.7);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const disposables: (BufferGeometry | Material)[] = [];
  const mat = (color: string, roughness = 0.6, metalness = 0) => {
    const m = new MeshStandardMaterial({ color, roughness, metalness });
    disposables.push(m);
    return m;
  };
  const add = (geo: BufferGeometry, material: Material, x: number, y: number, z: number, parent: Object3D, shadow = true) => {
    disposables.push(geo);
    const o = new Mesh(geo, material);
    o.position.set(x, y, z);
    o.castShadow = shadow;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };

  // stín pod autem + jemná plošina
  const shadowMat = new ShadowMaterial({ opacity: 0.18 });
  disposables.push(shadowMat);
  const ground = add(new CircleGeometry(6, 64), shadowMat, 0, 0, 0, scene, false);
  ground.rotation.x = -Math.PI / 2;
  const disk = add(new CylinderGeometry(3.2, 3.3, 0.04, 96), mat('#ECE8E1', 0.95), 0, 0.02, 0, scene, false);
  disk.receiveShadow = true;

  const { car } = buildCar({ add, mat, track: (...i) => disposables.push(...i) }, '#C7CDD3');
  car.position.y = 0.04;
  scene.add(car);

  // ── Mapa laku ──
  const paintLayer = new Group();
  car.add(paintLayer);
  const paintLabels: { el: HTMLElement; pos: Vector3 }[] = [];
  for (const panel of panels) {
    const value = protocol.paint[panel.id];
    if (value == null) continue;
    const st = paintStatus(value);
    const [x, y, z, w, h, d] = panelPlacement[panel.id];
    const m = new MeshStandardMaterial({
      color: tone[st],
      roughness: 0.4,
      emissive: tone[st],
      emissiveIntensity: st === 'ok' ? 0.1 : 0.35,
      transparent: st === 'ok',
      opacity: st === 'ok' ? 0.55 : 1,
    });
    disposables.push(m);
    add(rbox(w, h, d, Math.min(w, h, d) / 2.2), m, x, y, z, paintLayer, false);
    // popisek jen u dílů mimo originál, ať je náhled přehledný
    if (st === 'ok') continue;
    const el = document.createElement('span');
    el.className = `pv-chip pv-chip--${st}`;
    el.textContent = `${value} µm`;
    overlay.append(el);
    const out = new Vector3(x, y, z);
    if (Math.abs(z) > 0.5) out.z += Math.sign(z) * 0.15;
    else out.y += 0.12;
    paintLabels.push({ el, pos: out });
  }

  // ── Špendlíky nálezů ──
  const pinLayer = new Group();
  car.add(pinLayer);
  const pinLabels: { el: HTMLElement; pos: Vector3 }[] = [];
  const rings: Mesh[] = [];
  for (const sec of sections) {
    if (!sec.anchor) continue;
    const st = sectionStatus(protocol, sec);
    if (st !== 'warn' && st !== 'bad') continue;
    const [x, y, z] = sec.anchor;
    const pin = new Group();
    pin.position.set(x, y, z);
    pinLayer.add(pin);
    const pm = new MeshStandardMaterial({ color: tone[st], emissive: tone[st], emissiveIntensity: 0.35, roughness: 0.35 });
    disposables.push(pm);
    add(new CylinderGeometry(0.012, 0.012, 0.55, 8), mat('#16181B', 0.5), 0, 0.275, 0, pin, false);
    add(new SphereGeometry(0.09, 20, 14), pm, 0, 0.6, 0, pin, false);
    const rm = new MeshBasicMaterial({ color: tone[st], transparent: true, opacity: 0.6 });
    disposables.push(rm);
    const ring = add(new TorusGeometry(0.12, 0.012, 8, 40), rm, 0, 0.005, 0, pin, false);
    ring.rotation.x = Math.PI / 2;
    rings.push(ring);
    const count = sec.items.filter((it) => {
      const s = protocol.items[`${sec.id}.${it.id}`]?.s;
      return s === 'warn' || s === 'bad';
    }).length;
    const el = document.createElement('span');
    el.className = `pv-pin pv-pin--${st}`;
    el.innerHTML = `<b>${sec.title}</b><small>${count}× ${statuses[st].label.toLowerCase()}</small>`;
    overlay.append(el);
    pinLabels.push({ el, pos: new Vector3(x, y + 0.75, z) });
  }

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 5.5;
  controls.maxDistance = 13;
  controls.maxPolarAngle = 1.45;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.addEventListener('start', () => (controls.autoRotate = false));

  let width = 1;
  let height = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const far = camera.aspect < 1 ? 11.5 : 8.8;
    camera.position.setLength(far);
    camera.updateProjectionMatrix();
  };

  const tmp = new Vector3();
  const place = (list: { el: HTMLElement; pos: Vector3 }[], visible: boolean) => {
    for (const l of list) {
      tmp.copy(l.pos);
      car.localToWorld(tmp);
      tmp.project(camera);
      const on = visible && tmp.z < 1;
      l.el.style.transform = `translate(${((tmp.x + 1) / 2) * width}px, ${((1 - tmp.y) / 2) * height}px) translate(-50%, -50%)`;
      l.el.classList.toggle('is-on', on);
    }
  };

  let running = false;
  let raf = 0;
  let t = 0;
  const frame = () => {
    t += 0.016;
    rings.forEach((r, i) => {
      const k = (t * 0.8 + i * 0.3) % 1;
      r.scale.setScalar(1 + k * 1.6);
      (r.material as MeshBasicMaterial).opacity = 0.6 * (1 - k);
    });
    controls.update();
    renderer.render(scene, camera);
    place(paintLabels, paintLayer.visible);
    place(pinLabels, pinLayer.visible);
    if (running) raf = requestAnimationFrame(frame);
  };

  resize();
  frame();

  return {
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize() {
      resize();
      frame();
    },
    setLayer(layer: Layer, on: boolean) {
      (layer === 'paint' ? paintLayer : pinLayer).visible = on;
      frame();
    },
    snapshot() {
      renderer.render(scene, camera);
      return canvas.toDataURL('image/png');
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
