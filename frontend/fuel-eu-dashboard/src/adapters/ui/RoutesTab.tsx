import React, { useEffect, useState } from 'react';
import { getRoutes, setBaseline } from '../infrastructure/api';
// RoutesTab.test.tsx
import * as api from '../infrastructure/api';
jest.mock('../infrastructure/api.ts');


interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

const RoutesTab: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    const res = await getRoutes();
    setRoutes(res.data);
    setLoading(false);
  };

  const handleSetBaseline = async (routeId: string) => {
    await setBaseline(routeId);
    fetchRoutes();
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> :
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Route ID</th>
              <th>Vessel Type</th>
              <th>Fuel Type</th>
              <th>Year</th>
              <th>GHG Intensity</th>
              <th>Fuel Consumption (t)</th>
              <th>Distance (km)</th>
              <th>Total Emissions</th>
              <th>Baseline</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.routeId} className="text-center border-t">
                <td>{r.routeId}</td>
                <td>{r.vesselType}</td>
                <td>{r.fuelType}</td>
                <td>{r.year}</td>
                <td>{r.ghgIntensity}</td>
                <td>{r.fuelConsumption}</td>
                <td>{r.distance}</td>
                <td>{r.totalEmissions}</td>
                <td>
                  {r.isBaseline ? '✅' :
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleSetBaseline(r.routeId)}>Set Baseline</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default RoutesTab;
