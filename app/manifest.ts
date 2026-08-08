import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TheQuiverIndia',
    short_name: 'TheQuiver',
    description:
      "India's editorial-first political news platform — verified journalism and leader accountability.",
    start_url: '/',
    display: 'standalone',
    background_color: '#180E29',
    theme_color: '#371D51',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
