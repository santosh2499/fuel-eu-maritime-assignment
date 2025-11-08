// frontend/fuel-eu-dashboard/src/adapters/ui/PoolingTab.tsx
import React, { useEffect, useState } from 'react';
import { getCB, bankCB, applyBankedCB, getAdjustedCB, createPool } from '../infrastructure/api';
// PoolingTab.test.tsx
import * as api from '../infrastructure/api';;
jest.mock('../infrastructure/api');




interface PoolMember {
  shipId: string;
  cb_gco2eq: number;
  cb_after?: number;
}

const PoolingTab: React.FC = () => {
  const [year, setYear] = useState<number>(2025);
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [poolSum, setPoolSum] = useState<number>(0);

  const fetchMembers = async () => {
    const res = await getAdjustedCB(year);
    // Ensure res.data is always an array
    const membersData: PoolMember[] = Array.isArray(res.data) ? res.data : [];
    setMembers(membersData);

    const sum = membersData.reduce((acc, m) => acc + (m.cb_gco2eq || 0), 0);
    setPoolSum(sum);
  };

  useEffect(() => {
    fetchMembers();
  }, [year]);

  const handleCreatePool = async () => {
    const res = await createPool({
      year,
      members: members.map(m => ({ shipId: m.shipId, cb_before: m.cb_gco2eq })),
    });

    // Ensure response has members array and poolSum
    setMembers(Array.isArray(res.members) ? res.members : []);
    setPoolSum(res.poolSum ?? 0);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pooling</h2>
      <label className="block mb-2">
        Year:
        <input
          type="number"
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          className="ml-2 border p-1 w-20"
        />
      </label>

      <table className="w-full border mb-4 text-center">
        <thead className="bg-gray-200">
          <tr>
            <th>Ship ID</th>
            <th>CB Before</th>
            <th>CB After</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.shipId} className="border-t">
              <td>{m.shipId}</td>
              <td>{m.cb_gco2eq !== undefined ? m.cb_gco2eq.toFixed(2) : '-'}</td>
              <td>{m.cb_after !== undefined ? m.cb_after.toFixed(2) : '-'}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <p className={`font-bold mb-2 ${poolSum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        Pool Sum: {poolSum.toFixed(2)} gCO₂e
      </p>

      <button
        className="px-4 py-2 rounded bg-blue-500 text-white"
        onClick={handleCreatePool}
        disabled={poolSum < 0}
      >
        Create Pool
      </button>
    </div>
  );
};

export default PoolingTab;
