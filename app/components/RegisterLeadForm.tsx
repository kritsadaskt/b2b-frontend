'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { B2bLead } from "../utils/types";
import Select from "react-select";
import { projectData } from "../utils/projectData";
import { useSaveLeadData } from "../hooks/saveData";
import { LEAD_THANK_YOU_STORAGE_KEY, type ThankYouPayload } from "../utils/thankYouStorage";
import AlertPopup from "./AlertPopup";

function readSelectedCompanyFromSession(): { companyName?: string; companyUid?: string } {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("selectedCompany") || "{}");
  } catch {
    return {};
  }
}

function RegisterLeadForm() {
  const [leadData, setLeadData] = useState<B2bLead>(() => {
    const selectedCompany = readSelectedCompanyFromSession();
    return {
      Fname: "",
      Lname: "",
      Tel: "",
      Email: "",
      Company: selectedCompany.companyName ?? "",
      CompanyID: selectedCompany.companyUid ?? "",
      InterestedProject: 0,
      Source: [],
      PDPA: true,
      TypeInterest: [],
    };
  });

  useEffect(() => {
    const selectedCompany = readSelectedCompanyFromSession();
    if (selectedCompany.companyName || selectedCompany.companyUid) {
      setLeadData((prev) => ({
        ...prev,
        Company: selectedCompany.companyName ?? prev.Company,
        CompanyID: selectedCompany.companyUid ?? prev.CompanyID,
      }));
    }
  }, []);

  const { loading: saveLeadDataLoading, error: saveLeadDataError, refetch: SaveLeadData } = useSaveLeadData(leadData);
  const router = useRouter();

  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertPopupType, setAlertPopupType] = useState<'success' | 'error' | 'warning' | 'info'>('error');
  const [alertPopupTitle, setAlertPopupTitle] = useState('');
  const [alertPopupText, setAlertPopupText] = useState('');

  const handleConfirmAlertPopup = () => {
    setShowAlertPopup(false);
  };

  const mediaData = [
    { value: "1", label: "สื่อประชาสัมพันธ์ภายในองค์กร (Intranet, E-mail, บอร์ดประชาสัมพันธ์, Line Group, Facebook)" },
    { value: "2", label: "การออกบูธประชาสัมพันธ์ของ บมจ. แอสเซทไวส์" },
    { value: "3", label: "บุคลากรภายในองค์กรแนะนำ" },
    { value: "4", label: "สื่อออนไลน์ หรือโซเชียลมีเดียของ บมจ. แอสเซทไวส์" },
    { value: "5", label: "พนักงานขายของบริษัท" },
    { value: "6", label: "การแนะนำจากเพื่อน" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await SaveLeadData();
      if (saveLeadDataError) {
        console.error('Error saving lead data:', saveLeadDataError);
      }
      const savedResponse = Array.isArray(result) ? result[0] : result;
      const payload: ThankYouPayload = { leadData, savedResponse };
      sessionStorage.setItem(LEAD_THANK_YOU_STORAGE_KEY, JSON.stringify(payload));
      router.push('/submit/thank-you');
    } catch (error) {
      console.error('Error saving lead data:', error);
      setShowAlertPopup(true);
      setAlertPopupType('error');
      setAlertPopupTitle('บันทึกข้อมูลไม่สำเร็จ');
      setAlertPopupText('บันทึกข้อมูลไม่สำเร็จ ' + String(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto text-left">
      <div className="flex gap-4 mb-4 justify-center">
        <div className="w-full">
          <label htmlFor="fname" className="block text-gray-900 font-medium mb-2 text-sm">
            ชื่อ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="Fname"
            name="Fname"
            value={leadData.Fname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="lname" className="block text-gray-900 font-medium mb-2 text-sm">
            นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="Lname"
            name="Lname"
            value={leadData.Lname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="tel" className="block text-gray-900 font-medium mb-2 text-sm">
          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="Tel"
          name="Tel"
          pattern="^0[0-9]{9}$"
          value={leadData.Tel}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-900 font-medium mb-2 text-sm">
          อีเมล <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="Email"
          name="Email"
          value={leadData.Email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-900 font-medium mb-2 text-sm">
          ชื่อบริษัท <span className="text-red-500">*</span>
          <span className="text-gray-500 text-[10px] font-light ml-3">ไม่สามารถแก้ไขได้ หากต้องการเปลี่ยนกรุณาตรวจสอบสิทธิ์ใหม่อีกครั้ง</span>
        </label>
        <input
          type="text"
          id="Company"
          name="Company"
          disabled
          value={leadData.Company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent text-gray-500"
          required
        />
        <input type="hidden" id="CompanyID" name="CompanyID" value={leadData.CompanyID} />
      </div>

      <div className="mb-4">
        <label htmlFor="interestedProject" className="block text-gray-900 font-medium mb-2 text-sm">
          โครงการที่สนใจ
        </label>
        <Select 
          options={projectData}
          onChange={(selectedOption) => setLeadData({ ...leadData, InterestedProject: selectedOption?.ProjectID || 0 })}
          value={projectData.find((project) => project.ProjectID === leadData.InterestedProject) || null}
          getOptionLabel={(option) => option.ProjectName}
          getOptionValue={(option) => option.ProjectID.toString()}
          placeholder="เลือกโครงการ"
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              height: '42px',
              borderRadius: '8px',
            }),
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-900 font-medium mb-4 text-sm">
          รูปแบบที่อยู่อาศัยที่ท่านสนใจ (เลือกได้มากกว่า 1 ข้อ)
        </label>
        <div className="space-y-2">
          {[
            { value: 'คอนโดมิเนียม', label: 'คอนโดมิเนียม' },
            { value: 'บ้านเดี่ยว', label: 'บ้านเดี่ยว' },
            { value: 'บ้านแฝด', label: 'บ้านแฝด' },
            { value: 'ทาวน์เฮ้าส์', label: 'ทาวน์เฮ้าส์' },
            { value: 'โฮมออฟฟิต', label: 'โฮมออฟฟิต' }
          ].map((propertyType) => (
            <div key={propertyType.value} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`property-${propertyType.value}`}
                name="PropertyTypes"
                value={propertyType.value}
                checked={leadData.TypeInterest?.includes(propertyType.value) || false}
                onChange={(e) => {
                  const currentTypes = leadData.TypeInterest || [];
                  if (e.target.checked) {
                    setLeadData({ 
                      ...leadData, 
                      TypeInterest: [...currentTypes, propertyType.value] 
                    });
                  } else {
                    setLeadData({ 
                      ...leadData, 
                      TypeInterest: currentTypes.filter((type: string) => type !== propertyType.value) 
                    });
                  }
                }}
                className="h-4 w-4 text-[#123F6D] focus:ring-[#123F6D] border-gray-300 rounded"
              />
              <label 
                htmlFor={`property-${propertyType.value}`} 
                className="text-sm text-gray-600 cursor-pointer"
              >
                {propertyType.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="media" className="block text-gray-900 font-medium mb-4 text-sm">
          ท่านทราบข้อมูลเกี่ยวกับ Promotion B2B จากสื่อใด <span className="text-red-500">*</span>
        </label>
        <Select 
          options={mediaData}
          isMulti
          onChange={(selectedOptions) => setLeadData({ ...leadData, Source: selectedOptions ? selectedOptions.map(option => option.label) : [] })}
          value={mediaData.filter((media) => leadData.Source.includes(media.label)) || null}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          placeholder="เลือกช่องทาง"
          isClearable
          required
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '42px',
              borderRadius: '8px',
            }),
          }}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="PDPA"
            name="PDPA"
            checked={leadData.PDPA || false}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-[#123F6D] focus:ring-[#123F6D] border-gray-300 rounded"
            required
          />
          <label htmlFor="PDPA" className="text-[14px] font-light text-gray-600 leading">
            ข้าพเจ้ายินยอมให้ AssetWise เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามวัตถุประสงค์ที่ระบุไว้ใน
            <a 
              href="https://assetwise.co.th/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#123F6D] hover:text-[#0f2f54] underline ml-1"
            >
              นโยบายความเป็นส่วนตัว
            </a>
            {" "}และ
            <a 
              href="https://assetwise.co.th/terms-and-conditions/assetwise-partners/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#123F6D] hover:text-[#0f2f54] underline ml-1"
            >
              ข้อกำหนดและเงื่อนไข
            </a>
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saveLeadDataLoading}
        className="w-full bg-[#123F6D] hover:bg-[#0f2f54] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saveLeadDataLoading ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
      </button>
      {showAlertPopup && (
        <AlertPopup
          popup_type={alertPopupType}
          popup_title={alertPopupTitle}
          popup_text={alertPopupText}
          onCancel={() => setShowAlertPopup(false)}
          onConfirm={() => handleConfirmAlertPopup()}
        />
      )}
    </form>
  );
}

export default RegisterLeadForm;