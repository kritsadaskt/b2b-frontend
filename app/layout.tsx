import type { Metadata } from 'next';
import ClearSelectedCompanyOnLeaveSubmit from './components/ClearSelectedCompanyOnLeaveSubmit';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://assetwise.co.th'),
  title: 'AssetWise B2B Partners',
  description: 'ตรวจสอบสิทธิ์และสมัครเป็นพาร์ทเนอร์กับ AssetWise',
  keywords: 'AssetWise, B2B, Partners, Thailand, Financial Services',
  openGraph: {
    title: 'AssetWise B2B Partners',
    description: 'ตรวจสอบสิทธิ์และสมัครเป็นพาร์ทเนอร์กับ AssetWise',
    images: ['/images/ASW-Partners_OG.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="font-sans">
        <ClearSelectedCompanyOnLeaveSubmit />
        {children}
      </body>
    </html>
  );
}
