
import React from 'react';
import { Dive } from '../types';

interface DiveCardProps {
  dive: Dive;
}

const DiveCard: React.FC<DiveCardProps> = ({ dive }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg truncate pr-4">{dive.pointName}</h3>
        <span className="bg-blue-500 text-blue-50 text-xs px-2 py-1 rounded-full whitespace-nowrap">
          {dive.diveTime} min
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Depth (Max/Avg)</p>
          <p className="text-slate-800 font-semibold">{dive.maxDepth}m / {dive.avgDepth}m</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Water Temp</p>
          <p className="text-slate-800 font-semibold">{dive.waterTemp}°C</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Visibility</p>
          <p className="text-slate-800 font-semibold">{dive.visibility}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Current</p>
          <p className="text-slate-800 font-semibold">{dive.current}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Waves</p>
          <p className="text-slate-800 font-semibold">{dive.waves}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Guide</p>
          <p className="text-slate-800 font-semibold truncate">{dive.guide}</p>
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
        <span className="text-slate-400 text-[10px] font-mono uppercase">Logged: {dive.timestamp}</span>
      </div>
    </div>
  );
};

export default DiveCard;
