import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`px-4 py-2 rounded ${tab === activeTab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
