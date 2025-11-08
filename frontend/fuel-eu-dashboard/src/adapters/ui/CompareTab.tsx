import React, { useEffect, useState } from 'react';
import { getComparison } from '../infrastructure/api';
import * as api from '../infrastructure/api';
jest.mock('../infrastructure/api');
interface Comparison {
  routeId: string;
  baseline: number;
  comparison: number;
  percentDiff: number;
  compliant: boolean;
}

const TARGET = 89.3368;

const CompareTab: React.FC = () => {
  const [data, setData] = useState<Comparison[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getComparison();
      // Compute percentDiff and compliant
      const computed = res.data.map((r: any) => ({
        ...r,
        percentDiff: ((r.comparison / r.baseline) - 1) * 100,
        compliant: r.comparison <= TARGET
      }));
      setData(computed);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Comparison</h2>
      <table className="w-full border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th>Route</th>
            <th>Baseline</th>
            <th>Comparison</th>
            <th>% Diff</th>
            <th>Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.routeId} className="border-t">
              <td>{d.routeId}</td>
              <td>{d.baseline.toFixed(2)}</td>
              <td>{d.comparison.toFixed(2)}</td>
              <td>{d.percentDiff.toFixed(2)}%</td>
              <td>{d.compliant ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareTab;
