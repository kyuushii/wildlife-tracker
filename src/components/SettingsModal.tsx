'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Upload, 
  ShieldCheck, 
  Laptop, 
  Check, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { exportUserDataAsJSON, importUserDataFromJSON } from '@/lib/storage';
import { resetSupabaseClient } from '@/lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('cp_supabase_url') || '');
      setSupabaseKey(localStorage.getItem('cp_supabase_anon_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cp_supabase_url', supabaseUrl.trim());
    localStorage.setItem('cp_supabase_anon_key', supabaseKey.trim());
    resetSupabaseClient();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClearSupabase = () => {
    localStorage.removeItem('cp_supabase_url');
    localStorage.removeItem('cp_supabase_anon_key');
    setSupabaseUrl('');
    setSupabaseKey('');
    resetSupabaseClient();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const json = exportUserDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colorado-photo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importUserDataFromJSON(content);
      if (res.success) {
        setImportStatus(`Successfully restored ${res.count} items!`);
        onDataChanged();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to import backup: invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Database className="w-4 h-4" />
            <span>Settings & Cross-Device Sync</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            App Configuration
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage cloud sync between your Mac & PC, backup your field sightings, and install the app.
          </p>
        </div>

        {/* Zero API Key Callout */}
        <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl flex items-start space-x-3 text-emerald-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="font-bold text-emerald-300">No API Key Required!</strong>
            <p className="text-emerald-200/90 leading-relaxed">
              The entire application—including the interactive map, species search, filters, trip planner, and personal sighting logs—runs <strong>100% free with zero API keys or accounts</strong>. Everything is saved directly in your browser on this device.
            </p>
          </div>
        </div>

        {/* Section 1: Desktop PWA Installation */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Laptop className="w-4 h-4" />
            <span>Install on Mac & PC Desktop</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This app is configured as a Progressive Web App (PWA). In Chrome, Edge, or Safari, click the <strong>Install / Add to Dock</strong> button in your browser address bar to run it as a standalone, distraction-free desktop application on macOS or Windows.
          </p>
        </div>

        {/* Section 2: Supabase Free-Tier Cloud Sync (Optional) */}
        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <Database className="w-4 h-4" />
              <span>Optional Cloud Sync (Supabase)</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
              Optional Only
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            You do <strong>not</strong> need this to use the app. Only fill this out if you set up a free Supabase project and want automatic multi-device synchronization between your Mac and PC:
          </p>

          <form onSubmit={handleSaveSupabase} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Project URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Anon / Public API Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Config Saved!</span>
                  </>
                ) : (
                  <span>Save Cloud Sync Keys</span>
                )}
              </button>

              {(supabaseUrl || supabaseKey) && (
                <button
                  type="button"
                  onClick={handleClearSupabase}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                >
                  Clear Keys
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Section 3: Manual Backup & Restore JSON */}
        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400">
            <RefreshCw className="w-4 h-4" />
            <span>Backup & Transfer Data (.JSON)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Move your sighting journal and target list between machines instantly without setting up any cloud account.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Field Data</span>
            </button>

            <label className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer">
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Import Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-emerald-400 font-semibold">{importStatus}</p>
          )}
        </div>

        {/* Section 4: Ethics Quick Reference */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Nature Photography Principles</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Never bait, call, or pursue wildlife for a photograph.</li>
            <li>Maintain minimum 25 yards from elk/bighorn, 50-100+ yards from moose and predators.</li>
            <li>In alpine tundra, stay strictly on designated rock talus or trails; alpine cushion plants require decades to regenerate.</li>
            <li>Never pick or trample Colorado Blue Columbine (protected state flower).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
