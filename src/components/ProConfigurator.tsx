/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu as CpuIcon, 
  Layers, 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertOctagon, 
  CircleDashed,
  HelpCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { HardwareComponent } from '../types';

interface ProConfiguratorProps {
  systemHealth: number;
}

export default function ProConfigurator({ systemHealth }: ProConfiguratorProps) {
  // Preset list of available high-performance hardware parts
  const cpusList: HardwareComponent[] = [
    { id: 'cpu-7950x3d', name: 'Ryzen 9 7950X3D', category: 'CPU', socketOrSlot: 'AM5 Socket', detail1: '16 CORES / 32 THREADS', detail2: '120W TDP', wattage: 120, stock: 14, price: 649, status: 'IN STOCK' },
    { id: 'cpu-7800x3d', name: 'Ryzen 7 7800X3D', category: 'CPU', socketOrSlot: 'AM5 Socket', detail1: '8 CORES / 16 THREADS', detail2: '120W TDP', wattage: 120, stock: 4, price: 399, status: 'LOW STOCK' },
    { id: 'cpu-14900k', name: 'Intel Core i9-14900K', category: 'CPU', socketOrSlot: 'LGA1700 Socket', detail1: '24 CORES / 32 THREADS', detail2: '125W TDP', wattage: 125, stock: 8, price: 589, status: 'IN STOCK' }
  ];

  const gpusList: HardwareComponent[] = [
    { id: 'gpu-4090', name: 'RTX 4090 OC Edition', category: 'GPU', socketOrSlot: 'PCIe 5.0', detail1: '24GB GDDR6X VRAM', detail2: '450W TDP', wattage: 450, stock: 2, price: 1599, status: 'LOW STOCK' },
    { id: 'gpu-4080s', name: 'RTX 4080 Super', category: 'GPU', socketOrSlot: 'PCIe 5.0', detail1: '16GB GDDR6X VRAM', detail2: '320W TDP', wattage: 320, stock: 11, price: 999, status: 'IN STOCK' },
    { id: 'gpu-7900xtx', name: 'Radeon RX 7900 XTX', category: 'GPU', socketOrSlot: 'PCIe 5.0', detail1: '24GB GDDR6 VRAM', detail2: '355W TDP', wattage: 355, stock: 5, price: 899, status: 'IN STOCK' }
  ];

  const motherboardsList: HardwareComponent[] = [
    { id: 'mobo-x670e', name: 'ROG Crosshair X670E', category: 'MOTHERBOARD', socketOrSlot: 'X670E CHIPSET', detail1: 'E-ATX BOARD SIZE', detail2: '4X DDR5 DIMM SLOTS', wattage: 80, stock: 6, price: 499, status: 'IN STOCK' },
    { id: 'mobo-z790', name: 'ROG Maximus Z790 Hero', category: 'MOTHERBOARD', socketOrSlot: 'Z790 CHIPSET', detail1: 'ATX BOARD SIZE', detail2: '4X DDR5 DIMM SLOTS', wattage: 85, stock: 5, price: 629, status: 'IN STOCK' },
    { id: 'mobo-b650', name: 'MSI MAG B650 Tomahawk', category: 'MOTHERBOARD', socketOrSlot: 'B650 CHIPSET', detail1: 'ATX BOARD SIZE', detail2: '4x DDR5 DIMM SLOTS', wattage: 65, stock: 12, price: 199, status: 'IN STOCK' }
  ];

  const psusList: HardwareComponent[] = [
    { id: 'psu-sfx750', name: 'SFX Platinum 750', category: 'PSU', socketOrSlot: 'SFX FORMAT', detail1: 'FULLY MODULAR PLUG', detail2: '80+ PLATINUM RATED', wattage: 750, stock: 15, price: 149, status: 'IN STOCK' },
    { id: 'psu- gold650', name: 'SFX Gold 650', category: 'PSU', socketOrSlot: 'SFX FORMAT', detail1: 'FULLY MODULAR PLUG', detail2: '80+ GOLD CERTIFIED', wattage: 650, stock: 0, price: 119, status: 'AWAITING SHIPMENT' },
    { id: 'psu-thor1000', name: 'ROG Thor Platinum 1000W', category: 'PSU', socketOrSlot: 'ATX ATX', detail1: 'LIVE OLED SHELDOUT', detail2: '80+ CERT PLATINUM', wattage: 1000, stock: 7, price: 359, status: 'IN STOCK' }
  ];

  // Selected config state
  const [selectedCpu, setSelectedCpu] = useState<HardwareComponent>(cpusList[0]);
  const [selectedGpu, setSelectedGpu] = useState<HardwareComponent>(gpusList[0]);
  const [selectedMobo, setSelectedMobo] = useState<HardwareComponent>(motherboardsList[0]);
  const [selectedPsu, setSelectedPsu] = useState<HardwareComponent>(psusList[0]);

  // Motherboard schematic interactives
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Dynamic calculations based on custom configuration
  const baseOperatingOverhead = 100; // Fans, cooling overhead, storage modules
  const currentTotalWattage = selectedCpu.wattage + selectedGpu.wattage + selectedMobo.wattage + baseOperatingOverhead;
  const wattageCap = selectedPsu.wattage;
  const wattageHeadroom = wattageCap - currentTotalWattage;
  const isPsuIncompatible = currentTotalWattage > wattageCap;
  const isPsuUrgent = currentTotalWattage + 15 >= wattageCap && !isPsuIncompatible;

  // Single-Click Quick Fix PSU Swapper
  const handleFixPsuPowerShortage = () => {
    // Upgrades PSU to the ROG Thor Platinum 1000W
    setSelectedPsu(psusList[2]);
  };

  // Helper stats calculating overall build price dynamically
  const overallEstimatedPrice = selectedCpu.price + selectedGpu.price + selectedMobo.price + selectedPsu.price;

  // Render motherboard detail helper labels based on custom clickable visual pins
  const interactiveNodes = {
    cpu: { id: 'cpu', name: 'AM5 Socket Node', desc: 'Main central processor bus node.', temp: '42°C (STABLE)', volt: '1.24V' },
    ram: { id: 'ram', name: 'DDR5 DIMM_A2', desc: 'Active memory slot under telemetry.', temp: '36°C (OPTIMAL)', volt: '1.35V' },
    pcie: { id: 'pcie', name: 'PCIe 5.0 GPU Bus', desc: 'Main graphical connection core.', temp: '54°C (LOAD)', volt: '12V' }
  };

  return (
    <div className="space-y-6 font-mono text-on-surface">
      {/* View Header */}
      <div className="mb-6">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary-cyan tracking-tight drop-shadow-[0_0_10px_rgba(0,220,230,0.15)] uppercase">
          PRO COMPONENT CONFIGURATOR
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base mt-1">
          Perform digital equipment pairing, test custom configurations, and evaluate power consumption index limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Selection Left Side List */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-xl text-primary-cyan-bright tracking-tight uppercase">
              SELECTED COMPONENTS
            </h3>
            <span className="text-[10px] bg-primary-cyan/15 text-primary-cyan border border-primary-cyan/35 px-2 py-0.5 rounded uppercase font-bold">
              BUILD PRICE: ${overallEstimatedPrice} USD
            </span>
          </div>

          <div className="space-y-3.5">
            {/* CPU SELECTOR COLUMN */}
            <div className="relative bg-surface-container/45 p-4 border border-outline-variant/30 hover:border-primary-cyan/45 transition-all clip-corner-sm flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold border-b border-outline-variant/20 pb-1">
                <span className="flex items-center gap-1.5 uppercase">
                  <CpuIcon className="w-3.5 h-3.5 text-primary-cyan" />
                  CPU MODULE
                </span>
                <span className="text-primary-cyan uppercase tracking-wide">{selectedCpu.socketOrSlot}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div>
                  <h4 className="font-sans font-bold text-[#6ff6ff] text-base leading-tight">{selectedCpu.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wide">
                    {selectedCpu.detail1} / {selectedCpu.detail2}
                  </p>
                </div>
                <select 
                  value={selectedCpu.id}
                  onChange={(e) => {
                    const match = cpusList.find(c => c.id === e.target.value);
                    if (match) setSelectedCpu(match);
                  }}
                  className="bg-surface-lowest border border-outline-variant/30 text-[10px] text-primary-cyan px-2 py-1 rounded cursor-pointer"
                >
                  {cpusList.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (${c.price})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPU SELECTOR COLUMN */}
            <div className="relative bg-surface-container/45 p-4 border border-outline-variant/30 hover:border-primary-cyan/45 transition-all clip-corner-sm flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold border-b border-outline-variant/20 pb-1">
                <span className="flex items-center gap-1.5 uppercase">
                  <Layers className="w-3.5 h-3.5 text-primary-cyan" />
                  GPU GRAPHIC CARD
                </span>
                <span className="text-primary-cyan uppercase tracking-wide">{selectedGpu.socketOrSlot}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div>
                  <h4 className="font-sans font-bold text-[#6ff6ff] text-base leading-tight">{selectedGpu.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wide">
                    {selectedGpu.detail1} / {selectedGpu.detail2}
                  </p>
                </div>
                <select 
                  value={selectedGpu.id}
                  onChange={(e) => {
                    const match = gpusList.find(g => g.id === e.target.value);
                    if (match) setSelectedGpu(match);
                  }}
                  className="bg-surface-lowest border border-outline-variant/30 text-[10px] text-primary-cyan px-2 py-1 rounded cursor-pointer"
                >
                  {gpusList.map(g => (
                    <option key={g.id} value={g.id}>{g.name} (${g.price})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MOTHERBOARD SELECTOR COLUMN */}
            <div className="relative bg-surface-highest/50 p-4 border-2 border-primary-cyan/70 shadow-[0_0_15px_rgba(0,220,230,0.15)] transition-all clip-corner-sm flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-[#6ff6ff] font-bold border-b border-primary-cyan/20 pb-1">
                <span className="flex items-center gap-1.5 uppercase">
                  <Settings className="w-3.5 h-3.5 text-primary-cyan" />
                  MOTHERBOARD BOARD
                </span>
                <span className="text-primary-cyan uppercase tracking-wide">{selectedMobo.socketOrSlot}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div>
                  <h4 className="font-sans font-bold text-[#00f2fe] text-base leading-tight">{selectedMobo.name}</h4>
                  <p className="text-[10px] text-[#b9cacb] mt-0.5 tracking-wide">
                    {selectedMobo.detail1} / {selectedMobo.detail2}
                  </p>
                </div>
                <select 
                  value={selectedMobo.id}
                  onChange={(e) => {
                    const match = motherboardsList.find(m => m.id === e.target.value);
                    if (match) setSelectedMobo(match);
                  }}
                  className="bg-surface-lowest border border-primary-cyan/50 text-[10px] text-[#00f2fe] px-2 py-1 rounded cursor-pointer font-bold"
                >
                  {motherboardsList.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (${m.price})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* POWER SUPPLY SELECTOR COLUMN */}
            <div className="relative bg-surface-container/45 p-4 border border-outline-variant/30 hover:border-primary-cyan/45 transition-all clip-corner-sm flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold border-b border-outline-variant/20 pb-1">
                <span className="flex items-center gap-1.5 uppercase">
                  <Zap className="w-3.5 h-3.5 text-primary-cyan" />
                  POWER SUPPLY UNIT (PSU)
                </span>
                <span className="text-secondary-green uppercase tracking-wide">750W PEAK CAP</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div>
                  <h4 className="font-sans font-bold text-[#6ff6ff] text-base leading-tight">{selectedPsu.name}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wide">
                    {selectedPsu.detail1} / {selectedPsu.detail2}
                  </p>
                </div>
                <select 
                  value={selectedPsu.id}
                  onChange={(e) => {
                    const match = psusList.find(p => p.id === e.target.value);
                    if (match) setSelectedPsu(match);
                  }}
                  className="bg-surface-lowest border border-outline-variant/30 text-[10px] text-primary-cyan px-2 py-1 rounded cursor-pointer"
                >
                  {psusList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Board Diagram & HUD Visuals */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-video bg-surface-lowest border border-outline-variant/30 rounded-xl overflow-hidden scanline-effect shadow-2xl flex flex-col justify-between p-4">
            {/* Atmospheric Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/[0.03] via-transparent to-primary-cyan/[0.03] pointer-events-none"></div>
            
            {/* HUD Status Header Overlay */}
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-dark-bg/60 p-1.5 border border-outline-variant/20 rounded">
                BOARD LAYOUT: {selectedMobo.name}
              </span>
              
              <div className="flex flex-col gap-1.5 items-end">
                {/* VOLTAGE STATS */}
                <div className="bg-[#171b26]/90 backdrop-blur-md px-3 py-1.5 border-r-3 border-primary-cyan rounded text-right">
                  <span className="text-[8px] font-bold block text-on-surface-variant tracking-wider uppercase">VOLTAGE STABILITY</span>
                  <div className="flex gap-[3px] mt-1">
                    <div className="w-[3px] h-2 bg-primary-cyan shadow-[0_0_4px_#00dce6]"></div>
                    <div className="w-[3px] h-2 bg-primary-cyan shadow-[0_0_4px_#00dce6]"></div>
                    <div className="w-[3px] h-2 bg-primary-cyan shadow-[0_0_4px_#00dce6]"></div>
                    <div className="w-[3px] h-2 bg-primary-cyan"></div>
                    <div className="w-[3px] h-2 bg-primary-cyan"></div>
                    <div className="w-[3px] h-2 bg-[#262a35]"></div>
                    <div className="w-[3px] h-2 bg-[#262a35]"></div>
                  </div>
                </div>

                {/* THERMAL STATS */}
                <div className="bg-[#171b26]/90 backdrop-blur-md px-3 py-1.5 border-r-3 border-secondary-green rounded text-right">
                  <span className="text-[8px] font-bold block text-on-surface-variant tracking-wider uppercase font-mono">THERMAL HEADROOM</span>
                  <span className="text-secondary-green font-bold text-[11px] block mt-0.5 tracking-wide">+22% (OPTIMAL)</span>
                </div>
              </div>
            </div>

            {/* Motherboard Vector Design Schematic block */}
            <div className="absolute inset-x-4 top-14 bottom-14 flex items-center justify-center">
              <svg className="w-full h-full text-surface-highest opacity-40 max-h-[180px]" viewBox="0 0 700 360">
                {/* PCB Main outline */}
                <rect x="20" y="10" width="660" height="340" fill="currentColor" rx="8" className="transition-all duration-500 text-surface-container" />
                
                {/* AM5 CPU socket with interaction */}
                <rect 
                  x="260" y="80" width="120" height="120" 
                  fill="#0b0f19" 
                  stroke={selectedNode === 'cpu' ? '#00f2fe' : '#00dce6'} 
                  strokeWidth={selectedNode === 'cpu' ? '3.5' : '1.5'}
                  className="transition-all duration-300 cursor-pointer hover:fill-[#171b26]"
                  onClick={() => setSelectedNode('cpu')}
                />
                <text x="320" y="145" textAnchor="middle" fill="#00dce6" fontSize="11" className="font-sans font-bold">CPU SOCKET</text>
                
                {/* Graphics slot PCIe */}
                <rect 
                  x="120" y="260" width="400" height="25" 
                  fill="#0b0f19" 
                  stroke={selectedNode === 'pcie' ? '#00f2fe' : '#849495'} 
                  strokeWidth="1.5"
                  className="transition-all duration-300 cursor-pointer hover:fill-[#171b26]"
                  onClick={() => setSelectedNode('pcie')}
                />
                <text x="320" y="276" textAnchor="middle" fill="#849495" fontSize="9" className="font-sans font-bold uppercase">PCIe_5.0_SLOT</text>
                
                {/* 4 DDR5 dimms */}
                <rect 
                  x="440" y="60" width="12" height="160" 
                  fill="#0e121a" 
                  stroke={selectedNode === 'ram' ? '#00f2fe' : '#3a494b'} 
                  strokeWidth="1"
                  className="transition-all duration-300 cursor-pointer hover:fill-[#171b26]"
                  onClick={() => setSelectedNode('ram')}
                />
                <rect 
                  x="465" y="60" width="12" height="160" 
                  fill="#0e121a" 
                  stroke={selectedNode === 'ram' ? '#00f2fe' : '#3a494b'} 
                  strokeWidth="1"
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedNode('ram')}
                />
                <rect 
                  x="490" y="60" width="12" height="160" 
                  fill="#0e121a" 
                  stroke={selectedNode === 'ram' ? '#00f2fe' : '#30c793'} 
                  strokeWidth="1.5"
                  className="transition-all duration-300 cursor-pointer hover:fill-[#171b26]"
                  onClick={() => setSelectedNode('ram')}
                />
                <rect 
                  x="515" y="60" width="12" height="160" 
                  fill="#0e121a" 
                  stroke={selectedNode === 'ram' ? '#00f2fe' : '#30c793'} 
                  strokeWidth="1.5"
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedNode('ram')}
                />
                <text x="478" y="245" textAnchor="middle" fill="#30c793" fontSize="8" className="font-bold">4X_DDR5</text>
                
                {/* VRM area outlines */}
                <rect x="220" y="80" width="25" height="120" fill="#262a35" rx="2" />
                <rect x="260" y="45" width="120" height="25" fill="#262a35" rx="2" />
              </svg>

              {/* Dynamic Interactive Node Dots for custom clicks */}
              <div 
                className="absolute top-[32%] left-[45%] w-6 h-6 rounded-full bg-primary-cyan/20 border-2 border-primary-cyan flex items-center justify-center cursor-pointer animate-pulse z-10"
                onClick={() => setSelectedNode('cpu')}
                title="Processor Sockets details"
              >
                <div className="w-1.5 h-1.5 bg-primary-cyan rounded-full"></div>
              </div>

              <div 
                className="absolute top-[30%] left-[71%] w-6 h-6 rounded-full bg-secondary-green/20 border-2 border-secondary-green flex items-center justify-center cursor-pointer z-10"
                onClick={() => setSelectedNode('ram')}
                title="Memory lanes state"
              >
                <div className="w-1.5 h-1.5 bg-secondary-green rounded-full"></div>
              </div>
            </div>

            {/* Click node result overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-dark-bg/95 backdrop-blur border border-outline-variant/40 p-2.5 max-w-[200px] text-[10px] rounded animate-fade-in">
              {selectedNode ? (
                <div>
                  <p className="font-bold text-[#6ff6ff] border-b border-outline-variant/30 pb-0.5 mb-1 uppercase">
                    {interactiveNodes[selectedNode as keyof typeof interactiveNodes].name}
                  </p>
                  <p className="text-on-surface-variant leading-tight mb-1">
                    {interactiveNodes[selectedNode as keyof typeof interactiveNodes].desc}
                  </p>
                  <p className="font-semibold text-secondary-green">TEMP: {interactiveNodes[selectedNode as keyof typeof interactiveNodes].temp}</p>
                  <p className="font-semibold text-primary-cyan">V_OUT: {interactiveNodes[selectedNode as keyof typeof interactiveNodes].volt}</p>
                </div>
              ) : (
                <div className="text-on-surface-variant italic">
                  Click on board terminal items (CPU, Memory or PCIe) to extract sensor telemetry.
                </div>
              )}
            </div>

            {/* Completion Percentage ring bottom right */}
            <div className="absolute bottom-4 right-4 z-10">
              <div className="bg-[#171b26]/90 backdrop-blur p-2 border border-outline-variant/30 flex items-center gap-3 rounded">
                <div className="relative w-10 h-10 shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle className="text-surface-highest" cx="20" cy="20" fill="transparent" r="16" stroke="currentColor" strokeWidth="3" />
                    <circle className="text-primary-cyan" cx="20" cy="20" fill="transparent" r="16" stroke="currentColor" strokeDasharray="100.48" strokeDashoffset={selectedNode ? '25' : '45'} strokeWidth="3.5" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary-cyan font-orbitron">
                    {selectedNode ? '88%' : '76%'}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-bold block text-on-surface-variant tracking-wider uppercase font-mono">STABILITY CORE</span>
                  <span className="text-[10px] font-extrabold text-on-surface">HEALTHY EQUIP</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Real-time Hardware Compatibility Ticker Footer Bar */}
      <footer className="bg-surface-container-highest/95 backdrop-blur-xl border border-primary-cyan/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Identity */}
          <div className="flex items-center gap-3 md:border-r border-outline-variant/30 pr-2 pb-2 md:pb-0">
            <div className="w-10 h-10 bg-primary-cyan/15 rounded border border-primary-cyan/45 flex items-center justify-center shrink-0">
              <Zap className="text-primary-cyan w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-primary-cyan tracking-wider uppercase">COMPATIBILITY KERNEL</p>
              <p className="text-xs font-bold font-sans">SYS_COMP_X92</p>
            </div>
          </div>

          {/* AM5 / LGA status */}
          <div className="flex items-center gap-2.5 pb-2 md:pb-0">
            <CheckCircle className="text-secondary-green w-4 h-4 shrink-0" />
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Mobo socket match</p>
              <p className="text-xs font-bold text-on-surface uppercase">
                {selectedCpu.socketOrSlot.split(' ')[0]} VERIFIED
              </p>
            </div>
          </div>

          {/* Wattage bar progress index */}
          <div className="flex items-center gap-3 pb-2 md:pb-0">
            <div className="flex-grow">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">WATTAGE HEADROOM INDEX</span>
              
              <div className="w-full bg-surface-lowest h-2 rounded overflow-hidden mt-1 relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isPsuIncompatible 
                      ? 'bg-warning-red shadow-[0_0_8px_#ffb4ab]' 
                      : isPsuUrgent 
                        ? 'bg-[#ffe066]' 
                        : 'bg-secondary-green shadow-[0_0_8px_#4edea3]'
                  }`}
                  style={{ width: `${Math.min((currentTotalWattage / wattageCap) * 100, 100)}%` }}
                />
              </div>
              <p className={`text-[9px] mt-1.5 font-bold tracking-wider uppercase ${isPsuUrgent || isPsuIncompatible ? 'text-warning-red' : 'text-[#6ff6ff]'}`}>
                {currentTotalWattage}W / {wattageCap}W CAP ({wattageHeadroom}W SPARE)
              </p>
            </div>
          </div>

          {/* Interactive alert fix box */}
          <div className="flex-grow">
            {isPsuIncompatible ? (
              <div className="flex justify-between items-center bg-warning-red-dark/20 border border-warning-red p-2.5 rounded text-xs">
                <div>
                  <p className="font-bold text-warning-red uppercase tracking-wide">POWER DEFICIT!</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Need {currentTotalWattage}W, PSU has {wattageCap}W.</p>
                </div>
                <button 
                  onClick={handleFixPsuPowerShortage}
                  className="bg-warning-red text-dark-bg px-2.5 py-1 text-[9px] font-bold uppercase rounded hover:opacity-85 transition-opacity"
                >
                  UPGRADE PSU
                </button>
              </div>
            ) : isPsuUrgent ? (
              <div className="flex justify-between items-center bg-[#ffe066]/10 border border-[#ffe066]/50 p-2.5 rounded text-xs animate-pulse">
                <div>
                  <p className="font-bold text-[#ffe066] uppercase tracking-wide">CRITICAL OVERLOAD!</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 mt-1 font-mono">Wattage clearance low ({wattageHeadroom}W).</p>
                </div>
                <button 
                  onClick={handleFixPsuPowerShortage}
                  className="bg-[#ffe066] text-dark-bg px-2.5 py-1 text-[9px] font-bold uppercase rounded hover:bg-opacity-90"
                >
                  FIX OVERLOAD
                </button>
              </div>
            ) : (
              <div className="bg-secondary-green/10 border border-secondary-green/30 p-2.5 rounded text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-secondary-green uppercase tracking-wide">SYSTEM EQUIPPED</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase mb-1">Configuration is fully viable.</p>
                </div>
                <span className="text-[8px] font-bold border border-secondary-green/45 text-secondary-green px-1.5 rounded uppercase">APPROVED</span>
              </div>
            )}
          </div>

        </div>
      </footer>
    </div>
  );
}
