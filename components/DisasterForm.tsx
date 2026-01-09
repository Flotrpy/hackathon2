
import React, { useState } from 'react';
import { DisasterType, Severity, DisasterRecord } from '../types';
import GlassCard from './GlassCard';

interface DisasterFormProps {
  onSubmit: (record: Omit<DisasterRecord, 'id' | 'reportedBy'>) => void;
}

const DisasterForm: React.FC<DisasterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: DisasterType.EARTHQUAKE,
    location: '',
    lat: '',
    lng: '',
    severity: Severity.LOW,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: formData.type,
      location: formData.location,
      coordinates: [parseFloat(formData.lat) || 0, parseFloat(formData.lng) || 0],
      severity: formData.severity,
      date: formData.date,
      description: formData.description,
    });
    setFormData({
      type: DisasterType.EARTHQUAKE,
      location: '',
      lat: '',
      lng: '',
      severity: Severity.LOW,
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  return (
    <GlassCard className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="fa-solid fa-circle-exclamation text-red-500"></i>
        New Incident Report
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 opacity-70">Disaster Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DisasterType }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(DisasterType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 opacity-70">Location Name</label>
          <input
            required
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. Tokyo, Japan"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Latitude</label>
            <input
              required
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
              placeholder="35.6762"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Longitude</label>
            <input
              required
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
              placeholder="139.6503"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as Severity }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-70">Date</label>
            <input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 opacity-70">Description</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Details about the incident..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
        >
          Submit Report
        </button>
      </form>
    </GlassCard>
  );
};

export default DisasterForm;
