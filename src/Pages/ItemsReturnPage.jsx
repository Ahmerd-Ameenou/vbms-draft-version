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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10,15}$/;
    const studentIdRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (!nameRegex.test(formData.studentName)) {
      newErrors.studentName = 'Name should contain only letters';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!studentIdRegex.test(formData.studentId)) {
      newErrors.studentId = 'Invalid student ID format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10-15 digits)';
    }

    if (!formData.club.trim()) {
      newErrors.club = 'Club/Association is required';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.dateCollected) {
      newErrors.dateCollected = 'Collection date is required';
    }

    if (!formData.dateReturned) {
      newErrors.dateReturned = 'Return date is required';
    } else if (formData.dateCollected && new Date(formData.dateReturned) < new Date(formData.dateCollected)) {
      newErrors.dateReturned = 'Return date cannot be before collection date';
    }

    // Check if at least one item is selected
    const hasSelectedItems = Object.values(formData.items).some(item => item.checked);
    if (!hasSelectedItems) {
      newErrors.items = 'At least one item must be selected';
    }

    // Check quantities for selected items
    Object.entries(formData.items).forEach(([itemKey, itemData]) => {
      if (itemData.checked && (isNaN(itemData.quantity) || itemData.quantity <= 0)) {
        newErrors[`item_${itemKey}`] = `Please enter a valid quantity for ${itemKey}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent cursor from appearing in non-input areas
    if (e.target.readOnly) {
      e.preventDefault();
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (item, field, value) => {
    let processedValue = value;
    
    if (field === 'quantity') {
      // Ensure quantity is a positive number
      processedValue = Math.max(0, parseInt(value) || 0);
    }

    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: {
          ...prev.items[item],
          [field]: processedValue
        }
      }
    }));

    // Clear item quantity error when changed
    if (errors[`item_${item}`]) {
      setErrors(prev => ({ ...prev, [`item_${item}`]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      navigate('/booking-status');
    }
  };

  // Check if form is complete for submit button disabling
  const isFormComplete = () => {
    return (
      formData.studentName.trim() &&
      formData.studentId.trim() &&
      formData.phone.trim() &&
      formData.purpose.trim() &&
      formData.dateCollected &&
      formData.dateReturned &&
      formData.club.trim() &&
      Object.values(formData.items).some(item => item.checked)
    );
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
                  className={`w-full p-2 border-2 ${errors.studentName ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.studentName}
                  pattern="[a-zA-Z\s]+"
                  title="Name should contain only letters"
                />
                {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  className={`w-full p-2 border-2 ${errors.studentId ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.studentId}
                />
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
              </div>
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className={`w-full p-2 border-2 ${errors.phone ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.phone}
                  pattern="[0-9]{10,15}"
                  title="Phone number should be 10-15 digits"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Club/Association</label>
                <input
                  type="text"
                  name="club"
                  className={`w-full p-2 border-2 ${errors.club ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.club}
                />
                {errors.club && <p className="text-red-500 text-xs mt-1">{errors.club}</p>}
              </div>
            </div>

            <div className="w-full mb-4">
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Purpose of Event/Program</label>
              <textarea
                name="purpose"
                className={`w-full p-2 border-2 ${errors.purpose ? 'border-red-500' : 'border-blue-500'} rounded-lg h-20 text-sm`}
                required
                onChange={handleInputChange}
                value={formData.purpose}
              />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Date Collected</label>
                <input
                  type="date"
                  name="dateCollected"
                  className={`w-full p-1.5 border-2 ${errors.dateCollected ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.dateCollected}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateCollected && <p className="text-red-500 text-xs mt-1">{errors.dateCollected}</p>}
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Date Returned</label>
                <input
                  type="date"
                  name="dateReturned"
                  className={`w-full p-1.5 border-2 ${errors.dateReturned ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  value={formData.dateReturned}
                  min={formData.dateCollected}
                />
                {errors.dateReturned && <p className="text-red-500 text-xs mt-1">{errors.dateReturned}</p>}
              </div>
            </div>

            <h3 className="text-gray-800 my-3 text-sm font-semibold w-full">
              Items Returned
            </h3>
            {errors.items && <p className="text-red-500 text-xs mb-2 w-full">{errors.items}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
              {Object.entries(formData.items).map(([itemKey, itemData]) => {
                const itemName = itemKey.replace('_', ' ');
                const itemError = errors[`item_${itemKey}`];
                
                return (
                  <div key={itemKey} className={`border-2 ${itemError ? 'border-red-500' : 'border-blue-500'} rounded-lg p-3 flex items-center gap-3 bg-gray-50`}>
                    <input
                      type="checkbox"
                      checked={itemData.checked}
                      onChange={(e) => handleItemChange(itemKey, 'checked', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="flex-1 text-sm">{itemName}</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className={`w-14 p-1 border-2 ${itemError ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
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
              className={`bg-blue-500 text-white py-2 px-8 rounded-lg text-sm font-medium mt-4 hover:bg-blue-600 transition-colors ${!isFormComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isFormComplete()}
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