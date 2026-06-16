/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck,
  Package,
  Wrench,
  Sparkles,
  Clipboard,
  X
} from 'lucide-react';
import { InventoryItem } from '../types';

interface SparePartsInventoryProps {
  systemHealth: number;
}

export default function SparePartsInventory({ systemHealth }: SparePartsInventoryProps) {
  // Shared inventory dataset reflecting exact image mockups
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { partId: '#CPU-12900K', name: 'Intel Core i9-12900K', category: 'Processor', socket: 'LGA 1700', stock: 3, status: 'CRITICAL STOCK', price: 589.00, ticketId: '#AX-429' },
    { partId: '#DDR5-64GB-A', name: 'Apex Ultra DDR5 64GB Kit', category: 'Memory', socket: 'DIMM-V5', stock: 42, status: 'IN STOCK', price: 245.99 },
    { partId: '#NVME-4TB-PRO', name: 'Quantum 4TB NVMe Gen5', category: 'Storage', socket: 'M.2 2280', stock: 15, status: 'AWAITING SHIPMENT', price: 899.00, ticketId: '#AX-882' },
    { partId: '#PSU-1200W-P', name: 'Titan 1200W Platinum', category: 'Power Supply', socket: 'ATX 3.0', stock: 8, status: 'LOW STOCK', price: 310.50 },
    { partId: '#GPU-4090-SLI', name: 'NVIDIA RTX 4090 Advanced', category: 'Graphical Core', socket: 'PCIe 5.0', stock: 1, status: 'CRITICAL STOCK', price: 1699.00 },
    { partId: '#RAM-DDR5-32B', name: 'Vengeance DDR5 32GB 6000', category: 'Memory', socket: 'DIMM-V5', stock: 24, status: 'IN STOCK', price: 139.99 }
  ]);

  // Filters state
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedSocket, setSelectedSocket] = useState<string>('All Sockets');

  // Bookmarked reserves logs
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Modals visibility toggles
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);

  // New Part form state
  const [newPartId, setNewPartId] = useState<string>('');
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartCat, setNewPartCat] = useState<string>('Processor');
  const [newPartSocket, setNewPartSocket] = useState<string>('AM5');
  const [newPartStock, setNewPartStock] = useState<number>(10);
  const [newPartPrice, setNewPartPrice] = useState<number>(299.99);

  // Calculate stats dynamically on the collection
  const totalStockSum = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  const totalCriticalSKUs = inventory.filter(item => item.status === 'CRITICAL STOCK' || item.stock < 5).length;
  const inTransitCount = 345 + inventory.filter(item => item.status === 'AWAITING SHIPMENT').length * 12;
  const reservedItemsCount = 54 + bookmarkedIds.length;

  const handleToggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(b => b !== id));
    } else {
      setBookmarkedIds(prev => [...prev, id]);
    }
  };

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartId || !newPartName) {
      alert("Please designate Part ID and Name details.");
      return;
    }

    // Determine initial status based on stock count
    let statusId: 'CRITICAL STOCK' | 'IN STOCK' | 'LOW STOCK' = 'IN STOCK';
    if (newPartStock === 0) {
      statusId = 'CRITICAL STOCK';
    } else if (newPartStock < 5) {
      statusId = 'LOW STOCK';
    }

    const newItem: InventoryItem = {
      partId: newPartId.startsWith('#') ? newPartId : `#${newPartId}`,
      name: newPartName,
      category: newPartCat,
      socket: newPartSocket,
      stock: newPartStock,
      status: statusId,
      price: newPartPrice
    };

    setInventory(prev => [newItem, ...prev]);
    setShowAddModal(false);

    // Reset Form fields
    setNewPartId('');
    setNewPartName('');
    setNewPartStock(10);
    setNewPartPrice(299);
  };

  const generateCsvDataString = (): string => {
    let csv = "PART ID,NAME,CATEGORY,SOCKET,STOCK,STATUS,PRICE\n";
    inventory.forEach(item => {
      csv += `"${item.partId}","${item.name}","${item.category}","${item.socket}",${item.stock},"${item.status}","${item.price.toFixed(2)}"\n`;
    });
    return csv;
  };

  const handleCopyToClipboard = () => {
    const csvContent = generateCsvDataString();
    navigator.clipboard.writeText(csvContent);
    alert("Clean CSV representation copied to clipboard!");
  };

  // Perform multi-filter matching on items
  const filteredInventory = inventory.filter(item => {
    const query = searchText.toLowerCase();
    const queryMatch = item.partId.toLowerCase().includes(query) || 
                       item.name.toLowerCase().includes(query) ||
                       item.socket.toLowerCase().includes(query);
    
    const catMatch = selectedCategory === 'All Categories' || item.category.toLowerCase().includes(selectedCategory.slice(0, 4).toLowerCase());
    const socketMatch = selectedSocket === 'All Sockets' || item.socket.toLowerCase() === selectedSocket.toLowerCase();

    return queryMatch && catMatch && socketMatch;
  });

  return (
    <div className="space-y-6 font-mono text-on-surface">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary-cyan tracking-tight drop-shadow-[0_0_10px_rgba(0,220,230,0.15)] uppercase flex items-center gap-2">
            <Package className="w-8 h-8 text-primary-cyan" />
            SPARE PARTS INVENTORY
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base mt-1">
            Logistical equipment directories, stock audits, and telemetry optimization models.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Export button */}
          <button 
            onClick={() => setShowCsvModal(true)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-high hover:bg-surface-highest transition-colors border border-outline-variant/30 font-bold text-xs flex items-center justify-center gap-2 clip-corner-sm"
          >
            <Download className="w-4 h-4" /> EXPORT CSV
          </button>
          
          {/* New Part registration */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-grow md:flex-grow-0 px-4 py-2.5 bg-primary-cyan text-dark-bg hover:brightness-110 transition-all font-bold text-xs flex items-center justify-center gap-2 clip-corner-sm"
          >
            <Plus className="w-4 h-4" /> NEW PART
          </button>
        </div>
      </div>

      {/* Inputs Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low/40 p-4 rounded-lg border border-outline-variant/20 backdrop-blur-sm">
        <div className="md:col-span-2 relative group">
          <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-cyan transition-colors" />
          <input 
            type="text"
            placeholder="Search Part ID or Serial..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-surface-lowest border-b-2 border-outline-variant focus:border-primary-cyan outline-none py-2.5 pl-11 pr-4 text-xs transition-all text-on-surface"
          />
        </div>

        <div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-surface-lowest border border-outline-variant/30 py-2.5 px-4 text-xs text-on-surface focus:border-primary-cyan outline-none rounded appearance-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Processor</option>
            <option>Memory</option>
            <option>Storage</option>
            <option>Power Supply</option>
            <option>Graphical Core</option>
          </select>
        </div>

        <div>
          <select 
            value={selectedSocket}
            onChange={(e) => setSelectedSocket(e.target.value)}
            className="w-full bg-surface-lowest border border-outline-variant/30 py-2.5 px-4 text-xs text-on-surface focus:border-primary-cyan outline-none rounded appearance-none cursor-pointer"
          >
            <option>All Sockets</option>
            <option>LGA 1700</option>
            <option>AM5</option>
            <option>DIMM-V5</option>
            <option>M.2 2280</option>
            <option>ATX 3.0</option>
            <option>PCIe 5.0</option>
          </select>
        </div>
      </div>

      {/* Dynamic Bento stats summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TOTAL STOCK */}
        <div className="bg-[#1c1f2a]/40 p-4 border border-outline-variant/20 backdrop-blur-md rounded-lg">
          <p className="text-[10px] text-on-surface-variant mb-1 font-bold tracking-wider uppercase">STOCK CAPACITY</p>
          <p className="font-orbitron font-bold text-lg sm:text-xl text-[#6ff6ff]">
            {totalStockSum} <span className="text-xs text-on-surface-variant font-mono font-normal">UNITS</span>
          </p>
        </div>

        {/* CRITICAL ALERTS */}
        <div className={`p-4 border backdrop-blur-md rounded-lg transition-colors ${
          totalCriticalSKUs > 0 
            ? 'bg-warning-red-dark/10 border-warning-red/40' 
            : 'bg-[#1c1f2a]/40 border-outline-variant/20'
        }`}>
          <p className="text-[10px] text-on-surface-variant mb-1 font-bold tracking-wider uppercase">CRITICAL SKUS</p>
          <p className={`font-orbitron font-bold text-lg sm:text-xl ${totalCriticalSKUs > 0 ? 'text-warning-red' : 'text-secondary-green'}`}>
            {totalCriticalSKUs} <span className="text-xs font-mono font-normal">ALERTS</span>
          </p>
        </div>

        {/* IN TRANSIT */}
        <div className="bg-[#1c1f2a]/40 p-4 border border-outline-variant/20 backdrop-blur-md rounded-lg">
          <p className="text-[10px] text-on-surface-variant mb-1 font-bold tracking-wider uppercase">SHIPPINGS IN TRANSIT</p>
          <p className="font-orbitron font-bold text-lg sm:text-xl text-[#6ffbbe]">
            {inTransitCount} <span className="text-xs text-on-surface-variant font-mono font-normal">UNITS</span>
          </p>
        </div>

        {/* RESERVED */}
        <div className="bg-[#1c1f2a]/40 p-4 border border-outline-variant/20 backdrop-blur-md rounded-lg">
          <p className="text-[10px] text-on-surface-variant mb-1 font-bold tracking-wider uppercase">RESERVED ALLOCATIONS</p>
          <p className="font-orbitron font-bold text-lg sm:text-xl text-on-surface">
            {reservedItemsCount} <span className="text-xs text-on-surface-variant font-mono font-normal font-sans">ITEMS</span>
          </p>
        </div>
      </div>

      {/* Main Database Table view */}
      <div className="bg-surface-low/60 border border-outline-variant/30 rounded-xl overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-highest/40 border-b border-outline-variant/35 text-[10px] text-outline">
                <th className="px-5 py-3 tracking-wider font-bold">PART ID</th>
                <th className="px-4 py-3 tracking-wider font-bold">EQUIPMENT NAME</th>
                <th className="px-4 py-3 tracking-wider font-bold">CATEGORY</th>
                <th className="px-4 py-3 tracking-wider font-bold">SOCKET CONNS</th>
                <th className="px-4 py-3 tracking-wider font-bold text-center">QUANTITY</th>
                <th className="px-4 py-3 tracking-wider font-bold">TELEMETRY CODE</th>
                <th className="px-4 py-3 tracking-wider font-bold">UNIT PRICE</th>
                <th className="px-5 py-3 tracking-wider font-bold text-right">RESERVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredInventory.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.partId);
                return (
                  <tr key={item.partId} className="hover:bg-primary-cyan/[0.03] transition-colors group">
                    {/* Part ID */}
                    <td className="px-5 py-4 font-bold text-[#6ff6ff] select-all">
                      {item.partId}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4 font-sans font-bold text-on-surface text-[13px]">
                      {item.name}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-on-surface-variant font-medium">
                      {item.category}
                    </td>

                    {/* Socket */}
                    <td className="px-4 py-4">
                      <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] border border-outline-variant/40 font-semibold text-primary-cyan font-sans uppercase">
                        {item.socket}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className={`px-4 py-4 text-center font-bold font-orbitron ${
                      item.stock < 5 ? 'text-warning-red' : 'text-on-surface'
                    }`}>
                      {item.stock.toString().padStart(2, '0')}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4">
                      {item.status === 'CRITICAL STOCK' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold text-warning-red bg-warning-red-dark/15 border border-warning-red/35 animate-pulse uppercase">
                          <AlertTriangle className="w-3 h-3" /> CRITICAL STOCK
                        </span>
                      ) : item.status === 'AWAITING SHIPMENT' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold text-[#6ff6ff] bg-primary-cyan/15 border border-primary-cyan/35 uppercase">
                          AWAITING SHIPMENT
                        </span>
                      ) : item.status === 'LOW STOCK' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold text-[#f7b955] bg-[#f7b955]/10 border border-[#f7b955]/40 uppercase">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold text-secondary-green bg-secondary-green-dark/15 border border-secondary-green/35 uppercase">
                          <CheckCircle className="w-3 h-3" /> IN STOCK
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-semibold text-on-surface">
                      ${item.price.toFixed(2)}
                    </td>

                    {/* Reserve click action */}
                    <td className="px-5 py-4 text-right">
                      {item.ticketId ? (
                        <button 
                          onClick={() => alert(`Redirecting to diagnostic details for ${item.ticketId}`)}
                          className="bg-surface-container-highest hover:bg-primary-cyan/20 hover:text-[#6ff6ff] px-2.5 py-1 rounded text-[10px] font-bold transition-all border border-outline-variant/35 text-on-surface uppercase"
                        >
                          TICKET {item.ticketId}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleBookmark(item.partId)}
                          className="text-outline hover:text-[#00f2fe] transition-colors p-1"
                          title="Bookmark reservation slot"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-primary-cyan" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination fake element block */}
        <div className="px-5 py-3.5 bg-surface-lowest/40 flex justify-between items-center border-t border-outline-variant/30 text-[10px] font-bold text-outline">
          <p className="uppercase">SHOWING 1-{filteredInventory.length} OF {inventory.length} DATA SKUS</p>
          <div className="flex gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center rounded bg-surface-highest text-on-surface-variant hover:text-[#6ff6ff] transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-primary-cyan text-dark-bg font-bold">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-surface-highest text-on-surface-variant hover:text-[#6ff6ff] transition-colors font-bold">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-surface-highest text-on-surface-variant hover:text-[#6ff6ff] transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lower contextual cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#1c1f2a]/40 border border-outline-variant/35 backdrop-blur-md rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg">
          <div className="sm:w-1/3 min-h-[140px] relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQrq6-PPWo-M_xeUMlSkIV6DC1Sj277oNrHifOhZ_3mUJq2uv1XfddoXPRwkjBA0A7kqKnml63yr3vAXPdTDdYGR5UxK2utbwCM4WJzseK9v2PTCFzj_gNJs2WYiPeGbUMgyrRrLIu0gQNAYz61Kex9Qh4nUz4jmR_3hOJ2SD0Qs5RzQaKEkCbp-DB8OcjirzoKPeK3mp2YU8UM_2ArzrHaW3-a6j_HB5H5XnDZIpUwNjd4hLITRK9GJr1WBJdGv6lGm3zQBZiJGc" 
              alt="Processor core logic chips" 
              className="w-full h-full object-cover grayscale brightness-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1f2a]"></div>
          </div>
          <div className="sm:w-2/3 p-5 flex flex-col justify-center">
            <h4 className="font-sans font-bold text-base text-[#6ff6ff] mb-1.5 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-cyan" />
              AI STORAGE OPTIMIZER RECOMMENDATION
            </h4>
            <p className="text-[11px] text-[#b9cacb] leading-relaxed mb-4">
              Failure indicators recommend augmenting LGA 1700 processor inventories by 25% to accommodate upcoming maintenance requests.
            </p>
            <button 
              onClick={() => alert("Loading deep inventory demand plots...")}
              className="w-fit px-4 py-1.5 border border-primary-cyan text-primary-cyan hover:bg-primary-cyan/15 transition-all text-[10px] font-bold uppercase clip-corner-sm"
            >
              VIEW ANALYSIS PLOT
            </button>
          </div>
        </div>

        <div className="bg-[#1c1f2a]/40 p-5 border border-outline-variant/35 backdrop-blur-md rounded-xl relative overflow-hidden group hover:border-[#6ffbbe]/45 transition-all shadow-lg flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#00dce6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scanline-horizontal-effect"></div>
          
          <div className="flex justify-between items-start mb-3">
            <Wrench className="w-8 h-8 text-secondary-green" />
            <span className="bg-secondary-green/25 text-secondary-green px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase">LOGISTICS_CORE</span>
          </div>
          <h4 className="font-sans font-sans font-bold text-[#6ffbbe] uppercase">PREDICTIVE HARDWARE LOGISTICS</h4>
          <p className="text-[11px] text-[#b9cacb] leading-relaxed mt-2 uppercase">
            Auto-shipping integrations route backup socket transits across direct air corridors. Real-time notifications alert dispatch teams upon low thresholds.
          </p>
        </div>
      </section>

      {/* Export to CSV Modal Dialog Container */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1f2a] border border-[#00dce6]/50 rounded-xl max-w-xl w-full p-5 shadow-2xl relative animate-scale-up">
            <button 
              onClick={() => setShowCsvModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant hover:text-warning-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-orbitron text-[#6ff6ff] text-base mb-2 uppercase flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-primary-cyan" />
              CSV REGISTRY EXPORT GENERATOR
            </h3>
            <p className="text-[10px] text-on-surface-variant mb-4 uppercase">
              Copy complete physical item datasets below to feed into external ERP databases.
            </p>

            <textarea 
              readOnly 
              rows={8}
              value={generateCsvDataString()}
              className="w-full bg-[#0a0e18] text-primary-cyan text-[10px] p-3 rounded font-mono border border-outline-variant/40 focus:outline-none focus:border-primary-cyan"
            />

            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleCopyToClipboard}
                className="flex-1 py-2 bg-primary-cyan text-dark-bg hover:brightness-110 font-bold uppercase text-xs rounded transition-colors"
              >
                COPY DATASET TO CLIPBOARD
              </button>
              <button 
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-surface-highest hover:bg-surface-bright font-bold text-xs rounded transition-colors uppercase"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Part Modal Dialog Container */}
      {showAddModal && (
        <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreatePart}
            className="bg-[#1c1f2a] border border-[#6ff6ff]/40 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
          >
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant hover:text-warning-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-orbitron text-[#6ff6ff] text-base mb-4 uppercase flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-cyan" />
              ADD NEW INVENTORY PART
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-on-surface-variant font-bold uppercase text-[10px]">Part ID / Serial Hash</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. #CPU-13700K"
                  value={newPartId}
                  onChange={(e) => setNewPartId(e.target.value)}
                  className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-on-surface-variant font-bold uppercase text-[10px]">Equipment name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Intel Core i7-13700K"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant font-bold uppercase text-[10px]">Category</label>
                  <select 
                    value={newPartCat}
                    onChange={(e) => setNewPartCat(e.target.value)}
                    className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface cursor-pointer"
                  >
                    <option>Processor</option>
                    <option>Memory</option>
                    <option>Storage</option>
                    <option>Power Supply</option>
                    <option>Graphical Core</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant font-bold uppercase text-[10px]">Socket / Slot</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. LGA 1700"
                    value={newPartSocket}
                    onChange={(e) => setNewPartSocket(e.target.value)}
                    className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant font-bold uppercase text-[10px]">Initial Quantity</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={newPartStock}
                    onChange={(e) => setNewPartStock(parseInt(e.target.value) || 0)}
                    className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant font-bold uppercase text-[10px]">Unit Price ($)</label>
                  <input 
                    type="number" 
                    min="1"
                    step="0.01"
                    required
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(parseFloat(e.target.value) || 0)}
                    className="bg-surface-lowest border border-outline-variant/50 focus:border-primary-cyan rounded py-2 px-3 text-on-surface outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-primary-cyan text-dark-bg hover:brightness-110 font-bold uppercase text-xs rounded transition-colors"
              >
                PRODUCE NEW RECORD
              </button>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-surface-highest hover:bg-surface-bright font-bold text-xs rounded transition-colors uppercase"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
