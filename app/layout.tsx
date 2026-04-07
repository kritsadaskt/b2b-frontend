import type { Metadata } from 'next';
import ClearSelectedCompanyOnLeaveSubmit from './components/ClearSelectedCompanyOnLeaveSubmit';
import FontFaceStyles from './components/FontFaceStyles';
import { publicAssetPath } from './utils/assets';
import './globals.css';

function bgUrl(path: string): string {
  return `url('${publicAssetPath(path)}')`;
}

const rootSurfaceStyle = {
  '--bg-info-desktop': bgUrl('images/b2b-info-bg-d.webp'),
  '--bg-info-mobile': bgUrl('images/b2b-info-bg-m.webp'),
  '--bg-steps-desktop': bgUrl('images/steps-bg-desktop.webp'),
  '--bg-steps-mobile': bgUrl('images/steps-bg-mobile.webp'),
} as React.CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://assetwise.co.th'),
  title: 'AssetWise B2B Partners',
  description: 'ตรวจสอบสิทธิ์และสมัครเป็นพาร์ทเนอร์กับ AssetWise',
  keywords: 'AssetWise, B2B, Partners, Thailand, Financial Services',
  openGraph: {
    title: 'AssetWise B2B Partners',
    description: 'ตรวจสอบสิทธิ์และสมัครเป็นพาร์ทเนอร์กับ AssetWise',
    images: [publicAssetPath('images/ASW-Partners_OG.webp')],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" style={rootSurfaceStyle}>
      <body className="font-sans">
        <FontFaceStyles />
        <ClearSelectedCompanyOnLeaveSubmit />
        {children}
      </body>
    </html>
  );
}
