import React, { useState, useEffect } from 'react';
import { Video, Maximize, Circle, Camera, Radio, ShieldAlert } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { TopBar } from '../components/TopBar';

interface TelemetryEvent {
  id: string;
  student_name: string;
  student_id: string;
  direction: string;
  camera_id: number;
  time: string;
}

export default function Surveillance() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('new_attendance', (record) => {
      const newEvent: TelemetryEvent = {
        id: Math.random().toString(36).substr(2, 9),
        student_name: record.student_name || 'Unknown',
        student_id: record.student_id,
        direction: record.direction,
        camera_id: record.camera_id,
        time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      
      setEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopBar title="Live Surveillance Array" />

      <main className="p-8 min-h-screen max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div>
              <h2 className="font-semibold tracking-tight text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dual-Gate Node Architecture</h2>
              <p className=" text-zinc-500 dark:text-zinc-400 mt-1 tracking-wide">Secure Hardware Pipeline Active • Latency &lt; 15ms</p>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner px-4 py-2 rounded-xl">
              <Radio size={20} className={socketConnected ? 'text-zinc-600 dark:text-zinc-300 animate-pulse' : 'text-error'} />
              <span className="font-medium tracking-wide text-[12px] font-bold tracking-widest uppercase text-zinc-900 dark:text-zinc-100">
                {socketConnected ? 'SOCKET LINK STABLE' : 'LINK SEVERED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Dual Camera Grid */}
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
              
              {/* FEED 01: IN */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Video size={20} className="text-zinc-600 dark:text-zinc-300" />
                      Feed 01: Entry Gate (IN)
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 tracking-widest mt-1">NODE: CAM_00 | RESOLUTION: 1080p | 60 FPS</span>
                  </div>
                  <span className="bg-secondary/20 border border-secondary/30 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,229,203,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    LIVE
                  </span>
                </div>
                
                <div className="relative aspect-video rounded-2xl bg-black border border-zinc/20 overflow-hidden shadow-[0_0_30px_rgba(0,229,203,0.1)]">
                  <img 
                    src={`http://${import.meta.env.VITE_JETSON_IP || '192.168.1.8'}:5001/video_feed_0`} 
                    alt="Entry Gate" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
                  
                  {/* HUD Elements */}
                  <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-secondary/30 text-[10px] font-mono text-zinc-600 dark:text-zinc-300">
                    REC ●
                  </div>
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-600 dark:text-zinc-300/70">
                    TARGET ACQUISITION LOGIC: ACTIVE
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 p-3 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 hover:text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-colors">
                    <Maximize size={16} /> EXPAND
                  </button>
                  <button className="flex-1 p-3 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 hover:text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-colors">
                    <Circle size={16} /> MANUAL OVERRIDE
                  </button>
                  <button className="flex-none px-6 py-3 rounded-xl text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2 hover:text-white bg-zinc/20 hover:bg-zinc/40 border border-zinc/30 transition-colors shadow-[0_0_15px_rgba(0,229,203,0.2)]">
                    <Camera size={16} /> CAPTURE
                  </button>
                </div>
              </div>

              {/* FEED 02: OUT */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Video size={20} className="text-error" />
                      Feed 02: Exit Gate (OUT)
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 tracking-widest mt-1">NODE: CAM_01 | RESOLUTION: 1080p | 45 FPS</span>
                  </div>
                  <span className="bg-red/20 border border-red/30 text-error px-3 py-1 rounded-md text-[10px] font-bold tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                    LIVE
                  </span>
                </div>
                
                <div className="relative aspect-video rounded-2xl bg-black border border-red/20 overflow-hidden shadow-[0_0_30px_rgba(255,50,50,0.1)]">
                  <img 
                    src={`http://${import.meta.env.VITE_JETSON_IP || '192.168.1.8'}:5001/video_feed_1`} 
                    alt="Exit Gate" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
                  
                  {/* HUD Elements */}
                  <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-red/30 text-[10px] font-mono text-error">
                    REC ●
                  </div>
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-red/70">
                    TARGET ACQUISITION LOGIC: ACTIVE
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 p-3 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 hover:text-error bg-zinc-50 dark:bg-zinc-950 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-colors">
                    <Maximize size={16} /> EXPAND
                  </button>
                  <button className="flex-1 p-3 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 hover:text-error bg-zinc-50 dark:bg-zinc-950 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-inner transition-colors">
                    <Circle size={16} /> MANUAL OVERRIDE
                  </button>
                  <button className="flex-none px-6 py-3 rounded-xl text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2 hover:text-white bg-red/20 hover:bg-red/40 border border-red/30 transition-colors shadow-[0_0_15px_rgba(255,50,50,0.2)]">
                    <Camera size={16} /> CAPTURE
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar: Telemetry Feed */}
            <div className="col-span-1 lg:col-span-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold tracking-tight text-2xl font-bold text-zinc-900 dark:text-zinc-100">Neural Telemetry</h3>
                  <ShieldAlert className="text-zinc-900 dark:text-zinc-100" size={24} />
                </div>
                
                <p className=" text-zinc-500 dark:text-zinc-400 mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  Real-time biometric recognition events strictly streamed from hardware edge nodes.
                </p>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
                  {events.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 dark:text-zinc-400/50 font-mono text-[12px]">
                      Awaiting neural handshake...
                    </div>
                  ) : (
                    events.map((evt) => (
                      <div 
                        key={evt.id} 
                        className={`p-4 rounded-2xl flex flex-col gap-2 border animate-in slide-in-from-right-4 fade-in duration-300 ${
                          evt.direction === 'IN' 
                            ? 'bg-zinc/10 border-zinc/20' 
                            : 'bg-red/10 border-red/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[14px] text-zinc-900 dark:text-zinc-100">{evt.student_name}</span>
                          <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded ${
                            evt.direction === 'IN' ? 'bg-secondary/20 text-zinc-600 dark:text-zinc-300' : 'bg-red/20 text-error'
                          }`}>
                            {evt.direction === 'IN' ? 'ENTRY LOGGED' : 'EXIT LOGGED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 dark:text-zinc-400 opacity-80">
                          <span>ID: {evt.student_id}</span>
                          <span>{evt.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
