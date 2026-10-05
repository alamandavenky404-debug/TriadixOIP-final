import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Upload,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Layers,
  Activity,
  Lock,
  Plus,
  ArrowRight,
  Bell,
  Hash,
  FileCheck
} from 'lucide-react';
import { CyberIncident } from '../types/career';
import { MOCK_CYBER_INCIDENTS } from '../data/mockData';

export const CyberIncidentPortal: React.FC = () => {
  const [incidents, setIncidents] = useState<CyberIncident[]>(MOCK_CYBER_INCIDENTS);
  const [activeView, setActiveView] = useState<'admin-dashboard' | 'report-new' | 'analytics'>('admin-dashboard');
  const [selectedIncident, setSelectedIncident] = useState<CyberIncident | null>(MOCK_CYBER_INCIDENTS[0]);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [notification, setNotification] = useState<string | null>(
    'P1 Critical incident INC-2026-084 moved to Containment phase'
  );

  // New report form state
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<CyberIncident['severity']>('P2-High');
  const [category, setCategory] = useState<CyberIncident['category']>('Phishing');
  const [affectedSystemsInput, setAffectedSystemsInput] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceName, setEvidenceName] = useState('');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newInc: CyberIncident = {
      id: `INC-2026-0${Math.floor(85 + Math.random() * 50)}`,
      title,
      severity,
      category,
      status: 'Reported',
      reporter: 'security-analyst@company.internal',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      affectedSystems: affectedSystemsInput ? affectedSystemsInput.split(',').map((s) => s.trim()) : ['Production Subnet A'],
      description,
      evidenceFiles: evidenceName
        ? [
            {
              name: evidenceName,
              size: '1.2 MB',
              hash: '7a8f9c0e1b2d3f4a5c6e7b8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
              type: 'pcap/log',
            },
          ]
        : [],
      iocs: ['198.51.100.12', 'suspicious_payload_hash'],
      responseActionPlan: [
        'Isolate infected endpoint from primary VLAN',
        'Collect volatile memory image and correlate firewall telemetry',
      ],
    };

    setIncidents([newInc, ...incidents]);
    setSelectedIncident(newInc);
    setActiveView('admin-dashboard');
    setNotification(`New incident ${newInc.id} logged and dispatched to SOC queue.`);
    setTitle('');
    setDescription('');
    setAffectedSystemsInput('');
    setEvidenceName('');
  };

  const handleUpdateStatus = (id: string, newStatus: CyberIncident['status']) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setNotification(`Incident ${id} updated to status "${newStatus}"`);
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'All') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Capstone Header Banner */}
      <div className="rounded-2xl border border-rose-900/50 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-rose-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Capstone Project #1 • Live Interactive Prototype</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cyber Incident Reporting & Triage Portal
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Enterprise security operations (SecOps) platform featuring forensic evidence hashing, severity-based P1-P4 triage workflows, real-time status tracking, and attack vector analytics.
            </p>
          </div>

          {/* Navigation Mode */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveView('admin-dashboard')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeView === 'admin-dashboard'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SOC Queue ({incidents.length})
            </button>
            <button
              onClick={() => setActiveView('report-new')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeView === 'report-new'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              + Report Incident
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeView === 'analytics'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Threat Analytics
            </button>
          </div>
        </div>

        {/* Live Security Notification Banner */}
        {notification && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-rose-950/40 px-4 py-2 text-xs text-rose-300 border border-rose-800/40">
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: SOC Admin Dashboard & Incident Inspector */}
      {activeView === 'admin-dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incident Queue List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Incident Queue
              </span>
              {/* Severity filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-slate-300"
              >
                <option value="All">All Severities</option>
                <option value="P1-Critical">P1-Critical</option>
                <option value="P2-High">P2-High</option>
                <option value="P3-Medium">P3-Medium</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`cursor-pointer rounded-xl border p-4 space-y-2 transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{inc.id}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                              inc.severity === 'P1-Critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : inc.severity === 'P2-High'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{inc.title}</h4>
                      </div>

                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {inc.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{inc.category}</span>
                      <span>{inc.timestamp.slice(0, 10)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Detail & Status Lifecycle */}
          <div className="lg:col-span-7 space-y-4">
            {selectedIncident ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400">{selectedIncident.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          selectedIncident.severity === 'P1-Critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {selectedIncident.severity}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {selectedIncident.category}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">{selectedIncident.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Reported by: {selectedIncident.reporter} • {selectedIncident.timestamp}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedIncident.status}
                      onChange={(e) => handleUpdateStatus(selectedIncident.id, e.target.value as any)}
                      className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none"
                    >
                      <option value="Reported">Reported</option>
                      <option value="Triaging">Triaging</option>
                      <option value="Containment">Containment</option>
                      <option value="Eradicated">Eradicated</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Status Lifecycle Progress Stepper */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Incident Lifecycle Progression
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {(['Reported', 'Triaging', 'Containment', 'Eradicated', 'Closed'] as const).map(
                      (stepName, idx) => {
                        const stepOrder = ['Reported', 'Triaging', 'Containment', 'Eradicated', 'Closed'];
                        const currentIdx = stepOrder.indexOf(selectedIncident.status);
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div
                            key={stepName}
                            onClick={() => handleUpdateStatus(selectedIncident.id, stepName)}
                            className={`cursor-pointer rounded-lg p-2 transition-all border ${
                              isCurrent
                                ? 'bg-rose-600 text-white font-bold border-rose-500 shadow'
                                : isDone
                                ? 'bg-rose-950/40 text-rose-300 border-rose-900/50'
                                : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            <span className="text-[10px] block">{idx + 1}</span>
                            <span className="text-[11px] truncate block">{stepName}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Incident Summary & Forensics
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {selectedIncident.description}
                  </p>
                </div>

                {/* Affected Systems */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Affected Infrastructure & Assets
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIncident.affectedSystems.map((sys, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200 border border-slate-700"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence Files with SHA-256 Hashes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                    Cryptographic Evidence Vault (SHA-256 Verified)
                  </span>
                  <div className="space-y-1.5">
                    {selectedIncident.evidenceFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-950 p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{f.name}</span>
                          <span className="text-[10px] text-slate-500">({f.size})</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                          {f.hash}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Playbook Containment Actions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Active Containment Playbook
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedIncident.responseActionPlan.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/70 p-2 rounded border border-slate-850">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* VIEW 2: Report New Incident Form */}
      {activeView === 'report-new' && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              File Urgent Security Incident Report
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit details directly to the 24/7 Security Operations Center (SOC) triage engine.
            </p>
          </div>

          <form onSubmit={handleCreateIncident} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Incident Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Suspected Ransomware Activity on Internal Build Server"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Severity Matrix</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-rose-500 focus:outline-none"
                >
                  <option value="P1-Critical">P1 - Critical (Immediate Outage/Breach)</option>
                  <option value="P2-High">P2 - High (Significant Risk)</option>
                  <option value="P3-Medium">P3 - Medium (Isolated Incident)</option>
                  <option value="P4-Low">P4 - Low (Informational Anomaly)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Threat Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-rose-500 focus:outline-none"
                >
                  <option value="Phishing">Phishing / Social Engineering</option>
                  <option value="Ransomware">Ransomware / Extortion</option>
                  <option value="Data Breach">Data Breach / Exfiltration</option>
                  <option value="DDoS">DDoS / Resource Exhaustion</option>
                  <option value="Unauthorized Access">Unauthorized Access</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Affected Systems (comma-separated)</label>
              <input
                type="text"
                value={affectedSystemsInput}
                onChange={(e) => setAffectedSystemsInput(e.target.value)}
                placeholder="e.g. AWS Prod DB, Kubernetes Node 04, Okta SSO"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Technical Incident Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail timeline, observed anomalous network behavior, user reports, and immediate initial containment measures taken..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Evidence File Upload Simulation */}
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-center space-y-2">
              <Upload className="h-6 w-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-300">Simulate Evidence Artifact Upload</p>
              <p className="text-[11px] text-slate-500">PCAPs, memory dumps, or server audit logs. Automatically calculates SHA-256 checksum.</p>
              <input
                type="text"
                value={evidenceName}
                onChange={(e) => setEvidenceName(e.target.value)}
                placeholder="Filename (e.g. firewall_packet_capture.pcap)"
                className="max-w-xs mx-auto rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('admin-dashboard')}
                className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all cursor-pointer"
              >
                Submit Incident to SOC
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: Threat Analytics & Attack Vectors */}
      {activeView === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Total Incidents (Q4)</span>
              <p className="text-2xl font-black text-white">{incidents.length + 84}</p>
              <span className="text-[10px] text-emerald-400">+12% faster triage</span>
            </div>
            <div className="rounded-xl border border-rose-900/40 bg-slate-900/60 p-4 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-rose-400">Active P1 Criticals</span>
              <p className="text-2xl font-black text-rose-400">1</p>
              <span className="text-[10px] text-slate-500">Under active containment</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Mean Time to Respond</span>
              <p className="text-2xl font-black text-indigo-400">42 min</p>
              <span className="text-[10px] text-emerald-400">NIST benchmark met</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Containment Success Rate</span>
              <p className="text-2xl font-black text-emerald-400">97.8%</p>
              <span className="text-[10px] text-slate-500">Zero data exfiltration</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Threat Category Distribution
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Phishing & Credential Harvesters', percentage: 42, color: 'bg-rose-500' },
                  { name: 'DDoS & HTTP/2 Floods', percentage: 24, color: 'bg-amber-500' },
                  { name: 'Data Access & S3 Leakage', percentage: 18, color: 'bg-indigo-500' },
                  { name: 'Malware & Trojan Droppers', percentage: 16, color: 'bg-emerald-500' },
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{cat.name}</span>
                      <span className="font-mono font-bold">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Forensics Evidence Verification Compliance
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All uploaded PCAPs, system logs, and forensic disk images are automatically tokenized with SHA-256 cryptographic hashes upon ingestion to satisfy legal chain-of-custody requirements under NIST SP 800-86 standards.
              </p>
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[11px] font-mono text-emerald-400">
                STATUS: Chain-of-Custody Cryptographic Vault Active (256-bit AES at rest)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
