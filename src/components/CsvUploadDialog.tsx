import React, { useState } from 'react';
import { X, Upload, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Supplier } from '../utils/types';
import { getApiHeaders, createApiUrl } from '../utils/api';
import AlertPopup from './AlertPopup';

interface CsvUploadDialogProps {
  onClose: () => void;
}

interface CsvRow {
  [key: string]: string;
}

interface ProcessedRow {
  [key: string]: string | { id: number }[];
}

function CsvUploadDialog({ onClose }: CsvUploadDialogProps) {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [originalData, setOriginalData] = useState<CsvRow[]>([]);
  const [preparedSuppliers, setPreparedSuppliers] = useState<Supplier[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [errorRow, setErrorRow] = useState<{ rowIndex: number; supplier: Supplier; error: string } | null>(null);
  const supplierTypeList = [
    { id: 1, name: 'Bank' },
    { id: 2, name: 'องค์กร' },
    { id: 3, name: 'ASW Partner' },
    { id: 4, name: 'sponsor' },
    { id: 5, name: 'other' }
  ]

  const processCsvFile = (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setFileType('csv');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      
      if (lines.length > 0) {
        // Parse headers (first row)
        const headerRow = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        setHeaders(headerRow);

        // Parse data rows (skip first row, take first 20)
        const dataRows: CsvRow[] = [];
        for (let i = 1; i < Math.min(lines.length, 21); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
            const row: CsvRow = {};
            headerRow.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            dataRows.push(row);
          }
        }
        
        // Store original data for display
        setOriginalData(dataRows);
        setCsvData(dataRows);
      }
      setIsProcessing(false);
    };

    reader.readAsText(file, 'UTF-8');
  };

  const processExcelFile = (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setFileType('excel');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length > 0) {
          // Parse headers (first row)
          const headerRow = jsonData[0].map(header => String(header || '').trim());
          setHeaders(headerRow);

          // Parse data rows (skip first row, take first 20)
          const dataRows: CsvRow[] = [];
          for (let i = 1; i < Math.min(jsonData.length, 21); i++) {
            if (jsonData[i] && jsonData[i].length > 0) {
              const row: CsvRow = {};
              headerRow.forEach((header, index) => {
                row[header] = String(jsonData[i][index] || '').trim();
              });
              dataRows.push(row);
            }
          }
          
          // Store original data for display
          setOriginalData(dataRows);
          setCsvData(dataRows);
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์ Excel');
      }
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const processFile = (file: File) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const mimeType = file.type.toLowerCase();

    if (fileExtension === 'csv' || mimeType === 'text/csv') {
      processCsvFile(file);
    } else if (['xlsx', 'xls'].includes(fileExtension || '') || 
               ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                'application/vnd.ms-excel'].includes(mimeType)) {
      processExcelFile(file);
    } else {
      alert('กรุณาอัพโหลดไฟล์ CSV หรือ Excel (.csv, .xlsx, .xls) เท่านั้น');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const validateFileStructure = (): { isValid: boolean; errors: string[]; foundColumns: string[] } => {
    const requiredColumns = [
      { name: 'email', variations: ['email', 'e-mail', 'mail', 'อีเมล'] },
      { name: 'supplier_name', variations: ['supplier_name', 'supplier name', 'company', 'company_name', 'บริษัท', 'ชื่อบริษัท'] },
      { name: 'street', variations: ['street', 'address', 'ที่อยู่', 'ถนน'] },
      { name: 'city', variations: ['city', 'province', 'จังหวัด', 'เมือง'] },
      { name: 'sales_person', variations: ['sales_person', 'sales person', 'contact_person', 'contact person', 'ผู้ติดต่อ'] },
      { name: 'telephone', variations: ['telephone', 'phone', 'tel', 'mobile', 'เบอร์โทร', 'โทรศัพท์'] },
      { name: 'head_count', variations: ['head_count', 'จำนวนคน', 'คน', 'จำนวนพนักงาน Head Office'] },
      { name: 'type', variations: ['type', 'ประเภท', 'ประเภทบริษัท'] }
    ];

    const errors: string[] = [];
    const foundColumns: string[] = [];
    const headerLowerCase = headers.map(h => h.toLowerCase().trim().replace(/[_\s-]/g, ''));

    // Check if all required columns exist
    for (const requiredCol of requiredColumns) {
      const found = requiredCol.variations.some(variation => {
        const normalizedVariation = variation.toLowerCase().replace(/[_\s-]/g, '');
        return headerLowerCase.some(header => 
          header.includes(normalizedVariation) || 
          header === normalizedVariation ||
          normalizedVariation.includes(header)
        );
      });
      
      if (found) {
        const foundHeader = headers.find((header) => {
          const normalizedHeader = header.toLowerCase().trim().replace(/[_\s-]/g, '');
          return requiredCol.variations.some(variation => {
            const normalizedVariation = variation.toLowerCase().replace(/[_\s-]/g, '');
            return normalizedHeader.includes(normalizedVariation) || 
                   normalizedHeader === normalizedVariation ||
                   normalizedVariation.includes(normalizedHeader);
          });
        });
        foundColumns.push(`${requiredCol.name} → "${foundHeader}"`);
      } else {
        errors.push(`ไม่พบคอลัมน์ที่จำเป็น: "${requiredCol.name}" (ควรมีคำใดคำหนึ่ง: ${requiredCol.variations.join(', ')})`);
      }
    }

    // Check if we have at least the minimum expected columns
    if (headers.length < 6) {
      errors.push(`ไฟล์ควรมีอย่างน้อย 6 คอลัมน์ แต่พบเพียง ${headers.length} คอลัมน์`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      foundColumns
    };
  };

  const findColumnIndex = (columnName: string): number => {
    const variations: { [key: string]: string[] } = {
      'email': ['email', 'e-mail', 'mail', 'อีเมล'],
      'supplier_name': ['supplier_name', 'supplier name', 'company', 'company_name', 'บริษัท', 'ชื่อบริษัท'],
      'street': ['street', 'address', 'ที่อยู่', 'ถนน'],
      'city': ['city', 'province', 'จังหวัด', 'เมือง'],
      'sales_person': ['sales_person', 'sales person', 'contact_person', 'contact person', 'ผู้ติดต่อ'],
      'telephone': ['telephone', 'phone', 'tel', 'mobile', 'เบอร์โทร', 'โทรศัพท์'],
      'head_count': ['head_count', 'จำนวนคน', 'คน', 'จำนวนพนักงาน Head Office'],
      'type': ['type', 'ประเภท', 'ประเภทบริษัท']
    };

    const searchVariations = variations[columnName] || [columnName];
    const headerLowerCase = headers.map(h => h.toLowerCase().trim().replace(/[_\s-]/g, ''));
    
    for (const variation of searchVariations) {
      const normalizedVariation = variation.toLowerCase().replace(/[_\s-]/g, '');
      const index = headerLowerCase.findIndex(header => 
        header.includes(normalizedVariation) || 
        header === normalizedVariation ||
        normalizedVariation.includes(header)
      );
      if (index !== -1) return index;
    }
    
    return -1;
  };

  const handleUploadData = () => {
    // Validate file structure first
    const validation = validateFileStructure();
    
    // Get type column index early for additional validation
    const typeIndex = findColumnIndex('type');
    
    console.log('=== FILE STRUCTURE VALIDATION ===');
    console.log('Headers found:', headers);
    console.log('Validation result:', validation);
    console.log('Type column index:', typeIndex);
    console.log('================================');
    
    if (!validation.isValid) {
      const errorMessage = [
        'โครงสร้างไฟล์ไม่ถูกต้อง:',
        '',
        'ข้อผิดพลาด:',
        ...validation.errors.map(error => `• ${error}`),
        '',
        validation.foundColumns.length > 0 ? 'คอลัมน์ที่พบ:' : '',
        ...validation.foundColumns.map(col => `✓ ${col}`),
        '',
        'หมายเหตุ: ระบบจะจับคู่คอลัมน์อัตโนมัติตามชื่อที่คล้ายกัน',
        'เช่น "email", "e-mail", "mail" จะถูกจับคู่กับ email',
        '',
        'สำหรับคอลัมน์ "type": ค่าจะถูกคัดลอกโดยตรงไปยัง type_name ในข้อมูลที่ส่งไป API'
      ].filter(line => line !== '').join('\n');
      
      alert(errorMessage);
      return;
    }

    // Additional validation specifically for type column
    if (typeIndex < 0) {
      alert('ไม่พบคอลัมน์ "type" ในไฟล์ กรุณาตรวจสอบว่าไฟล์มีคอลัมน์ type หรือ "ประเภท"\n\nค่าในคอลัมน์นี้จะถูกคัดลอกโดยตรงไปยัง type_name ในข้อมูลที่ส่งไป API');
      return;
    }

    // Get column indices using the new flexible mapping
    const emailIndex = findColumnIndex('email');
    const supplierNameIndex = findColumnIndex('supplier_name');
    const streetIndex = findColumnIndex('street');
    const cityIndex = findColumnIndex('city');
    const salesPersonIndex = findColumnIndex('sales_person');
    const telephoneIndex = findColumnIndex('telephone');
    const headCountIndex = findColumnIndex('head_count');

    // Process data and create MediaList for each row
    const processedData: ProcessedRow[] = originalData.map((row) => {
      const newRow: ProcessedRow = { ...row };
      const mediaList: { id: number }[] = [];
      
      // Process columns K to Q (index 10-16) and collect media IDs
      for (let j = 10; j <= 16 && j < headers.length; j++) {
        const columnHeader = headers[j];
        if (columnHeader) {
          const cellValue = row[columnHeader];
          // If cell has any value (not empty), add to mediaList with column index
          if (cellValue && cellValue.trim() !== '') {
            const columnIndex = j - 9; // K=1, L=2, M=3, etc.
            mediaList.push({ id: columnIndex });
          }
        }
      }
      
      // Merge data from columns after Q (index 18+) into column I (index 8)
      const columnIHeader = headers[8]; // Column I
      if (columnIHeader) {
        let mergedData = row[columnIHeader] || '';
        
        // Collect data from columns after Q
        for (let j = 18; j < headers.length; j++) {
          const columnHeader = headers[j];
          if (columnHeader) {
            const cellValue = row[columnHeader];
            if (cellValue && cellValue.trim() !== '') {
              // Add separator if column I already has data
              if (mergedData && mergedData.trim() !== '') {
                mergedData += ' | ';
              }
              mergedData += cellValue.trim();
            }
          }
        }
        
        // Update column I with merged data
        newRow[columnIHeader] = mergedData;
      }
      
      // Add MediaList to the row
      newRow.MediaList = mediaList;
      
      // Remove the original K-Q columns and columns after Q from the processed data
      for (let j = 10; j <= 16 && j < headers.length; j++) {
        const columnHeader = headers[j];
        if (columnHeader) {
          delete newRow[columnHeader];
        }
      }
      
      return newRow;
    });

    // Transform processed data to Supplier format for API
    const suppliers: Supplier[] = processedData.map((row, index) => {
      // Simply copy the value from "ประเภท" column to type_name
      //console.log('Row:', row);
      const typeValue = typeIndex >= 0 ? (row[headers[typeIndex]] as string) || '' : '';
      const type_name = typeValue.trim(); // Just clean up whitespace
      const type_id = supplierTypeList.find(type => type.name === type_name)?.id || 0;
      
      const supplier: Supplier = {
        uid: `supplier_${Date.now()}_${index}`, // Generate unique ID
        type_id: type_id,
        type_name: type_name,
        email: emailIndex >= 0 ? (row[headers[emailIndex]] as string) || '' : '',
        supplier_name: supplierNameIndex >= 0 ? (row[headers[supplierNameIndex]] as string) || '' : '',
        business_type: "B2B", // Default business type
        contact_date: new Date().toISOString().split('T')[0], // Default to today
        update_time: new Date().toISOString(),
        is_active: true, // Default to active
        address: streetIndex >= 0 ? (row[headers[streetIndex]] as string) || '' : '',
        city: cityIndex >= 0 ? (row[headers[cityIndex]] as string) || '' : '',
        sales_person: salesPersonIndex >= 0 ? (row[headers[salesPersonIndex]] as string) || '' : '',
        telephone: telephoneIndex >= 0 ? (row[headers[telephoneIndex]] as string) || '' : '',
        head_count: headCountIndex >= 0 ? parseInt((row[headers[headCountIndex]] as string) || '0') || 0 : 0, // Default value since we don't have head_count in required columns
        remark: (row[headers[8]] as string) || '', // Keep existing remark logic for now
        media_remark: '', // Default empty
        StatusList: [], // Default empty status list
        MediaList: ((row.MediaList as { id: number }[]) || []).map(media => ({
          id: media.id,
          name: `Media ${media.id}` // Generate media name based on ID
        }))
      };
      
      return supplier;
    });

    // Store prepared suppliers for potential API calls
    setPreparedSuppliers(suppliers);

    // console.log('=== UPLOADED DATA PREVIEW ===');
    // console.log('File Type:', fileType);
    // console.log('File Name:', fileName);
    // console.log('Total Rows:', processedData.length);
    // console.log('Headers:', headers);
    // console.log('Type Column Index:', typeIndex);
    // console.log('=== SUPPLIERS PREPARED FOR API ===');
    // console.log('Prepared Suppliers:', JSON.stringify(suppliers, null, 2));
    
    // // Log type copying results
    // console.log('=== TYPE COPYING RESULTS ===');
    // suppliers.forEach((supplier, index) => {
    //   const originalTypeValue = typeIndex >= 0 ? originalData[index][headers[typeIndex]] : 'N/A';
    //   console.log(`Row ${index + 1}: "${originalTypeValue}" → type_name: "${supplier.type_name}"`);
    // });
    // console.log('=== END PREVIEW ===');
    
    // Start uploading data to API
    //return;
    uploadSuppliers(suppliers);
  };

  const uploadSuppliers = async (suppliers: Supplier[]) => {
    //console.log('Uploading suppliers:', suppliers);
    //return;
    setIsUploading(true);
    setErrorRow(null);
    setUploadProgress({ current: 0, total: suppliers.length });

    for (let i = 0; i < suppliers.length; i++) {
      const supplier = suppliers[i];
      setUploadProgress({ current: i + 1, total: suppliers.length });

      try {
        const response = await fetch(createApiUrl('Suplier/SaveSuplier'), {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify(supplier)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        await response.json();
        console.log(`Successfully uploaded supplier ${i + 1}/${suppliers.length}:`, supplier.supplier_name);

        // Add a small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        const error = err as Error;
        const errorMessage = error.message || 'Unknown error occurred';
        console.error(`Error uploading supplier ${i + 1}/${suppliers.length}:`, errorMessage);
        
        // Stop uploading and show error
        setErrorRow({
          rowIndex: i + 1, // +1 because row index should be 1-based for user display
          supplier: supplier,
          error: errorMessage
        });
        setIsUploading(false);
        return;
      }
    }

    // All uploads completed successfully
    onClose();
    setIsUploading(false);
    AlertPopup({
      popup_title: 'อัพโหลดสำเร็จ!',
      popup_text: `ข้อมูล ${suppliers.length} รายการถูกส่งไปยัง API แล้ว`,
      popup_type: 'success',
      onCancel: () => {},
      onConfirm: () => {}
    });
  };

  const getFileIcon = () => {
    if (fileType === 'excel') {
      return <FileSpreadsheet className="h-12 w-12 text-green-500 mx-auto mb-4" />;
    }
    return <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />;
  };

  const getFileTypeText = () => {
    if (fileType === 'excel') {
      return 'ไฟล์ Excel';
    }
    return 'ไฟล์ CSV';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#123F6D]">อัพโหลดไฟล์ข้อมูล</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">อัพโหลดไฟล์ CSV หรือ Excel เพื่ออัพเดตข้อมูลบริษัท</p>
        
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-[#F1683B] transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {fileName ? getFileIcon() : <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
          <p className="text-lg font-medium text-gray-700 mb-2">
            {fileName ? `${getFileTypeText()}: ${fileName}` : 'ลากไฟล์ CSV หรือ Excel มาที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
          </p>
          <p className="text-sm text-gray-500 mb-4">รองรับไฟล์ CSV (.csv) และ Excel (.xlsx, .xls)</p>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>เลือกไฟล์</span>
          </label>
        </div>

                 {/* Processing Indicator */}
         {isProcessing && (
           <div className="text-center py-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F1683B] mx-auto"></div>
             <p className="text-gray-600 mt-2">กำลังประมวลผลไฟล์...</p>
           </div>
         )}

         {/* Upload Progress */}
         {isUploading && (
           <div className="text-center py-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F1683B] mx-auto mb-2"></div>
             <p className="text-gray-600 mb-2">กำลังอัพโหลดข้อมูล...</p>
             <p className="text-sm text-gray-500">
               {uploadProgress.current} / {uploadProgress.total} รายการ
             </p>
             <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
               <div 
                 className="bg-[#F1683B] h-2 rounded-full transition-all duration-300"
                 style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
               ></div>
             </div>
           </div>
         )}

         {/* Error Display */}
         {errorRow && (
           <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
             <h4 className="text-lg font-semibold text-red-800 mb-2">
               เกิดข้อผิดพลาดในการอัพโหลด
             </h4>
             <p className="text-red-700 mb-3">
               <strong>แถวที่ {errorRow.rowIndex}:</strong> {errorRow.supplier.supplier_name}
             </p>
             <div className="bg-white p-3 rounded border">
               <p className="text-sm text-red-600 mb-2"><strong>ข้อผิดพลาด:</strong></p>
               <p className="text-sm text-red-600 font-mono">{errorRow.error}</p>
             </div>
             <div className="mt-3">
               <p className="text-sm text-red-700 mb-2"><strong>ข้อมูลที่ส่ง:</strong></p>
               <div className="bg-gray-50 p-3 rounded text-sm">
                 <p><strong>Email:</strong> {errorRow.supplier.email}</p>
                 <p><strong>Supplier Name:</strong> {errorRow.supplier.supplier_name}</p>
                 <p><strong>Address:</strong> {errorRow.supplier.address}</p>
                 <p><strong>City:</strong> {errorRow.supplier.city}</p>
                 <p><strong>Telephone:</strong> {errorRow.supplier.telephone}</p>
                 <p><strong>Media Count:</strong> {errorRow.supplier.MediaList.length}</p>
               </div>
             </div>
           </div>
         )}

        {/* Data Table */}
        {csvData.length > 0 && !isProcessing && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#123F6D] mb-4">
              ตัวอย่างข้อมูล (20 แถวแรก) - {getFileTypeText()}
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, index) => (
                      <th 
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                                 <tbody className="divide-y divide-gray-200">
                   {originalData.map((row, rowIndex) => (
                     <tr key={rowIndex} className="hover:bg-gray-50">
                       {headers.map((header, colIndex) => (
                         <td 
                           key={colIndex}
                           className="px-4 py-3 text-sm text-gray-900 border-b"
                         >
                           <div className="max-w-xs truncate" title={row[header]}>
                             {row[header]}
                           </div>
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              แสดง {csvData.length} แถวแรกจากไฟล์ {getFileTypeText()}
            </p>
          </div>
        )}

                 {/* Action Buttons */}
         <div className="flex justify-end space-x-4 mt-6">
           <button 
             onClick={onClose}
             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
             disabled={isUploading}
           >
             ยกเลิก
           </button>
           {csvData.length > 0 && !isUploading && (
             <button 
               onClick={handleUploadData}
               className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
             >
               อัพโหลดข้อมูล
             </button>
           )}
           {errorRow && (
             <button 
               onClick={() => {
                 setErrorRow(null);
                 uploadSuppliers(preparedSuppliers);
               }}
               className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
             >
               ลองใหม่
             </button>
           )}
         </div>
      </div>
    </div>
  );
}

export default CsvUploadDialog;