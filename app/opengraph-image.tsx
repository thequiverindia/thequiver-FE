import { ImageResponse } from 'next/og';

export const alt = 'TheQuiverIndia — Politics. Power. People.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default share card for pages without their own. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          padding: 80,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            color: '#FBBF24',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
          }}
        >
          TheQuiverIndia
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          Politics. Power. People.
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 28, fontFamily: 'Arial, sans-serif' }}>
          Verified journalism · Leader accountability · Reader voice
        </div>
      </div>
    ),
    size,
  );
}
