import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Layout/layout/Sidebar';

const ItemsReturnPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    phone: '',
    purpose: '',
    dateCollected: '',
    dateReturned: '',
    club: '',
    items: {
      Mat: { checked: false, quantity: 0 },
      'Big drink container': { checked: false, quantity: 0 },
      'First aid kit box': { checked: false, quantity: 0 },
      'Portable speaker': { checked: false, quantity: 0 },
      'Portable projector': { checked: false, quantity: 0 },
      'HDMI cable': { checked: false, quantity: 0 },
      'Wireless microphone': { checked: false, quantity: 0 },
      'Wired microphone': { checked: false, quantity: 0 },
      'Mic stand': { checked: false, quantity: 0 },
      'Audio cable': { checked: false, quantity: 0 },
      'Portable white projection screen': { checked: false, quantity: 0 },
      Mixer: { checked: false, quantity: 0 }
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (item, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: {
          ...prev.items[item],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/booking-status');
  };

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute left-5 top-5 flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer z-10 hover:bg-blue-50"
        >
          ← Back
        </button>

        <div className="max-w-2xl mx-auto my-5 p-6 bg-white rounded-xl shadow-md border-4 border-gray-200">
          <h2 className="text-center mb-6 text-xl font-semibold text-gray-800">
            Items Return Form
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  className="w-full p-2 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  className="w-full p-2 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-2 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Club/Association</label>
                <input
                  type="text"
                  name="club"
                  className="w-full p-2 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full mb-4">
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Purpose of Event/Program</label>
              <textarea
                name="purpose"
                className="w-full p-2 border-2 border-blue-500 rounded-lg h-20 text-sm"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Date Collected</label>
                <input
                  type="date"
                  name="dateCollected"
                  className="w-full p-1.5 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Date Returned</label>
                <input
                  type="date"
                  name="dateReturned"
                  className="w-full p-1.5 border-2 border-blue-500 rounded-lg text-sm"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h3 className="text-gray-800 my-3 text-sm font-semibold w-full">
              Items Returned
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
              {Object.entries(formData.items).map(([itemKey, itemData]) => {
                const itemName = itemKey.replace('_', ' ');
                return (
                  <div key={itemKey} className="border-2 border-blue-500 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                    <input
                      type="checkbox"
                      checked={itemData.checked}
                      onChange={(e) => handleItemChange(itemKey, 'checked', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="flex-1 text-sm">{itemName}</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      className="w-14 p-1 border-2 border-blue-500 rounded-lg text-sm"
                      value={itemData.quantity}
                      onChange={(e) => handleItemChange(itemKey, 'quantity', e.target.value)}
                      disabled={!itemData.checked}
                    />
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-8 rounded-lg text-sm font-medium mt-4 hover:bg-blue-600 transition-colors"
            >
              SUBMIT RETURN
            </button>
          </form>

          <div className="mt-8 pt-5 text-center border-t border-gray-200">
            <div className="text-2xl font-serif text-gray-800 mb-3">
              "inspiring minds"
            </div>
            <div className="flex justify-center gap-4 font-bold uppercase text-sm text-gray-800 tracking-wider">
              <span>AQIDAH</span>
              <span>AKHLAQ</span>
              <span>ADAB</span>
              <span>AMANAH</span>
              <span>AMALAN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsReturnPage;
