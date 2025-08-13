import React from 'react';

interface AlertPopupProps {
  popup_type: 'success' | 'error' | 'warning' | 'info';
  popup_title: string;
  popup_text: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  popup_type,
  popup_title,
  popup_text,
  onCancel,
  onConfirm
}) => {
  const getTypeStyles = () => {
    switch (popup_type) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'error':
        return 'bg-red-50 text-red-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800';
      case 'info':
        return 'bg-blue-50 text-blue-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${getTypeStyles()}`}>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6">{popup_title}</h3>
                <div className="mt-2">
                  <p className="text-sm">{popup_text}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#F1683B] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#e5572f] focus:outline-none focus:ring-2 focus:ring-[#F1683B] focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#123F6D] focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
