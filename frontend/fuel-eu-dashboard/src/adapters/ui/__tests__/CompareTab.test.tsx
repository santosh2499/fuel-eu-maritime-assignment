
import { render, screen, waitFor } from '@testing-library/react';
import CompareTab from '../CompareTab';
import * as api from '../../infrastructure/api';

jest.mock('../../infrastructure/api');

const mockData = [
  { routeId: 'R001', baseline: 91, comparison: 90.5 },
  { routeId: 'R002', baseline: 88, comparison: 88.5 },
];

describe('CompareTab', () => {
  beforeEach(() => {
    (api.getComparison as jest.Mock).mockResolvedValue({ data: mockData });
  });

  test('renders comparison table', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
    });
  });

  test('shows compliant status correctly', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getAllByText('✅').length).toBe(1);
      expect(screen.getAllByText('❌').length).toBe(1);
    });
  });
});
