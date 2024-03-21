import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import BuyModal from './BuyModal'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dropdownItems, setDropdownItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fundData, setFundData] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, stockName: '', SchemeName: ''});
 const navigate = useNavigate();
  const handleBuyClick = (stockName, SchemeName) => {
    setModalData({ isOpen: true, stockName, SchemeName });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login')
  }
  const SuccessComponent = ({ message, onClose }) => (
    <div className="flex shadow-md gap-6 rounded-lg overflow-hidden divide-x max-w-2xl dark:bg-gray-900 dark:text-gray-100 dark:divide-gray-700">
        <div className="flex flex-1 flex-col p-4 border-l-8 dark:border-green-400">
            <span className="text-2xl">Success</span>
            <span className="text-xs dark:text-gray-400">Buy purchase initiated.</span>
        </div>
        <button className="px-4 flex items-center text-xs uppercase tracking-wide dark:text-gray-400 dark:border-gray-700" onClick={onClose}>Dismiss</button>
    </div>
  );

  const handleBuySuccess = () => {
    setSuccess(true);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  

  useEffect(() => {
    const fetchDropdownItems = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/fund-family/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const formattedOptions = response.data.map(item => ({
            label: item,
            value: item,
          }));
        setDropdownItems(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch dropdown items:', error);
      }
    };

    fetchDropdownItems();
  }, []);

  useEffect(() => {
    const fetchFundData = async () => {
        try {
            setLoading(true);
            
            const accessToken = localStorage.getItem('access_token');
            let url = 'http://127.0.0.1:8000/api/mutual-fund-data/';
            if (selectedItems != null && selectedItems.value) {
                url = `http://127.0.0.1:8000/api/mutual-fund-data/?fund_family=${selectedItems.value}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }, 
            })
            setFundData(response.data)
        } catch (error) {
            console.error('Failed to fetch fund data:', error);
        } finally {
            setLoading(false);
        }
    }
    fetchFundData()
  }, [selectedItems])

  return (
    <>
        <button onClick={handleLogout} className="fixed top-0 right-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-0">Logout</button>
        {success && <SuccessComponent message={success} onClose={handleCloseSuccess} />}
        <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
            <h2 className='text-2xl font-semibold text-black'>Dashboard</h2>
            <div className='w-full mx-auto my-8'>
                <div>
                {/* Multiselect Dropdown */}
                <Select
                    options={dropdownItems}
                    value={selectedItems}
                    onChange={(selectedOptions) => setSelectedItems(selectedOptions)}
                    isClearable
                    placeholder="Select Fund Families"
                    className='max-w-2xl text-black'
                />

                {/* Display Fund Data */}
            
                <div className="overflow-x-auto">
                    <h2 className="mb-4 text-2xl font-semibold text-black mt-2">Mutual Fund Data</h2>
                    <table className="w-full p-6 table-fixed text-xs text-center whitespace-nowrap">
                        {/* Table code here */}
                        <colgroup>
                            <col className="w-1/12" />
                            <col className="w-2/6"/>
                            <col className="w-1/12"/>
                            <col className="w-1/12"/>
                            <col className="w-1/6" />
                            <col className='w-1/12'/>
                        </colgroup>
                        <thead>
                            <tr className="dark:bg-gray-700">
                                <th className="p-3">Scheme Code</th>
                                <th className="p-3">Scheme Name</th>
                                <th className="p-3">Net Asset Value</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Scheme Category</th>
                                <th className='p-3'>Place Order</th>
                            </tr>
                        </thead>
                            <tbody className="border-b dark:bg-gray-900 dark:border-gray-700">
                                {fundData.map((fund, index) => (
                                    <tr key={index}>
                                        <td className="px-3 py-2">{fund['Scheme Code']}</td>
                                        <td className="px-3 py-2">{fund['Scheme Name']}</td>
                                        <td className="px-3 py-2">{fund['Net Asset Value']}</td>
                                        <td className="px-3 py-2">{fund['Date']}</td>
                                        <td className="px-3 py-2">{fund['Scheme Category'].replace('Open Ended Schemes(', '').replace(')', '')}</td>
                                        <td className="px-3 py-2">
                                            <button onClick={() => handleBuyClick(fund['Scheme Code'], fund['Scheme Name'])} className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 border border-green-500 rounded'>Buy</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    {loading && <div className="flex items-center justify-center space-x-2 mt-10">
                                    <div className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-900"></div>
                                    <div className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-900"></div>
                                    <div className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-900"></div>
                                </div>
                    }
                    <BuyModal
                        stockName={modalData.stockName}
                        SchemeName={modalData.SchemeName}
                        isOpen={modalData.isOpen}
                        onClose={() => setModalData({ ...modalData, isOpen: false })}
                        onBuySuccess={handleBuySuccess} 
                    />
                </div>
            </div>
            </div>
        </div>
    </>
  );
};

export default Dashboard;
