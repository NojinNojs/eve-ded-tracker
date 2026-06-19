import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'DED Tracker — EVE Online Loot Tracker';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#faf7f4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '24px solid #1a1a1a',
          position: 'relative',
        }}
      >
        {/* Background elements */}
        <div style={{ position: 'absolute', top: 40, left: 40, display: 'flex', gap: '20px' }}>
          <div style={{ width: 100, height: 100, background: '#f472b6', border: '8px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a' }} />
          <div style={{ width: 100, height: 100, background: '#a3e635', border: '8px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a', marginTop: 40 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 40, display: 'flex', gap: '20px' }}>
          <div style={{ width: 100, height: 100, background: '#a78bfa', border: '8px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a', marginBottom: 40 }} />
          <div style={{ width: 100, height: 100, background: '#fbbf24', border: '8px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a' }} />
        </div>

        {/* Central Logo Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
            height: 200,
            background: '#22d3ee',
            border: '12px solid #1a1a1a',
            boxShadow: '16px 16px 0px #1a1a1a',
            marginBottom: 40,
            position: 'relative',
          }}
        >
          {/* We simulate the crosshair + arrow */}
          <div style={{
            position: 'absolute',
            width: 120, height: 120,
            borderRadius: '50%',
            border: '12px solid #1a1a1a',
          }} />
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            fontSize: 100,
            fontWeight: 900,
            color: '#1a1a1a',
            fontFamily: 'sans-serif',
            transform: 'rotate(-45deg)',
          }}>
            →
          </div>
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            fontFamily: 'sans-serif',
            marginBottom: 20,
          }}
        >
          DED Tracker
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#1a1a1a',
            background: '#a3e635',
            padding: '12px 24px',
            border: '6px solid #1a1a1a',
            boxShadow: '8px 8px 0px #1a1a1a',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
          }}
        >
          EVE Online Loot & ISK Appraiser
        </div>
      </div>
    ),
    { ...size }
  );
}
