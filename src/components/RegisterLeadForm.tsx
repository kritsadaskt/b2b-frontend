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
  });

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
        <label htmlFor="fname" className="block text-gray-600 mb-2 text-sm">
          ชื่อ-นามสกุล
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
        <label htmlFor="tel" className="block text-gray-600 mb-2 text-sm">
          เบอร์โทรศัพท์
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
        <label htmlFor="email" className="block text-gray-600 mb-2 text-sm">
          อีเมล
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
        <label htmlFor="company" className="block text-gray-600 mb-2 text-sm">
          ชื่อบริษัท
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
        <label htmlFor="interestedProject" className="block text-gray-600 mb-2 text-sm">
          โครงการที่สนใจ
        </label>
        <Select 
          options={projectData}
          onChange={(selectedOption) => setLeadData({ ...leadData, interestedProject: selectedOption?.ProjectID || 0 })}
          value={projectData.find((project) => project.ProjectID === leadData.interestedProject) || null}
          onInputChange={(inputValue) => setLeadData({ ...leadData, interestedProject: parseInt(inputValue) })}
          getOptionLabel={(option) => option.ProjectName}
          getOptionValue={(option) => option.ProjectID.toString()}
          placeholder="เลือกโครงการ"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="media" className="block text-gray-600 mb-2 text-sm">
          รู้จักเราผ่านช่องทางใด
        </label>
        <input
          type="text"
          id="media"
          name="media"
          value={leadData.media}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
          required
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
          <label htmlFor="pdpaConsent" className="text-sm text-gray-600 leading-relaxed">
            ข้าพเจ้ายินยอมให้ AssetWise เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามวัตถุประสงค์ที่ระบุไว้ใน
            <a 
              href="/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#123F6D] hover:text-[#0f2f54] underline ml-1"
            >
              นโยบายความเป็นส่วนตัว
            </a>
            {" "}และ
            <a 
              href="/terms-conditions" 
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