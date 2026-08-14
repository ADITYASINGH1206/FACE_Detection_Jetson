import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Building, X, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import { TopBar } from '../components/TopBar';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Adjust first day for Mon-Sun week (0 is Sunday)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  useEffect(() => {
    const fetchLogsForDate = async () => {
      setLoading(true);
      try {
        // Format YYYY-MM-DD
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        const res = await axios.get(`http://localhost:3000/api/v1/events/attendance/date?date=${dateStr}`);
        if (res.data?.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch logs for date", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogsForDate();
  }, [selectedDate]);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopBar title="Historical Attendance" />

      <main className="flex-1 px-margin-mobile max-w-4xl mx-auto w-full pt-stack-md">
        {/* Monthly Attendance Calendar */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold tracking-tight text-[24px] font-bold text-zinc-900 dark:text-zinc-100">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-zinc-950 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl active:bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-all">
                <ChevronLeft size={20} className="text-zinc-900 dark:text-zinc-100" />
              </button>
              <button onClick={handleNextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-zinc-950 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl active:bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-all">
                <ChevronRight size={20} className="text-zinc-900 dark:text-zinc-100" />
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['MO','TU','WE','TH','FR','SA','SU'].map((d, i) => (
                <div key={d} className={`text-center font-medium tracking-wide text-[12px] font-bold ${i === 6 ? 'text-error' : 'text-zinc-500 dark:text-zinc-400'}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Empty slots for previous month */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10"></div>
              ))}
              
              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                
                return (
                  <button 
                    key={day} 
                    onClick={() => handleDateClick(day)}
                    className={`h-10 rounded-lg flex items-center justify-center  text-[14px] transition-all
                      ${isSelected 
                        ? 'font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner bg-zinc-200 dark:bg-zinc-700 border border-zinc/30' 
                        : isToday 
                        ? 'text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-950 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl filter drop-shadow-[0_0_4px_rgba(0,223,197,0.5)] border border-zinc/20' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Daily Log List */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold tracking-tight text-[20px] font-bold text-zinc-900 dark:text-zinc-100">
              Logs for {selectedDate.toLocaleDateString()}
            </h2>
            <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              {logs.length} RECORDS
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 animate-pulse">Loading records...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 ">
                No attendance events recorded for this date.
              </div>
            ) : (
              logs.map((log) => {
                const isEntry = log.direction === 'IN';
                const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={log.id} className={`p-4 bg-white dark:bg-zinc-950 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-4 transition-transform ${log.is_late ? 'border-l-4 border-error' : 'border-l-4 border-transparent'}`}>
                    <div className={`w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner flex flex-col items-center justify-center ${isEntry ? 'bg-secondary/10 text-zinc-600 dark:text-zinc-300' : 'bg-tertiary/10 text-zinc-500 dark:text-zinc-400'}`}>
                      {isEntry ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className=" text-[16px] font-semibold text-zinc-900 dark:text-zinc-100">{log.student_name || 'Unknown'} <span className="text-xs font-mono font-normal text-zinc-500 dark:text-zinc-400 ml-2">({log.student_id})</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`font-medium tracking-wide text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isEntry ? 'bg-secondary/20 text-zinc-600 dark:text-zinc-300' : 'bg-tertiary/20 text-zinc-500 dark:text-zinc-400'}`}>{isEntry ? 'ENTRY' : 'EXIT'}</span>
                        <p className="font-mono text-[12px] text-zinc-500 dark:text-zinc-400">{timeStr}</p>
                        <span className="font-medium tracking-wide text-[10px] uppercase text-outline-variant ml-2 tracking-widest">{log.camera_id ? `CAM-${log.camera_id}` : 'MANUAL'}</span>
                      </div>
                    </div>
                    {log.is_late && (
                      <button className="px-3 py-2 rounded-lg bg-error/20 text-error font-medium tracking-wide text-[10px] font-bold active:bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-all">
                        {isEntry ? 'LATE ENTRY' : 'LATE EXIT'}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
