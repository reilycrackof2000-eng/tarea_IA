/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Settings, RefreshCw, Layers } from 'lucide-react';
import { NavSection } from '../types';

interface HeaderProps {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  latencySeconds: number;
  triggerRefreshLatency: () => void;
}

export default function Header({
  currentSection,
  setCurrentSection,
  latencySeconds,
  triggerRefreshLatency
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container/60 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_15px_rgba(0,220,230,0.1)]">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setCurrentSection('EXECUTIVE_DASHBOARD')}
      >
        <Terminal className="text-primary-cyan w-6 h-6 transition-transform group-hover:rotate-6" />
        <h1 className="font-sans font-bold text-lg md:text-xl tracking-tighter text-primary-cyan-bright drop-shadow-[0_0_8px_rgba(0,220,230,0.6)]">
          APEXPC PRO HUB
        </h1>
      </div>

      {/* Desktop Quick Nav Menu in top bar if desired, but we have secondary indicators */}
      <div className="hidden lg:flex gap-4">
        <button 
          onClick={() => setCurrentSection('EXECUTIVE_DASHBOARD')}
          className={`font-mono text-xs font-semibold px-3 py-1 rounded transition-colors ${
            currentSection === 'EXECUTIVE_DASHBOARD' 
              ? 'text-primary-cyan bg-primary-cyan/10 border-b-2 border-primary-cyan' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/30'
          }`}
        >
          DASHBOARD
        </button>
        <button 
          onClick={() => setCurrentSection('PRO_CONFIGURATOR')}
          className={`font-mono text-xs font-semibold px-3 py-1 rounded transition-colors ${
            currentSection === 'PRO_CONFIGURATOR' 
              ? 'text-primary-cyan bg-primary-cyan/10 border-b-2 border-primary-cyan' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/30'
          }`}
        >
          CONFIGURATOR
        </button>
        <button 
          onClick={() => setCurrentSection('SPARE_PARTS')}
          className={`font-mono text-xs font-semibold px-3 py-1 rounded transition-colors ${
            currentSection === 'SPARE_PARTS' 
              ? 'text-primary-cyan bg-primary-cyan/10 border-b-2 border-primary-cyan' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/30'
          }`}
        >
          SPARE PARTS
        </button>
        <button 
          onClick={() => setCurrentSection('AI_DIAGNOSTIC')}
          className={`font-mono text-xs font-semibold px-3 py-1 rounded transition-colors ${
            currentSection === 'AI_DIAGNOSTIC' 
              ? 'text-primary-cyan bg-primary-cyan/10 border-b-2 border-primary-cyan' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/30'
          }`}
        >
          AI DIAGNOSTIC
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-green animate-pulse"></span>
            <span className="text-[10px] font-bold text-on-surface tracking-wider">SYS_OP: ACTIVE</span>
          </div>
          <button 
            onClick={triggerRefreshLatency}
            className="text-[9px] text-primary-cyan/70 hover:text-primary-cyan flex items-center gap-1 mt-0.5 active:rotate-45 transition-transform"
            title="Recalculate latency telemetry"
          >
            <RefreshCw className="w-2 h-2" />
            LATENCY: {latencySeconds}ms
          </button>
        </div>

        {/* Action controls */}
        <div className="flex gap-1.5">
          <button 
            className="p-2 hover:bg-primary-cyan/10 text-on-surface-variant hover:text-primary-cyan transition-colors rounded-full"
            onClick={triggerRefreshLatency}
            title="Refresh network sync"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            className="p-2 hover:bg-primary-cyan/10 text-on-surface-variant hover:text-primary-cyan transition-colors rounded-full"
            onClick={() => setCurrentSection('PRO_CONFIGURATOR')}
            title="Component Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
