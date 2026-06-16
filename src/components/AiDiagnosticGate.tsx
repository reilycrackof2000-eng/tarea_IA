/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Search, 
  Sliders, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Cpu,
  Bookmark
} from 'lucide-react';
import { Symptom, RepairStep } from '../types';

interface AiDiagnosticGateProps {
  systemHealth: number;
}

export default function AiDiagnosticGate({ systemHealth }: AiDiagnosticGateProps) {
  // Checklist datasets
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: 'sym-1', name: 'No Display Signal', checked: false },
    { id: 'sym-2', name: '3 Short Beeps (POST Error)', checked: false },
    { id: 'sym-3', name: 'System Blue Screen (BSOD)', checked: true },
    { id: 'sym-4', name: 'Thermal Freeze @ 85°C', checked: true }
  ]);

  // Telemetry sensor evaluation states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStateText, setScanStateText] = useState<string>('IDLE');
  const [probabilityPercent, setProbabilityPercent] = useState<number>(88);
  const [matchedFailureTitle, setMatchedFailureTitle] = useState<string>('GPU VRM FAILURE');
  const [matchedFailureDesc, setMatchedFailureDesc] = useState<string>('Thermal stress detected on Phase 4 MOSFET cluster. Power delivery unstable.');
  const [complexityRating, setComplexityRating] = useState<number>(7.4);
  const [estRepairTime, setEstRepairTime] = useState<number>(45);

  // Suggested parts stock model
  const [sparePartStock, setSparePartStock] = useState<number>(14);
  const [isPartOrdered, setIsPartOrdered] = useState<boolean>(false);

  // Interactive timeline sequencing
  const [repairSteps, setRepairSteps] = useState<RepairStep[]>([
    { name: 'RECEIVED', time: '10:45 AM', status: 'COMPLETED', icon: 'check', desc: 'Equipment registered in registry.' },
    { name: 'DIAGNOSTIC', time: '11:20 AM', status: 'COMPLETED', icon: 'wrench', desc: 'AI Diagnostic complete. Defect verified.' },
    { name: 'AWAITING PARTS', time: '01:15 PM', status: 'COMPLETED', icon: 'package', desc: 'Replacement MOSFET stock allocated.' },
    { name: 'SOLDERING', time: 'IN PROGRESS', status: 'IN_PROGRESS', icon: 'zap', desc: 'High precision solder replacement.' },
    { name: 'QA', time: 'PENDING', status: 'PENDING', icon: 'search', desc: 'Post-mounting circuit diagnostics.' },
    { name: 'READY', time: 'PENDING', status: 'PENDING', icon: 'done_all', desc: 'Final stress test complete.' }
  ]);

  const handleToggleSymptom = (id: string) => {
    setSymptoms(prev => prev.map(sym => {
      if (sym.id === id) {
        return { ...sym, checked: !sym.checked };
      }
      return sym;
    }));
  };

  const handleRunNeuralScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStateText('READING TELEMETRY BUS...');

    // Multi-phase loader to make the simulation highly atmospheric
    setTimeout(() => {
      setScanStateText('EVALUATING VRM VOLTAGE REGISTERS...');
    }, 800);

    setTimeout(() => {
      setScanStateText('MATCHING HEURISTIC SYMPTOM ARRAYS...');
    }, 1600);

    setTimeout(() => {
      // Recalculates dynamically based on selected checkboxes!
      const checkedCount = symptoms.filter(s => s.checked).length;
      if (checkedCount === 0) {
        setProbabilityPercent(15);
        setMatchedFailureTitle('NO DETECTED FAULTS');
        setMatchedFailureDesc('All systems operate within normal baseline, or checklist is empty.');
        setComplexityRating(1.2);
        setEstRepairTime(10);
      } else if (checkedCount === 1) {
        setProbabilityPercent(45);
        setMatchedFailureTitle('VOLTAGE VARIANCE REG_A');
        setMatchedFailureDesc('Slight voltage sag detected on PCIe lane inputs. Likely minor filter overload.');
        setComplexityRating(3.5);
        setEstRepairTime(20);
      } else if (checkedCount === 2) {
        setProbabilityPercent(72);
        setMatchedFailureTitle('THERMAL CHIP THROTTLING');
        setMatchedFailureDesc('Heatsink contact degradation or failing thermal paste under core workload.');
        setComplexityRating(5.8);
        setEstRepairTime(30);
      } else {
        setProbabilityPercent(88 + Math.floor(Math.random() * 8));
        setMatchedFailureTitle('GPU VRM FAILURE');
        setMatchedFailureDesc('Thermal stress detected on Phase 4 MOSFET cluster. Power delivery unstable.');
        setComplexityRating(7.4);
        setEstRepairTime(45);
      }

      setIsScanning(false);
      setScanStateText('SCAN COMPLETE');
    }, 2400);
  };

  // Interactive timeline progression click
  const advanceTimelineStep = (clickedIndex: number) => {
    setRepairSteps(prev => prev.map((step, idx) => {
      if (idx < clickedIndex) {
        return { ...step, status: 'COMPLETED', time: step.time === 'PENDING' ? '02:30 PM' : step.time };
      } else if (idx === clickedIndex) {
        return { ...step, status: 'IN_PROGRESS', time: 'IN PROGRESS' };
      } else {
        return { ...step, status: 'PENDING', time: 'PENDING' };
      }
    }));
  };

  const handleOrderPart = () => {
    if (isPartOrdered || sparePartStock === 0) return;
    setIsPartOrdered(true);
    setSparePartStock(prev => prev - 1);
    alert("ApexPro VRM MOSFET Set order has been routed. Stock reserved.");
  };

  return (
    <div className="space-y-6 font-mono text-on-surface">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary-cyan tracking-tight drop-shadow-[0_0_10px_rgba(0,220,230,0.15)] uppercase">
          AI DIAGNOSTIC GATE
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base mt-1">
          Heuristics telemetry engine analyzing circuit sags, thermal freezer failures, and transistor overloads.
        </p>
      </div>

      {/* Main Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Symptom Checklist Card */}
        <section className="lg:col-span-4 bg-surface-container/60 backdrop-blur-xl p-5 border border-outline-variant/30 rounded-xl relative overflow-hidden flex flex-col justify-between scanline-effect shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-2">
              <h3 className="text-xs font-bold text-primary-cyan tracking-wider uppercase">
                SYMPTOM CHECKLIST Registry
              </h3>
              <Sparkles className="w-4 h-4 text-primary-cyan animate-pulse" />
            </div>

            <div className="space-y-2.5">
              {symptoms.map((sym) => (
                <label 
                  key={sym.id}
                  className={`flex items-center gap-3.5 p-3.5 rounded cursor-pointer border transition-colors ${
                    sym.checked 
                      ? 'bg-surface-high border-primary-cyan/45 text-on-surface' 
                      : 'bg-surface-container-high/40 border-outline-variant/20 hover:bg-surface-highest/50 text-on-surface-variant'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={sym.checked}
                    onChange={() => handleToggleSymptom(sym.id)}
                    className="form-checkbox bg-[#0f131d] border-outline-variant rounded text-primary-cyan focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold leading-relaxed uppercase">{sym.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={handleRunNeuralScan}
            disabled={isScanning}
            className={`mt-6 w-full py-3.5 rounded bg-primary-cyan text-dark-bg font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 clip-btn ${
              isScanning 
                ? 'animate-pulse bg-outline cursor-not-allowed text-dark-bg' 
                : 'hover:brightness-110 active:opacity-85'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? scanStateText : 'RUN NEURAL SCAN'}
          </button>
        </section>

        {/* AI Diagnostic Engine Card */}
        <section className="lg:col-span-8 bg-surface-container/60 backdrop-blur-xl p-5 border border-primary-cyan/20 rounded-xl shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-[#00dce6]/20 pb-2">
            <h3 className="text-xs font-bold text-[#6ff6ff] tracking-wider uppercase">
              AI DIAGNOSTIC MATRIX SIMULATOR
            </h3>
            <div className="flex items-center gap-1.5 bg-secondary-green/10 px-2 py-0.5 rounded border border-secondary-green/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-green animate-ping"></span>
              <span className="text-[9px] font-bold text-secondary-green tracking-widest uppercase">ENGINE ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Probability Gauge Dial */}
            <div className="flex flex-col items-center text-center p-4 bg-surface-lowest/70 rounded-lg border border-outline-variant/15 relative">
              <div className="relative w-40 h-40 mb-3 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    className="text-surface-highest" 
                    cx="80" cy="80" fill="transparent" r="68" 
                    stroke="currentColor" strokeWidth="6" 
                  />
                  <circle 
                    className="text-primary-cyan transition-all duration-1000" 
                    cx="80" cy="80" fill="transparent" r="68" 
                    stroke="currentColor" 
                    strokeDasharray="427" 
                    strokeDashoffset={427 - (427 * probabilityPercent) / 100}
                    strokeWidth="7" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-orbitron font-bold text-2xl text-on-surface">
                    {probabilityPercent}%
                  </span>
                  <span className="text-[8px] font-bold tracking-widest text-[#b9cacb] uppercase mt-0.5">PROBABILITY</span>
                </div>
              </div>

              <h4 className="font-sans font-bold text-[#6ff6ff] text-base uppercase leading-tight mb-1">{matchedFailureTitle}</h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                {matchedFailureDesc}
              </p>
            </div>

            {/* Details & Inventory Shortcut */}
            <div className="space-y-4">
              {/* Order spare link box */}
              <div className="bg-surface-high p-4 rounded-lg border-l-4 border-primary-cyan flex flex-col justify-between gap-3 shadow-md">
                <p className="text-[9px] font-bold text-primary-cyan tracking-widest uppercase">SUGGESTED SPARES REQUIRED</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0a0e18] border border-outline-variant/30 flex items-center justify-center rounded">
                      <Cpu className="text-secondary-green w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-sans font-bold text-on-surface">ApexPro VRM MOSFET Set</p>
                      <p className="text-[9px] text-[#4edea3] font-bold">STOCK: {sparePartStock} UNITS</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleOrderPart}
                    disabled={isPartOrdered}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded transition-colors uppercase ${
                      isPartOrdered 
                        ? 'text-outline bg-surface-lowest cursor-not-allowed border border-outline-variant/20' 
                        : 'text-primary-cyan border border-primary-cyan/45 hover:bg-primary-cyan/15 bg-surface-lowest'
                    }`}
                  >
                    {isPartOrdered ? 'ORDERED' : 'ORDER NOW'}
                  </button>
                </div>
              </div>

              {/* Complexity rating grids */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-high p-3 rounded-lg border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-1">TASK COMPLEXITY</p>
                  <p className="font-orbitron font-extrabold text-base text-warning-red">{complexityRating.toFixed(1)} / 10</p>
                </div>
                <div className="bg-surface-high p-3 rounded-lg border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-1">EST. REPAIR DURATION</p>
                  <p className="font-orbitron font-extrabold text-base text-primary-cyan">{estRepairTime} MINS</p>
                </div>
              </div>

              {/* Warnings box */}
              <div className="p-3 bg-warning-red-dark/15 border border-warning-red/35 rounded flex gap-3 items-start">
                <AlertTriangle className="w-4.5 h-4.5 text-warning-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-warning-red uppercase tracking-wider">WARN: DETECTED HIGH TEMPERATURE ZONE</p>
                  <p className="text-[9px] text-on-surface-variant leading-relaxed mt-0.5">
                    Heat gun calibration must not exceed 350°C during extraction. Shield adjacent high-capacity capacitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Repair Timeline Tracking Progress */}
      <section className="glass-panel p-5 border border-outline-variant/30 rounded-xl relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-outline-variant/20 pb-3">
          <div>
            <h3 className="font-orbitron text-sm text-[#6ff6ff] uppercase flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#6ff6ff]" />
              ACTIVE REPAIR PROGRESS TIMELINE: CASE #AX-4902
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase">
              Interactive timeline. Click any pending stage button parameter below to manually update repair progress!
            </p>
          </div>
          <span className="text-[9px] bg-[#1d263b] text-primary-cyan border border-primary-cyan/45 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            WORKBENCH_DIAG
          </span>
        </div>

        {/* Repair timeline grid conns */}
        <div className="relative">
          {/* Horizontal connecting background wire bar - hidden on mobile */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-highest -translate-y-1/2 hidden md:block z-0" />
          
          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-4">
            {repairSteps.map((step, index) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              return (
                <div 
                  key={step.name} 
                  onClick={() => advanceTimelineStep(index)}
                  className={`flex md:flex-col items-center gap-3.5 md:gap-2 bg-surface-lowest/40 md:bg-transparent p-3 md:p-0 rounded-lg cursor-pointer transition-all hover:scale-[1.02] md:hover:scale-100 ${
                    isInProgress ? 'border border-[#00f2fe]/40 md:border-transparent' : ''
                  }`}
                  title={`Set status to ${step.name}`}
                >
                  {/* Status Circle pin */}
                  <div className={`w-9 h-9 rounded-full border-4 border-dark-bg flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-primary-cyan text-dark-bg' 
                      : isInProgress 
                        ? 'bg-secondary-green text-dark-bg shadow-[0_0_12px_#4edea3] animate-pulse' 
                        : 'bg-surface-highest text-outline'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    ) : (
                      <span className="text-[10px] font-bold font-sans">{index + 1}</span>
                    )}
                  </div>

                  {/* Labels details */}
                  <div className="text-left md:text-center">
                    <p className={`text-[10px] font-bold tracking-widest uppercase ${
                      isCompleted 
                        ? 'text-primary-cyan' 
                        : isInProgress 
                          ? 'text-secondary-green font-extrabold' 
                          : 'text-outline'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-[9px] text-[#b9cacb] font-mono mt-0.5">{step.time}</p>
                    {step.desc && (
                      <p className="text-[8px] text-on-surface-variant font-mono mt-0.5 hidden lg:block opacity-75 max-w-[120px] mx-auto leading-tight">
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hardware Asset visual breaks screenshot card */}
      <section className="relative h-56 rounded-xl overflow-hidden group border border-outline-variant/30 shadow-2xl">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsC_M9G0doH0a6J-9jEllq0ElsrXL6D894BXXFkpcEjhscKYRvsca0ivAAyDe79uf1tz6JQL-nqr-4b8bzntea6Gs7-E6TzHwuucvK1dq0DmgyeIlUX_Ry2vkM60rOFVO9w6VC20ZW9Yc2CjiACBe1piODxKMs89YBx6SzwIWl66H1u9Tm1atF_GRi0gbBD2xihJyRC4e-K8qh9PwJZzEJzOTxKVEouOY8cmCoZ1eojo8OQrs_56_HIr1mPks5Snbeu8gPObKb_-4" 
          alt="High-tech internal glowing computer motherboard schema traces" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent"></div>
        <div className="absolute bottom-5 left-5">
          <div className="bg-[#171b26]/90 backdrop-blur border border-primary-cyan/25 p-3.5 rounded flex flex-col gap-0.5">
            <span className="text-[8px] font-extrabold text-primary-cyan tracking-widest uppercase font-mono">REAL-TIME SENSOR SHIELD</span>
            <span className="font-orbitron font-extrabold text-base text-on-surface">TELEMETRY_PORTAL: STATION_DIAG_072</span>
          </div>
        </div>
      </section>
    </div>
  );
}
