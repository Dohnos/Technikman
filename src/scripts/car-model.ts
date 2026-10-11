// Stylizované auto ze zaoblených tvarů – sdílí ho úvodní scéna i 3D protokol.
// Auto míří přídí do +x, pravá strana je +z, levá −z.
import { BufferGeometry, CylinderGeometry, Group, Material, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type Helpers = {
  add: (geo: BufferGeometry, material: Material, x: number, y: number, z: number, parent: Object3D, shadow?: boolean) => Mesh;
  mat: (color: string, roughness?: number, metalness?: number) => MeshStandardMaterial;
  track: (...items: (BufferGeometry | Material)[]) => void;
};

export const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 4, r);

export function buildCar({ add, mat, track }: Helpers, color = '#3F5B73') {
  const car = new Group();
  const paint = mat(color, 0.42, 0.12);
  const dark = mat('#1D2024', 0.85);
  const glass = mat('#3B5568', 0.08, 0.45);
  const chrome = mat('#CDD2D8', 0.25, 0.85);
  const headMat = new MeshStandardMaterial({ color: '#FFF6DE', emissive: '#FFE6A6', emissiveIntensity: 0.9 });
  const tailMat = new MeshStandardMaterial({ color: '#E0531F', emissive: '#E0531F', emissiveIntensity: 0.6 });
  track(headMat, tailMat);

  add(rbox(4.2, 0.72, 1.8, 0.3), paint, 0, 0.74, 0, car);
  add(rbox(2.3, 0.66, 1.62, 0.3), paint, -0.3, 1.32, 0, car);
  add(rbox(2.36, 0.4, 1.64, 0.16), glass, -0.3, 1.37, 0, car);
  add(rbox(0.12, 0.42, 1.66, 0.04), paint, -0.25, 1.37, 0, car);
  add(rbox(4.26, 0.16, 1.84, 0.08), dark, 0, 0.46, 0, car);
  for (const z of [0.6, -0.6]) {
    add(rbox(0.1, 0.14, 0.42, 0.05), headMat, 2.07, 0.9, z, car, false);
    add(rbox(0.1, 0.12, 0.38, 0.05), tailMat, -2.07, 0.92, z, car, false);
  }
  // zrcátka
  for (const z of [0.9, -0.9]) add(rbox(0.16, 0.12, 0.14, 0.05), paint, 0.72, 1.18, z, car);

  // motor pod kapotou
  add(rbox(0.9, 0.1, 1.1, 0.04), mat('#2A2E33', 0.55, 0.4), 1.45, 1.08, 0, car);
  add(new CylinderGeometry(0.06, 0.06, 0.03, 16), mat('#E0531F', 0.5), 1.25, 1.13, 0.25, car, false);

  const hoodPivot = new Group();
  hoodPivot.position.set(0.85, 1.12, 0);
  car.add(hoodPivot);
  add(rbox(1.22, 0.07, 1.66, 0.03), paint, 0.61, 0, 0, hoodPivot);

  const wheels: Group[] = [];
  for (const x of [1.35, -1.35]) {
    for (const z of [0.86, -0.86]) {
      const w = new Group();
      w.position.set(x, 0.4, z);
      car.add(w);
      const tire = add(new CylinderGeometry(0.4, 0.4, 0.3, 32), dark, 0, 0, 0, w);
      tire.rotation.x = Math.PI / 2;
      const rim = add(new CylinderGeometry(0.24, 0.24, 0.32, 6), chrome, 0, 0, 0, w);
      rim.rotation.x = Math.PI / 2;
      wheels.push(w);
    }
  }
  return { car, hoodPivot, wheels };
}

/** Umístění dílů karoserie pro mapu laku: [x, y, z, šířka(x), výška(y), hloubka(z)] */
export const panelPlacement: Record<string, [number, number, number, number, number, number]> = {
  kapota: [1.47, 1.172, 0, 1.12, 0.03, 1.5],
  strecha: [-0.3, 1.668, 0, 1.9, 0.03, 1.38],
  kufr: [-1.76, 1.115, 0, 0.56, 0.03, 1.5],
  blatnikLP: [1.66, 0.9, -0.912, 0.74, 0.3, 0.03],
  dvereLP: [0.42, 0.78, -0.912, 0.8, 0.5, 0.03],
  dvereLZ: [-0.44, 0.78, -0.912, 0.8, 0.5, 0.03],
  blatnikLZ: [-1.66, 0.9, -0.912, 0.74, 0.3, 0.03],
  blatnikPP: [1.66, 0.9, 0.912, 0.74, 0.3, 0.03],
  dverePP: [0.42, 0.78, 0.912, 0.8, 0.5, 0.03],
  dverePZ: [-0.44, 0.78, 0.912, 0.8, 0.5, 0.03],
  blatnikPZ: [-1.66, 0.9, 0.912, 0.74, 0.3, 0.03],
};
