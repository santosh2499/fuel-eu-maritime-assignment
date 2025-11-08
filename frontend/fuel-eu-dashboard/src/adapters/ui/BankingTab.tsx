import React, { useEffect, useState } from 'react';
import { getCB, bankCB, applyBankedCB } from '../infrastructure/api.ts';

interface CBRecord {
  shipId: string;
  cb_gco2eq: number;
}

const BankingTab: React.FC = () => {
  const [records, setRecords] = useState<CBRecord[]>([]);
  const [year, setYear] = useState<number>(2025);

  const fetchCB = async () => {
    try {
      const res = await getCB(year);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch CB:', err);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchCB();
  }, [year]);

  const handleBank = async (shipId: string) => {
    const record = records.find(r => r.shipId === shipId);
    if (!record || record.cb_gco2eq <= 0) return;
    await bankCB({ shipId, year, amount_gco2eq: record.cb_gco2eq });
    fetchCB();
  };

  const handleApply = async (shipId: string) => {
    const record = records.find(r => r.shipId === shipId);
    if (!record || record.cb_gco2eq <= 0) return;
    await applyBankedCB({ shipId, year, amount_gco2eq: record.cb_gco2eq / 2 });
    fetchCB();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Banking</h2>
      <label className="block mb-2">
        Year:
        <input
          type="number"
          value={year}
          onChange={e => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) setYear(val);
          }}
          className="ml-2 border p-1 w-20"
        />
      </label>
      <table className="w-full border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th>Ship</th>
            <th>CB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map(r => (
              <tr key={r.shipId} className="border-t">
                <td>{r.shipId}</td>
                <td>{r.cb_gco2eq.toFixed(2)}</td>
                <td>
                  <button className="px-2 py-1 bg-green-500 text-white mr-2" onClick={() => handleBank(r.shipId)}>Bank</button>
                  <button className="px-2 py-1 bg-blue-500 text-white" onClick={() => handleApply(r.shipId)}>Apply</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BankingTab;
