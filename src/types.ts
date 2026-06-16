/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavSection = 'EXECUTIVE_DASHBOARD' | 'PRO_CONFIGURATOR' | 'SPARE_PARTS' | 'AI_DIAGNOSTIC';

export interface HardwareComponent {
  id: string;
  name: string;
  category: 'CPU' | 'GPU' | 'MOTHERBOARD' | 'PSU';
  socketOrSlot: string;
  detail1: string;
  detail2: string;
  wattage: number;
  stock: number;
  price: number;
  status: 'IN STOCK' | 'CRITICAL STOCK' | 'LOW STOCK' | 'AWAITING SHIPMENT';
}

export interface Symptom {
  id: string;
  name: string;
  checked: boolean;
}

export interface SupportTicket {
  id: string;
  clientName: string;
  hardwareModel: string;
  progress: number; // 0 to 100
  techAssigned: string;
  status: 'CALIBRATING' | 'INITIALIZING' | 'COMPLETED' | 'AWAITING PARTS' | 'SOLDERING';
}

export interface RepairStep {
  name: string;
  time: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  icon: string;
  desc?: string;
}

export interface InventoryItem {
  partId: string;
  name: string;
  category: string;
  socket: string;
  stock: number;
  status: 'CRITICAL STOCK' | 'IN STOCK' | 'AWAITING SHIPMENT' | 'LOW STOCK';
  price: number;
  ticketId?: string;
}

export interface SystemAlert {
  id: string;
  type: 'ERROR' | 'INFO' | 'WARNING';
  title: string;
  message: string;
}
