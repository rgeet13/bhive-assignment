// Import the necessary dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Dashboard = () => {
  const [dropdownItems, setDropdownItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fundData, setFundData] = useState([]);

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
            const accessToken = localStorage.getItem('access_token');
            const selectedItemsString = selectedItems.map(item => item.value).join(',');
            console.log(selectedItemsString);
            const response = await axios.get(`http://127.0.0.1:8000/api/mutual-fund-data/?fund_family=${selectedItemsString}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }, 
            })
            console.log(response.data);
            setFundData(response.data)
        } catch (error) {
            console.error('Failed to fetch fund data:', error);
        }
    }
    fetchFundData()
  }, [selectedItems])

  return (
    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
        <h2 className='text-2xl font-semibold text-black'>Dashbaord</h2>
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
                                    <button onClick={() => handleBuyClick(fund['Scheme Code'])} className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 border border-green-500 rounded'>Buy</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Dashboard;
