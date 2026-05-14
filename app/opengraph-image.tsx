import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DCA — แนะนำการลงทุนสำหรับมือใหม่';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont(): Promise<ArrayBuffer | undefined> {
  try {
    const res = await fetch('https://fonts.gstatic.com/s/notosansthai/v25/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1vu37.ttf');
    if (res.ok) return await res.arrayBuffer();
  } catch { /* fall through */ }
  return undefined;
}

export default async function OGImage() {
  const fontData = await loadFont();
  const fontFamily = fontData ? 'NotoSansThai' : 'system-ui, sans-serif';
  const fonts = fontData
    ? [{ name: 'NotoSansThai', data: fontData, style: 'normal' as const, weight: 700 as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #0e7490 100%)',
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: '80px',
            marginBottom: '8px',
          }}
        >
          📊
        </div>
        <div
          style={{
            color: '#22d3ee',
            fontSize: '52px',
            fontWeight: 900,
            letterSpacing: '-1px',
          }}
        >
          DCA
        </div>
        <div
          style={{
            color: 'white',
            fontSize: '42px',
            fontWeight: 700,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.3,
            marginTop: '20px',
          }}
        >
          เริ่มลงทุนง่ายๆ แม้ไม่รู้เรื่องเลย
        </div>
        <div
          style={{
            color: '#94a3b8',
            fontSize: '24px',
            marginTop: '16px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          วางแผน วิเคราะห์ และจำลองการลงทุนแบบ DCA ฟรี 100%
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '36px',
            color: '#67e8f9',
            fontSize: '20px',
          }}
        >
          <span>25 สินทรัพย์</span>
          <span>·</span>
          <span>3 พอร์ตแนะนำ</span>
          <span>·</span>
          <span>ฟรี 100%</span>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) },
  );
}
