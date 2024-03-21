import React from 'react';
import axios from 'axios';

const BuyModal = ({ stockName, SchemeName, isOpen, onClose, onBuySuccess }) => {
  const handleConfirm = async () => {
    const accessToken = localStorage.getItem('access_token');
    const payload = {
        schemeCode: stockName,
        SchemeName,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/buy-purchase/', payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onClose();
      onBuySuccess()

    } catch (error) {
      console.error('Error calling API:', error);
      onClose();
      if (error.response && error.response.data && error.response.data.code === -413) {
        alert('Auth Code has expired. Please login again');
        localStorage.clear();
      }
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
          style={{ background: 'rgba(0,0,0,.7)' }}>
          <div className="border border-teal-500 modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="font-bold text-black block">{SchemeName}</p>
                <div onClick={onClose} className="modal-close cursor-pointer z-50">
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 18 18">
                    <path
                      d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z">
                    </path>
                  </svg>
                </div>
              </div>
              <div className="my-5 text-black">
                <p>Are you sure you want to Buy this Fund?</p>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={onClose} className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300">Cancel</button>
                <button onClick={handleConfirm} className="focus:outline-none px-4 bg-teal-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyModal;
