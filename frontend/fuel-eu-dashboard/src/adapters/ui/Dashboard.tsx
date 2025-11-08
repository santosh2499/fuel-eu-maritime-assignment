import React, { useState } from 'react';
import Layout from '../../shared/Layout';
import Tabs from '../../shared/Tabs';
import RoutesTab from './RoutesTab';
import CompareTab from './CompareTab';
import BankingTab from './BankingTab';
import PoolingTab from './PoolingTab';
import * as api from '../infrastructure/api';
jest.mock('../infrastructure/api');
// TODO: import CompareTab, BankingTab, PoolingTab

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Routes');

  return (
    <Layout>
      <Tabs tabs={['Routes','Compare','Banking','Pooling']} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'Routes' && <RoutesTab />}
      {activeTab === 'Compare' && <CompareTab />}
      {activeTab === 'Banking' && <BankingTab />}
      {activeTab === 'Pooling' && <PoolingTab />}
      {/* TODO: Add other tabs */}
    </Layout>
  );
};

export default Dashboard;
