import React, { useState } from 'react';
import { Plus, AlertTriangle, X, Trash2, Radar } from 'lucide-react';

// --- Components ---

const Badge = ({ level, type }) => {
  const colors = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-orange-100 text-orange-700 border-orange-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };
  
  const defaultColor = "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${colors[level] || defaultColor}`}>
      {type}: {level}
    </span>
  );
};

const Card = ({ item, onDragStart, onDelete }) => {
  const isHighRisk = item.probability === 'High';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      className={`
        bg-white p-3 rounded-lg shadow-sm border-l-4 cursor-move hover:shadow-md transition-all mb-3
        ${isHighRisk ? 'border-l-red-500' : 'border-l-blue-400'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.title}</h4>
        <button 
          onClick={() => onDelete(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
      
      <div className="flex gap-2 flex-wrap">
        <Badge level={item.probability} type="Prob" />
        <Badge level={item.impact} type="Imp" />
      </div>
    </div>
  );
};

const Column = ({ title, status, items, onDrop, onDragOver, onDragStart, onDelete }) => {
  return (
    <div 
      className="flex flex-col h-full w-72 flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-700">{title}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>
      
      <div className="bg-gray-100 rounded-xl p-2 flex-1 overflow-y-auto min-h-[200px] border-2 border-transparent hover:border-blue-100 transition-colors">
        {items.map((item) => (
          <Card 
            key={item.id} 
            item={item} 
            onDragStart={onDragStart} 
            onDelete={onDelete}
          />
        ))}
        {items.length === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

const AddRiskModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    probability: 'Medium',
    impact: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ title: '', description: '', probability: 'Medium', impact: 'Medium' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Log New Risk</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Title</label>
            <input 
              required
              autoFocus
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., API Rate Limits"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                value={formData.probability}
                onChange={(e) => setFormData({...formData, probability: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                value={formData.impact}
                onChange={(e) => setFormData({...formData, impact: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="What could go wrong?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Risk
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [risks, setRisks] = useState([
    { id: 1, title: 'Database Timeout', description: 'Queries taking too long during peak load', probability: 'High', impact: 'High', status: 'New' },
    { id: 2, title: 'Vendor API Change', description: '3rd party provider updating schema next month', probability: 'Medium', impact: 'High', status: 'Monitoring' },
    { id: 3, title: 'Staff Holiday', description: 'Key FE dev off for 2 weeks in sprint 4', probability: 'High', impact: 'Medium', status: 'Mitigating' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("riskId", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, newStatus) => {
    const id = parseInt(e.dataTransfer.getData("riskId"));
    setRisks(prev => prev.map(risk => 
      risk.id === id ? { ...risk, status: newStatus } : risk
    ));
  };

  const handleAddRisk = (newRisk) => {
    const risk = {
      ...newRisk,
      id: Date.now(),
      status: 'New'
    };
    setRisks([...risks, risk]);
  };

  const handleDeleteRisk = (id) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  };

  const columns = [
    { title: '🆕 New Risks', status: 'New' },
    { title: '👀 Monitoring', status: 'Monitoring' },
    { title: '🛡️ Mitigating', status: 'Mitigating' },
    { title: '✅ Closed', status: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Radar className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Radar <span className="text-slate-400 font-normal">| RAID Log</span></h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-gray-200"
          >
            <Plus size={16} /> Log Risk
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
          {columns.map(col => (
            <Column 
              key={col.status}
              title={col.title}
              status={col.status}
              items={risks.filter(r => r.status === col.status)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onDelete={handleDeleteRisk}
            />
          ))}
        </div>
      </main>

      <AddRiskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddRisk}
      />
    </div>
  );
}
