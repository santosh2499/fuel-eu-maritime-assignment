// File: frontend/fuel-eu-dashboard/src/adapters/ui/__tests__/BankingTab.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BankingTab from '../BankingTab';
import * as api from '../../infrastructure/api';
jest.mock('../../infrastructure/api');
 // Update path according to your project


describe('BankingTab', () => {
  const mockRecords = [
  { shipId: 'R001', cb_gco2eq: 100, cb_after: undefined },
  { shipId: 'R002', cb_gco2eq: 50, cb_after: undefined },
  ];

  beforeEach(() => {
    (api.getCB as jest.Mock).mockResolvedValue({ data: mockRecords });
(api.bankCB as jest.Mock).mockResolvedValue({ success: true });
(api.applyBankedCB as jest.Mock).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders current CB records', async () => {
    render(<BankingTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    expect(screen.getByText(/CB Before/i)).toBeInTheDocument();
    expect(screen.getByText(/150/i)).toBeInTheDocument();
  });

  test('Bank button calls API', async () => {
    render(<BankingTab />);
    const btn = await screen.findByText('Bank');
    fireEvent.click(btn);
    await waitFor(() => expect(api.bankCB).toHaveBeenCalled());
  });

  test('Apply button calls API', async () => {
    render(<BankingTab />);
    const btn = await screen.findByText('Apply');
    fireEvent.click(btn);
    await waitFor(() => expect(api.applyBankedCB).toHaveBeenCalled());
  });
});
