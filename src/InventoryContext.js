import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './Supabase-client';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const inventoryData = {
        "SA Inventory": data.filter(item => item.category === "SA Inventory"),
        "ICT Inventory": data.filter(item => item.category === "ICT Inventory")
      };
      
      setInventory(inventoryData);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateInventory = async (itemName, change) => {
    try {
      // Get current item data
      const { data: itemData, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('name', itemName)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newQuantity = itemData.units + change;
      
      // Update in Supabase
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ units: newQuantity })
        .eq('name', itemName);
      
      if (updateError) throw updateError;
      
      // Update local state
      setInventory(prev => {
        const newInventory = {...prev};
        for (const category in newInventory) {
          const itemIndex = newInventory[category].findIndex(item => item.name === itemName);
          if (itemIndex !== -1) {
            newInventory[category][itemIndex].units = newQuantity;
            break;
          }
        }
        return newInventory;
      });
      
      return true;
    } catch (error) {
      console.error("Error updating inventory:", error);
      return false;
    }
  };

  return (
    <InventoryContext.Provider value={{ inventory, loading, updateInventory, fetchInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);