import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../Components/Layout/layout/Sidebar';
import { supabase } from '../Supabase-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookVenuePage = () => {
  const { venue } = useParams();
  const navigate = useNavigate();
  const [venueId, setVenueId] = useState(null);
  const [itemsMap, setItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    phone: '',
    purpose: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    club: '',
    items: {
      Mat: { checked: false, quantity: 0 },
      "Big drink container": { checked: false, quantity: 0 },
      "First aid kit box": { checked: false, quantity: 0 },
      "Portable speaker": { checked: false, quantity: 0 },
      "Portable projector": { checked: false, quantity: 0 },
      "HDMI cable": { checked: false, quantity: 0 },
      "Audio cable": { checked: false, quantity: 0 },
      "Portable white projection screen": { checked: false, quantity: 0 },
      "Wireless microphone": { checked: false, quantity: 0 },
      "Wired microphone": { checked: false, quantity: 0 },
      "Mic stand": { checked: false, quantity: 0 },
      Mixer: { checked: false, quantity: 0 }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get venue ID
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('id')
          .eq('name', decodeURIComponent(venue))
          .single();

        if (venueError) throw venueError;
        setVenueId(venueData.id);

        // Get items mapping
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('id, name');

        if (itemsError) throw itemsError;

        const itemsMapping = itemsData.reduce((acc, item) => {
          acc[item.name] = item.id;
          return acc;
        }, {});

        setItemsMap(itemsMapping);
        setLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setSubmitError('Failed to load booking information');
        setLoading(false);
      }
    };

    fetchData();
  }, [venue]);

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate student name (letters only)
    if (!formData.studentName.trim()) {
      errors.studentName = 'Student name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.studentName)) {
      errors.studentName = 'Name should contain only letters';
    }

    // Validate student ID (alphanumeric)
    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.studentId)) {
      errors.studentId = 'ID should be alphanumeric';
    }

    // Validate phone number (now accepts international numbers with + and special characters)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    // Validate club/association (letters only)
    if (!formData.club.trim()) {
      errors.club = 'Club/Association is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.club)) {
      errors.club = 'Club name should contain only letters';
    }

    // Validate purpose
    if (!formData.purpose.trim()) {
      errors.purpose = 'Purpose is required';
    }

    // Validate dates
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    } else if (new Date(formData.startDate) < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date cannot be before start date';
    }

    // Validate times
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, [field]: formattedDate }));
  };

  const handleItemChange = (item, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: {
          ...prev.items[item],
          [field]: field === 'quantity' ? parseInt(value) || 0 : value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Check for existing bookings conflicts — now filtering only approved bookings
      const { data: conflicts, error: conflictError } = await supabase
        .from('bookings')
        .select()
        .eq('venue_id', venueId)
        .eq('status', 'approved')
        .gte('start_date', formData.startDate)
        .lte('end_date', formData.endDate)
        .or(
          `and(start_time.lte.${formData.endTime},end_time.gte.${formData.startTime})`
        );

      if (conflictError) throw conflictError;

      if (conflicts.length > 0) {
        toast.warning(
          'There is an existing booking at this time. Please choose a different time.'
        );
        throw new Error(
          'Booking conflict: There is an existing booking at this time.'
        );
      }

      // Create new booking with status 'pending' and start/end time
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          venue_id: venueId,
          student_name: formData.studentName,
          student_id: formData.studentId,
          phone: formData.phone,
          purpose: formData.purpose,
          start_date: formData.startDate,
          end_date: formData.endDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          club: formData.club,
          status: 'pending'
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create booking items
      const itemsToInsert = Object.entries(formData.items)
        .filter(([_, item]) => item.checked && item.quantity > 0)
        .map(([itemName, item]) => ({
          booking_id: booking.id,
          item_id: itemsMap[itemName],
          quantity: item.quantity
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('booking_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      navigate('/booking-status');
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen font-sans relative">
        <Sidebar />
        <div className="fixed left-64 right-0 top-0 bottom-0 flex items-center justify-center">
          <div className="text-gray-600">Loading booking form...</div>
        </div>
      </div>
    );
  }

  if (!venueId) {
    return (
      <div className="flex min-h-screen font-sans relative">
        <Sidebar />
        <div className="fixed left-64 right-0 top-0 bottom-0 flex items-center justify-center">
          <div className="text-red-500">Venue not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans relative">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />

      <div className="fixed left-64 right-0 top-0 bottom-0 overflow-y-auto bg-white border-l border-gray-200">
        <button 
          onClick={() => navigate('/venues')}
          className="absolute left-5 top-5 flex items-center gap-2 py-2 px-4 bg-white border-2 border-blue-500 rounded-lg text-blue-500 text-sm font-semibold cursor-pointer z-10 hover:bg-blue-50"
        >
          ← Back
        </button>

        <div className="max-w-2xl mx-auto my-5 p-6 bg-white rounded-xl shadow-md border-4 border-gray-200">
          <h2 className="text-center mb-6 text-xl font-semibold text-gray-800">
            Booking Form for {decodeURIComponent(venue)}
          </h2>
          
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  className={`w-full p-2 border-2 ${formErrors.studentName ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  pattern="[A-Za-z\s]+"
                  title="Only letters allowed"
                />
                {formErrors.studentName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.studentName}</p>
                )}
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  className={`w-full p-2 border-2 ${formErrors.studentId ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  pattern="[A-Za-z0-9]+"
                  title="Only alphanumeric characters allowed"
                />
                {formErrors.studentId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className={`w-full p-2 border-2 ${formErrors.phone ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Club/Association</label>
                <input
                  type="text"
                  name="club"
                  className={`w-full p-2 border-2 ${formErrors.club ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                  pattern="[A-Za-z\s]+"
                  title="Only letters allowed"
                />
                {formErrors.club && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.club}</p>
                )}
              </div>
            </div>

            <div className="w-full mb-4">
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Purpose of Event/Program</label>
              <textarea
                name="purpose"
                className={`w-full p-2 border-2 ${formErrors.purpose ? 'border-red-500' : 'border-blue-500'} rounded-lg h-20 text-sm`}
                required
                onChange={handleInputChange}
              />
              {formErrors.purpose && (
                <p className="text-red-500 text-xs mt-1">{formErrors.purpose}</p>
              )}
            </div>

            <div className="flex gap-4 mb-4 w-full flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Start Date</label>
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  minDate={new Date()}
                  className={`w-full p-1.5 border-2 ${formErrors.startDate ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  placeholderText="Select start date"
                />
                {formErrors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">End Date</label>
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                  className={`w-full p-1.5 border-2 ${formErrors.endDate ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  placeholderText="Select end date"
                />
                {formErrors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className={`w-full p-1.5 border-2 ${formErrors.startTime ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                />
                {formErrors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className={`w-full p-1.5 border-2 ${formErrors.endTime ? 'border-red-500' : 'border-blue-500'} rounded-lg text-sm`}
                  required
                  onChange={handleInputChange}
                />
                {formErrors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>
                )}
              </div>
            </div>

            <h3 className="text-gray-800 my-3 text-sm font-semibold w-full">
              Items Requested
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
              {Object.entries(formData.items).map(([itemKey, itemData]) => (
                <div key={itemKey} className="border-2 border-blue-500 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                  <input
                    type="checkbox"
                    checked={itemData.checked}
                    onChange={(e) => handleItemChange(itemKey, 'checked', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="flex-1 text-sm">{itemKey}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    className={`w-14 p-1 border-2 ${!itemData.checked ? 'border-gray-300' : 'border-blue-500'} rounded-lg text-sm`}
                    value={itemData.quantity}
                    onChange={(e) => handleItemChange(itemKey, 'quantity', e.target.value)}
                    disabled={!itemData.checked}
                  />
                </div>
              ))}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white py-2 px-8 rounded-lg text-sm font-medium mt-4 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'SUBMIT BOOKING'}
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
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default BookVenuePage;