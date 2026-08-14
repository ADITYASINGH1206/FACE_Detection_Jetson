import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import axios from 'axios';
import { Users, Clock, AlertTriangle } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

interface Occupant {
  student_id: string;
  student_name: string | null;
  entry_time: string | null;
  is_late: boolean;
}

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'in';
  const isOutside = filter === 'out';

  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const status = isOutside ? 'OUT' : 'IN';
        const res = await axios.get(`http://localhost:3000/api/v1/analytics/occupancy?status=${status}`);
        if (res.data?.success) {
          setOccupants(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch occupancy data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOccupancy();
  }, [isOutside]);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopBar title="Live Occupancy & Analytics" />
      
      <main className="p-8 min-h-screen max-w-[1440px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-semibold tracking-tight text-[28px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {isOutside ? 'Currently Outside' : 'Currently Inside'}
          </h2>
          <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm px-6 py-3 rounded-full border-l-4 flex items-center gap-3 ${isOutside ? 'border-tertiary' : 'border-secondary'}`}>
            <Users size={24} className={isOutside ? 'text-zinc-500 dark:text-zinc-400 ' : 'text-zinc-600 dark:text-zinc-300 '} />
            <span className={`font-semibold tracking-tight text-[24px] font-bold ${isOutside ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-600 dark:text-zinc-300'}`}>{occupants.length}</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Students</span>
          </div>
        </div>

        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 animate-pulse">Loading occupancy data...</div>
            ) : occupants.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 ">
                No students are currently logged as inside the hostel.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase tracking-widest text-[11px]">
                    <th className="pb-4 px-4 font-bold">Student Details</th>
                    <th className="pb-4 px-4 font-bold">Time of Entry</th>
                    <th className="pb-4 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {occupants.map((student) => {
                    const timeStr = student.entry_time 
                      ? new Date(student.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : 'N/A';
                    return (
                      <tr key={student.student_id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:bg-zinc-800 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-md">{student.student_name || 'Unknown'}</span>
                            <span className="text-[12px] font-mono text-zinc-500 dark:text-zinc-400">{student.student_id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                            <Clock size={16} />
                            <span className="font-mono text-[14px]">{timeStr}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {student.is_late ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red/10 text-error border border-red/20 drop-shadow-[0_0_4px_rgba(255,50,50,0.3)]">
                              <AlertTriangle size={12} /> {isOutside ? 'LATE EXIT' : 'LATE ENTRY'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-zinc-600 dark:text-zinc-300 border border-zinc/20 drop-shadow-[0_0_4px_rgba(0,229,203,0.3)]">
                              {isOutside ? 'REGULAR EXIT' : 'REGULAR ENTRY'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
