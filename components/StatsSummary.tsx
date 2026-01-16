
import React from 'react';
import { DiveStats } from '../types';

interface StatsSummaryProps {
  stats: DiveStats;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatItem label="Total Dives" value={stats.totalDives} unit="" color="blue" />
      <StatItem label="Avg Max Depth" value={stats.avgMaxDepth.toFixed(1)} unit="m" color="indigo" />
      <StatItem label="Avg Temp" value={stats.avgWaterTemp.toFixed(1)} unit="°C" color="cyan" />
      <StatItem label="Deepest Dive" value={stats.deepestDive} unit="m" color="violet" />
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  unit: string;
  color: 'blue' | 'indigo' | 'cyan' | 'violet';
}

const StatItem: React.FC<StatItemProps> = ({ label, value, unit, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    violet: 'text-violet-600 bg-violet-50 border-violet-100',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex flex-col items-center justify-center text-center`}>
      <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">{label}</p>
      <p className="text-2xl font-bold">
        {value}<span className="text-sm ml-0.5 font-medium">{unit}</span>
      </p>
    </div>
  );
};

export default StatsSummary;
