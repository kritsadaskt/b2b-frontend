import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'รายชื่อ Partners | AssetWise B2B',
  description:
    'เลือก Partner สำหรับแคมเปญและดูช่องทางติดต่อประชาสัมพันธ์ในหน่วยงาน',
};

export default function PartnersListedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
