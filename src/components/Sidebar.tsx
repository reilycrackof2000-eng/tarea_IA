/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { User, LayoutDashboard, Cpu, Box, BrainCircuit } from 'lucide-react';
import { NavSection } from '../types';

interface SidebarProps {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  systemHealth: number;
}

export default function Sidebar({
  currentSection,
  setCurrentSection,
  systemHealth
}: SidebarProps) {
  // Simulating slightly fluctuating green LED bars for tech-realism
  const [ledCount, setLedCount] = useState<number>(3);
  const [flicker, setFlicker] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLedCount(Math.floor(Math.random() * 2) + 8); // fluctuates between 8 and 9 active bars out of 10
      setFlicker(prev => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    {
      id: 'EXECUTIVE_DASHBOARD' as NavSection,
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'PRO_CONFIGURATOR' as NavSection,
      label: 'Pro Configurator',
      icon: Cpu,
    },
    {
      id: 'SPARE_PARTS' as NavSection,
      label: 'Spare Parts',
      icon: Box,
    },
    {
      id: 'AI_DIAGNOSTIC' as NavSection,
      label: 'AI Diagnostic',
      icon: BrainCircuit,
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex flex-col pt-20 bg-surface-lowest/70 backdrop-blur-md h-screen w-72 border-r border-primary-cyan/15 shadow-xl hidden md:flex font-mono">
      {/* User Operator Profile */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3.5 p-3 bg-surface-high/40 rounded-lg border border-outline-variant/20">
          <div className="relative w-10 h-10 rounded-full bg-primary-cyan/10 flex items-center justify-center border border-primary-cyan/35 group hover:border-primary-cyan transition-colors">
            <User className="text-primary-cyan w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary-green rounded-full border border-dark-bg"></span>
          </div>
          <div>
            <p className="font-sans font-semibold text-sm text-[#6ff6ff] leading-none mb-1">APEX_USER_01</p>
            <p className="text-[9px] font-bold text-secondary-green tracking-widest uppercase">
              CONN: ONLINE
            </p>
          </div>
        </div>
      </div>

      {/* Navigation options */}
      <nav className="flex flex-col gap-1.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded text-left transition-all ${
                isActive
                  ? 'bg-primary-cyan/15 text-[#6ff6ff] border-r-4 border-primary-cyan shadow-[0_0_15px_rgba(0,220,230,0.15)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/55'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-cyan' : 'text-on-surface-variant'}`} />
              <span className="text-xs font-semibold tracking-wide uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom telemetry monitoring block */}
      <div className="mt-auto p-5">
        <div className="p-4 bg-surface-highest/20 rounded border border-outline-variant/20 clip-corner-sm">
          <p className="text-[9px] text-on-surface-variant mb-2 tracking-widest font-bold uppercase">
            SYSTEM TELEMETRY HEALTH
          </p>
          
          {/* Neon active LED segments bar */}
          <div className="flex gap-[3px] mb-2 items-center">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isActive = idx < ledCount;
              return (
                <div
                  key={idx}
                  className={`h-3 w-1.5 rounded-sm transition-all duration-500 ${
                    isActive
                      ? 'bg-primary-cyan shadow-[0_0_8px_#00dce6]'
                      : 'bg-[#21242e]'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-secondary-green font-bold tracking-widest">
              STATUS: STABLE
            </span>
            <span className="text-xs font-bold text-primary-cyan drop-shadow-[0_0_4px_rgba(0,220,230,0.4)]">
              {systemHealth}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
