// frontend/fuel-eu-dashboard/src/adapters/ui/__tests__/PoolingTab.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PoolingTab from '../PoolingTab';
import * as api from '../../infrastructure/api';
jest.mock('../../infrastructure/api');


const mockMembers = [
  { shipId: 'R001', cb_gco2eq: 100, cb_after: undefined },
  { shipId: 'R002', cb_gco2eq: 50, cb_after: undefined },
];

// Mock getAdjustedCB API
(api.getAdjustedCB as jest.Mock).mockResolvedValue({ data: mockMembers });

// Mock createPool API
(api.createPool as jest.Mock).mockResolvedValue({ members: mockMembers, poolSum: 150 });






const mockAdjustedCB = {
  data: [
    { shipId: 'R001', cb_gco2eq: 100 },
    { shipId: 'R002', cb_gco2eq: 50 },
  ],
};

const mockPoolResponse = {
  members: [
    { shipId: 'R001', cb_before: 100, cb_after: 90 },
    { shipId: 'R002', cb_before: 50, cb_after: 60 },
  ],
  poolSum: 150,
};

describe('PoolingTab', () => {
  beforeEach(() => {
    (api.getAdjustedCB as jest.Mock).mockResolvedValue(mockAdjustedCB);
    (api.createPool as jest.Mock).mockResolvedValue(mockPoolResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PoolingTab table and Pool Sum', async () => {
    render(<PoolingTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
      expect(screen.getByText(/Pool Sum/i)).toBeInTheDocument();
      expect(screen.getByText('150.00 gCO₂e')).toBeInTheDocument();
    });
  });

  test('Create Pool button calls API and updates table', async () => {
    render(<PoolingTab />);
    const btn = await screen.findByText('Create Pool');
    fireEvent.click(btn);

    await waitFor(() => expect(api.createPool).toHaveBeenCalled());

    // Check if the table updated correctly
    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getByText('R002')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('150.00 gCO₂e'))).toBeInTheDocument();
  });
});
