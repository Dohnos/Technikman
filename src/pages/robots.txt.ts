import type { APIRoute } from 'astro';
import { absUrl } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://proklepto.cz');
  const body = [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${new URL(absUrl('/brand/', origin)).pathname}`,
    '',
    `Sitemap: ${absUrl('/sitemap-index.xml', origin)}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
