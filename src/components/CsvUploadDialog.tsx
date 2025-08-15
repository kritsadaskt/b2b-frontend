import { X } from "lucide-react";

interface CsvUploadDialogProps {
  onClose: () => void;
}

function CsvUploadDialog({ onClose }: CsvUploadDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-[#123F6D] mb-4">อัพโหลด CSV</h2>
        <p className="text-gray-600 mb-6">อัพโหลด CSV เพื่ออัพเดตข้อมูลบริษัท</p>
        <input type="file" className="w-full p-2 border border-gray-300 rounded-lg" />
        <button className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 mt-4" onClick={onClose}>
          <span>ปิด</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default CsvUploadDialog;