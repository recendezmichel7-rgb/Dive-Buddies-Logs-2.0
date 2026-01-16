
import React, { useState, useEffect, useMemo } from 'react';
// Added SHEET_ID to imports to fix "Cannot find name SHEET_ID" error on line 150
import { fetchDiveData, SHEET_ID } from './services/sheetService';
import { Dive, DiveStats } from './types';
import DiveCard from './components/DiveCard';
import StatsSummary from './components/StatsSummary';

const App: React.FC = () => {
  const [dives, setDives] = useState<Dive[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDiveData();
        setDives(data);
        setError(null);
      } catch (err) {
        setError('Unable to load dive data. Please check the sheet visibility.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract unique dates for the dropdown, sorted newest first
  const uniqueDates = useMemo(() => {
    // Cast to string[] to resolve TypeScript 'unknown' type error in the sort comparator
    const dates = Array.from(new Set(dives.map(d => d.date))).filter(Boolean) as string[];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [dives]);

  // Filtered dives based on selection
  const filteredDives = useMemo(() => {
    if (selectedDate === 'all') return dives;
    return dives.filter(d => d.date === selectedDate);
  }, [dives, selectedDate]);

  // Calculate statistics for the filtered view
  const stats: DiveStats = useMemo(() => {
    if (filteredDives.length === 0) return { totalDives: 0, avgMaxDepth: 0, avgWaterTemp: 0, deepestDive: 0 };
    
    const totalDives = filteredDives.length;
    const depths = filteredDives.map(d => parseFloat(d.maxDepth) || 0);
    const temps = filteredDives.map(d => parseFloat(d.waterTemp) || 0);
    
    return {
      totalDives,
      avgMaxDepth: depths.reduce((a, b) => a + b, 0) / totalDives,
      avgWaterTemp: temps.reduce((a, b) => a + b, 0) / totalDives,
      deepestDive: Math.max(...depths),
    };
  }, [filteredDives]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Syncing with Google Sheets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ScubaLog Pro</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">Live dive data dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="date-select" className="text-sm font-semibold text-slate-600 whitespace-nowrap">Filter by Date:</label>
            <select
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all outline-none"
            >
              <option value="all">All Dates ({dives.length})</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        ) : (
          <>
            <StatsSummary stats={stats} />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedDate === 'all' ? 'Recent Dives' : `Dives for ${selectedDate}`}
                <span className="ml-2 text-sm font-normal text-slate-400">({filteredDives.length})</span>
              </h2>
              {selectedDate !== 'all' && (
                <button 
                  onClick={() => setSelectedDate('all')}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {filteredDives.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-slate-800 font-semibold">No dives found</h3>
                <p className="text-slate-400 text-sm">Try selecting a different date or check the source sheet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDives.map((dive, idx) => (
                  <DiveCard key={`${dive.timestamp}-${idx}`} dive={dive} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 text-center text-slate-400 text-xs">
        <p>Connected to Sheet ID: {SHEET_ID.substring(0, 8)}... (Tab: Form Responses 1)</p>
        <p className="mt-1">© {new Date().getFullYear()} ScubaLog Dashboard. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};

export default App;
