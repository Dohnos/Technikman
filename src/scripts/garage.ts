// ─────────────────────────────────────────────────────────────
//  3D scéna v úvodu: mechanik prověřuje auto.
//  Průběh řídí scroll (progress 0–1):
//   0.00–0.25  přejde k boku auta, skenuje lak
//   0.25–0.50  jde k přídi, otevře kapotu
//   0.50–0.75  kontroluje přední kolo a podvozek
//   0.75–1.00  ustoupí, kapota se zavře, verdikt
// ─────────────────────────────────────────────────────────────
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildCar, rbox as roundedBox } from './car-model';

export type GarageLabel = { el: HTMLElement; anchor: [number, number, number]; at: number };

type Options = {
  labels: GarageLabel[];
  reduced: boolean;
  onFrame?: (p: number) => void;
};

const BG = '#F3F1EC';
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function createGarage(canvas: HTMLCanvasElement, opts: Options) {
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  scene.background = new Color(BG);
  scene.fog = new Fog(BG, 14, 30);

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);

  // ── Světla ──
  scene.add(new HemisphereLight('#ffffff', '#d9d2c6', 1.5));
  const sun = new DirectionalLight('#fff6ec', 2.4);
  sun.position.set(5, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  const rim = new DirectionalLight('#ffe2d2', 0.8);
  rim.position.set(-6, 4, -5);
  scene.add(rim);

  // ── Pomocníci ──
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
  const rbox = roundedBox;

  // ── Podlaha a plošina ──
  const floor = add(new CircleGeometry(40, 64), mat('#ECE8E1', 1), 0, 0, 0, scene, false);
  floor.rotation.x = -Math.PI / 2;
  const platform = add(new CylinderGeometry(4.3, 4.4, 0.06, 96), mat('#E4DFD6', 0.9), 0, 0.03, 0, scene, false);
  platform.receiveShadow = true;
  const ringMat = new MeshStandardMaterial({ color: '#E0531F', roughness: 0.5, emissive: '#E0531F', emissiveIntensity: 0.15 });
  disposables.push(ringMat);
  const ring = add(new TorusGeometry(4.05, 0.025, 8, 160), ringMat, 0, 0.065, 0, scene, false);
  ring.rotation.x = Math.PI / 2;

  // ── Auto ──
  const { car, hoodPivot, wheels } = buildCar({ add, mat, track: (...items) => disposables.push(...items) });
  car.position.y = 0.06;
  scene.add(car);
  const frontWheel = wheels[0]; // přední pravé (z +)

  // skenovací prstenec
  const scanMat = new MeshBasicMaterial({ color: '#E0531F', transparent: true, opacity: 0 });
  disposables.push(scanMat);
  const scan = add(new TorusGeometry(1.35, 0.03, 8, 96), scanMat, 0, 0.95, 0, car, false);
  scan.rotation.y = Math.PI / 2;
  scan.scale.set(1, 0.72, 1);

  // ── Rekvizity dílny ──
  const props = new Group();
  scene.add(props);
  // pojízdný vozík s nářadím
  const cart = new Group();
  cart.position.set(-3.3, 0, -1.6);
  cart.rotation.y = 0.5;
  props.add(cart);
  add(rbox(0.9, 0.9, 0.55, 0.08), mat('#E0531F', 0.5), 0, 0.55, 0, cart);
  for (const y of [0.35, 0.6, 0.85]) add(rbox(0.8, 0.02, 0.02, 0.01), mat('#16181B', 0.6), 0, y, 0.28, cart, false);
  add(rbox(0.95, 0.06, 0.6, 0.03), mat('#16181B', 0.6), 0, 1.02, 0, cart);
  for (const x of [-0.35, 0.35]) for (const z of [-0.2, 0.2]) add(new SphereGeometry(0.06, 10, 8), mat('#16181B', 0.6), x, 0.06, z, cart);
  // stoh pneumatik
  for (let i = 0; i < 3; i++) {
    const t = add(new TorusGeometry(0.34, 0.14, 12, 28), mat('#1D2024', 0.9), -3.0, 0.14 + i * 0.28, 1.9, props);
    t.rotation.x = Math.PI / 2;
  }
  // kužel
  add(new CylinderGeometry(0.03, 0.22, 0.6, 24), mat('#E0531F', 0.5), 3.2, 0.34, -1.9, props);
  add(rbox(0.5, 0.05, 0.5, 0.02), mat('#16181B', 0.6), 3.2, 0.03, -1.9, props);
  add(new CylinderGeometry(0.11, 0.155, 0.1, 24), mat('#F7DCCF', 0.4), 3.2, 0.38, -1.9, props, false);

  // ── Mechanik ──
  const mech = new Group();
  mech.position.y = 0.06;
  mech.scale.setScalar(0.82);
  scene.add(mech);
  const body = new Group();
  mech.add(body);
  const skin = mat('#E8B48E', 0.7);
  const navy = mat('#2B3440', 0.8);
  const orange = mat('#E0531F', 0.55);
  const stripe = mat('#F7DCCF', 0.35, 0.1);
  const ink = mat('#16181B', 0.6);

  const legs: Group[] = [];
  for (const z of [0.12, -0.12]) {
    const leg = new Group();
    leg.position.set(0, 0.86, z);
    body.add(leg);
    add(new CapsuleGeometry(0.1, 0.56, 6, 12), navy, 0, -0.38, 0, leg);
    add(rbox(0.3, 0.12, 0.16, 0.05), ink, 0.06, -0.8, 0, leg);
    legs.push(leg);
  }

  const torso = new Group();
  torso.position.set(0, 0.86, 0);
  body.add(torso);
  add(new CapsuleGeometry(0.26, 0.42, 8, 18), orange, 0, 0.42, 0, torso).scale.set(0.82, 1, 1);
  add(new CylinderGeometry(0.266, 0.266, 0.05, 24), stripe, 0, 0.28, 0, torso).scale.set(0.82, 1, 1);
  add(new CylinderGeometry(0.266, 0.266, 0.05, 24), stripe, 0, 0.16, 0, torso).scale.set(0.82, 1, 1);

  const head = new Group();
  head.position.set(0, 1.04, 0);
  torso.add(head);
  add(new CylinderGeometry(0.07, 0.08, 0.14, 12), skin, 0, -0.18, 0, head);
  add(new SphereGeometry(0.19, 28, 18), skin, 0, 0, 0, head);
  add(new SphereGeometry(0.2, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), ink, 0, 0.03, 0, head);
  add(rbox(0.22, 0.03, 0.3, 0.012), ink, 0.17, 0.04, 0, head);
  for (const z of [0.065, -0.065]) add(new SphereGeometry(0.022, 10, 8), ink, 0.175, -0.01, z, head, false);
  for (const z of [0.19, -0.19]) add(new SphereGeometry(0.045, 10, 8), skin, 0, -0.01, z, head, false);
  add(new SphereGeometry(0.185, 20, 12, Math.PI / 2, Math.PI, Math.PI / 2.6, Math.PI / 3), ink, -0.012, 0, 0, head, false);

  const arms: Group[] = [];
  for (const z of [0.31, -0.31]) {
    const arm = new Group();
    arm.position.set(0, 0.74, z);
    torso.add(arm);
    add(new CapsuleGeometry(0.075, 0.42, 6, 10), orange, 0, -0.27, 0, arm);
    add(new SphereGeometry(0.075, 12, 10), skin, 0, -0.55, 0, arm);
    arms.push(arm);
  }

  // tablet v rukou
  const tablet = new Group();
  tablet.position.set(0.42, 0.42, 0);
  tablet.rotation.z = -0.55;
  torso.add(tablet);
  add(rbox(0.04, 0.34, 0.46, 0.02), ink, 0, 0, 0, tablet);
  const screenMat = new MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFE9DE', emissiveIntensity: 0.6 });
  disposables.push(screenMat);
  add(rbox(0.01, 0.28, 0.4, 0.01), screenMat, -0.022, 0, 0, tablet, false);

  // ── Trasa mechanika ──
  const v = (x: number, z: number) => new Vector3(x, 0, z);
  const stations = [
    { pos: v(3.3, 2.0), look: new Vector3(1.4, 0, 0.6) },
    { pos: v(0.0, 2.1), look: new Vector3(0, 0, 0) },
    { pos: v(3.1, 0.45), look: new Vector3(1.5, 0, 0) },
    { pos: v(1.35, 1.8), look: new Vector3(1.35, 0, 0.9) },
    { pos: v(3.7, 2.7), look: new Vector3(0, 0, 0) },
  ];
  const waypoints: (Vector3 | null)[] = [null, v(2.9, 1.75), v(2.9, 1.5), null];
  const paths = stations.slice(0, -1).map((s, i) => {
    const pts = [s.pos, ...(waypoints[i] ? [waypoints[i]!] : []), stations[i + 1].pos];
    return new CatmullRomCurve3(pts, false, 'centripetal');
  });
  const lengths = paths.map((c) => c.getLength());

  // ── Kamera: klíčové pohledy podle progresu ──
  const camKeys = [
    { p: 0, az: 0.62, r: 1, h: 5.2 },
    { p: 0.25, az: 1.2, r: 0.9, h: 4.4 },
    { p: 0.5, az: 0.3, r: 0.88, h: 5.0 },
    { p: 0.75, az: 0.85, r: 0.82, h: 3.6 },
    { p: 1, az: 0.62, r: 1.04, h: 5.4 },
  ];
  const camAt = (p: number) => {
    let i = 0;
    while (i < camKeys.length - 2 && p > camKeys[i + 1].p) i++;
    const a = camKeys[i];
    const b = camKeys[i + 1];
    const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
    return {
      az: MathUtils.lerp(a.az, b.az, t),
      r: MathUtils.lerp(a.r, b.r, t),
      h: MathUtils.lerp(a.h, b.h, t),
    };
  };

  // ── Stav ──
  let target = opts.reduced ? 1 : 0;
  let p = target;
  let facing = Math.atan2(-(stations[0].look.z - stations[0].pos.z), stations[0].look.x - stations[0].pos.x);
  let moving = 0;
  let baseRadius = 13;
  let width = 1;
  let height = 1;
  let raf = 0;
  let running = false;
  let last = performance.now();
  let time = 0;
  const tmp = new Vector3();
  const tan = new Vector3();
  const look = new Vector3(0.5, 0.75, 0.5);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Na výšku (mobil) kameru oddálit, aby se vešlo auto i mechanik
    baseRadius = camera.aspect < 1 ? (13 / Math.max(camera.aspect, 0.5)) * 0.7 : camera.aspect < 1.4 ? 15 : 13;
    camera.updateProjectionMatrix();
  };

  const update = (dt: number) => {
    time += dt;
    p += (target - p) * Math.min(1, dt * 4.5);
    if (Math.abs(target - p) < 0.0005 || !Number.isFinite(p)) p = target;

    const seg = Math.min(3, Math.max(0, Math.floor(p * 4)));
    const local = p * 4 - seg;
    const walkT = smooth(clamp01(local / 0.5));
    const walk = (i: number) => (p * 4 >= i + 0.5 ? 1 : p * 4 <= i ? 0 : smooth((p * 4 - i) / 0.5));
    const act = (i: number) => clamp01((p * 4 - i - 0.5) / 0.5);

    // pozice mechanika
    const curve = paths[seg];
    curve.getPointAt(walkT, tmp);
    mech.position.set(tmp.x, 0.06, tmp.z);
    const isWalking = walkT > 0.001 && walkT < 0.999;
    moving += ((isWalking ? 1 : 0) - moving) * Math.min(1, dt * 8);

    // natočení
    let desired: number;
    if (isWalking) {
      curve.getTangentAt(walkT, tan);
      desired = Math.atan2(-tan.z, tan.x);
    } else {
      const st = stations[walkT >= 0.999 ? seg + 1 : seg];
      desired = Math.atan2(-(st.look.z - tmp.z), st.look.x - tmp.x);
    }
    let diff = desired - facing;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    facing += diff * Math.min(1, dt * 7);
    mech.rotation.y = facing;

    // chůze – krok podle ušlé vzdálenosti
    const dist = walkT * lengths[seg];
    const swing = Math.sin(dist * 6.5) * 0.5 * moving;
    legs[0].rotation.z = swing;
    legs[1].rotation.z = -swing;
    body.position.y = Math.abs(Math.cos(dist * 6.5)) * 0.035 * moving;

    // kontrola kola: předklon
    const lean = smooth(act(2)) * (1 - walk(3));
    torso.rotation.z = -0.62 * lean;
    body.position.y -= 0.06 * lean;
    legs[0].rotation.z += 0.3 * lean;
    legs[1].rotation.z -= 0.25 * lean;

    // ruce drží tablet, při kontrole kola sahají dolů
    const breathe = opts.reduced ? 0 : Math.sin(time * 1.6) * 0.03;
    for (const [i, arm] of arms.entries()) {
      arm.rotation.z = MathUtils.lerp(0.95, 0.35, lean) + breathe;
      arm.rotation.x = (i === 0 ? 0.32 : -0.32) * (1 - lean);
    }
    tablet.visible = lean < 0.6;
    tablet.position.y = 0.42 + breathe * 0.4;
    head.rotation.z = -0.25 + 0.2 * lean + (opts.reduced ? 0 : Math.sin(time * 0.7) * 0.05);

    // sken laku
    const a0 = act(0);
    scan.position.x = MathUtils.lerp(2.3, -2.3, smooth(a0));
    scanMat.opacity = a0 > 0 && a0 < 1 ? Math.sin(Math.PI * a0) * 0.85 : 0;

    // kapota
    hoodPivot.rotation.z = 1.05 * smooth(act(1)) * (1 - walk(3));

    // kolo se protočí
    frontWheel.rotation.z = -smooth(act(2)) * Math.PI * 2;

    // verdikt – prstenec zezelená
    const verdict = smooth(act(3));
    ringMat.color.set('#E0531F').lerp(new Color('#1E8A5A'), verdict);
    ringMat.emissive.copy(ringMat.color);

    // kamera
    const c = camAt(p);
    const az = c.az + (opts.reduced ? 0 : Math.sin(time * 0.22) * 0.035);
    const r = baseRadius * c.r;
    camera.position.set(Math.cos(az) * r, c.h, Math.sin(az) * r);
    camera.lookAt(look);

    // štítky
    for (const l of opts.labels) {
      tmp.set(...l.anchor).project(camera);
      const visible = p >= l.at && tmp.z < 1;
      l.el.style.transform = `translate(${((tmp.x + 1) / 2) * width}px, ${((1 - tmp.y) / 2) * height}px) translate(-50%, -100%)`;
      l.el.classList.toggle('is-on', visible);
    }
    opts.onFrame?.(p);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    renderer.render(scene, camera);
    raf = running ? requestAnimationFrame(frame) : 0;
  };

  resize();
  update(0);
  renderer.render(scene, camera);

  return {
    setProgress(value: number) {
      if (!Number.isFinite(value)) return;
      target = opts.reduced ? 1 : clamp01(value);
    },
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize() {
      resize();
      renderer.render(scene, camera);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
