'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { B2bLead } from "../utils/types";
import { buildLeadPdfFromCanvas } from "../utils/leadPdf";
import { LEAD_THANK_YOU_STORAGE_KEY, type ThankYouPayload } from "../utils/thankYouStorage";
import Header from "./Header";
import Footer from "./Footer";
import { Download } from "lucide-react";
import { projectData } from "../utils/projectData";

function LeadThankYou() {
  const router = useRouter();
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [leadData, setLeadData] = useState<B2bLead | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_THANK_YOU_STORAGE_KEY);
      if (!raw) {
        router.replace("/submit");
        return;
      }
      sessionStorage.removeItem(LEAD_THANK_YOU_STORAGE_KEY);
      const parsed = JSON.parse(raw) as ThankYouPayload;
      if (!parsed?.leadData) {
        router.replace("/submit");
        return;
      }
      setLeadData(parsed.leadData);
    } catch {
      router.replace("/submit");
    }
  }, [router]);

  const generatePdf = async (): Promise<ReturnType<typeof buildLeadPdfFromCanvas> | null> => {
    if (!leadData || !pdfContentRef.current) return null;
    await document.fonts.ready;
    const canvas = await html2canvas(pdfContentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    return buildLeadPdfFromCanvas(canvas);
  };

  const handleDownloadPdf = async () => {
    const doc = await generatePdf();
    if (doc) doc.save("lead-data.pdf");
  };

  const handleViewPdf = async () => {
    const doc = await generatePdf();
    if (!doc) return;
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) setTimeout(() => URL.revokeObjectURL(url), 1000);
    else URL.revokeObjectURL(url);
  };

  if (!leadData) {
    return null;
  }

  return (
    <>
      <Header />
      <section className="py-10 bg-gray-100 min-h-[60vh]">
        <div className="container mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-medium text-[#123F6D] mb-4">
            บันทึกข้อมูลสำเร็จ
          </h1>
          <p className="text-gray-600 mb-10">
            ขอบคุณสำหรับข้อมูล <br/>กรุณาดาวน์โหลดหรือพิมพ์เอกสาร PDF ด้านล่าง<br/>แนบกับใบจองใช้ในการยืนยันรับสิทธิ์
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleViewPdf}
              className="flex gap-2 justify-center items-center border-2 border-[#123F6D] text-[#123F6D] hover:bg-[#123F6D] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              <Download className="w-5 h-5" />
              Download PDF    
            </button>
          </div>
        </div>
      </section>
      <Footer />

      <div
        ref={pdfContentRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "595px",
          minHeight: "842px",
          padding: "32px",
          backgroundColor: "#ffffff",
          fontFamily: "'Sarabun', sans-serif",
          fontSize: "14px",
          color: "#111",
          boxSizing: "border-box",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            border: "2px solid #123F6D",
            background: "#fff",
            fontFamily: "'Sarabun', sans-serif",
          }}
        >
          <tbody>
            <tr>
              <td
                colSpan={2}
                style={{
                  border: "2px solid #123F6D",
                  padding: "16px 12px",
                  background: "#f3f6fa",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#123F6D" }}>
                  ข้อมูลการรับสิทธิ์ AssetWise Partner
                </p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#f3f6fa", color: "#123F6D" }}>วันที่รับสิทธิ์</td>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#fff", color: "#222" }}>{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
            <tr style={{ background: "#f9fafb" }}>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  fontWeight: 500,
                  color: "#123F6D",
                  width: "30%",
                  background: "#f3f6fa",
                }}
              >
                ชื่อ-นามสกุล
              </td>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  width: "70%",
                  background: "#fff",
                  color: "#222",
                }}
              >
                {leadData.Fname} {leadData.Lname}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  fontWeight: 500,
                  color: "#123F6D",
                  background: "#f3f6fa",
                }}
              >
                เบอร์โทรศัพท์
              </td>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  color: "#222",
                  background: "#fff",
                }}
              >
                {leadData.Tel}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  fontWeight: 500,
                  color: "#123F6D",
                  background: "#f3f6fa",
                }}
              >
                อีเมล
              </td>
              <td
                style={{
                  padding: "10px 16px",
                  lineHeight: 1.5,
                  border: "1px solid #ddd",
                  color: "#222",
                  background: "#fff",
                }}
              >
                {leadData.Email}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#f3f6fa", color: "#123F6D" }}>
                รับสิทธิ์ในนามบริษัท
              </td>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#fff", color: "#222" }}>
                {leadData.Company}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#f3f6fa", color: "#123F6D", "verticalAlign": "top" }}>
                ข้อมูลเพิ่มเติม
              </td>
              <td style={{ padding: "10px 16px", lineHeight: 1.5, border: "1px solid #ddd", background: "#fff", color: "#222" }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <li><strong>โครงการที่สนใจ:</strong> {projectData.find(project => project.ProjectID === leadData.InterestedProject)?.ProjectName}</li>
                  <li><strong>รูปแบบที่อยู่อาศัยที่สนใจ:</strong> {leadData.TypeInterest.join(', ')}</li>
                  <li><strong>ทราบข่าวโครงการจาก:</strong> {leadData.Source.join(', ')}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LeadThankYou;
