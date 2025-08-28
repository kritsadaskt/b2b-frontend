import { useState } from "react";
import { B2bLead } from "../utils/types";
import Select from "react-select";
import { projectData } from "../utils/projectData";

function RegisterLeadForm() {
  const [leadData, setLeadData] = useState<B2bLead>({
    fname: "",
    tel: "",
    email: "",
    company: "",
    interestedProject: 0,
    media: "",
    pdpaConsent: true,
    propertyTypes: [],
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(leadData);
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-left">
      <div className="mb-4">
        <label htmlFor="fname" className="block text-gray-900 font-medium mb-2 text-sm">
          ชื่อ-นามสกุล <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={leadData.fname}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tel" className="block text-gray-900 font-medium mb-2 text-sm">
          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="tel"
          name="tel"
          value={leadData.tel}
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
          id="email"
          name="email"
          value={leadData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-900 font-medium mb-2 text-sm">
          ชื่อบริษัท <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={leadData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interestedProject" className="block text-gray-900 font-medium mb-2 text-sm">
          โครงการที่สนใจ
        </label>
        <Select 
          options={projectData}
          onChange={(selectedOption) => setLeadData({ ...leadData, interestedProject: selectedOption?.ProjectID || 0 })}
          value={projectData.find((project) => project.ProjectID === leadData.interestedProject) || null}
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
                name="propertyTypes"
                value={propertyType.value}
                checked={leadData.propertyTypes?.includes(propertyType.value) || false}
                onChange={(e) => {
                  const currentTypes = leadData.propertyTypes || [];
                  if (e.target.checked) {
                    setLeadData({ 
                      ...leadData, 
                      propertyTypes: [...currentTypes, propertyType.value] 
                    });
                  } else {
                    setLeadData({ 
                      ...leadData, 
                      propertyTypes: currentTypes.filter(type => type !== propertyType.value) 
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
          onChange={(selectedOption) => setLeadData({ ...leadData, media: selectedOption?.value || "" })}
          value={mediaData.find((media) => media.value === leadData.media) || null}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          placeholder="เลือกช่องทาง"
          isClearable
          required
          styles={{
            control: (base) => ({
              ...base,
              height: '42px',
              borderRadius: '8px',
            }),
          }}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="pdpaConsent"
            name="pdpaConsent"
            checked={leadData.pdpaConsent || false}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-[#123F6D] focus:ring-[#123F6D] border-gray-300 rounded"
            required
          />
          <label htmlFor="pdpaConsent" className="text-[14px] font-light text-gray-600 leading">
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
              href="https://assetwise.co.th/terms-conditions/b2b" 
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
        className="w-full bg-[#123F6D] hover:bg-[#0f2f54] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
      >
        ส่งข้อมูล
      </button>
    </form>
  );
}

export default RegisterLeadForm;