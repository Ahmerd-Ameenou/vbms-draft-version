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
    } finally {
      setLoading(false);
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
          inventory:inventory_id (id, name, quantity, unit, category),
          bookings:booking_id (
            id,
            student_name, 
            start_date, 
            end_date, 
            venue_id, 
            venues:venue_id (name),
            status
          )
        `)
        .eq('returned', false);

      if (error) throw error;
      setBookedItems(data);
    } catch (err) {
      toast.error('Failed to fetch booked items');
    }
  };

  const handleReturnItem = async (bookingInventoryId, inventoryId, quantity) => {
    try {
      // Update the returned status in booking_inventory
      const { error: updateError } = await supabase
        .from('booking_inventory')
        .update({ returned: true })
        .eq('id', bookingInventoryId);

      if (updateError) throw updateError;

      // Update the inventory quantity in inventory table
      const { error: quantityError } = await supabase
        .from('inventory')
        .update({ quantity: supabase.rpc('increment', { 
          id: inventoryId, 
          amount: quantity 
        })})
        .eq('id', inventoryId);

      if (quantityError) throw quantityError;

      // Refresh both lists
      await fetchInventories();
      await fetchBookedItems();
      toast.success('Item marked as returned successfully');
    } catch (err) {
      toast.error('Failed to mark item as returned');
    }
  };

  useEffect(() => {
    fetchInventories();
    fetchBookedItems();
  }, []);

  // Group inventories by category
  const groupedInventories = inventories.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen font-sans relative">
        <AdminSidebar onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }} />
        <div className="flex-grow ml-64 p-8 overflow-y-auto">
          <h1 className="text-3xl font-extrabold mb-8">Inventory Management</h1>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen font-sans relative">
        <AdminSidebar onLogout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }} />
        <div className="flex-grow ml-64 p-8 overflow-y-auto">
          <h1 className="text-3xl font-extrabold mb-8">Inventory Management</h1>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Booked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.inventory.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.inventory.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity_used} {item.inventory.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.inventory.quantity} {item.inventory.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.bookings.student_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.bookings.venues.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(item.bookings.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.bookings.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            item.bookings.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.bookings.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleReturnItem(item.id, item.inventory.id, item.quantity_used)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={item.bookings.status !== 'approved'}
                            title={item.bookings.status !== 'approved' ? 'Only approved bookings can be returned' : ''}
                          >
                            Mark Returned
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              {Object.entries(groupedInventories).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{category} Inventory</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition">
                        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium">{item.quantity} {item.unit}{item.quantity !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
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