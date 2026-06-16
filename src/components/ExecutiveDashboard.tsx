/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  Search, 
  Terminal, 
  Play, 
  Filter, 
  TrendingUp, 
  User, 
  Grid,
  Shield,
  RefreshCw,
  Bell
} from 'lucide-react';
import { SupportTicket, SystemAlert } from '../types';

interface ExecutiveDashboardProps {
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  alerts: SystemAlert[];
  onTriggerOverride: () => void;
  systemHealth: number;
}

export default function ExecutiveDashboard({
  tickets,
  setTickets,
  alerts,
  onTriggerOverride,
  systemHealth
}: ExecutiveDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('sales');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'PRIORITY'>('ALL');
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  
  // Real-time custom state for interactive system override terminal logs
  const [overrideLogs, setOverrideLogs] = useState<string[]>([]);
  const [isOverriding, setIsOverriding] = useState<boolean>(false);
  const [overrideProgress, setOverrideProgress] = useState<number>(0);

  // Dynamic installation progress for the firmware update
  const [installingFirmware, setInstallingFirmware] = useState<boolean>(false);
  const [firmwareProgress, setFirmwareProgress] = useState<number>(0);

  // Weekly analytics data
  const weeklyData = [
    { wk: 'WK 01', turnaround: 5.2, satisfaction: 84, sales: 48 },
    { wk: 'WK 02', turnaround: 4.8, satisfaction: 89, sales: 52 },
    { wk: 'WK 03', turnaround: 5.5, satisfaction: 82, sales: 45 },
    { wk: 'WK 04', turnaround: 3.9, satisfaction: 91, sales: 60 },
    { wk: 'WK 05', turnaround: 4.2, satisfaction: 88, sales: 55 },
    { wk: 'WK 06', turnaround: 3.1, satisfaction: 94, sales: 68 },
    { wk: 'WK 07', turnaround: 3.5, satisfaction: 92, sales: 66 },
    { wk: 'WK 08', turnaround: 2.4, satisfaction: 96, sales: 74 },
  ];

  // Helper calculation for dynamic totals based on state values
  const totalIncompleteTickets = tickets.filter(t => t.status !== 'COMPLETED').length;

  const handleOverrideTrigger = () => {
    if (isOverriding) return;
    setIsOverriding(true);
    setOverrideProgress(0);
    setOverrideLogs([
      'CRITICAL AUTHENTICATION GRANTED.',
      'INITIATING EMERGENCY OVERRIDE SEQUENCE...',
      'CONNECTING TO SYSTEM BUS TERMINALS...',
    ]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setOverrideProgress(currentProgress);

      if (currentProgress === 30) {
        setOverrideLogs(prev => [...prev, 'BYPASSING INDUCTIVE POWER RELAYS...']);
      } else if (currentProgress === 60) {
        setOverrideLogs(prev => [...prev, 'RACK_04 FAN OVER-SPEED CALIBRATION INITIATED.']);
      } else if (currentProgress === 90) {
        setOverrideLogs(prev => [...prev, 'FLUSHING VOLTAGE CORRUPTION REGISTERS...']);
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setOverrideLogs(prev => [...prev, 'SYSTEM RESET SUCCESSFUL. TELEMETRY CORES RE-ALIGNED.']);
        setTimeout(() => {
          setIsOverriding(false);
          onTriggerOverride(); // trigger custom health trigger upward
        }, 1500);
      }
    }, 400);
  };

  const startFirmwareInstall = () => {
    if (installingFirmware) return;
    setInstallingFirmware(true);
    setFirmwareProgress(0);

    const interval = setInterval(() => {
      setFirmwareProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInstallingFirmware(false);
            alert("ApexFirmware v2.4.1 has been successfully loaded into EEPROM banks.");
          }, 800);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Modify individual ticket parameters dynamically!
  const updateTicketProgress = (id: string, progress: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const calculatedStatus = progress >= 100 
          ? 'COMPLETED' 
          : progress > 60 
            ? 'SOLDERING' 
            : progress > 30 
              ? 'CALIBRATING' 
              : 'INITIALIZING';
        return { 
          ...t, 
          progress: Math.min(Math.max(progress, 0), 100),
          status: calculatedStatus as any
        };
      }
      return t;
    }));
  };

  const updateTicketStatus = (id: string, newStatus: any) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const calculatedProgress = newStatus === 'COMPLETED' 
          ? 100 
          : newStatus === 'SOLDERING' 
            ? 70 
            : newStatus === 'CALIBRATING' 
              ? 45 
              : 15;
        return { ...t, status: newStatus, progress: calculatedProgress };
      }
      return t;
    }));
  };

  // Filter support queue lists based on search parameter and selected tab
  const filteredTickets = tickets.filter(t => {
    const query = searchQuery.toLowerCase();
    const queryMatch = t.clientName.toLowerCase().includes(query) ||
                       t.hardwareModel.toLowerCase().includes(query) ||
                       t.id.toLowerCase().includes(query) ||
                       t.techAssigned.toLowerCase().includes(query);
    
    if (queueFilter === 'ALL') {
      return queryMatch;
    } else {
      // PRIORITY criteria -> status is anything but COMPLETED, progress is low
      return queryMatch && t.status !== 'COMPLETED';
    }
  });

  return (
    <div className="space-y-6 font-mono text-on-surface">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary-cyan tracking-tight drop-shadow-[0_0_10px_rgba(0,220,230,0.15)] uppercase">
          ANALYTICS COMMAND CENTER
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base mt-1">
          Neural performance matrices, system sales indices, and real-time support trackers.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div 
          onClick={() => setSelectedMetric('sales')}
          className={`glass-panel p-4 clip-corner border-l-4 cursor-pointer transition-all duration-300 ${
            selectedMetric === 'sales'
              ? 'border-primary-cyan bg-primary-cyan/15 scale-[1.02] shadow-[0_0_15px_rgba(0,220,230,0.15)]'
              : 'border-outline-variant hover:border-primary-cyan bg-[#161b28]/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
              MONTHLY HARDWARE SALES
            </h3>
            <span className="text-[10px] bg-secondary-green/20 text-secondary-green font-bold px-1.5 py-0.5 rounded">
              +12.4%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-orbitron font-bold text-2xl md:text-3xl text-primary-cyan">
              $428.5K
            </span>
            <span className="text-[10px] text-on-surface-variant">USD_VAL</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div 
          onClick={() => setSelectedMetric('turnaround')}
          className={`glass-panel p-4 clip-corner border-l-4 cursor-pointer transition-all duration-300 ${
            selectedMetric === 'turnaround'
              ? 'border-secondary-green bg-secondary-green/10 scale-[1.02] shadow-[0_0_15px_rgba(78,222,163,0.1)]'
              : 'border-outline-variant hover:border-secondary-green bg-[#161b28]/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
              ACTIVE REPAIR TICKETS
            </h3>
            <span className="text-[10px] text-on-surface-variant font-bold">
              AVG 4.2d
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-orbitron font-bold text-2xl md:text-3xl text-secondary-green">
              {totalIncompleteTickets}
            </span>
            <span className="text-[10px] text-on-surface-variant">ACTIVE / 84 TOT</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div 
          onClick={() => setSelectedMetric('urgency')}
          className="glass-panel p-4 clip-corner border-2 pulse-critical-glow bg-warning-red-dark/20 border-warning-red/45 transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-warning-red tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning-red animate-bounce" />
              CRITICAL LOGISTICS ALERT
            </h3>
            <span className="text-[10px] text-warning-red font-bold animate-pulse">
              WARN_LOW
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-orbitron font-bold text-2xl md:text-3xl text-warning-red">
              3 SKUS
            </span>
            <span className="text-[10px] text-on-surface">WARNING STATUS</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div 
          onClick={() => setSelectedMetric('sales')}
          className="glass-panel p-4 clip-corner border-l-4 border-outline bg-[#161b28]/60 hover:border-primary-cyan transition-all"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
              MAINTENANCE COMPLETED
            </h3>
            <span className="text-[10px] text-secondary-green font-bold">
              100% SUCCESS
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-orbitron font-bold text-2xl md:text-3xl text-on-surface">
              1,204
            </span>
            <span className="text-[10px] text-on-surface-variant">TASKS TOTAL</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Interactive Line Chart & Side Actions */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Interactive Custom Line Chart Card */}
        <div className="xl:col-span-8 glass-panel p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,220,230,0.02)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="font-orbitron text-lg text-primary-cyan tracking-tight uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-cyan" />
                TELEMETRY COMMAND PLOT
              </h2>
              <p className="text-[9px] font-bold uppercase text-on-surface-variant tracking-wider mt-0.5">
                {selectedMetric === 'sales' && 'WEEKLY RETAIL REVENUE VOLUME VS PROBABILITY INDEX'}
                {selectedMetric === 'turnaround' && 'ACTIVE CLIENT REPAIR TURNAROUND TIMELINES'}
                {selectedMetric === 'urgency' && 'WEEKLY DIAGNOSTIC ALERTRATE INDEX'}
              </p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-primary-cyan uppercase">
                <span className="w-2.5 h-2.5 bg-primary-cyan inline-block rounded-sm" /> 
                {selectedMetric === 'sales' ? 'REVENUE INDEX' : 'TURNAROUND (DAYS)'}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-outline uppercase">
                <span className="w-2.5 h-2.5 bg-outline inline-block rounded-sm border border-dashed" /> 
                SATISFACTION INDEX (%)
              </span>
            </div>
          </div>

          {/* Interactive SVG Render Area */}
          <div className="h-64 sm:h-72 w-full relative flex items-end justify-between px-2 pt-6 border-b border-l border-outline-variant/30">
            {/* Weekly grid line markers */}
            <div className="absolute inset-0 grid grid-rows-5 pointer-events-none">
              <div className="border-b border-outline-variant/10"></div>
              <div className="border-b border-outline-variant/10"></div>
              <div className="border-b border-outline-variant/10"></div>
              <div className="border-b border-outline-variant/10"></div>
              <div className="border-b border-outline-variant/10"></div>
            </div>

            {/* Rendered Lines */}
            <svg className="absolute inset-0 w-full h-full pb-0.5" preserveAspectRatio="none" viewBox="0 0 800 240">
              {/* Turnaround Index Line */}
              <path 
                className="drop-shadow-[0_0_8px_rgba(0,220,230,0.8)] transition-all duration-500"
                d={
                  selectedMetric === 'sales'
                    ? "M 50 190 Q 150 170 250 200 T 350 150 T 450 160 T 550 110 T 650 130 T 750 80" 
                    : selectedMetric === 'turnaround'
                      ? "M 50 180 Q 150 160 250 190 T 350 130 T 450 140 T 550 110 T 650 120 T 750 90"
                      : "M 50 90 Q 150 120 250 80 T 350 150 T 450 140 T 550 190 T 650 170 T 750 210"
                }
                fill="none" 
                stroke="#00dce6" 
                strokeWidth="3.5"
              />

              {/* Satisfaction Index Line - Dashed grey */}
              <path 
                d="M 50 40 Q 150 50 250 45 T 350 70 T 450 65 T 550 90 T 650 80 T 750 120" 
                fill="none" 
                stroke="#849495" 
                strokeDasharray="5" 
                strokeWidth="2"
              />

              {/* Interactive interactive hover pins */}
              {weeklyData.map((data, index) => {
                const xPos = 50 + index * 100;
                
                // Dynamically calculate coordinate for y based on selected metrics
                let trackerY = 190;
                if (selectedMetric === 'sales') {
                  trackerY = 200 - (data.sales * 1.8);
                } else if (selectedMetric === 'turnaround') {
                  trackerY = 220 - (data.turnaround * 28);
                } else {
                  trackerY = 60 + (data.turnaround * 25);
                }

                const satY = 240 - (data.satisfaction * 2.1);

                return (
                  <g key={index} className="cursor-pointer group/node">
                    {/* Hover vertical guidelaying block */}
                    <line 
                      x1={xPos} y1="0" x2={xPos} y2="240" 
                      stroke="#00dce6" 
                      strokeWidth="1.5" 
                      strokeDasharray="3" 
                      className="opacity-0 group-hover/node:opacity-30 transition-opacity"
                    />

                    {/* Node point 1: Cyan tracker */}
                    <circle 
                      cx={xPos} 
                      cy={trackerY} 
                      r="5" 
                      fill="#0b0f19" 
                      stroke="#00dce6" 
                      strokeWidth="2.5"
                      className="transition-all duration-300 group-hover/node:r-8 group-hover/node:fill-[#00dce6]"
                      onMouseEnter={() => setHoveredWeek(index)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    />

                    {/* Node point 2: Satisfaction tracker */}
                    <circle 
                      cx={xPos} 
                      cy={satY} 
                      r="4.5" 
                      fill="#0b0f19" 
                      stroke="#849495" 
                      strokeWidth="2"
                      className="transition-all group-hover/node:r-6"
                      onMouseEnter={() => setHoveredWeek(index)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom hovering interactive dialog box widget */}
            {hoveredWeek !== null && (
              <div 
                className="absolute bg-[#171b26]/90 backdrop-blur-md border border-primary-cyan p-3 text-[11px] rounded shadow-lg transition-all z-20"
                style={{
                  left: `${hoveredWeek * 12.5 + 4}%`,
                  bottom: '50px'
                }}
              >
                <p className="text-primary-cyan font-bold block border-b border-outline-variant/30 pb-1 mb-1">
                  WEEK STATS: {weeklyData[hoveredWeek].wk}
                </p>
                <div className="space-y-1">
                  <p className="flex justify-between gap-6 uppercase">
                    <span>Turnaround Time:</span>
                    <span className="font-bold text-on-surface">{weeklyData[hoveredWeek].turnaround} days</span>
                  </p>
                  <p className="flex justify-between gap-6 uppercase">
                    <span>Satisfaction Rating:</span>
                    <span className="font-bold text-secondary-green">{weeklyData[hoveredWeek].satisfaction}%</span>
                  </p>
                  <p className="flex justify-between gap-6 uppercase">
                    <span>Retail Revenue:</span>
                    <span className="font-bold text-on-surface">${weeklyData[hoveredWeek].sales}K USD</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-3 text-[10px] font-bold text-outline uppercase px-2">
            {weeklyData.map((data, index) => (
              <span key={index} className="hover:text-primary-cyan duration-200">
                {data.wk}
              </span>
            ))}
          </div>
        </div>

        {/* Quick actions/alerts panel */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          
          {/* Real-time System state Alerts */}
          <div className="glass-panel p-5 flex-1 relative flex flex-col justify-between">
            <h3 className="font-orbitron text-sm text-on-surface uppercase border-b border-outline-variant/30 pb-2 mb-4 flex items-center justify-between">
              <span>SYSTEM ALERTS STATUS</span>
              <Bell className="w-4 h-4 text-warning-red animate-pulse" />
            </h3>

            <div className="space-y-4 flex-grow">
              {/* Interactive warning alert item */}
              <div className="flex gap-3 p-3 bg-warning-red-dark/15 border-l-3 border-warning-red rounded-sm group hover:bg-warning-red-dark/25 transition-all">
                <AlertTriangle className="w-5 h-5 text-warning-red shrink-0" />
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-warning-red tracking-wider">FAN_ERROR: RACK_04</p>
                    <span className="text-[8px] bg-warning-red-dark text-warning-red px-1 rounded">CRITICAL</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    Module fan speed below safe parameters (540 RPM).
                  </p>
                </div>
              </div>

              {/* Editable firmware prompt alert item */}
              <div className="flex gap-3 p-3 bg-[#1d263b]/60 border-l-3 border-primary-cyan rounded-sm group hover:bg-[#1d263b]/80 transition-all">
                <CheckCircle2 className="w-5 h-5 text-primary-cyan shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-primary-cyan tracking-wider">ApexFirmware v2.4.1</p>
                    <span className="text-[8px] bg-[#004f53] text-[#6ff6ff] px-1 rounded">STABLE</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    Diagnostic kernels ready to load. Patch telemetry modules.
                  </p>
                  
                  {installingFirmware ? (
                    <div className="mt-3">
                      <div className="w-full bg-surface-lowest h-1.5 rounded overflow-hidden">
                        <div className="bg-primary-cyan h-full transition-all" style={{ width: `${firmwareProgress}%` }}></div>
                      </div>
                      <p className="text-[9px] text-[#6ff6ff] font-bold tracking-wider mt-1.5 animate-pulse uppercase">
                        WRITING MEMORY BANKS: {firmwareProgress}%
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={startFirmwareInstall}
                      className="mt-2 text-[9px] text-primary-cyan-bright hover:underline font-bold tracking-wider flex items-center gap-1 uppercase"
                    >
                      <Play className="w-2.5 h-2.5 fill-primary-cyan" /> DEPOLOY FIRMWARE UPDATE
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Custom interactive System Override Terminal Emulator */}
            {overrideLogs.length > 0 && (
              <div className="mt-3 bg-surface-lowest border border-primary-cyan/20 p-2.5 rounded text-[9px] font-mono leading-tight space-y-1">
                <div className="flex justify-between">
                  <span className="text-primary-cyan font-bold">TERMINAL OUTPUT</span>
                  <span className="text-secondary-green animate-pulse">{overrideProgress}%</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {overrideLogs.map((log, index) => (
                    <p key={index} className="text-on-surface-variant">
                      <span className="text-primary-cyan select-none">&gt;</span> {log}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleOverrideTrigger}
            disabled={isOverriding}
            className={`w-full py-4 uppercase font-orbitron font-bold text-xs clip-btn flex items-center justify-center gap-2 duration-200 shadow-lg ${
              isOverriding 
                ? 'bg-outline text-dark-bg cursor-not-allowed scale-95' 
                : 'bg-primary-cyan-bright text-dark-bg hover:brightness-110 active:opacity-85 shadow-[0_0_20px_rgba(0,242,254,0.4)]'
            }`}
          >
            <Shield className="w-4 h-4 text-dark-bg" />
            {isOverriding ? 'OVERRIDING VOLTAGES...' : 'INITIATE EMERGENCY OVERRIDE'}
          </button>
        </div>
      </section>

      {/* Support Track Grid list Table */}
      <section className="glass-panel overflow-hidden border border-outline-variant/30">
        
        {/* Table header menu controls */}
        <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1c1f2a]/40">
          <div>
            <h3 className="font-orbitron text-sm text-primary-cyan flex items-center gap-2 uppercase">
              <Wrench className="w-4 h-4 text-primary-cyan" />
              ACTIVE SUPPORT SERVICE QUEUE
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase">
              Live status indexes of active repairs. Use inputs to filter or slide progress logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input bar */}
            <div className="relative flex-grow md:flex-grow-0 group">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary-cyan transition-colors" />
              <input 
                type="text"
                placeholder="Filter queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-lowest border-b border-outline-variant focus:border-primary-cyan text-xs text-on-surface pl-9 pr-3 py-1.5 focus:outline-none w-full md:w-48 transition-all"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex bg-surface-lowest p-0.5 rounded border border-outline-variant/30">
              <button 
                onClick={() => setQueueFilter('ALL')}
                className={`px-3 py-1 text-[9px] font-bold tracking-wider rounded transition-colors uppercase ${
                  queueFilter === 'ALL' 
                    ? 'bg-primary-cyan text-dark-bg' 
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                ALL TICKETS
              </button>
              <button 
                onClick={() => setQueueFilter('PRIORITY')}
                className={`px-3 py-1 text-[9px] font-bold tracking-wider rounded transition-colors uppercase ${
                  queueFilter === 'PRIORITY' 
                    ? 'bg-warning-red text-dark-bg' 
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                REPAIRS IN PROGRESS
              </button>
            </div>
          </div>
        </div>

        {/* Database Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-[10px] text-outline bg-surface-lowest/70 border-b border-outline-variant/20">
                <th className="px-5 py-3 tracking-wider font-bold uppercase">ID_HASH</th>
                <th className="px-4 py-3 tracking-wider font-bold uppercase">CLIENT_USER</th>
                <th className="px-4 py-3 tracking-wider font-bold uppercase">HARDWARE_MODEL</th>
                <th className="px-4 py-3 tracking-wider font-bold uppercase w-1/4">DIAGNOSTIC PROGRESS (%)</th>
                <th className="px-4 py-3 tracking-wider font-bold uppercase">TECH_ASSIGNED</th>
                <th className="px-5 py-3 tracking-wider font-bold uppercase text-right">STATUS CODE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-primary-cyan/[0.03] transition-colors group">
                  {/* ID */}
                  <td className="px-5 py-4 font-bold text-primary-cyan select-all">
                    {ticket.id}
                  </td>
                  
                  {/* Name */}
                  <td className="px-4 py-4 font-sans font-medium text-on-surface">
                    {ticket.clientName}
                  </td>
                  
                  {/* Hardware Model */}
                  <td className="px-4 py-4 text-on-surface-variant font-medium">
                    {ticket.hardwareModel}
                  </td>
                  
                  {/* Interactive Dynamic Progress Slider / Track */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-on-surface-variant">
                        <span>Progress: {ticket.progress}%</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Dynamic Interactive Input Slider */}
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={ticket.progress}
                          onChange={(e) => updateTicketProgress(ticket.id, parseInt(e.target.value))}
                          className="flex-grow accent-primary-cyan h-1 cursor-pointer bg-surface-highest"
                        />
                        {/* Visual progress bar overlay indicator */}
                        <div className="w-16 h-3 bg-surface-lowest rounded overflow-hidden relative border border-outline-variant/15 shrink-0 hidden sm:block">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              ticket.progress === 100 
                                ? 'bg-secondary-green shadow-[0_0_8px_#4edea3]' 
                                : 'bg-primary-cyan shadow-[0_0_8px_#00dce6]'
                            }`}
                            style={{ width: `${ticket.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Assigned tech */}
                  <td className="px-4 py-4 text-on-surface-variant font-medium font-sans">
                    {ticket.techAssigned}
                  </td>
                  
                  {/* Status Dropdown modification */}
                  <td className="px-5 py-4 text-right">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded inline-block bg-surface-lowest border focus:outline-none focus:border-primary-cyan text-right cursor-pointer tracking-wider ${
                        ticket.status === 'COMPLETED'
                          ? 'text-secondary-green border-secondary-green/35'
                          : ticket.status === 'SOLDERING'
                            ? 'text-primary-cyan border-primary-cyan/35'
                            : 'text-[#6ffbbe] border-[#6ffbbe]/35'
                      }`}
                    >
                      <option value="INITIALIZING">INITIALIZING</option>
                      <option value="CALIBRATING">CALIBRATING</option>
                      <option value="SOLDERING">SOLDERING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-on-surface-variant text-sm">
                    No diagnostics match search parameters in the service registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
