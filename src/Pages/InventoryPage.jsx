import React from 'react';

const inventories = {
  "SA Inventory": [
    { name: "Mat", units: 10 },
    { name: "Big drink container", units: 5 },
    { name: "First aid kit box", units: 2 },
  ],
  "ICT Inventory": [
    { name: "Portable speaker", units: 6 },
    { name: "Portable projector", units: 2 },
    { name: "HDMI cable", units: 10 },
    { name: "Audio cable", units: 10 },
    { name: "Portable white projection screen", units: 1 },
    { name: "Wireless microphone", units: 10 },
    { name: "Wired microphone", units: 10 },
    { name: "Mic stand", units: 6 },
  ],
};

const InventoryCard = ({ item }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition">
    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
    <p className="text-gray-600">{item.units} unit{item.units > 1 ? 's' : ''} available</p>
  </div>
);

const InventorySection = ({ title, items }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <InventoryCard key={index} item={item} />
      ))}
    </div>
  </section>
);

const InventoryPage = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold mb-8">Inventory Management</h1>
      
      {Object.entries(inventories).map(([category, items]) => (
        <InventorySection key={category} title={category} items={items} />
      ))}
    </div>
  );
};

export default InventoryPage;
