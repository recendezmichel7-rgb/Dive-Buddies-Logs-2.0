
export interface Dive {
  timestamp: string;
  date: string;
  pointName: string;
  diveTime: string;
  maxDepth: string;
  avgDepth: string;
  waterTemp: string;
  visibility: string;
  current: string;
  waves: string;
  guide: string;
}

export interface DiveStats {
  totalDives: number;
  avgMaxDepth: number;
  avgWaterTemp: number;
  deepestDive: number;
}
