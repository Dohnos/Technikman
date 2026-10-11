// ─────────────────────────────────────────────────────────────
//  Zabalení protokolu do odkazu (#…) a ověření podpisu.
//  Formát: base64url( deflate( JSON { p: "<protokol JSON>", s: "<podpis>" } ) )
//  Podpis: ECDSA P-256 / SHA-256 nad řetězcem p.
// ─────────────────────────────────────────────────────────────
import type { Protocol } from '../data/protocol';

const b64url = (bytes: Uint8Array) => {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (str: string) => {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

const pipe = async (data: Uint8Array, stream: CompressionStream | DecompressionStream) => {
  const out = new Blob([data]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
};

const ALG = { name: 'ECDSA', namedCurve: 'P-256' } as const;
const SIGN = { name: 'ECDSA', hash: 'SHA-256' } as const;

export type Decoded = { protocol: Protocol; signed: boolean; verified: boolean | null };

export async function encodeProtocol(protocol: Protocol, privateJwk?: JsonWebKey | null) {
  const p = JSON.stringify(protocol);
  let s: string | undefined;
  if (privateJwk) {
    const key = await crypto.subtle.importKey('jwk', privateJwk, ALG, false, ['sign']);
    s = b64url(new Uint8Array(await crypto.subtle.sign(SIGN, key, new TextEncoder().encode(p))));
  }
  const raw = new TextEncoder().encode(JSON.stringify(s ? { p, s } : { p }));
  if ('CompressionStream' in window) return `z.${b64url(await pipe(raw, new CompressionStream('deflate-raw')))}`;
  return `j.${b64url(raw)}`;
}

export async function decodeProtocol(hash: string, publicKey: { x: string; y: string } | null): Promise<Decoded> {
  const [kind, body] = [hash.slice(0, 2), hash.slice(2)];
  let raw: Uint8Array;
  if (kind === 'z.') raw = await pipe(fromB64url(body), new DecompressionStream('deflate-raw'));
  else if (kind === 'j.') raw = fromB64url(body);
  else throw new Error('Neznámý formát odkazu');
  const env = JSON.parse(new TextDecoder().decode(raw)) as { p: string; s?: string };
  const protocol = JSON.parse(env.p) as Protocol;
  if (!env.s) return { protocol, signed: false, verified: null };
  if (!publicKey) return { protocol, signed: true, verified: null };
  const key = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: publicKey.x, y: publicKey.y, ext: true }, ALG, false, ['verify']);
  const verified = await crypto.subtle.verify(SIGN, key, fromB64url(env.s), new TextEncoder().encode(env.p));
  return { protocol, signed: true, verified };
}

export async function generateKeyPair() {
  const pair = (await crypto.subtle.generateKey(ALG, true, ['sign', 'verify'])) as CryptoKeyPair;
  const priv = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const pub = await crypto.subtle.exportKey('jwk', pair.publicKey);
  return { privateJwk: priv, publicKey: { x: pub.x!, y: pub.y! } };
}
