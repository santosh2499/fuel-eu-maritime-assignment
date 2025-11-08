import React from 'react';
import Tabs from './Tabs';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Fuel EU Maritime Compliance Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">{children}</div>
    </div>
  );
};

export default Layout;
