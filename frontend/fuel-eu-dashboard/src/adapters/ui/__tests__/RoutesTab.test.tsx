// frontend/fuel-eu-dashboard/src/adapters/ui/__tests__/RoutesTab.test.tsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RoutesTab from '../RoutesTab';
import * as api from '../../infrastructure/api';
jest.mock('../../infrastructure/api');  // same path as import

const mockRoutes = [
  { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
];

describe('RoutesTab', () => {
  beforeEach(() => {
    (api.getRoutes as jest.Mock).mockResolvedValue({ data: mockRoutes });
    (api.setBaseline as jest.Mock).mockResolvedValue({ status: 200 });
  });

  test('renders routes table', async () => {
    render(<RoutesTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
    });
  });

  test('Set Baseline button calls API', async () => {
    render(<RoutesTab />);
    await waitFor(() => screen.getAllByText('Set Baseline'));
    fireEvent.click(screen.getAllByText('Set Baseline')[0]);
    await waitFor(() => expect(api.setBaseline).toHaveBeenCalledWith('R001'));
  });

  test('filters by vesselType', async () => {
    render(<RoutesTab />);
    const select = screen.getByLabelText(/Vessel Type/i);
    fireEvent.change(select, { target: { value: 'BulkCarrier' } });
    await waitFor(() => expect(screen.queryByText('R001')).not.toBeInTheDocument());
    expect(screen.getByText('R002')).toBeInTheDocument();
  });
});
