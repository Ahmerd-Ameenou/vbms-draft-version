import React, { useEffect, useState } from 'react';
import { supabase } from '../Supabase-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../Components/Layout/layout/AdminSidebar';

const InventoryPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedItems, setBookedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');

  const fetchInventories = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setInventories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBookedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_inventory')
        .select(`
          id,
          quantity_used,
          returned,
          inventory:inventory_id (id, name, quantity, units, category),
          booking:booking_id (
            id,
            student_name,
            start_date,
            end_date,
            venue,
            status
          )
        `)
        .eq('returned', false);

      if (error) throw error;
      setBookedItems(data || []);
    } catch (err) {
      toast.error('Failed to fetch booked items');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnItem = async (bookingInventoryId, inventoryId, quantity) => {
    try {
      // Mark item as returned
      const { error: updateError } = await supabase
        .from('booking_inventory')
        .update({ returned: true })
        .eq('id', bookingInventoryId);

      if (updateError) throw updateError;

      // Update inventory quantity
      const { error: quantityError } = await supabase
        .from('inventory')
        .update({ quantity: supabase.rpc('increment', { 
          id: inventoryId, 
          amount: quantity 
        })})
        .eq('id', inventoryId);

      if (quantityError) throw quantityError;

      // Refresh data
      await Promise.all([fetchInventories(), fetchBookedItems()]);
      toast.success('Item returned successfully');
    } catch (err) {
      toast.error('Failed to return item: ' + err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchInventories(), fetchBookedItems()]);
    };
    loadData();
  }, []);

  // Group inventories by category
  const groupedInventories = inventories.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Calculate booked quantities for each item
  const getBookedQuantity = (inventoryId) => {
    return bookedItems
      .filter(item => item.inventory.id === inventoryId && !item.returned)
      .reduce((sum, item) => sum + item.quantity_used, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen font-sans relative">
      <AdminSidebar onLogout={() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }} />
      
      <div className="flex-grow ml-64 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <ToastContainer />
          <h1 className="text-3xl font-extrabold mb-8">Inventory Management</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'inventory' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              View Inventory
            </button>
            <button
              onClick={() => setActiveTab('manageReturns')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'manageReturns' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Manage Returns ({bookedItems.length})
            </button>
          </div>

          {activeTab === 'manageReturns' ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <h2 className="text-xl font-bold p-4 bg-gray-100">Manage Returns</h2>
              {bookedItems.length === 0 ? (
                <div className="p-4 text-gray-500">No items currently booked</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Booked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookedItems.map((item) => {
                      const available = item.inventory.quantity;
                      const booked = item.quantity_used;
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.inventory.name} ({item.inventory.category})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booked} {item.inventory.units}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.booking.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.booking.venue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(item.booking.start_date).toLocaleDateString()} - {' '}
                            {new Date(item.booking.end_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleReturnItem(
                                item.id, 
                                item.inventory.id, 
                                item.quantity_used
                              )}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              disabled={item.booking.status !== 'approved'}
                              title={item.booking.status !== 'approved' ? 
                                'Only approved bookings can be returned' : ''}
                            >
                              Mark Returned
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              {Object.entries(groupedInventories).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item) => {
                      const booked = getBookedQuantity(item.id);
                      const available = item.quantity - booked;
                      return (
                        <div key={item.id} className="bg-white border rounded-lg p-4 shadow">
                          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span>{item.quantity} {item.units}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Booked:</span>
                              <span>{booked} {item.units}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available:</span>
                              <span className={available <= 0 ? 'text-red-500' : 'text-green-500'}>
                                {available} {item.units}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;