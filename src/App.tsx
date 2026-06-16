/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import ProConfigurator from './components/ProConfigurator';
import SparePartsInventory from './components/SparePartsInventory';
import AiDiagnosticGate from './components/AiDiagnosticGate';
import { NavSection, SupportTicket, SystemAlert } from './types';
import { LayoutDashboard, Cpu, Box, BrainCircuit, Bell, Shield } from 'lucide-react';

export default function App() {
  // Navigation active tab segment
  const [currentSection, setCurrentSection] = useState<NavSection>('EXECUTIVE_DASHBOARD');

  // Shared responsive systems states
  const [systemHealth, setSystemHealth] = useState<number>(98);
  const [latencySeconds, setLatencySeconds] = useState<number>(12);

  // Core equipment support tickets listing
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: '#AX-7721', clientName: 'Valerius_K', hardwareModel: 'Apex-X Threadripper', progress: 75, techAssigned: 'T. Miller', status: 'CALIBRATING' },
    { id: '#AX-8910', clientName: 'Sarah_Con', hardwareModel: 'Titan-Z Pro Workstation', progress: 30, techAssigned: 'M. Kusanagi', status: 'INITIALIZING' },
    { id: '#AX-6604', clientName: 'Deckard_6', hardwareModel: 'Quantum-V Node', progress: 100, techAssigned: 'J. Sebastian', status: 'COMPLETED' }
  ]);

  // System alert notices
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: 'alert-1', type: 'ERROR', title: 'FAN_ERROR: RACK_04', message: 'RPM below boundary, core overheating alert.' },
    { id: 'alert-2', type: 'INFO', title: 'UPDATE_AVAILABLE', message: 'ApexFirmware patch v2.4.1 available.' }
  ]);

  // Recalculates latency dynamically to simulate high-stakes telemetry
  const triggerRefreshLatency = () => {
    const rolled = Math.floor(Math.random() * 6) + 9; // 9ms to 14ms
    setLatencySeconds(rolled);
  };

  // Upward callback when emergency override logs are produced in Executive Dashboard
  const handleSystemOverrideSuccess = () => {
    setSystemHealth(100);
    // Remove the Fan Error alert
    setAlerts(prev => prev.filter(al => al.id !== 'alert-1'));
    alert("EMERGENCY VOLTAGE BYPASS SYSTEM ACTIVE. RACK_04 cooling calibrated successfully.");
  };

  // Simulating small background network synchronizations every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      triggerRefreshLatency();
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-on-surface font-mono selection:bg-primary-cyan/25 select-none overflow-x-hidden">
      
      {/* Top Main Navigation Bar */}
      <Header 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        latencySeconds={latencySeconds}
        triggerRefreshLatency={triggerRefreshLatency}
      />

      {/* Main Full-Scale Layout */}
      <div className="flex">
        
        {/* Left Side Drawer Navigation - visible on Desktop only */}
        <Sidebar 
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          systemHealth={systemHealth}
        />

        {/* Dynamic Center Workstation Main Canvas */}
        <main className="flex-1 pt-20 pb-24 md:pb-8 md:pl-72 min-h-screen transition-all">
          <div className="px-4 md:px-6 max-w-[1600px] mx-auto animate-fade-in py-4">
            
            {currentSection === 'EXECUTIVE_DASHBOARD' && (
              <ExecutiveDashboard 
                tickets={tickets}
                setTickets={setTickets}
                alerts={alerts}
                onTriggerOverride={handleSystemOverrideSuccess}
                systemHealth={systemHealth}
              />
            )}

            {currentSection === 'PRO_CONFIGURATOR' && (
              <ProConfigurator 
                systemHealth={systemHealth}
              />
            )}

            {currentSection === 'SPARE_PARTS' && (
              <SparePartsInventory 
                systemHealth={systemHealth}
              />
            )}

            {currentSection === 'AI_DIAGNOSTIC' && (
              <AiDiagnosticGate 
                systemHealth={systemHealth}
              />
            )}

          </div>
        </main>

      </div>

      {/* Bottom responsive menu nav bar - visible on mobile screens only */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 z-50 flex justify-around items-center md:hidden bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/25 shadow-[0_-5px_24px_rgba(0,0,0,0.6)] rounded-t-xl px-4">
        
        {/* HOME (Executive Dashboard) */}
        <button 
          onClick={() => setCurrentSection('EXECUTIVE_DASHBOARD')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentSection === 'EXECUTIVE_DASHBOARD' 
              ? 'text-primary-cyan scale-110 drop-shadow-[0_0_5px_rgba(0,220,230,0.8)]' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[8px] font-bold tracking-widest mt-1 uppercase">HOME</span>
        </button>

        {/* CONFIG (Pro Configurator) */}
        <button 
          onClick={() => setCurrentSection('PRO_CONFIGURATOR')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentSection === 'PRO_CONFIGURATOR' 
              ? 'text-primary-cyan scale-110 drop-shadow-[0_0_5px_rgba(0,220,230,0.8)]' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[8px] font-bold tracking-widest mt-1 uppercase">CONFIG</span>
        </button>

        {/* TELEMETRY (AI Diagnostic) */}
        <button 
          onClick={() => setCurrentSection('AI_DIAGNOSTIC')}
          className={`flex flex-col items-center justify-center transition-all relative ${
            currentSection === 'AI_DIAGNOSTIC' 
              ? 'text-primary-cyan scale-110 drop-shadow-[0_0_5px_rgba(0,220,230,0.8)]' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="text-[8px] font-bold tracking-widest mt-1 uppercase">DIAGNOSTIC</span>
          {alerts.length > 0 && (
            <span className="absolute top-0 right-3 w-2 h-2 bg-warning-red rounded-full animate-ping" />
          )}
        </button>

        {/* STOCK (Spare Parts) */}
        <button 
          onClick={() => setCurrentSection('SPARE_PARTS')}
          className={`flex flex-col items-center justify-center transition-all ${
            currentSection === 'SPARE_PARTS' 
              ? 'text-primary-cyan scale-110 drop-shadow-[0_0_5px_rgba(0,220,230,0.8)]' 
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[8px] font-bold tracking-widest mt-1 uppercase">STOCK</span>
        </button>

      </nav>

    </div>
  );
}
