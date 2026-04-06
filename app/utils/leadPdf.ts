import { jsPDF } from 'jspdf';
import { B2bLead, B2bLeadResponse } from '../utils/types';
import { projectData } from './projectData';

// Source labels matching RegisterLeadForm mediaData (value -> label)
const SOURCE_LABELS: Record<string, string> = {
  '1': 'สื่อประชาสัมพันธ์ภายในองค์กร (Intranet, E-mail, บอร์ดประชาสัมพันธ์, Line Group, Facebook)',
  '2': 'การออกบูธประชาสัมพันธ์ของ บมจ. แอสเซทไวส์',
  '3': 'บุคลากรภายในองค์กรแนะนำ',
  '4': 'สื่อออนไลน์ หรือโซเชียลมีเดียของ บมจ. แอสเซทไวส์',
  '5': 'พนักงานขายของบริษัท',
  '6': 'การแนะนำจากเพื่อน',
};

function getProjectName(projectId: number, savedResponse?: B2bLeadResponse): string {
  if (savedResponse?.InterestedProjectName) return savedResponse.InterestedProjectName;
  const project = projectData.find((p) => p.ProjectID === projectId);
  return project?.ProjectName ?? String(projectId);
}

function getSourceLabels(sources: string[]): string {
  if (!sources?.length) return '-';
  return sources.map((v) => SOURCE_LABELS[v] ?? v).join(', ');
}

/** Row data for rendering in HTML (PDF content with Thai font). */
export function getLeadPdfRows(
  leadData: B2bLead,
  savedResponse?: B2bLeadResponse
): { label: string; value: string }[] {
  return [
    { label: 'ชื่อ', value: leadData.Fname },
    { label: 'นามสกุล', value: leadData.Lname },
    { label: 'เบอร์โทรศัพท์', value: leadData.Tel },
    { label: 'อีเมล', value: leadData.Email },
    { label: 'ชื่อบริษัท', value: leadData.Company },
    {
      label: 'โครงการที่สนใจ',
      value: getProjectName(leadData.InterestedProject, savedResponse),
    },
    {
      label: 'รูปแบบที่อยู่อาศัยที่สนใจ',
      value: (leadData.TypeInterest ?? []).join(', ') || '-',
    },
    { label: 'แหล่งที่มาของข้อมูล', value: getSourceLabels(leadData.Source ?? []) },
    { label: 'PDPA', value: leadData.PDPA ? 'ใช่' : 'ไม่ใช่' },
  ];
}

/**
 * Builds a jsPDF from an HTML canvas (e.g. from html2canvas).
 * Fits the image to a single A4 page for readable Thai text.
 */
export function buildLeadPdfFromCanvas(canvas: HTMLCanvasElement): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const imgData = canvas.toDataURL('image/png');
  const imgW = canvas.width;
  const imgH = canvas.height;
  const pxToMm = 25.4 / 96;
  const wMm = imgW * pxToMm;
  const hMm = imgH * pxToMm;
  const ratio = Math.min(pageW / wMm, pageH / hMm);
  const w = wMm * ratio;
  const h = hMm * ratio;
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  doc.addImage(imgData, 'PNG', x, y, w, h);
  return doc;
}
